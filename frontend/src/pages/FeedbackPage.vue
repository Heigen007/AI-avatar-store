<template>
    <div class="min-h-screen px-4 py-6 bg-gradient-to-b from-white via-violet-50 to-white text-gray-800">
        <h1 class="text-xl font-semibold text-center text-violet-700 mb-6">Оставить пожелание</h1>

        <div class="bg-white border border-violet-200 rounded-2xl p-4 shadow-lg max-w-xl mx-auto">
            <p class="text-sm text-violet-500 mb-4">
                Поделитесь своими мыслями, идеями или замечаниями — мы внимательно читаем всё и учитываем при следующих обновлениях.
            </p>

            <textarea
                v-model="message"
                rows="6"
                placeholder="Ваше сообщение..."
                class="w-full px-4 py-3 rounded-xl bg-white border border-violet-200 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-violet-500 outline-none resize-none"
            />

            <div class="flex justify-end mt-4">
                <button
                    @click="sendFeedback"
                    :disabled="loading || message.trim().length === 0"
                    class="px-5 py-2 rounded-xl bg-violet-500 hover:bg-violet-600 text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {{ loading ? 'Отправка...' : 'Отправить' }}
                </button>
            </div>

            <div v-if="success" class="mt-4 text-sm text-green-600">
                Спасибо за ваш отклик! Мы учтём его в следующих обновлениях.
            </div>

            <div v-if="error" class="mt-4 text-sm text-red-500">
                Что-то пошло не так. Попробуйте позже.
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { axios } from 'boot/axios'
import { UserProfile } from 'src/models/UserProfile'

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
        await axios.post('/feedback', { message: message.value, userId: UserProfile.currentUser?.id })
        success.value = true
        message.value = ''
    } catch (err) {
        error.value = true
    } finally {
        loading.value = false
    }
}
</script>
