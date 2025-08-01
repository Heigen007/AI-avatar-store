import { buildPrompt } from "./3dPartyApis/openAI/buildChatPrompt"
import { OpenAIClient } from "./3dPartyApis/openAI/openAiClient"
import { updateSummaryIfNeeded } from "./3dPartyApis/openAI/updateSummaryIfNeeded"
import { ChatMessage } from "./classes/ChatMessage"
import { ChatSession } from "./classes/ChatSession"
import { UserProfile } from "./classes/UserProfile"

export async function processMessage(
    chatId: number,
    sender: 'user',
    text: string,
    imageUrl?: string
) {
    // 1. Сохраняем сообщение пользователя
    const userMessage = await ChatMessage.send(chatId, sender, text, imageUrl)

    // 2. Загружаем сессию и профиль
    const session = await ChatSession.getById(chatId)
    if (!session) throw new Error('Chat session not found')

    const userProfile = await UserProfile.getById(session.userProfileId)
    if (!userProfile) throw new Error('User profile not found')

    // 3. Формируем промпт
    const prompt = await buildPrompt(session, userProfile)

    // 4. GPT-ответ (передаем imageUrl!)
    const replyText = await OpenAIClient.generateResponse(prompt, imageUrl)

    // 5. Сохраняем ответ ИИ в БД
    const avatarMessage = await ChatMessage.send(chatId, 'avatar', replyText)

    // 6. Обновляем summary
    await updateSummaryIfNeeded(session)

    return { userMessage, avatarMessage }
}
