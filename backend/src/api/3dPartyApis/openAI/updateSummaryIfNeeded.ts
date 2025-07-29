import { ChatSession } from 'src/api/classes/ChatSession'
import { OpenAIClient } from './openAiClient'

export async function updateSummaryIfNeeded(session: ChatSession): Promise<void> {
    // Обновляем сводку только каждые 10 сообщений пользователя
    if (session.messages.length !== 1 && (session.messages.length - 1) % 20 !== 0) return

    // Берём только последние 10 сообщений (вместе с ответами аватара)
    const last10 = session.messages.slice(-20) // 10 user + 10 avatar

    const chatHistory = last10.map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
    }))

    const systemInstruction = {
        role: 'system',
        content: `
Ты — ИИ, который составляет краткую, структурированную и полезную сводку о пользователе на основе общения.

Сводка должна иметь следующий формат:

Сводка о пользователе:
1. Пол: ...
2. Характер: ...
3. Эмоциональное состояние: ...
4. Интересы: ...
5. Хобби и увлечения: ...
6. Профессия и образование: ...
7. Семейное положение(с именами): ...
8. Отношение к аватару: ...
9. Цели и желания: ...
10. Проблемы и тревоги: ...
11. Темы разговоров: ...
12. Особенности общения: ...

Ввод: предыдущая сводка + новые сообщения.

Инструкция:
- Обнови существующую сводку, дополнив или скорректировав её.
- Пиши без выдумок, только если факт явно следует из текста.
- Не повторяй сводку полностью, если ничего не изменилось.
- Пиши сжато, но информативно.
`
    }

    const prompt = [systemInstruction]

    // Добавляем предыдущую сводку, если есть
    if (session.summary) {
        prompt.push({
            role: 'system',
            content: `Предыдущая сводка пользователя:\n${session.summary}`
        })
    }

    prompt.push(...chatHistory)

    const updatedSummary = await OpenAIClient.generateSummary(prompt)
    await ChatSession.updateSummary(session.id, updatedSummary)
}