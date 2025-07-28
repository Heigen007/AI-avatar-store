<template>
    <div class="flex flex-col px-4 py-3 gap-4 bg-gradient-to-b from-[#0a1c2f] via-[#102f43] to-[#133c4f] text-white" style="height: 100%; padding-bottom: 70px;">
        <!-- Header -->
        <div class="flex items-center gap-4">
            <img
                :src="session.avatar.photoUrl"
                class="w-14 h-14 rounded-full object-cover shadow-xl ring-2 ring-cyan-400"
            />
            <div class="flex flex-col">
                <div class="text-lg font-semibold text-cyan-100">{{ session.avatar.name }}</div>
                <div class="flex items-center gap-2 mt-0.5">
                    <span class="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse shadow-sm"></span>
                    <span class="text-sm text-cyan-400 opacity-80">онлайн</span>
                </div>
            </div>
        </div>

        <!-- Chat scrollable area -->
        <div
            ref="messagesContainer"
            class="flex-1 overflow-y-auto bg-white/5 backdrop-blur-2xl rounded-3xl shadow-inner p-4 flex flex-col gap-3 border border-white/10 no-wrap"
        >
            <ChatBubble
                v-for="(msg, index) in session.messages"
                :key="index"
                :message="msg"
            />
        </div>

        <!-- Input area -->
        <div class="flex items-center gap-2 mt-2">
            <input
                v-model="input"
                type="text"
                placeholder="Напиши сообщение..."
                @keyup.enter="sendMessage"
                class="flex-1 px-4 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-cyan-300 focus:ring-2 focus:ring-cyan-400 outline-none"
            />
            <button
                @click="sendMessage"
                class="w-10 h-10 rounded-full bg-cyan-500 hover:bg-cyan-400 text-white flex items-center justify-center shadow-md transition"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ChatMessage } from 'src/models/ChatMessage'
import ChatBubble from 'src/components/ChatBubble.vue'
import { UserProfile } from 'src/models/UserProfile'
import { nextTick, watch } from 'vue'

const route = useRoute()
const sessionId = route.params.sessionId as string
const sessionRaw = UserProfile.currentUser?.getSessionBySessionId(sessionId)
const session = reactive(sessionRaw!)
const input = ref('')
const messagesContainer = ref<HTMLElement | null>(null)

function scrollToBottom() {
    nextTick(() => {
        if (messagesContainer.value) {
            messagesContainer.value.scrollTo({
                top: messagesContainer.value.scrollHeight,
                behavior: 'smooth'
            })
        }
    })
}

onMounted(() => {
    scrollToBottom()
})

async function sendMessage() {
    const text = input.value.trim()
    if (!text) return
    input.value = ''
    await session!.addMessage(new ChatMessage('user', text, new Date()))
}

watch(() => session.messages.length, () => {
    scrollToBottom()
}, { immediate: true })
</script>