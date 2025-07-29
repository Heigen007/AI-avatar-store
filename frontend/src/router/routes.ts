import { RouteRecordRaw } from 'vue-router'

// Layouts
import OnboardingLayout from 'layouts/OnboardingLayout.vue'
import MainLayout from 'layouts/MainLayout.vue'

// Pages
import OnboardingPage from 'pages/onboarding/OnboardingPage.vue'
import UserProfilePage from 'pages/UserProfilePage.vue'
import HomePage from 'pages/HomePage.vue'
import ChatPage from 'pages/ChatPage.vue'
import ChatsPage from 'pages/ChatsPage.vue'
import ErrorNotFound from 'pages/ErrorNotFound.vue'
import FeedbackPage from 'pages/FeedbackPage.vue'

const routes: RouteRecordRaw[] = [
    {
        path: '/onboarding',
        component: OnboardingLayout,
        children: [
            {
                path: '',
                name: 'OnboardingPage',
                component: OnboardingPage
            }
        ]
    },
    {
        path: '/',
        component: MainLayout,
        children: [
            {
                path: 'profile',
                name: 'UserProfilePage',
                component: UserProfilePage
            },
            {
                path: 'home',
                name: 'HomePage',
                component: HomePage
            },
            {
                path: 'chat/:sessionId',
                name: 'ChatPage',
                component: ChatPage
            },
            {
                path: 'chats',
                name: 'ChatsPage',
                component: ChatsPage
            },
            {
                path: '/avatar/:avatarId/edit',
                name: 'EditAvatarPage',
                component: () => import('pages/EditAvatarPage.vue')
            },
            {
                path: '/feedback',
                name: 'FeedbackPage',
                component: () => FeedbackPage
            }
        ]
    },
    {
        path: '/:catchAll(.*)*',
        component: ErrorNotFound
    }
]

export default routes
