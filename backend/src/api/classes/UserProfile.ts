import { DatabaseConnection } from 'src/db/DatabaseConnection';

export class UserProfile {
    constructor(
        public id: number,
        public name: string,
        public age: number,
        public bio: string,
        public createdAt: string
    ) {}

    static async getById(id: number): Promise<UserProfile | null> {
        return await DatabaseConnection.runTransaction(async (session) => {
            const result = await session.dbExecuteSelect(
                `SELECT id, name, age, bio, createdate FROM UserProfile WHERE id = $1`,
                [id]
            )
            if (result.sqlResultRowCount === 0) return null

            const row = result.sqlResultRows[0]
            return new UserProfile(row.id, row.name, row.age, row.bio, row.createdate)
        })
    }

    static async create(name: string, age: number, bio: string): Promise<UserProfile> {
        return await DatabaseConnection.runTransaction(async (session) => {
            const result = await session.dbExecuteInsert(
                `INSERT INTO UserProfile (name, age, bio, createdate)
                 VALUES ($1, $2, $3, NOW())
                 RETURNING id, name, age, bio, createdate`,
                [name, age, bio]
            );
            const row = result.sqlResultRows[0];
            return new UserProfile(row.id, row.name, row.age, row.bio, row.createdate);
        });
    }

    static async update(id: number, name: string, age: number, bio: string): Promise<UserProfile> {
        return await DatabaseConnection.runTransaction(async (session) => {
            await session.dbExecuteUpdate(
                `UPDATE UserProfile SET name = $1, age = $2, bio = $3 WHERE id = $4`,
                [name, age, bio, id]
            );
            const select = await session.dbExecuteSelect(
                `SELECT id, name, age, bio, createdate FROM UserProfile WHERE id = $1`,
                [id]
            );
            const row = select.sqlResultRows[0];
            return new UserProfile(row.id, row.name, row.age, row.bio, row.createdate);
        });
    }
}
