// Файл нужен для того, чтобы в зависимости от условий возвращать нужный экземпляр базы данных (нужный пул соединений)
// require('dotenv').config();

import { postgresDB } from './postgre/postgresDB'

import { IDbInterface } from './dbInterfaces'

export function getDatabase(): IDbInterface {
    return postgresDB
}
