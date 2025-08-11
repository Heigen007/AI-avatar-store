<template>
  <q-layout view="lHh Lpr lFf" class="safe-area-top safe-area-bottom">
    <q-page-container
      class="relative myLayout overflow-hidden bg-[#0a1c2f]"
      style="padding-bottom: calc(env(safe-area-inset-bottom) + 56px)"
    >
      <router-view v-slot="{ Component, route }">
        <transition :name="transitionName">
          <div v-if="isUnderMaintenance" class="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-center text-white px-6">
            <div class="text-2xl font-semibold mb-4">Приложение на техническом обслуживании</div>
            <div class="text-cyan-300">Пожалуйста, повторите попытку входа через 15 минут.</div>
          </div>
          <component
            v-else
            :is="Component"
            :key="route.fullPath"
            class="absolute inset-0 w-full h-full"
          />
        </transition>
      </router-view>
    </q-page-container>

    <q-footer class="bg-white/5 backdrop-blur-xl border-t border-white/10 text-cyan-100">
      <q-tabs
        dense
        align="justify"
        class="text-cyan-300"
        active-color="cyan-400"
        indicator-color="cyan-400"
      >
        <q-route-tab label="Профиль" icon="person" to="/profile" />
        <q-route-tab label="Аватары" icon="people" to="/home" />
        <q-route-tab label="Чаты" icon="chat" to="/chats" />
        <q-route-tab label="Отзыв" icon="feedback" to="/feedback" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>


<script setup lang="ts">
import { UserProfile } from 'src/models/UserProfile'
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'

defineOptions({ name: 'MainLayout' })

const route = useRoute()
const transitionName = ref('slide-left')

const tabsOrder = ['/profile', '/home', '/chats', '/feedback']
let previousIndex = tabsOrder.indexOf(route.path)

watch(() => route.path, (toPath) => {
    const currentIndex = tabsOrder.indexOf(toPath)

    if (currentIndex > previousIndex) {
        transitionName.value = 'slide-left'
    } else if (currentIndex < previousIndex) {
        transitionName.value = 'slide-right'
    }

    previousIndex = currentIndex
})

const isUnderMaintenance = computed(() => UserProfile.currentUser === null)
</script>

<style>
.myLayout {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>

<style scoped>
/* Slide Left */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
    transition: transform 0.2s ease;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
}

/* Slide Left */
.slide-left-enter-from {
    transform: translateX(100%);
}
.slide-left-leave-to {
    transform: translateX(-100%);
}

/* Slide Right */
.slide-right-enter-from {
    transform: translateX(-100%);
}
.slide-right-leave-to {
    transform: translateX(100%);
}
</style>
