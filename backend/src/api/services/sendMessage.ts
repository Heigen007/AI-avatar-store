import { Request, Response } from 'express'
import { ChatMessage } from '../classes/ChatMessage'
import { ChatSession } from '../classes/ChatSession'
import { buildPrompt } from '../3dPartyApis/openAI/buildChatPrompt'
import { OpenAIClient } from '../3dPartyApis/openAI/openAiClient'
import { updateSummaryIfNeeded } from '../3dPartyApis/openAI/updateSummaryIfNeeded'
import { UserProfile } from '../classes/UserProfile'

export async function sendMessage(req: Request, res: Response) {
    try {
        const chatId = Number(req.params.chatId)
        const { sender, text } = req.body

        const imageFile = req.file
        const imageUrl = imageFile ? `/uploads/${imageFile.filename}` : undefined

        // 1. Сохраняем сообщение пользователя
        const userMessage = await ChatMessage.send(chatId, sender, text, imageUrl)

        // 2. Загружаем сессию
        const session = await ChatSession.getById(chatId)
        if (!session) return res.status(404).send('Chat session not found')
        const userProfile = await UserProfile.getById(session.userProfileId)
        if (!userProfile) return res.status(404).send('User profile not found')
        // 3. Формируем промпт
        const prompt = await buildPrompt(session, userProfile)

        // 4. GPT-ответ
        const reply = await OpenAIClient.generateResponse(prompt)
        const avatarMessage = await ChatMessage.send(chatId, 'avatar', reply)

        // 5. Обновляем summary
        updateSummaryIfNeeded(session).catch((err) => {
            console.error('Failed to update summary:', err)
        })

        res.status(201).json({
            avatarMessage: {
                sender: avatarMessage.sender,
                text: avatarMessage.text,
                timestamp: avatarMessage.timestamp,
                imageUrl: avatarMessage.imageUrl,
                userImageUrl: userMessage.imageUrl
            }
        })

    } catch (err) {
        console.error('sendMessage error:', err)
        res.status(500).send('Failed to send message')
    }
}