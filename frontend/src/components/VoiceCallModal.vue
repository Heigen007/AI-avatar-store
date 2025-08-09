<template>
    <div class="fixed inset-0 bg-black/70 backdrop-blur-md flex flex-col items-center justify-center z-50">
        <!-- Кнопка закрытия -->
        <button
            @click="closeModal"
            class="absolute top-4 right-4 text-white/70 hover:text-white text-3xl font-bold"
        >
            ×
        </button>

        <!-- Аватарка с анимацией -->
        <div class="relative w-40 h-40 mb-8 flex items-center justify-center">
            <div
                v-if="status === 'speaking'"
                class="absolute inset-1 rounded-full border-4 border-cyan-400 animate-ping"
            ></div>

            <img
                :src="session.avatar.photoUrl"
                class="w-40 h-40 rounded-full object-cover shadow-xl border-4 border-cyan-400"
            />
        </div>

        <!-- Статус -->
        <div class="text-xl text-cyan-200 mb-8 h-8 transition">
            <span v-if="status === 'waiting'">Жду вашего сообщения…</span>
            <span v-else-if="status === 'thinking'">Думаю над ответом…</span>
            <span v-else-if="status === 'speaking'">Говорю…</span>
        </div>

        <!-- Кнопка записи -->
        <div class="flex items-center gap-4">
            <button
                @mousedown="startRecording"
                @mouseup="stopRecording"
                @mouseleave="stopRecording"
                @touchstart.prevent="startRecording"
                @touchend.prevent="stopRecording"
                :disabled="isRecording || status !== 'waiting'"
                class="w-20 h-20 rounded-full flex items-center justify-center transition
                       bg-cyan-500 hover:bg-cyan-400 text-white shadow-xl relative"
            >
                <span
                    class="absolute w-6 h-6 bg-red-500 rounded-full animate-pulse"
                    v-if="isRecording"
                ></span>
                <q-icon name="mic" size="36px" />
            </button>

            <div class="text-sm text-cyan-300 max-w-[200px] text-center">
                Удерживайте, чтобы записать голосовое
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
    import { ref, onBeforeUnmount } from 'vue'
    import { ChatMessage } from 'src/models/ChatMessage'
    import { axios, currentURL } from 'boot/axios'
    import { ChatSession } from 'src/models/ChatSession'
    import { Capacitor } from '@capacitor/core'
    import { VoiceRecorder } from 'capacitor-voice-recorder'
    import { onBeforeRouteLeave } from 'vue-router'

    const props = defineProps<{ session: ChatSession }>()
    const emit = defineEmits(['close'])

    const status = ref<'waiting' | 'thinking' | 'speaking'>('waiting')
    const isRecording = ref(false)

    let mediaRecorder: MediaRecorder | null = null
    let mediaStream: MediaStream | null = null
    let audioChunks: BlobPart[] = []
    let audioPlayer: HTMLAudioElement | null = null

    function stopPlayback() {
        if (audioPlayer) {
            try { audioPlayer.pause() } catch {}
            audioPlayer = null
        }
        if (status.value === 'speaking') status.value = 'waiting'
    }

    function stopWebStream() {
        if (mediaStream) {
            try {
                mediaStream.getTracks().forEach(t => t.stop())
            } catch {}
            mediaStream = null
        }
    }

    async function stopNativeRecordingIfNeeded() {
        try {
            // VoiceRecorder.stopRecording бросит, если не записывали — ловим и игнорируем
            await VoiceRecorder.stopRecording()
        } catch {}
    }

    async function stopEverything() {
        // 1) Остановить активную запись (web)
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            try { mediaRecorder.stop() } catch {}
        }
        mediaRecorder = null
        stopWebStream()

        // 2) Остановить активную запись (native)
        if (Capacitor.isNativePlatform()) {
            await stopNativeRecordingIfNeeded()
        }

        // 3) Сброс флагов записи
        isRecording.value = false

        // 4) Остановить проигрывание ответа
        stopPlayback()
    }

    function closeModal() {
        stopEverything()
        emit('close')
    }

    /**
     * Начало записи
     */
    async function startRecording() {
        if (isRecording.value || status.value !== 'waiting') return

        const isNative = Capacitor.isNativePlatform()
        if (isNative) {
            try {
                const perm = await VoiceRecorder.hasAudioRecordingPermission()
                if (!perm.value) {
                    await VoiceRecorder.requestAudioRecordingPermission()
                    // «разбудить» аудиосессию
                    await stopNativeRecordingIfNeeded()
                    await new Promise(r => setTimeout(r, 300))
                }

                isRecording.value = true
                audioChunks = []
                await VoiceRecorder.startRecording()
            } catch (err) {
                console.error('Native audio recording error', err)
                isRecording.value = false
            }
        } else {
            // Web запись
            isRecording.value = true
            audioChunks = []

            mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })
            mediaRecorder = new MediaRecorder(mediaStream)
            mediaRecorder.ondataavailable = e => {
                if (e.data.size > 0) audioChunks.push(e.data)
            }
            mediaRecorder.start()
        }
    }

    /**
     * Остановка записи
     */
    async function stopRecording() {
        if (!isRecording.value) return
        isRecording.value = false

        const isNative = Capacitor.isNativePlatform()
        if (isNative) {
            try {
                const result = await VoiceRecorder.stopRecording()
                if (result.value && result.value.recordDataBase64) {
                    const blob = base64ToBlob(result.value.recordDataBase64, 'audio/m4a')
                    const fileName = `voice-${Date.now()}.m4a`
                    const file = new File([blob], fileName, { type: 'audio/m4a' })
                    await sendVoiceMessage(file)
                }
            } catch (err) {
                console.error('Native stopRecording error', err)
            }
        } else if (mediaRecorder) {
            // Дождёмся onstop, соберём Blob и отправим
            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' })
                const file = new File([audioBlob], `voice-${Date.now()}.webm`, { type: 'audio/webm' })
                stopWebStream()
                await sendVoiceMessage(file)
            }
            try { mediaRecorder.stop() } catch {}
        }
    }

    /**
     * Отправка голосового сообщения на сервер
     */
    async function sendVoiceMessage(file: File) {
        status.value = 'thinking'

        const formData = new FormData()
        formData.append('voice', file, file.name)

        try {
            const res = await axios.post(`/chat/${props.session.id}/voice`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            const { userMessage, avatarMessage, voiceUrl } = res.data

            props.session.messages.push(
                new ChatMessage(userMessage.sender, userMessage.text, new Date(userMessage.timestamp))
            )
            props.session.messages.push(
                new ChatMessage(avatarMessage.sender, avatarMessage.text, new Date(avatarMessage.timestamp))
            )

            if (voiceUrl) {
                stopPlayback()
                status.value = 'speaking'
                audioPlayer = new Audio(currentURL + voiceUrl)
                audioPlayer.play().catch(() => { status.value = 'waiting' })
                if (audioPlayer) {
                    audioPlayer.onended = () => { status.value = 'waiting' }
                    audioPlayer.onerror = () => { status.value = 'waiting' }
                }
            } else {
                status.value = 'waiting'
            }
        } catch (err: any) {
            let msg = 'Ошибка отправки: '
            if (err.response) msg += `status ${err.response.status}, data: ${JSON.stringify(err.response.data)}`
            else if (err.message) msg += err.message
            else msg += JSON.stringify(err)
            console.error(msg)
            status.value = 'waiting'
        }
    }

    /**
     * Base64 → Blob
     */
    function base64ToBlob(base64: string, mime: string) {
        const byteCharacters = atob(base64)
        const byteArrays: Uint8Array[] = []
        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512)
            const byteNumbers = new Array(slice.length)
            for (let i = 0; i < slice.length; i++) byteNumbers[i] = slice.charCodeAt(i)
            byteArrays.push(new Uint8Array(byteNumbers))
        }
        return new Blob(byteArrays, { type: mime })
    }

    const handlePageHide = () => { stopEverything() }
    window.addEventListener('pagehide', handlePageHide)

    onBeforeRouteLeave((_to, _from, next) => {
        stopEverything().finally(() => next())
    })

    onBeforeUnmount(() => {
        window.removeEventListener('pagehide', handlePageHide)
        stopEverything()
    })
</script>

<style scoped>
@keyframes pulse-ring {
    0% { transform: scale(1); opacity: 0.7; }
    70% { transform: scale(1.5); opacity: 0; }
    100% { transform: scale(1.5); opacity: 0; }
}
</style>