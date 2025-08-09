<template>
    <div>
        <h2 class="text-xl font-semibold text-center text-gray-800 mb-4">Как тебя зовут?</h2>
        <input
            v-model="draft.name"
            type="text"
            placeholder="Имя"
            class="w-full bg-white border border-violet-200 rounded-xl px-4 py-3 text-base text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-violet-400"
            autofocus
        />
    </div>
</template>

<script setup lang="ts">
import { UserProfileDraft } from 'src/models/UserProfileDraft'
defineProps<{ draft: UserProfileDraft }>()
</script>
