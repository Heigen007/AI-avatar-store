<template>
    <div class="min-h-screen bg-gradient-to-b from-[#081825] via-[#0d2c3f] to-[#103d51] text-white flex items-center justify-center px-6 text-center">
        <div>
            <!-- Иконка "Обновление" -->
            <div class="text-[18vh] leading-none select-none text-cyan-400 drop-shadow-[0_0_25px_rgba(0,232,240,0.6)] mb-6">
                🔄
            </div>

            <!-- Заголовок -->
            <div class="text-2xl text-cyan-100 font-semibold mb-4">
                Требуется обновление
            </div>

            <!-- Описание -->
            <div class="text-cyan-300/80">
                Вы используете устаревшую версию приложения.<br>
                Пожалуйста, установите последнюю версию из магазина.
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'OutdatedPage' })
</script>
