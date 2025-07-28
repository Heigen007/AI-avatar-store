import { DatabaseConnection } from 'src/db/DatabaseConnection';
import { ChatSession } from './ChatSession';

export class Avatar {
    constructor(
        public id: number,
        public name: string,
        public role: 'friend' | 'lover' | 'mentor',
        public personality: string,
        public photoUrl: string
    ) {}

    static async create(
        name: string,
        role: 'friend' | 'lover' | 'mentor',
        personality: string,
        photoUrl: string,
        userProfileId: number
    ): Promise<ChatSession> {
        return await DatabaseConnection.runTransaction(async (session) => {
            const result = await session.dbExecuteInsert(
                `INSERT INTO Avatar (name, role, personality, photourl)
                 VALUES ($1, $2, $3, $4)
                 RETURNING id, name, role, personality, photourl`,
                [name, role, personality, photoUrl]
            );
            
            const row = result.sqlResultRows[0];
            const chatSession = await ChatSession.create(row.id, userProfileId, session, new Avatar(
                row.id, row.name, row.role, row.personality, row.photourl
            ));
            return chatSession;
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