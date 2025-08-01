<template>
    <div
        class="flex flex-col px-4 py-3 gap-4 bg-gradient-to-b from-[#0a1c2f] via-[#102f43] to-[#133c4f] text-white"
        style="height: 100%; padding-bottom: 70px;"
    >
        <!-- Header -->
        <div class="flex items-center justify-between gap-4">
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

            <!-- Кнопки справа -->
            <div class="flex items-center gap-2">
                <!-- Кнопка голосового звонка -->
                <button
                    @click="openVoiceModal"
                    class="p-2 rounded-full bg-white/10 hover:bg-white/20 text-cyan-300 border border-white/20 transition"
                >
                    <q-icon name="mic" size="22px" class="text-cyan-300" />
                </button>

                <!-- Иконка редактирования -->
                <button
                    @click="goToEditPage"
                    class="p-2 rounded-full bg-white/10 hover:bg-white/20 text-cyan-300 border border-white/20 transition"
                >
                    <q-icon name="edit" size="22px" class="text-cyan-300" />
                </button>
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

            <!-- Анимация "печатает..." -->
            <div v-if="isTyping" class="flex gap-1 items-center self-start ml-2 mt-2">
                <span class="w-2 h-2 bg-white/50 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span class="w-2 h-2 bg-white/50 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span class="w-2 h-2 bg-white/50 rounded-full animate-bounce"></span>
            </div>
        </div>

        <!-- Превью фото -->
        <div v-if="imagePreviewUrl" class="flex items-center gap-2 p-2 bg-white/10 rounded-xl border border-white/20">
            <img :src="imagePreviewUrl" class="h-20 rounded-lg object-cover" />
            <button @click="removeImage" class="text-red-400 text-sm underline">Удалить</button>
        </div>

        <!-- Ввод -->
        <div class="flex items-center gap-2 mt-2">
            <!-- Ввод + иконка фото внутри -->
            <div class="relative flex-1">
                <input
                    v-model="input"
                    type="text"
                    placeholder="Напиши сообщение..."
                    @keyup.enter="sendMessage"
                    class="w-full pr-12 px-4 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-cyan-300 focus:ring-2 focus:ring-cyan-400 outline-none"
                />

                <!-- Иконка фото справа внутри инпута -->
                <label class="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer">
                    <q-icon name="photo" size="22px" class="text-cyan-300 hover:text-cyan-100 transition" />
                    <input
                        type="file"
                        accept="image/*"
                        class="hidden"
                        @change="onFileSelected"
                    />
                </label>
            </div>

            <!-- Кнопка отправки -->
            <button
                @click="sendMessage"
                class="w-10 h-10 rounded-full bg-cyan-500 hover:bg-cyan-400 text-white flex items-center justify-center shadow-md transition"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
            </button>
        </div>

        <!-- Модалка голосового звонка -->
        <VoiceCallModal
            v-if="voiceModalOpen"
            :session="session"
            @close="voiceModalOpen = false"
        />
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

function onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return

    // 🔹 Проверка на 5 МБ
    const maxSizeMB = 5
    if (file.size > maxSizeMB * 1024 * 1024) {
        alert(`Файл слишком большой. Максимальный размер — ${maxSizeMB} МБ`)
        ;(event.target as HTMLInputElement).value = '' // сбрасываем выбор
        return
    }

    imageFile.value = file
    imagePreviewUrl.value = URL.createObjectURL(file)
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

    // Копируем значения до очистки
    const tempText = text
    const tempFile = file
    const tempImageUrl = tempFile ? URL.createObjectURL(tempFile) : null

    // Очищаем поля до отправки
    input.value = ''
    imageFile.value = null
    imagePreviewUrl.value = null

    const userMessage = new ChatMessage('user', tempText, new Date(), tempImageUrl || undefined)
    session.messages.push(userMessage)

    // Отправляем на сервер
    isTyping.value = true
    await messageSender.send(() =>
        session.addMessage(userMessage, tempFile || undefined)
    )
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
