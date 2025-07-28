import { Request, Response } from 'express';
import { ChatMessage } from '../classes/ChatMessage';

export async function getChatHistory(req: Request, res: Response) {
    try {
        const chatId = Number(req.params.chatId);
        const messages = await ChatMessage.getAllByChatId(chatId);
        res.status(200).json(messages);
    } catch (err) {
        console.error('getChatHistory error:', err);
        res.status(500).send('Failed to get chat messages');
    }
}
