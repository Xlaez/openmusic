import { Router, Request, Response } from 'express'
import { Purchase } from '../models/Purchase.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

/**
 * GET /api/library/owned
 * Get all projects owned (purchased) by the authenticated user
 */
router.get('/owned', requireAuth, async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: 'User not registered' })
    return
  }

  const purchases = await Purchase.find({ buyer: req.user._id })
    .populate({
      path: 'project',
      populate: { path: 'artist' },
    })
    .sort({ createdAt: -1 })

  // Deduplicate by project ID (user might have multiple purchases of same project... unlikely but safe)
  const seen = new Set<string>()
  const projects = purchases
    .map((p: any) => p.project)
    .filter((project: any) => {
      if (!project) return false
      const id = project._id.toString()
      if (seen.has(id)) return false
      seen.add(id)
      return true
    })

  res.json(projects.map((p: any) => p.toJSON()))
})

export default router
