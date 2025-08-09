<template>
    <div class="min-h-screen bg-gradient-to-b from-white via-violet-50 to-white text-gray-800 flex items-center justify-center px-6 text-center">
        <div>
            <!-- Иконка "Обновление" -->
            <div class="text-[18vh] leading-none select-none text-violet-500 drop-shadow-[0_0_25px_rgba(139,92,246,0.4)] mb-6">
                🔄
            </div>

            <!-- Заголовок -->
            <div class="text-2xl text-violet-700 font-semibold mb-4">
                Требуется обновление
            </div>

            <!-- Описание -->
            <div class="text-violet-500/80">
                Вы используете устаревшую версию приложения.<br>
                Пожалуйста, установите последнюю версию из магазина.
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'OutdatedPage' })
</script>
