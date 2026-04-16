import dotenv from 'dotenv'

dotenv.config()

export const env = {
  // Server
  PORT: parseInt(process.env.SERVER_PORT || '3001', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',

  // MongoDB
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/openmusic',

  // Privy
  PRIVY_APP_ID: process.env.VITE_PRIVY_APP_ID || '',
  PRIVY_APP_SECRET: process.env.VITE_PRIVY_APP_SECRET || '',

  // Blockchain
  BASE_SEPOLIA_RPC_URL: process.env.BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org',
  PLATFORM_PRIVATE_KEY: process.env.PLATFORM_PRIVATE_KEY || '',
  FACTORY_CONTRACT_ADDRESS: process.env.FACTORY_CONTRACT_ADDRESS || '',

  // Gemini
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
}

export function validateEnv() {
  const required = ['MONGODB_URI']
  const missing = required.filter((key) => !process.env[key] && !(env as any)[key])

  if (missing.length > 0) {
    console.warn(`⚠️  Missing environment variables: ${missing.join(', ')}`)
    console.warn('   Using defaults where possible.')
  }
}
