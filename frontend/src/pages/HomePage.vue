<template>
    <div class="min-h-screen px-4 pt-6 pb-20 bg-gradient-to-b from-[#091a2c] via-[#0d2b3f] to-[#134155] text-white flex flex-col">
        <h1 class="text-xl font-semibold text-center text-cyan-100 mb-6">Создай своего ИИ-аватара</h1>

        <form class="flex flex-col gap-6 flex-1 overflow-y-auto no-wrap" @submit.prevent="submit">
            <!-- Имя -->
            <div>
                <label class="block mb-2 text-sm font-medium text-cyan-200">Имя аватара</label>
                <input
                    v-model="form.name"
                    type="text"
                    placeholder="Алекс, София..."
                    class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-cyan-300"
                />
            </div>

            <!-- Возраст -->
            <div>
                <label class="block mb-2 text-sm font-medium text-cyan-200">Возраст аватара</label>
                <input
                    v-model="form.age"
                    type="number"
                    min="10"
                    max="99"
                    placeholder="Например, 25"
                    class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-cyan-300"
                />
            </div>

            <!-- Тип отношений -->
            <div>
                <label class="block mb-2 text-sm font-medium text-cyan-200">Тип отношений</label>
                <div class="flex gap-3">
                    <button
                        v-for="option in relationshipOptions"
                        :key="option.value"
                        type="button"
                        :class="[
                            'flex-1 px-4 py-2 rounded-xl border text-sm font-medium',
                            form.role === option.value
                                ? 'bg-cyan-500 text-white border-cyan-500'
                                : 'bg-white/5 text-cyan-300 border-white/20 hover:bg-white/10'
                        ]"
                        @click="form.role = option.value"
                    >
                        {{ option.label }}
                    </button>
                </div>
            </div>

            <!-- Характер -->
            <div>
                <label class="block mb-2 text-sm font-medium text-cyan-200">Характер</label>
                <div class="flex flex-wrap gap-2">
                    <button
                        v-for="option in personalityOptions"
                        :key="option.value"
                        type="button"
                        :class="[
                            'px-3 py-2 rounded-xl border text-sm font-medium whitespace-nowrap',
                            form.personality === option.value
                                ? 'bg-cyan-500 text-white border-cyan-500'
                                : 'bg-white/5 text-cyan-300 border-white/20 hover:bg-white/10'
                        ]"
                        @click="form.personality = option.value"
                    >
                        {{ option.label }}
                    </button>
                </div>
            </div>

            <!-- Фотография -->
            <div>
                <label class="block mb-2 text-sm font-medium text-cyan-200">Выбери фото</label>
                <div ref="containerRef" class="keen-slider" style="max-width: 92vw">
                    <div
                        v-for="(src, index) in photoList"
                        :key="index"
                        class="keen-slider__slide flex items-center justify-center cursor-pointer"
                        @click="selectSlide(index)"
                    >
                        <img
                            :src="`/${src}`"
                            :alt="`avatar ${index}`"
                            class="rounded-2xl h-40 w-28 object-cover transition-transform duration-300"
                            :class="{
                                'scale-110 border-4 border-cyan-400': selectedIndex === index,
                                'opacity-60': selectedIndex !== index
                            }"
                        />
                    </div>
                </div>
            </div>

        <!-- Кнопка продолжить -->
        <div class="mt-8">
            <button
                class="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-semibold text-base transition"
                :disabled="!isValid"
                type="submit"
            >
                Продолжить
            </button>
        </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/vue'
import { Avatar, AvatarRole } from 'src/models/Avatar'
import { ChatSession } from 'src/models/ChatSession'
import { onMounted, ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { UserProfile } from 'src/models/UserProfile'
import { useRouter } from 'vue-router'

const router = useRouter()

const photoList = Array.from({ length: 12 }, (_, i) => `${i + 1}.jpg`)
const selectedIndex = ref(0)

const [containerRef, slider] = useKeenSlider({
    loop: true,
    slides: {
        perView: 3,
        spacing: 15,
        origin: 'center'
    },
    mode: 'snap',
    created(s) {
        selectedIndex.value = s.track.details.rel
        form.value.photoUrl = photoList[selectedIndex.value]
    },
    slideChanged(s) {
        selectedIndex.value = s.track.details.rel
        form.value.photoUrl = photoList[selectedIndex.value]
    }
})

function selectSlide(index: number) {
    if (slider.value) {
        slider.value.moveToIdx(index)
    }
}

onMounted(() => {
    form.value.photoUrl = photoList[0]
})
const form = ref({
    name: '',
    age: null as number | null,
    role: 'friend' as any,
    personality: '',
    photoUrl: photoList[0]
})

const relationshipOptions = [
    { label: 'Друг', value: 'friend' },
    { label: 'Любовь', value: 'lover' },
    { label: 'Ментор', value: 'mentor' }
]

const personalityOptions = [
    { label: 'Спокойный и заботливый', value: 'gentle' },
    { label: 'Весёлый и энергичный', value: 'funny' },
    { label: 'Строгий и прямолинейный', value: 'strict' },
    { label: 'Мудрый и философский', value: 'wise' },
    { label: 'Флиртующий и романтичный', value: 'romantic' }
]

const isValid = computed(() =>
    form.value.name.trim() !== '' &&
    form.value.age !== null &&
    form.value.personality !== '' &&
    form.value.photoUrl !== ''
)

async function submit() {
    // можно передать в router.push или emit на родителя
    console.log('Созданный аватар:', form.value)

    const session: ChatSession = await Avatar.createNewAvatar(
        form.value.name,
        form.value.role,
        form.value.personality,
        form.value.photoUrl
    )

    router.push({
        name: 'ChatPage',
        params: { sessionId: session.id }
    })
}

</script>