import { Request, Response } from 'express';
import { UserProfile } from '../classes/UserProfile';

export async function createUser(req: Request, res: Response) {
    try {
        const { name, age, bio } = req.body;
        const user = await UserProfile.create(name, age, bio);
        res.status(201).json(user);
    } catch (err) {
        console.error('createUser error:', err);
        res.status(500).send('Failed to create user');
    }
}