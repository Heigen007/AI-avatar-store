<template>
    <div class="min-h-screen px-4 pt-6 pb-20 bg-gradient-to-b from-white via-violet-50 to-white text-gray-800 flex flex-col">
        <h1 class="text-xl font-semibold text-center text-violet-700 mb-6">Мой профиль</h1>

        <form class="flex flex-col gap-6 flex-1 overflow-y-auto no-wrap">
            <!-- Имя -->
            <div>
                <label class="block mb-2 text-sm font-medium text-violet-700">Имя</label>
                <input
                    v-model="form.name"
                    type="text"
                    placeholder="Как вас зовут?"
                    class="w-full px-4 py-2 bg-white border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 text-gray-700 placeholder-gray-400"
                />
            </div>

            <!-- Возраст -->
            <div>
                <label class="block mb-2 text-sm font-medium text-violet-700">Возраст</label>
                <input
                    v-model.number="form.age"
                    type="number"
                    min="1"
                    max="120"
                    placeholder="Ваш возраст"
                    class="w-full px-4 py-2 bg-white border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 text-gray-700 placeholder-gray-400"
                />
            </div>

            <!-- Описание -->
            <div>
                <label class="block mb-2 text-sm font-medium text-violet-700">Описание</label>
                <textarea
                    v-model="form.bio"
                    rows="4"
                    placeholder="Напишите немного о себе..."
                    class="w-full px-4 py-2 bg-white border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 text-gray-700 placeholder-gray-400"
                ></textarea>
                <p class="text-xs text-violet-500 mt-2 opacity-80">
                    Чем подробнее вы расскажете о себе, тем точнее ИИ-аватары будут понимать вас и подстраиваться под ваш стиль общения.
                </p>
            </div>
        </form>

        <div class="mt-8">
            <button
                :disabled="!canSave || state === 'saving'"
                @click="save"
                class="group relative w-full h-12 rounded-xl font-semibold text-base transition-all overflow-hidden
                       border border-violet-200 backdrop-blur-md
                       bg-gradient-to-r from-violet-500/80 to-violet-400/80
                       hover:from-violet-500 hover:to-violet-400
                       disabled:opacity-60 disabled:cursor-not-allowed
                       [box-shadow:0_10px_30px_rgba(139,92,246,0.15)]"
                :class="{
                    'pointer-events-none bg-gradient-to-r from-violet-500/60 to-violet-400/60': state === 'saving',
                    'bg-gradient-to-r from-emerald-500 to-emerald-400': state === 'success',
                    'bg-gradient-to-r from-rose-500 to-rose-400': state === 'error'
                }"
            >
                <!-- Содержимое кнопки -->
                <div class="absolute inset-0 flex items-center justify-center">
                    <!-- idle -->
                    <span v-if="state === 'idle'">Сохранить</span>

                    <!-- saving -->
                    <div v-else-if="state === 'saving'" class="flex items-center gap-3">
                        <span class="sr-only">Сохраняем…</span>
                        <span class="w-5 h-5 rounded-full border-2 border-white/60 border-t-transparent animate-spin"></span>
                        <span>Сохраняю…</span>
                    </div>

                    <!-- success -->
                    <div v-else-if="state === 'success'" class="flex items-center gap-2 animate-[pop_300ms_ease-out]">
                        <svg viewBox="0 0 24 24" class="w-6 h-6 fill-none stroke-white" stroke-width="2">
                            <path d="M20 6L9 17l-5-5" />
                        </svg>
                        <span>Сохранено</span>
                    </div>

                    <!-- error -->
                    <div v-else class="flex items-center gap-2 animate-[pop_300ms_ease-out]">
                        <svg viewBox="0 0 24 24" class="w-6 h-6 fill-none stroke-white" stroke-width="2">
                            <path d="M12 9v4m0 4h.01M12 2a10 10 0 1 0 0 20a10 10 0 0 0 0-20Z" />
                        </svg>
                        <span>Ошибка</span>
                    </div>
                </div>

                <!-- нежный блинг при успехе -->
                <div
                    v-if="state === 'success'"
                    class="pointer-events-none absolute inset-0 opacity-40 animate-[shine_900ms_ease-out]"
                    style="background: radial-gradient(120% 60% at 50% 0%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%);"
                />
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { UserProfile } from 'src/models/UserProfile'

const profile = UserProfile.currentUser!

const form = ref({
    name: profile.name,
    age: profile.age,
    bio: profile.bio,
})

const canSave = computed(() => form.value.name.trim() !== '' && form.value.age)

type SaveState = 'idle' | 'saving' | 'success' | 'error'
const state = ref<SaveState>('idle')

async function save() {
    if (!canSave.value || state.value === 'saving') return
    state.value = 'saving'
    try {
        profile.name = form.value.name
        profile.age = form.value.age
        profile.bio = form.value.bio
        await profile.updateInformation()
        state.value = 'success'
        setTimeout(() => (state.value = 'idle'), 1600)
    } catch (e) {
        state.value = 'error'
        setTimeout(() => (state.value = 'idle'), 1600)
    }
}
</script>

<style scoped>
@keyframes pop {
    0% { transform: scale(0.9); opacity: 0.4; }
    100% { transform: scale(1); opacity: 1; }
}
@keyframes shine {
    0% { transform: translateY(40%); opacity: 0; }
    20% { opacity: 1; }
    100% { transform: translateY(-60%); opacity: 0; }
}
</style>