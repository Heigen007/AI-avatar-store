// src/api/handlers/sendMessage.ts
import { Request, Response } from 'express'
import { processMessage } from '../processMessage'

export async function sendMessage(req: Request, res: Response) {
    try {
        const chatId = Number(req.params.chatId)
        const { sender = 'user', text = '' } = req.body
        const imageFile = req.file
        const imageUrl = imageFile ? `/uploads/${imageFile.filename}` : undefined

        const { userMessage, avatarMessage } = await processMessage(chatId, sender, text, imageUrl)

        res.status(201).json({
            userMessage,
            avatarMessage
        })
    } catch (err) {
        console.error('sendMessage error:', err)
        res.status(500).send('Failed to send message')
    }
}
