import { Request, Response } from 'express';
import { UserProfile } from '../classes/UserProfile';

export async function updateUser(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const { name, age, bio } = req.body;
        const updated = await UserProfile.update(id, name, age, bio);
        res.status(200).json(updated);
    } catch (err) {
        console.error('updateUser error:', err);
        res.status(500).send('Failed to update user');
    }
}
