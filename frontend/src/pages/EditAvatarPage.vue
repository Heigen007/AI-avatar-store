<template>
    <div class="min-h-screen px-4 pt-6 pb-20 bg-gradient-to-b from-white via-violet-50 to-white text-gray-800 flex flex-col">
        <h1 class="text-xl font-semibold text-center text-violet-700 mb-6">Редактировать ИИ-аватара</h1>

        <form class="flex flex-col gap-6 flex-1 overflow-y-auto no-wrap" @submit.prevent="updateAvatar">
            <!-- Имя -->
            <div>
                <label class="block mb-2 text-sm font-medium text-violet-700">Имя аватара</label>
                <input
                    v-model="form.name"
                    type="text"
                    class="w-full px-4 py-2 bg-white border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 text-gray-700 placeholder-gray-400"
                />
            </div>

            <!-- Тип отношений -->
            <div>
                <label class="block mb-2 text-sm font-medium text-violet-700">Тип отношений</label>
                <div class="flex gap-3">
                    <button
                        v-for="option in relationshipOptions"
                        :key="option.value"
                        type="button"
                        :class="[
                            'flex-1 px-4 py-2 rounded-xl border text-sm font-medium',
                            form.role === option.value
                                ? 'bg-violet-500 text-white border-violet-500'
                                : 'bg-white text-violet-600 border-violet-200 hover:bg-violet-50'
                        ]"
                        @click="form.role = option.value"
                    >
                        {{ option.label }}
                    </button>
                </div>
            </div>

            <!-- Пол -->
            <div>
                <label class="block mb-2 text-sm font-medium text-violet-700">Пол аватара</label>
                <div class="flex gap-3">
                    <button
                        v-for="option in genderOptions"
                        :key="option.value"
                        type="button"
                        :class="[
                            'flex-1 px-4 py-2 rounded-xl border text-sm font-medium',
                            form.gender === option.value
                                ? 'bg-violet-500 text-white border-violet-500'
                                : 'bg-white text-violet-600 border-violet-200 hover:bg-violet-50'
                        ]"
                        @click="form.gender = option.value"
                    >
                        {{ option.label }}
                    </button>
                </div>
            </div>

            <!-- Характер -->
            <div>
                <label class="block mb-2 text-sm font-medium text-violet-700">Характер</label>
                <div class="flex flex-wrap gap-2">
                    <button
                        v-for="option in personalityOptions"
                        :key="option.value"
                        type="button"
                        :class="[
                            'px-3 py-2 rounded-xl border text-sm font-medium whitespace-nowrap',
                            form.personality === option.value
                                ? 'bg-violet-500 text-white border-violet-500'
                                : 'bg-white text-violet-600 border-violet-200 hover:bg-violet-50'
                        ]"
                        @click="form.personality = option.value"
                    >
                        {{ option.label }}
                    </button>
                </div>
            </div>

            <!-- Фотография -->
            <div>
                <label class="block mb-2 text-sm font-medium text-violet-700">Выбери фото</label>
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
                                'scale-110 border-4 border-violet-400': selectedIndex === index,
                                'opacity-60': selectedIndex !== index
                            }"
                        />
                    </div>
                </div>
            </div>

            <!-- Описание -->
            <div>
                <label class="block mb-2 text-sm font-medium text-violet-700">Описание (необязательно)</label>
                <textarea
                    v-model="form.description"
                    rows="4"
                    class="w-full px-4 py-2 bg-white border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 text-gray-700 placeholder-gray-400 resize-none"
                ></textarea>
            </div>

            <!-- Голос -->
            <div>
                <label class="block mb-2 text-sm font-medium text-violet-700">Голос аватара</label>
                <div class="flex flex-wrap gap-3">
                    <div
                        v-for="voice in voiceOptions"
                        :key="voice.value"
                        class="flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer"
                        :class="form.voice === voice.value
                            ? 'bg-violet-500 text-white border-violet-500'
                            : 'bg-white text-violet-600 border-violet-200 hover:bg-violet-50'"
                        @click="form.voice = voice.value"
                    >
                        {{ voice.label }}
                        <button
                            type="button"
                            class="ml-2 text-xs px-2 py-1 rounded bg-violet-600 hover:bg-violet-500"
                            @click.stop="playVoice(voice.src)"
                        >
                            ▶
                        </button>
                    </div>
                </div>
            </div>

            <!-- Кнопка Обновить -->
            <div class="mt-8">
                <button
                    class="w-full py-3 rounded-xl bg-violet-500 hover:bg-violet-600 text-white font-semibold text-base transition"
                    :disabled="!isValid"
                    type="submit"
                >
                    Обновить
                </button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
    import 'keen-slider/keen-slider.min.css'
    import { useKeenSlider } from 'keen-slider/vue'
    import { Avatar } from 'src/models/Avatar'
    import { ref, computed, reactive, onBeforeUnmount } from 'vue'
    import { useRouter, useRoute } from 'vue-router'
    import { UserProfile } from 'src/models/UserProfile'

    const router = useRouter()
    const route = useRoute()
    const avatarId = route.params.avatarId as string
    const currentAvatar = UserProfile.currentUser!.getAvatarById(avatarId)!
    const sessionRaw = UserProfile.currentUser?.getSessionByAvatarId(avatarId)
    const session = reactive(sessionRaw!)

    const photoList = Array.from({ length: 12 }, (_, i) => `${i + 1}.jpg`)
    const selectedIndex = ref(0)

    // ---- ЕДИНЫЙ ПЛЕЕР ДЛЯ ПРОСЛУШИВАНИЯ ГОЛОСОВ ----
    const audio = ref<HTMLAudioElement | null>(null)
    const currentVoiceSrc = ref<string | null>(null)
    const isAnyVoicePlaying = ref(false)

    function stopCurrentAudio() {
        if (audio.value) {
            try {
                audio.value.pause()
                audio.value.currentTime = 0
            } catch {}
        }
        isAnyVoicePlaying.value = false
        currentVoiceSrc.value = null
    }

    async function playVoice(src: string) {
        // повторный клик по тому же — пауза/стоп
        if (audio.value && currentVoiceSrc.value === src && !audio.value.paused) {
            stopCurrentAudio()
            return
        }

        // остановить предыдущий
        stopCurrentAudio()

        audio.value = new Audio(src)
        currentVoiceSrc.value = src
        audio.value.onended = () => stopCurrentAudio()
        audio.value.onerror = () => stopCurrentAudio()

        try {
            await audio.value.play()
            isAnyVoicePlaying.value = true
        } catch {
            stopCurrentAudio()
        }
    }

    const onVisibilityChange = () => {
        if (document.hidden) stopCurrentAudio()
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    onBeforeUnmount(() => {
        document.removeEventListener('visibilitychange', onVisibilityChange)
        stopCurrentAudio()
    })
    // ---- /АУДИО ----

    const [containerRef, slider] = useKeenSlider({
        loop: true,
        slides: { perView: 3, spacing: 15, origin: 'center' },
        created(s) {
            // стартовый индекс — по текущей фотке аватара
            const idx = photoList.indexOf(form.value.photoUrl)
            selectedIndex.value = idx >= 0 ? idx : s.track.details.rel
            // синхронизировать видимый слайд с выбранным индексом
            if (slider.value && selectedIndex.value !== s.track.details.rel) {
                slider.value.moveToIdx(selectedIndex.value)
            }
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

    const relationshipOptions = [
        { label: 'Друг', value: 'friend' },
        { label: 'Любовь', value: 'lover' },
        { label: 'Ментор', value: 'mentor' }
    ]

    const genderOptions = [
        { label: 'Мужской', value: 'male' },
        { label: 'Женский', value: 'female' }
    ]

    const personalityOptions = [
        { label: 'Спокойный и заботливый', value: 'gentle' },
        { label: 'Весёлый и энергичный', value: 'funny' },
        { label: 'Строгий и прямолинейный', value: 'strict' },
        { label: 'Мудрый и философский', value: 'wise' },
        { label: 'Флиртующий и романтичный', value: 'romantic' },
        { label: 'Аналитичный и логичный', value: 'logical' }
    ]

    const voiceOptions = [
        { label: '1', value: 'alloy', src: '/voices/1.mp3' },
        { label: '2', value: 'ash', src: '/voices/2.mp3' },
        { label: '3', value: 'ballad', src: '/voices/3.mp3' },
        { label: '4', value: 'coral', src: '/voices/4.mp3' },
        { label: '5', value: 'echo', src: '/voices/5.mp3' },
        { label: '6', value: 'fable', src: '/voices/6.mp3' },
        { label: '7', value: 'nova', src: '/voices/7.mp3' },
        { label: '8', value: 'onyx', src: '/voices/8.mp3' },
        { label: '9', value: 'sage', src: '/voices/9.mp3' },
        { label: '10', value: 'shimmer', src: '/voices/10.mp3' }
    ]

    const form = ref({
        name: currentAvatar?.name || '',
        role: currentAvatar?.role || 'friend',
        gender: currentAvatar?.gender || 'male',
        personality: currentAvatar?.personality || '',
        description: currentAvatar?.description || '',
        photoUrl: currentAvatar?.photoUrl || photoList[0],
        voice: currentAvatar?.voice || 'alloy'
    }) as any

    const isValid = computed(() =>
        form.value.name.trim() !== '' &&
        form.value.personality !== '' &&
        form.value.voice !== ''
    )

    async function updateAvatar() {
        await Avatar.updateAvatar(
            currentAvatar,
            form.value.name,
            form.value.role,
            form.value.gender,
            form.value.personality,
            form.value.photoUrl,
            form.value.description,
            form.value.voice
        )

        // останавливаем звук перед переходом
        stopCurrentAudio()

        router.push({ name: 'ChatPage', params: { sessionId: session.id } })
    }
</script>
