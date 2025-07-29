<template>
    <div class="w-full flex">
        <div
            :class="[ 
                'max-w-[85%] px-4 py-2 rounded-2xl shadow-md text-sm break-words',
                message.sender === 'user'
                    ? 'bg-cyan-500 text-white self-end ml-auto'
                    : 'bg-white/10 text-white backdrop-blur-lg self-start border border-white/10 mr-auto'
            ]"
        >
            <div style="white-space: pre-wrap">{{ message.content }}</div>
            <img
                v-if="message.imageUrl"
                :src="message.imageUrl"
                class="mt-2 rounded-xl border border-white/10 max-w-full object-cover"
                style="max-height: 200px;"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ChatMessage } from 'src/models/ChatMessage'
defineProps<{ message: ChatMessage }>()
</script>
