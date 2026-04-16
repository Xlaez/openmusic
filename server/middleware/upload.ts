import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '../../')

// Ensure upload directories exist
const coversDir = path.join(rootDir, 'uploads/covers')
const tracksDir = path.join(rootDir, 'uploads/tracks')

fs.mkdirSync(coversDir, { recursive: true })
fs.mkdirSync(tracksDir, { recursive: true })

const coverStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, coversDir)
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname)
    const name = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`
    cb(null, name)
  },
})

const trackStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, tracksDir)
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname)
    const name = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`
    cb(null, name)
  },
})

export const uploadCover = multer({
  storage: coverStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid image file type'))
    }
  },
})

export const uploadTracks = multer({
  storage: trackStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (_req, file, cb) => {
    const allowedMimes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/ogg', 'audio/flac']
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid audio file type'))
    }
  },
})

// Combined upload for project creation (cover + tracks)
export const uploadProjectFiles = multer({
  storage: multer.diskStorage({
    destination: (_req, file, cb) => {
      if (file.fieldname === 'coverImage') {
        cb(null, coversDir)
      } else {
        cb(null, tracksDir)
      }
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname)
      const name = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`
      cb(null, name)
    },
  }),
  limits: { fileSize: 50 * 1024 * 1024 },
})
