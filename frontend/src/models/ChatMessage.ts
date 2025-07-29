import { currentURL } from "src/boot/axios"

export type Sender = 'user' | 'avatar'

export class ChatMessage {
    sender: Sender
    content: string
    timestamp: Date
    _imageUrl?: string

    constructor(sender: Sender, content: string, timestamp: Date, imageUrl?: string) {
        this.sender = sender
        this.content = content
        this.timestamp = timestamp
        this._imageUrl = imageUrl
    }

    get imageUrl(): string | undefined {
        if (!this._imageUrl) return undefined
        if(this._imageUrl.startsWith('blob')) return this._imageUrl
        return currentURL + this._imageUrl
    }
}