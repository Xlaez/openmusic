import mongoose from 'mongoose'
import { env } from './env.js'

export async function connectDB() {
  try {
    await mongoose.connect(env.MONGODB_URI)
    console.log('✅ Connected to MongoDB:', env.MONGODB_URI)
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    process.exit(1)
  }

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB error:', err)
  })

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected')
  })
}
