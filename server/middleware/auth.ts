import { Request, Response, NextFunction } from 'express'
import { PrivyClient } from '@privy-io/server-auth'
import { User, IUser } from '../models/User.js'
import { env } from '../config/env.js'

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser
      privyUserId?: string
    }
  }
}

let privyClient: PrivyClient | null = null

function getPrivyClient(): PrivyClient | null {
  if (!env.PRIVY_APP_ID || !env.PRIVY_APP_SECRET) {
    return null
  }
  if (!privyClient) {
    privyClient = new PrivyClient(env.PRIVY_APP_ID, env.PRIVY_APP_SECRET)
  }
  return privyClient
}

/**
 * Required auth middleware - returns 401 if no valid token
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authorization header required' })
    return
  }

  const token = authHeader.split(' ')[1]
  const client = getPrivyClient()

  if (!client) {
    // Dev mode: allow mock auth with user ID in token
    try {
      const user = await User.findById(token)
      if (user) {
        req.user = user
        req.privyUserId = token
        next()
        return
      }
    } catch {
      // Not a valid ObjectId, ignore
    }

    // Try to find first user as fallback in dev
    const devUser = await User.findOne()
    if (devUser) {
      req.user = devUser
      req.privyUserId = 'dev-user'
      next()
      return
    }

    res.status(401).json({ error: 'Privy not configured and no dev user available' })
    return
  }

  try {
    const claims = await client.verifyAuthToken(token)
    const user = await User.findOne({ privyId: claims.userId })

    if (!user) {
      // User is authenticated via Privy but not registered in our DB yet
      req.privyUserId = claims.userId
      next()
      return
    }

    req.user = user
    req.privyUserId = claims.userId
    next()
  } catch (error) {
    console.error('Auth error:', error)
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}

/**
 * Optional auth middleware - sets user if token present, but doesn't block
 */
export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next()
    return
  }

  const token = authHeader.split(' ')[1]
  const client = getPrivyClient()

  if (!client) {
    // Dev mode
    try {
      const user = await User.findById(token)
      if (user) {
        req.user = user
        req.privyUserId = token
      }
    } catch {
      const devUser = await User.findOne()
      if (devUser) {
        req.user = devUser
        req.privyUserId = 'dev-user'
      }
    }
    next()
    return
  }

  try {
    const claims = await client.verifyAuthToken(token)
    const user = await User.findOne({ privyId: claims.userId })
    if (user) {
      req.user = user
      req.privyUserId = claims.userId
    }
  } catch {
    // Token invalid, continue without user
  }

  next()
}
