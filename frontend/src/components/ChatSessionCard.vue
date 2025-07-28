<template>
    <div
        class="flex items-center justify-between gap-4 p-3 bg-white/10 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-lg hover:bg-white/15 transition"
        @click="$emit('open')"
    >
        <div class="flex items-center gap-4 cursor-pointer">
            <img
                :src="session.avatar.photoUrl"
                class="w-12 h-12 rounded-full object-cover shadow-md ring-2 ring-cyan-400"
            />

            <div class="flex flex-col">
                <div class="text-base font-semibold text-cyan-100">
                    {{ session.avatar.name }}
                </div>
                <div class="text-sm text-cyan-300 opacity-80 truncate max-w-[200px]">
                    {{ lastMessage }}
                </div>
            </div>
        </div>

        <button
            @click.stop="confirmDelete"
            class="text-cyan-300 hover:text-red-400 transition text-xl"
        >
            ✕
        </button>
    </div>
</template>

<script setup lang="ts">
import { ChatSession } from 'src/models/ChatSession'
import { Avatar } from 'src/models/Avatar'
import { UserProfile } from 'src/models/UserProfile'
import { Dialog } from 'quasar'

const props = defineProps<{ session: ChatSession }>()

const lastMessage = props.session.getLastMessage()?.content ?? 'Сообщений пока нет'

function confirmDelete() {
    Dialog.create({
        title: 'Удалить чат?',
        message: `Вы уверены, что хотите удалить чат с ${props.session.avatar.name}?`,
        persistent: true,
        class: 'glass-dialog',
        ok: {
            label: 'Удалить',
            color: 'red',
            unelevated: true,
            class: 'px-4 py-2 rounded-lg text-sm'
        },
        cancel: {
            label: 'Отмена',
            color: 'cyan-5',
            flat: true,
            class: 'px-4 py-2 rounded-lg text-sm text-cyan-300'
        }
    }).onOk(async () => {
        await Avatar.deleteAvatarById(props.session.avatar.id)
    })
}
</script>