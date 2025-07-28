import { Request, Response } from 'express';
import { Avatar } from '../classes/Avatar';

export async function createAvatar(req: Request, res: Response) {
    try {
        const { name, role, personality, photoUrl, userId } = req.body;
        const chatSession = await Avatar.create(name, role, personality, photoUrl, userId);
        console.log('createAvatar response:', chatSession);
        
        res.status(201).json({ sessionId: chatSession.id, avatarId: chatSession.avatar.id, avatar:{
            id: chatSession.avatar.id,
            name: chatSession.avatar.name,
            role: chatSession.avatar.role,
            personality: chatSession.avatar.personality,
            photoUrl: chatSession.avatar.photoUrl
        }});
    } catch (err) {
        console.error('createAvatar error:', err);
        res.status(500).send('Failed to create avatar');
    }
}
