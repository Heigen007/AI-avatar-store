<template>
    <div
        v-if="!UserProfile.ready.value"
        class="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-100 via-white to-violet-100 text-gray-800"
    >
        <div class="flex flex-col items-center text-center">
            <div class="text-5xl font-bold mb-2 text-violet-600">
                Repliky
            </div>
            <div class="text-lg text-violet-400 mb-8">
                Ваш персональный ИИ друг
            </div>

            <div class="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
    </div>

    <router-view v-else></router-view>
</template>

<script setup lang="ts">
import { UserProfile } from 'src/models/UserProfile'
import { StatusBar, Style } from '@capacitor/status-bar';

StatusBar.setOverlaysWebView({ overlay: false });
StatusBar.setBackgroundColor({ color: '#091a2c' });
StatusBar.setStyle({ style: Style.Light });
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
