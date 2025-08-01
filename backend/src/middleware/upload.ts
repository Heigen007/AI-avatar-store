import multer from 'multer'
import path from 'path'
import fs from 'fs'

const imagePath = path.join(__dirname, '../../public/uploads')
const audioPath = path.join(__dirname, '../../public/voice')

if (!fs.existsSync(imagePath)) fs.mkdirSync(imagePath, { recursive: true })
if (!fs.existsSync(audioPath)) fs.mkdirSync(audioPath, { recursive: true })

const makeStorage = (folder: string, isAudio = false) =>
    multer.diskStorage({
        destination: (req, file, cb) => cb(null, folder),
        filename: (req, file, cb) => {
            let ext = path.extname(file.originalname).toLowerCase()
            if (isAudio && (!ext || ext === '.blob')) {
                if (file.mimetype.includes('webm')) ext = '.webm'
                else if (file.mimetype.includes('wav')) ext = '.wav'
                else if (file.mimetype.includes('mpeg') || file.mimetype.includes('mp3')) ext = '.mp3'
                else if (file.mimetype.includes('ogg')) ext = '.ogg'
                else ext = '.mp3'
            }
            const name = `${Date.now()}-${Math.random().toString(36).substring(2)}${ext}`
            cb(null, name)
        }
    })

export const uploadImage = multer({
    storage: makeStorage(imagePath),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        file.mimetype.startsWith('image/')
            ? cb(null, true)
            : cb(new Error('Only images allowed'))
    }
})

export const uploadVoice = multer({
    storage: makeStorage(audioPath, true),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        file.mimetype.startsWith('audio/')
            ? cb(null, true)
            : cb(new Error('Only audio allowed'))
    }
})
