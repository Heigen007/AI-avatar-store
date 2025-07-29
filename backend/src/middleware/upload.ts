import multer from 'multer'
import path from 'path'
import fs from 'fs'

const uploadPath = path.join(__dirname, '../../public/uploads')

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true })
}

export const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, uploadPath),
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname)
            const name = `${Date.now()}-${Math.random().toString(36).substring(2)}${ext}`
            cb(null, name)
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // до 5MB
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            cb(new Error('Only images allowed'))
        } else {
            cb(null, true)
        }
    }
})
