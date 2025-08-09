<template>
    <div class="min-h-screen bg-gradient-to-b from-white via-violet-50 to-white flex items-center justify-center px-4">
        <div class="w-full max-w-sm bg-white border border-violet-200 rounded-3xl shadow-2xl p-6">
        <transition name="fade" mode="out-in">
            <component
                :is="currentComponent"
                :draft="draft"
            />
        </transition>

        <div class="flex justify-between mt-6">
            <button
                class="text-violet-600 font-medium disabled:opacity-30 transition"
                :disabled="stepIndex === 0"
                @click="prevStep"
            >
                Назад
            </button>
            <button
                class="text-violet-600 font-medium disabled:opacity-30 transition flex items-center gap-2"
                :disabled="!canProceed || savingState === 'saving'"
                @click="handleNext"
            >
                <template v-if="savingState === 'idle'">
                    {{ stepIndex < steps.length - 1 ? 'Далее' : 'Готово' }}
                </template>
                <template v-else-if="savingState === 'saving'">
                    <span class="w-4 h-4 rounded-full border-2 border-violet-400 border-t-transparent animate-spin"></span>
                    Сохраняю…
                </template>
                <template v-else-if="savingState === 'success'">
                    <svg viewBox="0 0 24 24" class="w-5 h-5 stroke-emerald-400 fill-none" stroke-width="2">
                        <path d="M20 6L9 17l-5-5" />
                    </svg>
                    Сохранено
                </template>
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
const savingState = ref<'idle' | 'saving' | 'success'>('idle')

const steps = [StepName, StepAge, StepBio]
const currentComponent = computed(() => steps[stepIndex.value])

function nextStep() {
    if (stepIndex.value < steps.length - 1) stepIndex.value++
}
async function handleNext() {
    if (stepIndex.value < steps.length - 1) {
        nextStep()
    } else {
        await onComplete()
    }
}

async function onComplete() {
    savingState.value = 'saving'
    await UserProfile.setCurrentUser(
        draft.value.name,
        draft.value.age || 25,
        draft.value.bio.trim()
    )

    router.push({ name: 'HomePage' })
}

function prevStep() {
    if (stepIndex.value > 0) stepIndex.value--
}

const canProceed = computed(() => {
    if (stepIndex.value === 0) return !!draft.value.name.trim()
    if (stepIndex.value === 1) return !!draft.value.age
    return true
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
    opacity: 0;
}
</style>
