<template>
    <div class="w-full flex">
        <div
            :class="[ 
                'max-w-[85%] px-4 py-2 rounded-2xl shadow-md text-sm break-words',
                message.sender === 'user'
                    ? 'bg-violet-500 text-white self-end ml-auto'
                    : 'bg-violet-100 text-gray-800 self-start border border-violet-200 mr-auto'
            ]"
        >
            <div style="white-space: pre-wrap">{{ message.content }}</div>
            <img
                v-if="message.imageUrl"
                :src="message.imageUrl"
                class="mt-2 rounded-xl border border-violet-200 max-w-full object-cover"
                style="max-height: 200px;"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ChatMessage } from 'src/models/ChatMessage'
defineProps<{ message: ChatMessage }>()
</script>
