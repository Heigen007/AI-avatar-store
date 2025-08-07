<template>
    <div v-if="!UserProfile.ready.value" class="min-h-screen flex items-center justify-center bg-[#081825] text-white">
        <div class="flex flex-col items-center text-center">
            <div class="text-5xl font-bold mb-2 text-cyan-400 drop-shadow-[0_0_15px_rgba(0,232,240,0.5)]">
                Repliky
            </div>
            <div class="text-lg text-cyan-200/80 mb-8">
                Ваш персональный ИИ друг
            </div>

            <div class="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        </div>
    </div>

    <router-view v-else></router-view>
</template>

<script setup lang="ts">
import { UserProfile } from 'src/models/UserProfile'
import { StatusBar } from '@capacitor/status-bar';

StatusBar.setOverlaysWebView({ overlay: false });
StatusBar.setBackgroundColor({ color: '#091a2c' });
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
