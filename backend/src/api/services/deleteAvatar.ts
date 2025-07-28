import { Request, Response } from 'express'
import { Avatar } from '../classes/Avatar'

export async function deleteAvatar(req: Request, res: Response) {
    try {
        const avatarId = Number(req.params.id)
        await Avatar.deleteById(avatarId)
        res.status(204).send()
    } catch (err) {
        console.error('deleteAvatar error:', err)
        res.status(500).send('Failed to delete avatar')
    }
}
