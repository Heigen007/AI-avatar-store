import { Request, Response } from 'express';
import { ChatMessage } from '../classes/ChatMessage';

export async function sendMessage(req: Request, res: Response) {
    try {
        const chatId = Number(req.params.chatId);
        const { sender, text } = req.body;

        await ChatMessage.send(chatId, sender, text);

        const avatarMessage = await ChatMessage.send(chatId, 'avatar', text); // Заглушка: дублирует сообщение

        res.status(201).json({ avatarMessage });
    } catch (err) {
        console.error('sendMessage error:', err);
        res.status(500).send('Failed to send message');
    }
}
