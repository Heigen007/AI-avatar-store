import { DatabaseConnection } from 'src/db/DatabaseConnection';

export class ChatMessage {
    constructor(
        public id: number,
        public sender: 'user' | 'avatar',
        public chatSessionId: number,
        public text: string,
        public timestamp: string
    ) {}

    static async getAllByChatId(chatId: number): Promise<ChatMessage[]> {
        return await DatabaseConnection.runTransaction(async (session) => {
            const result = await session.dbExecuteSelect(
                `SELECT id, sender, chat_session_id, text, timestamp
                 FROM ChatMessage
                 WHERE chat_session_id = $1
                 ORDER BY timestamp ASC`,
                [chatId]
            );
            return result.sqlResultRows.map(row =>
                new ChatMessage(row.id, row.sender, row.chat_session_id, row.text, row.timestamp)
            );
        });
    }

    static async send(chatId: number, sender: 'user' | 'avatar', text: string): Promise<ChatMessage> {
        return await DatabaseConnection.runTransaction(async (session) => {
            const result = await session.dbExecuteInsert(
                `INSERT INTO ChatMessage (sender, chat_session_id, text, timestamp)
                 VALUES ($1, $2, $3, NOW())
                 RETURNING id, sender, chat_session_id, text, timestamp`,
                [sender, chatId, text]
            );
            const row = result.sqlResultRows[0];
            return new ChatMessage(row.id, row.sender, row.chat_session_id, row.text, row.timestamp);
        });
    }
}
