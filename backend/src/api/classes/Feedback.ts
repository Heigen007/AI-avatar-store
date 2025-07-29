import { DatabaseConnection } from 'src/db/DatabaseConnection'

export class Feedback {
    constructor(
        public id: number,
        public message: string,
        public createdAt: Date
    ) {}

    static async create(message: string): Promise<Feedback> {
        return await DatabaseConnection.runTransaction(async (session) => {
            const result = await session.dbExecuteInsert(
                `INSERT INTO Feedback (message) VALUES ($1) RETURNING id, message, created_at`,
                [message]
            )

            const row = result.sqlResultRows[0]
            return new Feedback(row.id, row.message, row.created_at)
        })
    }
}
