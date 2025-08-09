<template>
    <div class="min-h-screen bg-gradient-to-b from-white via-violet-50 to-white text-gray-800 flex items-center justify-center px-6 text-center">
        <div>
            <div class="text-[30vh] font-bold leading-none select-none text-violet-500 drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                404
            </div>

            <div class="text-2xl text-violet-700 mb-10">
                Упс. Здесь ничего нет...
            </div>

            <router-link
                to="/"
                class="inline-block bg-violet-500 hover:bg-violet-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition"
            >
                На главную
            </router-link>
        </div>
    </div>
</template>


<script setup lang="ts">
defineOptions({ name: 'ErrorNotFound' })
</script>
