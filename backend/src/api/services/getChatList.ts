import { Request, Response } from 'express';
import { ChatSession } from '../classes/ChatSession';

export async function getChatList(req: Request, res: Response) {
    try {
        const userId = Number(req.params.userId);
        const chats = await ChatSession.getAllByUserId(userId);
        res.status(200).json(chats);
    } catch (err) {
        console.error('getChatList error:', err);
        res.status(500).send('Failed to get chats');
    }
}
