import { DatabaseConnection } from 'src/db/DatabaseConnection';

export class ChatMessage {
    constructor(
        public id: number,
        public sender: 'user' | 'avatar',
        public chatSessionId: number,
        public text: string,
        public timestamp: string,
        public imageUrl?: string
    ) {}

    static async getAllByChatId(chatId: number): Promise<ChatMessage[]> {
        return await DatabaseConnection.runTransaction(async (session) => {
            const result = await session.dbExecuteSelect(
                `SELECT id, sender, chat_session_id, text, timestamp, image_url
                 FROM ChatMessage
                 WHERE chat_session_id = $1
                 ORDER BY timestamp ASC`,
                [chatId]
            );
            return result.sqlResultRows.map(row =>
                new ChatMessage(row.id, row.sender, row.chat_session_id, row.text, row.timestamp, row.image_url)
            );
        });
    }

   static async send(
        chatId: number,
        sender: 'user' | 'avatar',
        text: string,
        imageUrl?: string
    ): Promise<ChatMessage> {
        return await DatabaseConnection.runTransaction(async (session) => {
            const result = await session.dbExecuteInsert(
                `INSERT INTO ChatMessage (sender, chat_session_id, text, image_url, timestamp)
                 VALUES ($1, $2, $3, $4, NOW())
                 RETURNING id, sender, chat_session_id, text, image_url, timestamp`,
                [sender, chatId, text, imageUrl || null]
            )

            const row = result.sqlResultRows[0]
            return new ChatMessage(
                row.id,
                row.sender,
                row.chat_session_id,
                row.text,
                row.timestamp,
                row.image_url
            )
        })
    }
}