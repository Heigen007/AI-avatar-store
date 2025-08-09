<template>
    <div>
        <h2 class="text-xl font-semibold text-center text-gray-800 mb-2">Расскажи немного о себе</h2>
        <p class="text-sm text-violet-500 text-center mb-4">Вы можете пропустить и заполнить потом</p>

        <textarea
            v-model="draft.bio"
            rows="4"
            placeholder="Кратко о себе (необязательно)"
            class="w-full bg-white border border-violet-200 rounded-xl px-4 py-3 text-base text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-violet-400"
        />
    </div>
</template>

<script setup lang="ts">
import { UserProfileDraft } from 'src/models/UserProfileDraft'
defineProps<{ draft: UserProfileDraft }>()
</script>
