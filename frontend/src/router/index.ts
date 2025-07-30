import { route } from 'quasar/wrappers'
import {
    createMemoryHistory,
    createRouter,
    createWebHashHistory,
    createWebHistory
} from 'vue-router'

import routes from './routes'
import { UserProfile } from 'src/models/UserProfile'

function versionsDiffer(local: string, required: string): boolean {
    return local !== required
}

export default route(async function () {
    await UserProfile.loadFromStorage()

    const mustUpdate = versionsDiffer(UserProfile.appVersion, UserProfile.requiredVersion)
    const createHistory = process.env.SERVER
        ? createMemoryHistory
        : (process.env.VUE_ROUTER_MODE === 'history'
            ? createWebHistory
            : createWebHashHistory)

    const Router = createRouter({
        scrollBehavior: () => ({ left: 0, top: 0 }),
        routes,
        history: createHistory(process.env.VUE_ROUTER_BASE)
    })

    Router.beforeEach((to, from, next) => {
        const isAuthenticated = !!UserProfile.currentUserId

        if (mustUpdate && to.path !== '/outdated') {
            return next('/outdated')
        }

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
