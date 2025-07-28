import { Request, Response } from 'express'
import { UserProfile } from '../classes/UserProfile'

export async function getUser(req: Request, res: Response) {
    try {
        const id = Number(req.params.id)
        const user = await UserProfile.getById(id)
        if (!user) return res.status(404).send('User not found')
        res.json(user)
    } catch (err) {
        console.error('getUser error:', err)
        res.status(500).send('Failed to get user')
    }
}
