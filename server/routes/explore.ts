import { Router, Request, Response } from 'express'
import { Project } from '../models/Project.js'
import { User } from '../models/User.js'

const router = Router()

/**
 * GET /api/explore/projects?filter=all|album|ep|mixtape|single
 * Browse all projects with optional type filter
 */
router.get('/projects', async (req: Request, res: Response) => {
  const filter = req.query.filter as string

  const query: any = {}
  if (filter && filter !== 'all') {
    query.type = filter
  }

  const projects = await Project.find(query).populate('artist').sort({ createdAt: -1 })

  res.json(projects.map((p) => p.toJSON()))
})

/**
 * GET /api/explore/artists
 * Discover all artists
 */
router.get('/artists', async (_req: Request, res: Response) => {
  const artists = await User.find({ role: 'artist' }).sort({ 'stats.totalSales': -1 })

  res.json(artists.map((a) => a.toJSON()))
})

export default router
