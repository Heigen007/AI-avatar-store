<template>
    <div class="min-h-screen px-4 pt-6 pb-20 bg-gradient-to-b from-[#091a2c] via-[#0d2b3f] to-[#134155] text-white flex flex-col">
        <h1 class="text-xl font-semibold text-center text-cyan-100 mb-6">Мой профиль</h1>

        <form class="flex flex-col gap-6 flex-1 overflow-y-auto">
            <!-- Имя -->
            <div>
                <label class="block mb-2 text-sm font-medium text-cyan-200">Имя</label>
                <input
                    v-model="form.name"
                    type="text"
                    placeholder="Как вас зовут?"
                    class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-cyan-300"
                />
            </div>

            <!-- Возраст -->
            <div>
                <label class="block mb-2 text-sm font-medium text-cyan-200">Возраст</label>
                <input
                    v-model.number="form.age"
                    type="number"
                    min="1"
                    max="120"
                    placeholder="Ваш возраст"
                    class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-cyan-300"
                />
            </div>

            <!-- Описание -->
            <div>
                <label class="block mb-2 text-sm font-medium text-cyan-200">Описание</label>
                <textarea
                    v-model="form.bio"
                    rows="4"
                    placeholder="Напишите немного о себе..."
                    class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-cyan-300"
                ></textarea>
                <p class="text-xs text-cyan-400 mt-2 opacity-80">
                    Чем подробнее вы расскажете о себе, тем точнее ИИ-аватары будут понимать вас и подстраиваться под ваш стиль общения.
                </p>
            </div>
        </form>

        <div class="mt-8">
            <button
                class="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-semibold text-base transition"
                :disabled="!canSave"
                @click="save"
            >
                Сохранить
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

async function save() {
    profile.name = form.value.name
    profile.age = form.value.age
    profile.bio = form.value.bio
    await profile.updateInformation()
}
</script>

<style scoped>
input[type="range"]::-webkit-slider-thumb {
    background-color: #06b6d4;
}
</style>
