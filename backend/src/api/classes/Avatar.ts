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
        public description: string
    ) {}

    static async create(
        name: string,
        role: 'friend' | 'lover' | 'mentor',
        gender: 'male' | 'female',
        personality: string,
        photoUrl: string,
        description: string,
        userProfileId: number
    ): Promise<ChatSession> {
        return await DatabaseConnection.runTransaction(async (session) => {
            const result = await session.dbExecuteInsert(
                `INSERT INTO Avatar (name, role, personality, photourl, gender, description)
                 VALUES ($1, $2, $3, $4, $5, $6)
                 RETURNING id, name, role, personality, photourl, gender, description`,
                [name, role, personality, photoUrl, gender, description]
            );
            
            const row = result.sqlResultRows[0];
            const chatSession = await ChatSession.create(row.id, userProfileId, session, new Avatar(
                row.id, row.name, row.role, row.personality, row.photourl, row.gender, row.description
            ));
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
    }): Promise<void> {
        await DatabaseConnection.runTransaction(async (session) => {
            await session.dbExecuteUpdate(
                `UPDATE Avatar
                SET name = $1,
                    role = $2,
                    gender = $3,
                    personality = $4,
                    photourl = $5,
                    description = $6
                WHERE id = $7`,
                [
                    data.name,
                    data.role,
                    data.gender,
                    data.personality,
                    data.photoUrl,
                    data.description,
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
            )
        })
    }
}