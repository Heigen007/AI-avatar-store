// classes/Avatar.ts
import { DatabaseConnection } from 'src/db/DatabaseConnection';
import { ChatSession } from './ChatSession';

export class Avatar {
    constructor(
        public id: number,
        public name: string,
        public role: 'friend' | 'lover' | 'mentor',
        public personality: string,
        public photoUrl: string,
        public gender: 'male' | 'female',
        public description: string,
        public voice: string
    ) {}

    static async create(
        name: string,
        role: 'friend' | 'lover' | 'mentor',
        gender: 'male' | 'female',
        personality: string,
        photoUrl: string,
        description: string,
        voice: string,
        userProfileId: number
    ): Promise<ChatSession> {
        return await DatabaseConnection.runTransaction(async (session) => {
            const result = await session.dbExecuteInsert(
                `INSERT INTO Avatar (name, role, personality, photourl, gender, description, voice)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)
                 RETURNING id, name, role, personality, photourl, gender, description, voice`,
                [name, role, personality, photoUrl, gender, description, voice]
            );

            const row = result.sqlResultRows[0];
            const avatar = new Avatar(
                row.id,
                row.name,
                row.role,
                row.personality,
                row.photourl,
                row.gender,
                row.description,
                row.voice
            );

            const chatSession = await ChatSession.create(row.id, userProfileId, session, avatar);
            return chatSession;
        });
    }

    static async updateById(id: number, data: {
        name: string;
        role: 'friend' | 'lover' | 'mentor';
        gender: 'male' | 'female';
        personality: string;
        photoUrl: string;
        description: string;
        voice: string;
    }): Promise<void> {
        await DatabaseConnection.runTransaction(async (session) => {
            await session.dbExecuteUpdate(
                `UPDATE Avatar
                 SET name = $1,
                     role = $2,
                     gender = $3,
                     personality = $4,
                     photourl = $5,
                     description = $6,
                     voice = $7
                 WHERE id = $8`,
                [
                    data.name,
                    data.role,
                    data.gender,
                    data.personality,
                    data.photoUrl,
                    data.description,
                    data.voice,
                    id
                ]
            );
        });
    }

    static async deleteById(id: number): Promise<void> {
        await DatabaseConnection.runTransaction(async (session) => {
            await session.dbExecuteDelete(
                `DELETE FROM Avatar WHERE id = $1`,
                [id]
            );
        });
    }
}
