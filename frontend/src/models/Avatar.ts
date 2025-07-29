export type AvatarRole = 'friend' | 'lover' | 'mentor'
import { axios } from 'boot/axios'
import { ChatSession } from './ChatSession'
import { UserProfile } from './UserProfile'

export class Avatar {
    id: string
    name: string
    role: AvatarRole
    personality: string
    photoUrl: string
    gender: 'male' | 'female'
    description: string

    constructor(
        id: string,
        name: string,
        role: AvatarRole,
        personality: string,
        photoUrl: string,
        gender: 'male' | 'female',
        description: string
    ) {
        this.id = id
        this.name = name
        this.role = role
        this.personality = personality
        this.photoUrl = photoUrl
        this.gender = gender
        this.description = description
    }

    static async createNewAvatar(
        name: string,
        role: AvatarRole,
        gender: 'male' | 'female',
        personality: string,
        photoUrl: string,
        description: string
    ): Promise<ChatSession> {
        const res = await axios.post('/avatar', {
            name,
            role,
            gender,
            personality,
            photoUrl,
            description,
            userId: UserProfile.currentUser?.id || 0
        })

        const sessionId = res.data.sessionId
        const avatarId = res.data.avatarId

        const avatar = new Avatar(avatarId, name, role, personality, photoUrl, gender, description)

        const session = new ChatSession(sessionId, avatar)
        UserProfile.currentUser!.addChatSession(session)
        return session
    }

    static async updateAvatar(
        avatar: Avatar,
        name: string,
        role: AvatarRole,
        gender: 'male' | 'female',
        personality: string,
        photoUrl: string,
        description: string
    ): Promise<void> {
        await axios.put(`/avatar/${avatar.id}`, {
            name,
            role,
            gender,
            personality,
            photoUrl,
            description
        })
        avatar.updateDetails(name, role, gender, personality, photoUrl, description)
    }

    static async deleteAvatarById(avatarId: string): Promise<void> {
        await axios.delete(`/avatar/${avatarId}`)
        UserProfile.currentUser?.removeAvatar(avatarId)
    }

    updateDetails(name: string, role: AvatarRole, gender: 'male' | 'female', personality: string, photoUrl: string, description: string) {
        this.name = name
        this.role = role
        this.gender = gender
        this.personality = personality
        this.photoUrl = photoUrl
        this.description = description
    }
}
