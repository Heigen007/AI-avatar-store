<template>
    <div class="min-h-screen px-4 py-6 bg-gradient-to-b from-[#091a2c] via-[#0e2a40] to-[#12384d] text-white">
        <h1 class="text-xl font-semibold text-center text-cyan-100 mb-6">Оставить пожелание</h1>

        <div class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-lg max-w-xl mx-auto">
            <p class="text-sm text-cyan-300 mb-4">
                Поделитесь своими мыслями, идеями или замечаниями — мы внимательно читаем всё и учитываем при следующих обновлениях.
            </p>

            <textarea
                v-model="message"
                rows="6"
                placeholder="Ваше сообщение..."
                class="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-cyan-300 focus:ring-2 focus:ring-cyan-400 outline-none resize-none"
            />

            <div class="flex justify-end mt-4">
                <button
                    @click="sendFeedback"
                    :disabled="loading || message.trim().length === 0"
                    class="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {{ loading ? 'Отправка...' : 'Отправить' }}
                </button>
            </div>

            <div v-if="success" class="mt-4 text-sm text-green-400">
                Спасибо за ваш отклик! Мы учтём его в следующих обновлениях.
            </div>

            <div v-if="error" class="mt-4 text-sm text-red-400">
                Что-то пошло не так. Попробуйте позже.
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { axios } from 'boot/axios'

const message = ref('')
const loading = ref(false)
const success = ref(false)
const error = ref(false)

async function sendFeedback() {
    if (!message.value.trim()) return

    loading.value = true
    success.value = false
    error.value = false

    try {
        await axios.post('/feedback', { message: message.value })
        success.value = true
        message.value = ''
    } catch (err) {
        error.value = true
    } finally {
        loading.value = false
    }
}
</script>
