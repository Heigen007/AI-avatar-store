// src/api/handlers/sendVoiceMessage.ts
import { Request, Response } from 'express'
import fs from 'fs/promises'
import path from 'path'
import { processMessage } from '../processMessage'
import { OpenAIClient } from '../3dPartyApis/openAI/openAiClient'
import { ChatSession } from '../classes/ChatSession'

export async function sendVoiceMessage(req: Request, res: Response) {
    try {
        const chatId = Number(req.params.chatId)
        const voiceFile = req.file
        if (!voiceFile) return res.status(400).send('No voice file provided')
        const chatSession = await ChatSession.getById(chatId)

        const filePath = path.resolve(voiceFile.path)

        // 1. Распознаем речь
        const transcript = await OpenAIClient.transcribe(filePath)

        // 2. Создаем сообщение и ответ ИИ
        const { userMessage, avatarMessage } = await processMessage(chatId, 'user', transcript)

        // 3. Генерируем голосовой ответ
        const ttsPath = await OpenAIClient.synthesizeSpeech(avatarMessage.text, chatSession?.avatar?.voice || 'alloy')
        const voiceUrl = `/tts/${path.basename(ttsPath)}`

        // Удаляем временный файл
        fs.unlink(filePath).catch(() => {})

        res.status(201).json({
            userMessage,
            avatarMessage,
            voiceUrl
        })
    } catch (err) {
        console.error('sendVoiceMessage error:', err)
        res.status(500).send('Failed to send voice message')
    }
}
