import { Request, Response } from 'express'
import { Feedback } from '../classes/Feedback'

export async function submitFeedback(req: Request, res: Response) {
    try {
        const message = req.body.message
        if (!message || message.trim().length === 0) {
            return res.status(400).json({ error: 'Empty message' })
        }

        await Feedback.create(message)
        res.status(200).json({ ok: true })
    } catch (err) {
        console.error('submitFeedback error:', err)
        res.status(500).json({ error: 'Failed to save feedback' })
    }
}
