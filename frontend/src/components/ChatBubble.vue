<template>
    <div class="w-full flex">
        <div
            :class="[ 
                'max-w-[75%] px-4 py-2 rounded-2xl shadow-md text-sm break-words',
                message.sender === 'user'
                    ? 'bg-cyan-500 text-white self-end ml-auto'
                    : 'bg-white/10 text-white backdrop-blur-lg self-start border border-white/10 mr-auto'
            ]"
        >
            {{ message.content }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ChatMessage } from 'src/models/ChatMessage'
defineProps<{ message: ChatMessage }>()
</script>
