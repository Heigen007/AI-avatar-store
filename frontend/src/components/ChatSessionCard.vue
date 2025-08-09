<template>
    <div
        class="flex items-center justify-between gap-4 p-3 bg-white border border-violet-200 rounded-2xl shadow-lg hover:bg-violet-50 transition"
        @click="$emit('open')"
    >
        <div class="flex items-center gap-4 cursor-pointer">
            <img
                :src="session.avatar.photoUrl"
                class="w-12 h-12 rounded-full object-cover shadow-md ring-2 ring-violet-400"
            />

            <div class="flex flex-col">
                <div class="text-base font-semibold text-gray-800">
                    {{ session.avatar.name }}
                </div>
                <div class="text-sm text-gray-500 truncate max-w-[200px]">
                    {{ lastMessage }}
                </div>
            </div>
        </div>

        <button
            @click.stop="confirmDelete"
            class="text-violet-500 hover:text-red-500 transition text-xl"
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
            color: 'purple-5',
            flat: true,
            class: 'px-4 py-2 rounded-lg text-sm text-violet-500'
        }
    }).onOk(async () => {
        await Avatar.deleteAvatarById(props.session.avatar.id)
    })
}
</script>