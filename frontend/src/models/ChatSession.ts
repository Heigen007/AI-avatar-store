import { Avatar } from './Avatar'
import { ChatMessage } from './ChatMessage'
import { axios } from 'boot/axios'

export class ChatSession {
    id: string
    avatar: Avatar
    messages: ChatMessage[] = []

    constructor(id: string, avatar: Avatar) {
        this.id = id
        this.avatar = avatar
    }

    async addMessage(message: ChatMessage): Promise<void> {
        this.messages.push(
            new ChatMessage(message.sender, message.content, new Date(message.timestamp)),
        )
        const res = await axios.post(`/chat/${this.id}/message`, {
            sender: message.sender,
            text: message.content
        })

        const { avatarMessage } = res.data
        this.messages.push(
            new ChatMessage(avatarMessage.sender, avatarMessage.text, new Date(avatarMessage.timestamp))
        )
    }

    getLastMessage(): ChatMessage | null {
        return this.messages.length > 0
            ? this.messages[this.messages.length - 1]
            : null
    }

    static fromRaw(raw: any): ChatSession {
        const avatar = new Avatar(
            raw.avatar.id,
            raw.avatar.name,
            raw.avatar.role,
            raw.avatar.personality,
            raw.avatar.photoUrl
        )

        const session = new ChatSession(String(raw.id), avatar)
        session.messages = raw.messages.map((msg: any) =>
            new ChatMessage(msg.sender, msg.text, new Date(msg.timestamp))
        )
        return session
    }
}
