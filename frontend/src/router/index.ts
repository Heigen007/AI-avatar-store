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
    const localParts = local.split('.').map(Number)
    const requiredParts = required.split('.').map(Number)

    for (let i = 0; i < Math.max(localParts.length, requiredParts.length); i++) {
        const l = localParts[i] || 0
        const r = requiredParts[i] || 0
        if (l < r) return true
        if (l > r) return false
    }

    return false // equal
}
export default route(function () {
    // Параллельная загрузка, не блокирует рендер
    UserProfile.loadFromStorage().catch(console.error)

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

    Router.beforeEach(async (to, from, next) => {
        if (!UserProfile.ready.value) {
            // ждём пока профиль загрузится
            const waitReady = async () => {
                while (!UserProfile.ready.value) {
                    await new Promise(resolve => setTimeout(resolve, 20))
                }
            }

            await waitReady()
        }

        const isAuthenticated = !!UserProfile.currentUserId
        const mustUpdate = versionsDiffer(UserProfile.appVersion, UserProfile.requiredVersion)

        if (mustUpdate && to.path !== '/outdated') {
            return next('/outdated')
        } else if (!mustUpdate && !isAuthenticated && to.path !== '/onboarding') {
            return next('/onboarding')
        } else if (!mustUpdate && isAuthenticated && to.path === '/') {
            return next('/home')
        }

        next()
    })

    return Router
})

