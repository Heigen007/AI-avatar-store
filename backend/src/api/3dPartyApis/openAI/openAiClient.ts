import OpenAI from 'openai'
import fs from 'fs'
import fsp from 'fs/promises'
import path from 'path'

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export class OpenAIClient {
    static async generateResponse(messages: any[], imageUrl?: string): Promise<string> {
        const payload: any = {
            model: 'gpt-4o',
            messages
        }
        const response = await client.chat.completions.create(payload)
        return response.choices[0].message?.content ?? ''
    }

    static async generateSummary(messages: any[]): Promise<string> {
        const response = await client.chat.completions.create({
            model: 'gpt-4o',
            messages
        })
        return response.choices[0].message?.content ?? ''
    }

    static async transcribe(filePath: string): Promise<string> {
        const response = await client.audio.transcriptions.create({
            file: fs.createReadStream(filePath),
            model: 'whisper-1'
        })
        return response.text || ''
    }


    static async synthesizeSpeech(text: string, voice: string): Promise<string> {
        const response = await client.audio.speech.create({
            model: 'gpt-4o-mini-tts',
            voice,
            input: text
        })

        const buffer = Buffer.from(await response.arrayBuffer())
        const fileName = `tts_${Date.now()}.mp3`
        const filePath = path.join(process.cwd(), 'public', 'tts', fileName)

        await fsp.mkdir(path.dirname(filePath), { recursive: true })
        await fsp.writeFile(filePath, buffer)

        return filePath
    }

    static async deleteFileSafe(filePath: string): Promise<void> {
        try {
            await fsp.unlink(filePath)
        } catch {}
    }
}
