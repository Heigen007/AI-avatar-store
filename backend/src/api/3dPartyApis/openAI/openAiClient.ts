import OpenAI from 'openai'

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export class OpenAIClient {
    static async generateResponse(messages: any[], imageUrl?: string): Promise<string> {
        const payload: any = {
            model: 'gpt-4o', // или 'o4-mini' / 'o3'
            messages: messages
        }
        if (imageUrl) {
            payload.images = [{ url: imageUrl }]
        }

        const response = await client.chat.completions.create(payload)
        return response.choices[0].message?.content ?? ''
    }

    static async generateSummary(messages: any[]): Promise<string> {
        const response = await client.chat.completions.create({
            model: 'gpt-4o',// or o3/o4-mini
            messages: messages
        })
        return response.choices[0].message?.content ?? ''
    }
}