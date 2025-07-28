export type Sender = 'user' | 'avatar'

export class ChatMessage {
    sender: Sender
    content: string
    timestamp: Date

    constructor(sender: Sender, content: string, timestamp: Date) {
        this.sender = sender
        this.content = content
        this.timestamp = timestamp
    }
}
