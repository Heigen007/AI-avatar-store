export type AvatarRole = 'friend' | 'lover' | 'mentor'
import { axios } from 'boot/axios'
import { ChatSession } from './ChatSession'
import { UserProfile } from './UserProfile'

export class Avatar {
    static currentAvatar: Avatar | null = null

    id: string
    name: string
    role: AvatarRole
    personality: string
    photoUrl: string

    constructor(
        id: string,
        name: string,
        role: AvatarRole,
        personality: string,
        photoUrl: string
    ) {
        this.id = id
        this.name = name
        this.role = role
        this.personality = personality
        this.photoUrl = photoUrl
    }

    static async createNewAvatar(
        name: string,
        role: AvatarRole,
        personality: string,
        photoUrl: string
    ): Promise<ChatSession> {
        const res = await axios.post('/avatar', {
            name,
            role,
            personality,
            photoUrl,
            userId: UserProfile.currentUser?.id || 0
        })

        const sessionId = res.data.sessionId
        const avatarId = res.data.avatarId

        const avatar = new Avatar(avatarId, name, role, personality, photoUrl)
        this.currentAvatar = avatar

        const session = new ChatSession(sessionId, avatar)
        UserProfile.currentUser!.addChatSession(session)
        return session
    }

    static async deleteAvatarById(avatarId: string): Promise<void> {
        await axios.delete(`/avatar/${avatarId}`)
        UserProfile.currentUser?.removeAvatar(avatarId)
    }
}
