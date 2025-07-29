import { Preferences } from '@capacitor/preferences'
import { axios } from 'boot/axios'
import { ChatSession } from './ChatSession'
import { Ref, ref } from 'vue'
import { Avatar } from './Avatar'

export class UserProfile {
    static currentUser: UserProfile | null = null

    id: number
    name: string
    age: number | null
    bio: string
    createdAt: Date
    chatSessions: Ref<ChatSession[]> = ref([])

    constructor(id: number, name: string, age: number | null, bio: string, createdAt: string) {
        this.id = id
        this.name = name
        this.age = age
        this.bio = bio
        this.createdAt = new Date(createdAt)
    }

    addChatSession(session: ChatSession) {
        this.chatSessions.value.push(session)
    }

    getSessionBySessionId(sessionId: string): ChatSession | undefined {
        return this.chatSessions.value.find(s => s.id == sessionId)
    }

    getSessionByAvatarId(avatarId: string): ChatSession | undefined {
        return this.chatSessions.value.find(s => s.avatar.id == avatarId)
    }

    getAvatarById(avatarId: string): Avatar | undefined {
        return this.chatSessions.value.find(session => session.avatar.id == avatarId)?.avatar
    }

    removeAvatar(avatarId: string): void {
        this.chatSessions.value = this.chatSessions.value.filter(session => session.avatar.id != avatarId)
    }

    get allSessions(): ChatSession[] {
        return this.chatSessions.value
    }

    static async setCurrentUser(name: string, age: number, bio: string): Promise<UserProfile> {
        const response = await axios.post('/user', { name, age, bio })
        const user: UserProfile = new UserProfile(
            response.data.id,
            response.data.name,
            response.data.age,
            response.data.bio,
            response.data.createdAt
        )

        await Preferences.set({ key: 'userId', value: String(user.id) })
        UserProfile.currentUser = user
        return user
    }

    static async loadFromStorage(): Promise<UserProfile | null> {
        const { value } = await Preferences.get({ key: 'userId' })
        if (!value) return null

        try {
            const userId = parseInt(value)
            const profileRes = await axios.get(`/user/${userId}`)
            const user = new UserProfile(
                profileRes.data.id,
                profileRes.data.name,
                profileRes.data.age,
                profileRes.data.bio,
                profileRes.data.createdAt
            )

            const chatsRes = await axios.get(`/chats/${userId}`)
            user.chatSessions.value = chatsRes.data.map((s: any) => ChatSession.fromRaw(s))
            UserProfile.currentUser = user
            return user
        } catch (err) {
            console.error('loadFromStorage error:', err)
            return null
        }
    }

    async updateInformation(): Promise<void> {
        await axios.put(`/user/${this.id}`, {
            name: this.name,
            age: this.age,
            bio: this.bio
        })
    }
}
