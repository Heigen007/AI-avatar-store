import * as winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

// Формат сообщений лога
const logFormat = winston.format.combine(
    winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss.SSS'}),
    winston.format.printf(info => {
        return `${info.timestamp} [${info.level}]: ${info.message}`
    })
)

// Создание экземпляра логгера
export const logger = winston.createLogger({
    // Уровень логирования { error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6 }
    level: 'debug',
    format: logFormat,
    // Определение транспортов
    transports: [
        // Консоль
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                logFormat
            )
        }),
        // Ротация файлов логов каждый день
        new DailyRotateFile({
            filename: 'application-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: false,
            maxSize: '128k', // Размер файла, при достижении которого его имя меняет индексный суффикс
            maxFiles: '14d',
            dirname: 'logs'
        })
    ]
})