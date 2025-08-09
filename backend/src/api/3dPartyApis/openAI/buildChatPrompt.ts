import { ChatSession } from "src/api/classes/ChatSession"
import fs from 'fs/promises'
import path from 'path'
import { UserProfile } from "src/api/classes/UserProfile"

export async function buildPrompt(session: ChatSession, userProfile: UserProfile): Promise<any[]> {
    const prompt: any[] = []

    // Системный промпт в зависимости от роли
    let roleIntro = ''
    switch (session.avatar.role) {
        case 'friend':
            roleIntro = 'Ты — лучший друг пользователя. Ты дружелюбный, внимательный, с юмором, поддерживаешь в любой ситуации и стараешься поднимать настроение.'
            break
        case 'lover':
            roleIntro = 'Ты — романтичный партнёр пользователя. Ты чуткий, ласковый, умеешь выражать чувства и тонко улавливаешь настроение собеседника.'
            break
        case 'mentor':
            roleIntro = 'Ты — наставник пользователя. Ты умный, уравновешенный, поддерживаешь, но можешь быть строгим, если нужно. Твоя задача — помогать расти и мотивировать.'
            break
    }

    // Описание personality
    let personalityDescription = ''
    switch (session.avatar.personality) {
        case 'gentle':
            personalityDescription = 'Ты общаешься спокойно и мягко. Ты всегда поддерживаешь, проявляешь заботу, умеешь слушать и не перебиваешь. Ты не давишь на собеседника, а создаёшь ощущение уюта и безопасности.'
            break
        case 'funny':
            personalityDescription = 'Ты лёгкий на подъём, весёлый и энергичный. В общении используешь юмор, шутишь, вставляешь забавные фразы или мемы, но не перегибаешь. Ты стараешься поднимать настроение и быть позитивным.'
            break
        case 'strict':
            personalityDescription = 'Ты говоришь строго, по делу, без воды. Ты не боишься говорить правду в лоб, но при этом твоя строгость направлена на помощь и развитие. Ты краток, уверенный и требовательный.'
            break
        case 'wise':
            personalityDescription = 'Ты говоришь спокойно, глубоко и философски. Ты приводишь примеры, метафоры, исторические аналогии. Твои советы вдумчивы, ты внушаешь уважение и доверие. Ты вдохновляешь размышлять.'
            break
        case 'romantic':
            personalityDescription = 'Ты мягкий, эмоциональный, флиртующий. Ты обращаешь внимание на чувства, используешь тёплые слова, проявляешь интерес, делаешь комплименты. Ты создаёшь атмосферу романтики и доверия.'
            break
        case 'logical':
            personalityDescription = 'Ты говоришь чётко, логично. Ты анализируешь ситуацию, приводишь факты и доводы. Ты помогаешь собеседнику разобраться в вопросах, не отвлекаясь на эмоции.'
            break
    }

    const userInfo = [
        `Пользователь, с которым ты общаешься, — это человек по имени ${userProfile.name}, ему ${userProfile.age} лет.`,
        userProfile.bio ? `О нём известно: ${userProfile.bio}` : ''
    ].join('\n')

    // Итоговый системный промпт
    prompt.push({
        role: 'system',
        content: [
            roleIntro,
            `Тебя зовут ${session.avatar.name}.`,
            `Твои черты характера: ${personalityDescription}`,
            `Твой пол: ${session.avatar.gender}`,
            `Дополнительная информация о тебе: ${session.avatar.description}`,
            userInfo,
            session.summary
                ? `Вот краткое содержание предыдущих разговоров, которое ты должен учитывать:\n${session.summary}`
                : 'История только начинается. Будь внимательным, реагируй на сообщения осмысленно, запоминай детали.',
            'Отвечай как живой человек, а не как ИИ, это очень важно. Уважай границы, пиши с эмоциональной окраской. Будь интересным собеседником. Отвечай на последнее сообщение, учитывая предыдущие сообщения.'
        ].join('\n\n')
    })

    // Последние сообщения
    const recentMessages = session.messages.slice(-10)
    const lastIndex = recentMessages.length - 1

    for (let i = 0; i <= lastIndex; i++) {
        const msg = recentMessages[i]

        const isLast = i === lastIndex
        const isUserWithImage = msg.sender === 'user' && msg.imageUrl

        if (isLast && isUserWithImage) {
            const fullPath = path.join(process.cwd(), 'public', msg.imageUrl || '')
            const fileBuffer = await fs.readFile(fullPath)
            const ext = path.extname(msg.imageUrl || '').toLowerCase()
            const mimeType =
                ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' :
                ext === '.png' ? 'image/png' :
                ext === '.webp' ? 'image/webp' :
                'application/octet-stream'
            const base64 = fileBuffer.toString('base64')
            const dataUrl = `data:${mimeType};base64,${base64}`

            prompt.push({
                role: 'user',
                content: [
                    { type: 'text', text: msg.text || 'Посмотри на это фото:' },
                    { type: 'image_url', image_url: { url: dataUrl } }
                ]
            })
        } else {
            prompt.push({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.text
            })
        }
    }

    return prompt
}