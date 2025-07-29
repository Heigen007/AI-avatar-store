import * as winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    winston.format.printf(info => `${info.timestamp} [${info.level}]: ${info.message}`)
)

export const logger = winston.createLogger({
    level: 'debug',
    format: logFormat,
    transports: [
        // Консоль
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                logFormat
            )
        }),

        // Все логи
        new DailyRotateFile({
            filename: 'application-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: false,
            maxSize: '128k',
            maxFiles: '14d',
            dirname: 'logs'
        }),

        // Только ошибки
        new DailyRotateFile({
            level: 'error',
            filename: 'error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: false,
            maxSize: '128k',
            maxFiles: '30d',
            dirname: 'logs/errors'
        })
    ]
})
