<template>
    <div class="min-h-screen bg-gradient-to-b from-[#0a192f] via-[#0f2c44] to-[#103848] flex items-center justify-center px-4">
        <div class="w-full max-w-sm bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl p-6">
        <transition name="fade" mode="out-in">
            <component
                :is="currentComponent"
                :draft="draft"
            />
        </transition>

        <div class="flex justify-between mt-6">
            <button
                class="text-cyan-300 font-medium disabled:opacity-30 transition"
                :disabled="stepIndex === 0"
                @click="prevStep"
            >
                Назад
            </button>
            <button
                class="text-cyan-300 font-medium disabled:opacity-30 transition"
                :disabled="!canProceed"
                @click="handleNext"
            >
                {{ stepIndex < steps.length - 1 ? 'Далее' : 'Готово' }}
            </button>
        </div>
        </div>
    </div>
</template>


<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { UserProfileDraft } from 'src/models/UserProfileDraft'
import StepName from './steps/StepName.vue'
import StepAge from './steps/StepAge.vue'
import StepBio from './steps/StepBio.vue'

import { UserProfile } from 'src/models/UserProfile'

const router = useRouter()
const draft = ref(new UserProfileDraft())
const stepIndex = ref(0)

const steps = [StepName, StepAge, StepBio]
const currentComponent = computed(() => steps[stepIndex.value])

function nextStep() {
    if (stepIndex.value < steps.length - 1) stepIndex.value++
}
function handleNext() {
    if (stepIndex.value < steps.length - 1) {
        nextStep()
    } else {
        onComplete()
    }
}

function prevStep() {
    if (stepIndex.value > 0) stepIndex.value--
}

const canProceed = computed(() => {
    if (stepIndex.value === 0) return !!draft.value.name.trim()
    if (stepIndex.value === 1) return !!draft.value.age
    return true
})

async function onComplete() {
    await UserProfile.setCurrentUser(draft.value.name, draft.value.age || 25, draft.value.bio.trim())
    router.push({ name: 'HomePage' })
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
    opacity: 0;
}
</style>
