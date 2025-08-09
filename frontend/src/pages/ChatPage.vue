<template>
    <div class="flex flex-col px-4 py-3 gap-4 bg-gradient-to-b from-white via-violet-50 to-white text-gray-800" style="height: 100%; padding-bottom: 70px;">
        <!-- Header -->
        <div class="flex items-center justify-between gap-4">
            <div class="flex items-center gap-4">
                <img :src="session.avatar.photoUrl" class="w-14 h-14 rounded-full object-cover shadow-xl ring-2 ring-violet-400" />
                <div class="flex flex-col">
                    <div class="text-lg font-semibold text-gray-800">{{ session.avatar.name }}</div>
                    <div class="flex items-center gap-2 mt-0.5">
                        <span class="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-sm"></span>
                        <span class="text-sm text-gray-500">онлайн</span>
                    </div>
                </div>
            </div>

            <div class="flex items-center gap-2">
                <button @click="openVoiceModal" class="p-2 rounded-full bg-white hover:bg-violet-50 text-violet-600 border border-violet-200 transition">
                    <q-icon name="mic" size="22px" class="text-violet-600" />
                </button>
                <button @click="goToEditPage" class="p-2 rounded-full bg-white hover:bg-violet-50 text-violet-600 border border-violet-200 transition">
                    <q-icon name="edit" size="22px" class="text-violet-600" />
                </button>
            </div>
        </div>

        <div ref="messagesContainer" class="flex-1 overflow-y-auto bg-white rounded-3xl shadow-inner p-4 flex flex-col gap-3 border border-violet-200 no-wrap">
            <ChatBubble v-for="(msg, index) in session.messages" :key="index" :message="msg" />
            <div v-if="isTyping" class="flex gap-1 items-center self-start ml-2 mt-2">
                <span class="w-2 h-2 bg-violet-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span class="w-2 h-2 bg-violet-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span class="w-2 h-2 bg-violet-300 rounded-full animate-bounce"></span>
            </div>
        </div>

        <div v-if="imagePreviewUrl" class="flex items-center gap-2 p-2 bg-white rounded-xl border border-violet-200">
            <img :src="imagePreviewUrl" class="h-20 rounded-lg object-cover" />
            <button @click="removeImage" class="text-red-500 text-sm underline">Удалить</button>
        </div>

        <div class="flex items-center gap-2 mt-2">
            <div class="relative flex-1">
                <input v-model="input" type="text" placeholder="Напиши сообщение..." @keyup.enter="sendMessage" class="w-full pr-12 px-4 py-3 rounded-xl bg-white border border-violet-200 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-violet-500 outline-none" />
                <button @click="takePhoto" class="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer">
                    <q-icon name="photo_camera" size="22px" class="text-violet-600 hover:text-violet-800 transition" />
                </button>
            </div>

            <button @click="sendMessage" class="w-10 h-10 rounded-full bg-violet-500 hover:bg-violet-600 text-white flex items-center justify-center shadow-md transition">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
            </button>
        </div>

        <VoiceCallModal v-if="voiceModalOpen" :session="session" @close="voiceModalOpen = false" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ChatMessage } from 'src/models/ChatMessage'
import ChatBubble from 'src/components/ChatBubble.vue'
import { UserProfile } from 'src/models/UserProfile'
import { MessageSender } from 'src/utils/MessageSender'
import VoiceCallModal from 'src/components/VoiceCallModal.vue'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { StatusBar, Style } from '@capacitor/status-bar'

const router = useRouter()
const route = useRoute()
const messageSender = new MessageSender()

const sessionId = route.params.sessionId as string
const sessionRaw = UserProfile.currentUser?.getSessionBySessionId(sessionId)
const session = reactive(sessionRaw!)
const input = ref('')
const messagesContainer = ref<HTMLElement | null>(null)
const isTyping = ref(false)

const imageFile = ref<File | null>(null)
const imagePreviewUrl = ref<string | null>(null)

const voiceModalOpen = ref(false)

async function takePhoto() {
    try {
        const photo = await Camera.getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Prompt,
            quality: 90
        })

        await StatusBar.setOverlaysWebView({ overlay: false })
        await StatusBar.setBackgroundColor({ color: '#091a2c' })
        await StatusBar.setStyle({ style: Style.Light })

        if (photo?.webPath) {
            imagePreviewUrl.value = photo.webPath
            const response = await fetch(photo.webPath)
            const blob = await response.blob()
            imageFile.value = new File([blob], 'photo.jpg', { type: blob.type })
        }
    } catch (error) {
        console.error('Camera error:', error)
    }
}

function removeImage() {
    imageFile.value = null
    imagePreviewUrl.value = null
}

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
    setTimeout(() => {
        scrollToBottom()
    }, 400)
})

async function sendMessage() {
    const text = input.value.trim()
    const file = imageFile.value

    if (!text && !file) return

    const tempText = text
    const tempFile = file
    const tempImageUrl = tempFile ? URL.createObjectURL(tempFile) : null

    input.value = ''
    imageFile.value = null
    imagePreviewUrl.value = null

    const userMessage = new ChatMessage('user', tempText, new Date(), tempImageUrl || undefined)
    session.messages.push(userMessage)

    isTyping.value = true
    await messageSender.send(() => session.addMessage(userMessage, tempFile || undefined))
    isTyping.value = false
}

watch(() => session.messages.length, () => {
    scrollToBottom()
}, { immediate: true })

function goToEditPage() {
    router.push({ name: 'EditAvatarPage', params: { avatarId: session.avatar.id } })
}

function openVoiceModal() {
    voiceModalOpen.value = true
}
</script>
