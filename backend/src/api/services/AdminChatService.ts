// src/api/services/AdminChatService.ts
import { DatabaseConnection } from 'src/db/DatabaseConnection';

export type AdminChatRow = {
    chat_id: number;
    user_profile_id: number;
    avatar_name: string;
    msg_cnt: number;
    last_msg_at: string | null; // ISO
};

export class AdminChatService {
    // Базовый список с агрегатами (без пагинации — сортируем/фильтруем на фронте)
    static async listAll(): Promise<AdminChatRow[]> {
        return await DatabaseConnection.runTransaction(async (session) => {
            const res = await session.dbExecuteSelect(
                `SELECT
                    cs.id AS chat_id,
                    cs.user_profile_id,
                    a.name AS avatar_name,
                    COUNT(cm.id) AS msg_cnt,
                    MAX(cm.timestamp) AS last_msg_at
                 FROM ChatSession cs
                 JOIN Avatar a ON a.id = cs.avatar_id
                 LEFT JOIN ChatMessage cm ON cm.chat_session_id = cs.id
                 GROUP BY cs.id, cs.user_profile_id, a.name
                 ORDER BY cs.id ASC`
            );

            return res.sqlResultRows.map((r: any) => ({
                chat_id: Number(r.chat_id),
                user_profile_id: Number(r.user_profile_id),
                avatar_name: r.avatar_name,
                msg_cnt: Number(r.msg_cnt),
                last_msg_at: r.last_msg_at ? new Date(r.last_msg_at).toISOString() : null
            }));
        });
    }
}
