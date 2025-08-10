// src/api/handlers/getAdminChatsList.ts
import { Request, Response } from 'express';
import { AdminChatService } from '../services/AdminChatService';

export async function getAdminChatsList(req: Request, res: Response) {
    try {
        const rows = await AdminChatService.listAll();
        res.status(200).json({ items: rows, count: rows.length, generatedAt: new Date().toISOString() });
    } catch (err) {
        console.error('getAdminChatsList error:', err);
        res.status(500).send('Failed to load chats list');
    }
}
