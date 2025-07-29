import { DatabaseConnection } from 'src/db/DatabaseConnection';
import { Avatar } from './Avatar';
import { ChatMessage } from './ChatMessage';

export class ChatSession {
    constructor(
        public id: number,
        public avatar: Avatar,
        public userProfileId: number,
        public messages: ChatMessage[] = [],
        public summary: string = ''
    ) {}

    static async getAllByUserId(userId: number): Promise<ChatSession[]> {
        return await DatabaseConnection.runTransaction(async (session) => {
            const result = await session.dbExecuteSelect(
                `SELECT
                    cs.id AS session_id,
                    cs.avatar_id,
                    cs.user_profile_id,
                    cs.summary,
                    a.id AS avatar_id,
                    a.name AS avatar_name,
                    a.role AS avatar_role,
                    a.gender AS avatar_gender,
                    a.personality AS avatar_personality,
                    a.photourl AS avatar_photourl,
                    a.description AS avatar_description
                FROM ChatSession cs
                JOIN Avatar a ON cs.avatar_id = a.id
                WHERE cs.user_profile_id = $1`,
                [userId]
            )

            const sessions: ChatSession[] = []

            for (const row of result.sqlResultRows) {
                const avatar = new Avatar(
                    row.avatar_id,
                    row.avatar_name,
                    row.avatar_role,
                    row.avatar_personality,
                    row.avatar_photourl,
                    row.avatar_gender,
                    row.avatar_description
                )

                const chatSession = new ChatSession(row.session_id, avatar, userId, [], row.summary)

                const msgRes = await session.dbExecuteSelect(
                    `SELECT id, sender, text, timestamp, image_url
                     FROM ChatMessage
                     WHERE chat_session_id = $1
                     ORDER BY timestamp ASC`,
                    [chatSession.id]
                )

                chatSession.messages = msgRes.sqlResultRows.map((m: any) => {
                    return new ChatMessage(m.id, m.sender, chatSession.id, m.text, m.timestamp, m.image_url)
                })

                sessions.push(chatSession)
            }

            return sessions
        })
    }

    static async getById(chatId: number): Promise<ChatSession | null> {
        return await DatabaseConnection.runTransaction(async (session) => {
            const result = await session.dbExecuteSelect(
                `SELECT
                    cs.id AS session_id,
                    cs.avatar_id,
                    cs.user_profile_id,
                    cs.summary,
                    a.id AS avatar_id,
                    a.name AS avatar_name,
                    a.role AS avatar_role,
                    a.gender AS avatar_gender,
                    a.personality AS avatar_personality,
                    a.photourl AS avatar_photourl,
                    a.description AS avatar_description
                FROM ChatSession cs
                JOIN Avatar a ON cs.avatar_id = a.id
                WHERE cs.id = $1`,
                [chatId]
            )

            const row = result.sqlResultRows[0]
            if (!row) return null

            const avatar = new Avatar(
                row.avatar_id,
                row.avatar_name,
                row.avatar_role,
                row.avatar_personality,
                row.avatar_photourl,
                row.avatar_gender,
                row.avatar_description
            )

            const messagesRes = await session.dbExecuteSelect(
                `SELECT id, sender, text, timestamp, image_url
                 FROM ChatMessage
                 WHERE chat_session_id = $1
                 ORDER BY timestamp ASC`,
                [chatId]
            )

            const messages = messagesRes.sqlResultRows.map((m: any) =>
                new ChatMessage(m.id, m.sender, chatId, m.text, m.timestamp, m.image_url)
            )

            return new ChatSession(row.session_id, avatar, row.user_profile_id, messages, row.summary)
        })
    }

    static async delete(id: number): Promise<void> {
        await DatabaseConnection.runTransaction(async (session) => {
            await session.dbExecuteDelete(
                `DELETE FROM ChatSession WHERE id = $1`,
                [id]
            );
        });
    }

   static async create(avatarId: number, userProfileId: number, session: DatabaseConnection, avatar: Avatar): Promise<ChatSession> {
        const result = await session.dbExecuteInsert(
            `INSERT INTO ChatSession (avatar_id, user_profile_id, summary)
             VALUES ($1, $2, '')
             RETURNING id, avatar_id, user_profile_id, summary`,
            [avatarId, userProfileId]
        );
        const row = result.sqlResultRows[0];
        return new ChatSession(row.id, avatar, userProfileId, [], row.summary);
    }

    static async updateSummary(chatSessionId: number, summary: string): Promise<void> {
        await DatabaseConnection.runTransaction(async (session) => {
            await session.dbExecuteUpdate(
                `UPDATE ChatSession SET summary = $1 WHERE id = $2`,
                [summary, chatSessionId]
            );
        });
    }
}