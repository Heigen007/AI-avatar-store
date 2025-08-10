// src/api/services/StatsService.ts
import { DatabaseConnection } from 'src/db/DatabaseConnection';

export type DateRange = {
    from: string; // ISO date string (YYYY-MM-DD 00:00:00)
    to: string;   // ISO date string (YYYY-MM-DD 00:00:00), exclusive
};

export class StatsService {
    static makeRange(days: number): DateRange {
        // from = today - (days - 1), to = tomorrow (exclusive), по дневным срезам
        const now = new Date();
        const to = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0));
        const from = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - (days - 1), 0, 0, 0));
        const pad = (n: number) => String(n).padStart(2, '0');
        const toISO = `${to.getUTCFullYear()}-${pad(to.getUTCMonth() + 1)}-${pad(to.getUTCDate())} 00:00:00+00`;
        const fromISO = `${from.getUTCFullYear()}-${pad(from.getUTCMonth() + 1)}-${pad(from.getUTCDate())} 00:00:00+00`;
        return { from: fromISO, to: toISO };
    }

    static async getOverview(range: DateRange) {
        return await DatabaseConnection.runTransaction(async (session) => {
            const usersTotal = await session.dbExecuteSelect(
                `SELECT COUNT(*) AS c FROM UserProfile`
            );

            const users7 = await session.dbExecuteSelect(
                `SELECT COUNT(*) AS c
                 FROM UserProfile
                 WHERE createdate >= $1 AND createdate < $2`,
                [range.from, range.to]
            );

            const msgs7 = await session.dbExecuteSelect(
                `SELECT
                    SUM(CASE WHEN sender='user' THEN 1 ELSE 0 END) AS total,
                    SUM(CASE WHEN sender='user' and is_voice THEN 1 ELSE 0 END) AS voice
                 FROM ChatMessage
                 WHERE timestamp >= $1 AND timestamp < $2`,
                [range.from, range.to]
            );

            const activeChats7 = await session.dbExecuteSelect(
                `SELECT COUNT(DISTINCT chat_session_id) AS c
                 FROM ChatMessage
                 WHERE timestamp >= $1 AND timestamp < $2`,
                [range.from, range.to]
            );

            const withImages7 = await session.dbExecuteSelect(
                `SELECT COUNT(*) AS c
                 FROM ChatMessage
                 WHERE timestamp >= $1 AND timestamp < $2
                   AND image_url IS NOT NULL`,
                [range.from, range.to]
            );

            return {
                usersTotal: Number(usersTotal.sqlResultRows[0]?.c || 0),
                usersPeriod: Number(users7.sqlResultRows[0]?.c || 0),
                messagesTotalPeriod: Number(msgs7.sqlResultRows[0]?.total || 0),
                voiceMessagesPeriod: Number(msgs7.sqlResultRows[0]?.voice || 0),
                activeChatsPeriod: Number(activeChats7.sqlResultRows[0]?.c || 0),
                imagesPeriod: Number(withImages7.sqlResultRows[0]?.c || 0)
            };
        });
    }

    static async getSeries(range: DateRange) {
        return await DatabaseConnection.runTransaction(async (session) => {
            // Генерим список дней и сразу приводим к 'YYYY-MM-DD'
            const daysRes = await session.dbExecuteSelect(
                `WITH dd AS (
                    SELECT generate_series(
                        date_trunc('day', $1::timestamptz),
                        date_trunc('day', $2::timestamptz) - interval '1 day',
                        interval '1 day'
                    ) AS d
                )
                SELECT to_char(d::date, 'YYYY-MM-DD') AS d
                FROM dd
                ORDER BY d`,
                [range.from, range.to]
            );

            const byUsers = await session.dbExecuteSelect(
                `SELECT to_char(createdate::date, 'YYYY-MM-DD') AS d, COUNT(*) AS c
                FROM UserProfile
                WHERE createdate >= $1 AND createdate < $2
                GROUP BY d
                ORDER BY d`,
                [range.from, range.to]
            );

            const byImages = await session.dbExecuteSelect(
                `SELECT to_char(timestamp::date, 'YYYY-MM-DD') AS d, COUNT(*) AS with_images
                FROM ChatMessage
                WHERE timestamp >= $1 AND timestamp < $2
                AND image_url IS NOT NULL
                GROUP BY d
                ORDER BY d`,
                [range.from, range.to]
            );

            const dau = await session.dbExecuteSelect(
                `SELECT to_char(cm.timestamp::date, 'YYYY-MM-DD') AS d,
                        COUNT(DISTINCT cs.user_profile_id) AS dau
                FROM ChatMessage cm
                JOIN ChatSession cs ON cs.id = cm.chat_session_id
                WHERE cm.timestamp >= $1 AND cm.timestamp < $2
                AND cm.sender = 'user'
                GROUP BY d
                ORDER BY d`,
                [range.from, range.to]
            );

            const dayList: string[] = daysRes.sqlResultRows.map((r: any) => r.d);

            const mapUsers: Record<string, number> = {};
            const mapDAU: Record<string, number> = {};

            byUsers.sqlResultRows.forEach((r: any) => { mapUsers[r.d] = Number(r.c); });
            dau.sqlResultRows.forEach((r: any) => { mapDAU[r.d] = Number(r.dau); });

            return {
                days: dayList, // уже 'YYYY-MM-DD'
                usersByDay: dayList.map(d => mapUsers[d] || 0),
                dauByDay: dayList.map(d => mapDAU[d] || 0)
            };
        });
    }

    static async getAvatarBreakdown() {
        return await DatabaseConnection.runTransaction(async (session) => {
            const byRole = await session.dbExecuteSelect(
                `SELECT role, COUNT(*) AS c FROM Avatar GROUP BY role`
            );
            const byGender = await session.dbExecuteSelect(
                `SELECT gender, COUNT(*) AS c FROM Avatar GROUP BY gender`
            );
            const byVoice = await session.dbExecuteSelect(
                `SELECT voice, COUNT(*) AS c
                 FROM Avatar
                 GROUP BY voice
                 ORDER BY COUNT(*) DESC
                 LIMIT 5`
            );

            return {
                role: byRole.sqlResultRows,
                gender: byGender.sqlResultRows,
                voiceTop: byVoice.sqlResultRows
            };
        });
    }

    static async getTopChats(range: DateRange) {
        return await DatabaseConnection.runTransaction(async (session) => {
            const res = await session.dbExecuteSelect(
                `SELECT cs.id AS chat_id, COUNT(*) AS msg_cnt
                 FROM ChatMessage cm
                 JOIN ChatSession cs ON cs.id = cm.chat_session_id
                 WHERE cm.timestamp >= $1 AND cm.timestamp < $2
                 GROUP BY cs.id
                 ORDER BY msg_cnt DESC
                 LIMIT 10`,
                [range.from, range.to]
            );
            return res.sqlResultRows;
        });
    }

    static async getTopUsers(range: DateRange) {
        return await DatabaseConnection.runTransaction(async (session) => {
            const res = await session.dbExecuteSelect(
                `SELECT cs.user_profile_id, COUNT(*) AS msg_cnt
                 FROM ChatMessage cm
                 JOIN ChatSession cs ON cs.id = cm.chat_session_id
                 WHERE cm.timestamp >= $1 AND cm.timestamp < $2
                   AND cm.sender = 'user'
                 GROUP BY cs.user_profile_id
                 ORDER BY msg_cnt DESC
                 LIMIT 10`,
                [range.from, range.to]
            );
            return res.sqlResultRows;
        });
    }

    static async getFeedback(range: DateRange) {
        return await DatabaseConnection.runTransaction(async (session) => {
            const counts = await session.dbExecuteSelect(
                `SELECT
                    COUNT(*) FILTER (WHERE created_at >= $1 AND created_at < $2) AS period_cnt,
                    COUNT(*) AS total_cnt
                 FROM Feedback`,
                [range.from, range.to]
            );

            const latest = await session.dbExecuteSelect(
                `SELECT id, message, created_at
                 FROM Feedback
                 ORDER BY created_at DESC
                 LIMIT 20`
            );

            return {
                total: Number(counts.sqlResultRows[0]?.total_cnt || 0),
                period: Number(counts.sqlResultRows[0]?.period_cnt || 0),
                latest: latest.sqlResultRows
            };
        });
    }

    static async getFunnel(range: DateRange) {
        // Без created_at в Avatar/ChatSession делаем «проксиворонку» по пользователям,
        // зарегистрированным в период: зарегистрировался → имеет чат → писал сообщение.
        return await DatabaseConnection.runTransaction(async (session) => {
            const users = await session.dbExecuteSelect(
                `SELECT COUNT(*) AS c
                 FROM UserProfile
                 WHERE createdate >= $1 AND createdate < $2`,
                [range.from, range.to]
            );

            const withChat = await session.dbExecuteSelect(
                `SELECT COUNT(DISTINCT up.id) AS c
                 FROM UserProfile up
                 JOIN ChatSession cs ON cs.user_profile_id = up.id
                 WHERE up.createdate >= $1 AND up.createdate < $2`,
                [range.from, range.to]
            );

            const withMsg = await session.dbExecuteSelect(
                `SELECT COUNT(DISTINCT up.id) AS c
                 FROM UserProfile up
                 JOIN ChatSession cs ON cs.user_profile_id = up.id
                 JOIN ChatMessage cm ON cm.chat_session_id = cs.id
                 WHERE up.createdate >= $1 AND up.createdate < $2
                   AND cm.sender = 'user'`,
                [range.from, range.to]
            );

            const u = Number(users.sqlResultRows[0]?.c || 0);
            const a = Number(withChat.sqlResultRows[0]?.c || 0);
            const m = Number(withMsg.sqlResultRows[0]?.c || 0);

            return {
                users: u,
                usersWithChat: a,
                usersWithMsg: m,
                conv1: u ? Math.round((a / u) * 100) : 0,
                conv2: a ? Math.round((m / a) * 100) : 0
            };
        });
    }
}
