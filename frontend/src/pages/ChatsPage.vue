<template>
    <div class="min-h-screen px-4 py-6 bg-gradient-to-b from-[#0a192f] via-[#0e2a40] to-[#12384d] text-white">
        <h1 class="text-xl font-semibold text-center text-cyan-100 mb-6">Мои чаты</h1>

        <div v-if="sessions.length === 0" class="text-center text-cyan-300 mt-20">
            <div class="text-4xl mb-2">💬</div>
            <div class="text-base">У тебя пока нет чатов с аватарами</div>
            <div class="text-sm text-cyan-500 mt-1">Создай аватара, чтобы начать общение</div>
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
