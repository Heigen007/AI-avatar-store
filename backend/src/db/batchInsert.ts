import { DatabaseConnection } from "./DatabaseConnection";

export async function batchInsert(
    session: DatabaseConnection,
    queryBase: string, // Базовая часть запроса INSERT (без VALUES)
    allValues: any[], // Все значения для вставки
    columnsCount: number, // Количество столбцов в таблице
    batchSize: number = 1000 // Размер батча (количество строк за раз)
): Promise<void> {
    for (let i = 0; i < allValues.length; i += batchSize * columnsCount) {
        const batchValues = allValues.slice(i, i + batchSize * columnsCount);
        const placeholders: string[] = [];
        let paramIndex = 1;

        // Генерируем placeholders для каждой строки
        for (let j = 0; j < batchValues.length; j += columnsCount) {
            const rowPlaceholders = Array.from(
                { length: columnsCount },
                () => `$${paramIndex++}`
            ).join(', ');
            placeholders.push(`(${rowPlaceholders})`);
        }

        const finalQuery = `${queryBase} ${placeholders.join(', ')}`;
        await session.dbExecuteInsert(finalQuery, batchValues);
    }
}