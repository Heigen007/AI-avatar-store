import { Request, Response } from 'express';
import { Avatar } from '../classes/Avatar';

export async function updateAvatar(req: Request, res: Response) {
    try {
        const avatarId = parseInt(req.params.id);
        const { name, role, gender, personality, photoUrl, description } = req.body;

        await Avatar.updateById(avatarId, {
            name,
            role,
            gender,
            personality,
            photoUrl,
            description
        });

        res.status(200).send('Avatar updated');
    } catch (err) {
        console.error('updateAvatar error:', err);
        res.status(500).send('Failed to update avatar');
    }
}
