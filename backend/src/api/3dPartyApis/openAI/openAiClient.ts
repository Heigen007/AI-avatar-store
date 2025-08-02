import OpenAI from 'openai'
import fs from 'fs'
import fsp from 'fs/promises'
import path from 'path'
import { exec } from 'child_process'
import util from 'util'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg'

ffmpeg.setFfmpegPath(ffmpegInstaller.path)

const execPromise = util.promisify(exec)
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

    /**
     * Универсальная транскрипция: принимает любой аудиофайл и конвертирует его в wav
     */
    static async transcribe(filePath: string): Promise<string> {
        const dir = path.dirname(filePath)
        const baseName = path.basename(filePath, path.extname(filePath))
        const wavPath = path.join(dir, `${baseName}.wav`)

        await new Promise<void>((resolve, reject) => {
            ffmpeg(filePath)
                .audioChannels(1)
                .audioFrequency(16000)
                .toFormat('wav')
                .on('end', () => resolve())
                .on('error', reject)
                .save(wavPath)
        })

        const response = await client.audio.transcriptions.create({
            file: fs.createReadStream(wavPath),
            model: 'whisper-1'
        })

        // Чистим временные файлы
        OpenAIClient.deleteFileSafe(wavPath)
        OpenAIClient.deleteFileSafe(filePath)

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
