<template>
    <div>
        <h2 class="text-xl font-semibold text-center text-white mb-2">Расскажи немного о себе</h2>
        <p class="text-sm text-cyan-200 text-center mb-4">Вы можете пропустить и заполнить потом</p>

        <textarea
            v-model="draft.bio"
            rows="4"
            placeholder="Кратко о себе (необязательно)"
            class="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-base text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-cyan-400"
        />
    </div>
</template>

<script setup lang="ts">
import { UserProfileDraft } from 'src/models/UserProfileDraft'
defineProps<{ draft: UserProfileDraft }>()
</script>
