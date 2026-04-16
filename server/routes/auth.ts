import { Router, Request, Response } from 'express'
import { User } from '../models/User.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
router.get('/me', requireAuth, async (req: Request, res: Response) => {
  if (req.user) {
    res.json(req.user.toJSON())
    return
  }

  // User authenticated via Privy but not registered yet
  res.status(404).json({ error: 'User not registered', privyUserId: req.privyUserId })
})

/**
 * POST /api/auth/register
 * Register a new user after Privy authentication
 */
router.post('/register', requireAuth, async (req: Request, res: Response) => {
  try {
    // Check if already registered
    if (req.user) {
      res.json(req.user.toJSON())
      return
    }

    const { role, username, displayName, email } = req.body

    if (!role || !['listener', 'artist'].includes(role)) {
      res.status(400).json({ error: 'Valid role (listener or artist) is required' })
      return
    }

    // Generate username if not provided
    const finalUsername = username || `user_${Date.now().toString(36)}`

    const user = new User({
      privyId: req.privyUserId,
      role,
      username: finalUsername,
      displayName: displayName || finalUsername,
      email: email || '',
      balance: { usdc: 500, usdt: 100 }, // Starting balance for testnet
      stats: { totalSales: 0, totalListeners: 0, projectsReleased: 0 },
    })

    await user.save()
    res.status(201).json(user.toJSON())
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(409).json({ error: 'Username already taken' })
      return
    }
    throw error
  }
})

/**
 * PATCH /api/auth/profile
 * Update user profile
 */
router.patch('/profile', requireAuth, async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: 'User not registered' })
    return
  }

  const allowedFields = ['displayName', 'bio', 'avatar', 'coverImage', 'username', 'email']
  const updates: Record<string, any> = {}

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field]
    }
  }

  try {
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true })
    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    res.json(user.toJSON())
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(409).json({ error: 'Username already taken' })
      return
    }
    throw error
  }
})

export default router
