<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container
      class="relative overflow-hidden bg-gradient-to-b from-white via-violet-50 to-white"
      style="padding-bottom: 0; height: 100vh"
    >
      <router-view v-slot="{ Component, route }">
        <transition :name="transitionName">
          <div
            v-if="isUnderMaintenance"
            class="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-center text-gray-700 px-6"
          >
            <div class="text-2xl font-semibold mb-4">Приложение на техническом обслуживании</div>
            <div class="text-violet-500">Пожалуйста, повторите попытку входа через 15 минут.</div>
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

    <q-footer class="bg-white/80 backdrop-blur-xl border-t border-violet-200 text-violet-600">
      <q-tabs
        dense
        align="justify"
        class="text-violet-500"
        active-color="violet-600"
        indicator-color="violet-600"
      >
        <q-route-tab content-class="q-mb-sm" label="Профиль" icon="person" to="/profile" />
        <q-route-tab content-class="q-mb-sm" label="Аватары" icon="people" to="/home" />
        <q-route-tab content-class="q-mb-sm" label="Чаты" icon="chat" to="/chats" />
        <q-route-tab content-class="q-mb-sm" label="Отзыв" icon="feedback" to="/feedback" />
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
