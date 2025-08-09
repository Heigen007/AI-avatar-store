<template>
    <div class="min-h-screen px-4 py-6 bg-gradient-to-b from-white via-violet-50 to-white text-gray-800">
        <h1 class="text-xl font-semibold text-center text-violet-700 mb-6">Мои чаты</h1>

        <div v-if="sessions.length === 0" class="text-center text-violet-500 mt-20">
            <div class="text-4xl mb-2">💬</div>
            <div class="text-base">У тебя пока нет чатов с аватарами</div>
            <div class="text-sm text-violet-400 mt-1">Создай аватара, чтобы начать общение</div>
        </div>

        <div v-else class="flex flex-col gap-3">
            <ChatSessionCard
                v-for="session in sessions"
                :key="session.id"
                :session="session"
                @open="openChat(session.id)"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import ChatSessionCard from 'src/components/ChatSessionCard.vue'
import { UserProfile } from 'src/models/UserProfile'

const router = useRouter()
const sessions = UserProfile.currentUser?.chatSessions ?? []

function openChat(id: string) {
    router.push({ name: 'ChatPage', params: { sessionId: id } })
}
</script>
