<template>
    <div class="min-h-screen px-4 pt-6 pb-20 bg-gradient-to-b from-[#091a2c] via-[#0d2b3f] to-[#134155] text-white flex flex-col">
        <h1 class="text-xl font-semibold text-center text-cyan-100 mb-2">Создай своего ИИ-аватара</h1>
        <p class="text-center text-cyan-300 text-sm mb-4">
            Заполните информацию об аватаре, чтобы сделать его уникальным
        </p>

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

            <!-- Пол -->
            <div>
                <label class="block mb-2 text-sm font-medium text-cyan-200">Пол аватара</label>
                <div class="flex gap-3">
                    <button
                        v-for="option in genderOptions"
                        :key="option.value"
                        type="button"
                        :class="[
                            'flex-1 px-4 py-2 rounded-xl border text-sm font-medium',
                            form.gender === option.value
                                ? 'bg-cyan-500 text-white border-cyan-500'
                                : 'bg-white/5 text-cyan-300 border-white/20 hover:bg-white/10'
                        ]"
                        @click="form.gender = option.value"
                    >
                        {{ option.label }}
                    </button>
                </div>
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

            <!-- Описание -->
            <div>
                <label class="block mb-2 text-sm font-medium text-cyan-200">
                    Расскажите об аватаре
                    <span class="ml-2 text-xs font-normal px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                        необязательно
                    </span>
                </label>
                <textarea
                    v-model="form.description"
                    rows="4"
                    placeholder="Здесь можно описать характер, прошлое, интересы, работу, стиль общения и другие детали. Это поможет ИИ вести себя реалистичнее."
                    class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-cyan-300 resize-none"
                ></textarea>
            </div>

            <!-- Голос -->
            <div>
                <label class="block mb-2 text-sm font-medium text-cyan-200">Голос аватара</label>
                <div class="flex flex-wrap gap-3">
                    <div
                        v-for="voice in voiceOptions"
                        :key="voice.value"
                        class="flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer"
                        :class="form.voice === voice.value
                            ? 'bg-cyan-500 text-white border-cyan-500'
                            : 'bg-white/5 text-cyan-300 border-white/20 hover:bg-white/10'"
                        @click="form.voice = voice.value"
                    >
                        {{ voice.label }}
                        <button
                            type="button"
                            class="ml-2 text-xs px-2 py-1 rounded bg-cyan-600 hover:bg-cyan-500"
                            @click.stop="playVoice(voice.src)"
                        >
                            ▶
                        </button>
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
    import { Avatar } from 'src/models/Avatar'
    import type { ChatSession } from 'src/models/ChatSession'
    import { onMounted, onBeforeUnmount, ref, computed } from 'vue'
    import { useRouter } from 'vue-router'

    const router = useRouter()

    // Список фото (например, "1.jpg"..."12.jpg")
    const photoList = Array.from({ length: 12 }, (_, i) => `${i + 1}.jpg`)
    const selectedIndex = ref(0)

    // ---- АУДИО: гарантируем одиночное воспроизведение ----
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
        // Если кликаем по тому же голосу и он играет — остановим
        if (audio.value && currentVoiceSrc.value === src && !audio.value.paused) {
            stopCurrentAudio()
            return
        }

        // Остановить предыдущий (если играл)
        stopCurrentAudio()

        // Создать новый проигрыватель и запустить
        audio.value = new Audio(src)
        currentVoiceSrc.value = src

        // Сброс флагов по завершении/ошибке
        audio.value.onended = () => stopCurrentAudio()
        audio.value.onerror = () => stopCurrentAudio()

        try {
            await audio.value.play()
            isAnyVoicePlaying.value = true
        } catch {
            // В некоторых браузерах может требоваться пользовательское взаимодействие
            stopCurrentAudio()
        }
    }

    // На скрытие вкладки/уход со страницы — остановить звук
    const onVisibilityChange = () => {
        if (document.hidden) {
            stopCurrentAudio()
        }
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    onBeforeUnmount(() => {
        document.removeEventListener('visibilitychange', onVisibilityChange)
        stopCurrentAudio()
    })
    // ---- /АУДИО ----

    // Слайдер
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

    // ---- ФОРМА ----
    type Role = 'friend' | 'lover' | 'mentor'
    type Gender = 'male' | 'female'
    type VoiceValue =
        | 'alloy' | 'ash' | 'ballad' | 'coral' | 'echo'
        | 'fable' | 'nova' | 'onyx' | 'sage' | 'shimmer'

    const form = ref({
        name: '',
        role: 'friend' as Role,
        personality: '',
        photoUrl: photoList[0],
        gender: '' as '' | Gender,
        description: '',
        voice: 'alloy' as VoiceValue
    }) as any;

    const relationshipOptions = [
        { label: 'Друг', value: 'friend' as Role },
        { label: 'Любовь', value: 'lover' as Role },
        { label: 'Ментор', value: 'mentor' as Role }
    ]

    const personalityOptions = [
        { label: 'Спокойный и заботливый', value: 'gentle' },
        { label: 'Весёлый и энергичный', value: 'funny' },
        { label: 'Строгий и прямолинейный', value: 'strict' },
        { label: 'Мудрый и философский', value: 'wise' },
        { label: 'Флиртующий и романтичный', value: 'romantic' },
        { label: 'Аналитичный и логичный', value: 'logical' }
    ]

    const genderOptions = [
        { label: 'Мужской', value: 'male' as Gender },
        { label: 'Женский', value: 'female' as Gender }
    ]

    const voiceOptions = [
        { label: '1', value: 'alloy' as VoiceValue, src: '/voices/1.mp3' },
        { label: '2', value: 'ash' as VoiceValue, src: '/voices/2.mp3' },
        { label: '3', value: 'ballad' as VoiceValue, src: '/voices/3.mp3' },
        { label: '4', value: 'coral' as VoiceValue, src: '/voices/4.mp3' },
        { label: '5', value: 'echo' as VoiceValue, src: '/voices/5.mp3' },
        { label: '6', value: 'fable' as VoiceValue, src: '/voices/6.mp3' },
        { label: '7', value: 'nova' as VoiceValue, src: '/voices/7.mp3' },
        { label: '8', value: 'onyx' as VoiceValue, src: '/voices/8.mp3' },
        { label: '9', value: 'sage' as VoiceValue, src: '/voices/9.mp3' },
        { label: '10', value: 'shimmer' as VoiceValue, src: '/voices/10.mp3' }
    ]

    const isValid = computed(() =>
        form.value.name.trim() !== '' &&
        form.value.personality !== '' &&
        form.value.photoUrl !== '' &&
        form.value.gender !== '' &&
        form.value.role !== '' &&
        form.value.voice !== ''
    )

    async function submit() {
        const session: ChatSession = await Avatar.createNewAvatar(
            form.value.name,
            form.value.role,
            form.value.gender as Gender,
            form.value.personality,
            form.value.photoUrl,
            form.value.description,
            form.value.voice
        )

        // Перед переходом — остановим текущий звук
        stopCurrentAudio()

        router.push({
            name: 'ChatPage',
            params: { sessionId: session.id }
        })
    }
</script>
