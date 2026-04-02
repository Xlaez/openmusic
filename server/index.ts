import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

import { env, validateEnv } from './config/env.js'
import { connectDB } from './config/db.js'
import { errorHandler } from './middleware/errorHandler.js'

// Routes
import authRoutes from './routes/auth.js'
import projectRoutes from './routes/projects.js'
import exploreRoutes from './routes/explore.js'
import homeRoutes from './routes/home.js'
import searchRoutes from './routes/search.js'
import libraryRoutes from './routes/library.js'
import purchaseRoutes from './routes/purchases.js'
import dashboardRoutes from './routes/dashboard.js'
import artistRoutes from './routes/artists.js'
import geminiRoutes from './routes/gemini.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function main() {
  validateEnv()

  // Connect to MongoDB
  await connectDB()

  const app = express()

  // Middleware
  app.use(cors())
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ extended: true }))

  // Serve uploaded files
  app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')))

  // API Routes
  app.use('/api/auth', authRoutes)
  app.use('/api/projects', projectRoutes)
  app.use('/api/explore', exploreRoutes)
  app.use('/api/home', homeRoutes)
  app.use('/api/search', searchRoutes)
  app.use('/api/library', libraryRoutes)
  app.use('/api/purchases', purchaseRoutes)
  app.use('/api/dashboard', dashboardRoutes)
  app.use('/api/artists', artistRoutes)
  app.use('/api/gemini', geminiRoutes)

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
  })

  // Error handler (must be last)
  app.use(errorHandler)

  app.listen(env.PORT, () => {
    console.log(`\n🎵 OpenMusic API server running on http://localhost:${env.PORT}`)
    console.log(`   Health check: http://localhost:${env.PORT}/api/health\n`)
  })
}

main().catch((error) => {
  console.error('Failed to start server:', error)
  process.exit(1)
})
