<template>
    <div class="min-h-screen bg-gradient-to-b from-[#081825] via-[#0d2c3f] to-[#103d51] text-white flex items-center justify-center px-6 text-center">
        <div>
            <div class="text-[30vh] font-bold leading-none select-none text-cyan-400 drop-shadow-[0_0_15px_rgba(0,232,240,0.5)]">
                404
            </div>

            <div class="text-2xl text-cyan-200/80 mb-10">
                Упс. Здесь ничего нет...
            </div>

            <router-link
                to="/"
                class="inline-block bg-cyan-500 hover:bg-cyan-400 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition"
            >
                На главную
            </router-link>
        </div>
    </div>
</template>


<script setup lang="ts">
defineOptions({ name: 'ErrorNotFound' })
</script>
