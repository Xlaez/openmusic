import { Router, Request, Response } from 'express'
import { Project } from '../models/Project.js'
import { User } from '../models/User.js'

const router = Router()

/**
 * GET /api/search?q=term&filter=projects|artists
 * Search projects and artists
 */
router.get('/', async (req: Request, res: Response) => {
  const query = (req.query.q as string) || ''
  const filter = req.query.filter as string

  if (!query.trim()) {
    res.json({ projects: [], artists: [] })
    return
  }

  const regex = new RegExp(query, 'i')

  let projects: any[] = []
  let artists: any[] = []

  if (!filter || filter === 'projects') {
    projects = await Project.find({
      $or: [{ title: regex }, { genres: regex }],
    })
      .populate('artist')
      .limit(20)
  }

  if (!filter || filter === 'artists') {
    artists = await User.find({
      role: 'artist',
      $or: [{ displayName: regex }, { username: regex }],
    }).limit(20)
  }

  res.json({
    projects: projects.map((p) => p.toJSON()),
    artists: artists.map((a) => a.toJSON()),
  })
})

export default router
