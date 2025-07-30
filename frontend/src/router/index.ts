import { route } from 'quasar/wrappers'
import {
    createMemoryHistory,
    createRouter,
    createWebHashHistory,
    createWebHistory
} from 'vue-router'

import routes from './routes'
import { UserProfile } from 'src/models/UserProfile'

export default route(async function () {
    // 1. Подгружаем пользователя до создания роутера
    await UserProfile.loadFromStorage()

    // 2. Создаём history
    const createHistory = process.env.SERVER
        ? createMemoryHistory
        : (process.env.VUE_ROUTER_MODE === 'history'
            ? createWebHistory
            : createWebHashHistory)

    // 3. Создаём Router
    const Router = createRouter({
        scrollBehavior: () => ({ left: 0, top: 0 }),
        routes,
        history: createHistory(process.env.VUE_ROUTER_BASE)
    })

    // 4. Проверка авторизации
    Router.beforeEach((to, from, next) => {
        const isAuthenticated = !!UserProfile.currentUserId

        if (!isAuthenticated && to.path !== '/onboarding') {
            return next('/onboarding')
        }

        if (isAuthenticated && to.path === '/') {
            return next('/home')
        }

        next()
    })

    return Router
})
