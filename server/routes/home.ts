import { Router, Request, Response } from 'express'
import { Project } from '../models/Project.js'
import { Purchase } from '../models/Purchase.js'
import { optionalAuth } from '../middleware/auth.js'

const router = Router()

/**
 * GET /api/home/recently-played
 * Returns recently purchased projects by the user, or latest projects for anonymous
 */
router.get('/recently-played', optionalAuth, async (req: Request, res: Response) => {
  if (req.user) {
    const purchases = await Purchase.find({ buyer: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate({
        path: 'project',
        populate: { path: 'artist' },
      })

    const projects = purchases.map((p) => p.project).filter(Boolean)
    res.json(projects.map((p: any) => p.toJSON()))
    return
  }

  // Fallback: return latest projects
  const projects = await Project.find().populate('artist').sort({ createdAt: -1 }).limit(5)

  res.json(projects.map((p) => p.toJSON()))
})

/**
 * GET /api/home/new-from-favorites
 * New releases from artists the user has purchased from
 */
router.get('/new-from-favorites', optionalAuth, async (req: Request, res: Response) => {
  if (req.user) {
    // Get distinct artist IDs from user's purchases
    const purchases = await Purchase.find({ buyer: req.user._id }).populate('project')
    const artistIds = [...new Set(purchases.map((p: any) => p.project?.artist?.toString()).filter(Boolean))]

    if (artistIds.length > 0) {
      const projects = await Project.find({ artist: { $in: artistIds } })
        .populate('artist')
        .sort({ releaseDate: -1 })
        .limit(5)

      res.json(projects.map((p) => p.toJSON()))
      return
    }
  }

  // Fallback: return projects offset by 5
  const projects = await Project.find().populate('artist').sort({ createdAt: -1 }).skip(5).limit(5)

  res.json(projects.map((p) => p.toJSON()))
})

/**
 * GET /api/home/recommended
 * Recommended projects (random sample for now)
 */
router.get('/recommended', async (_req: Request, res: Response) => {
  const projects = await Project.aggregate([{ $sample: { size: 8 } }])

  // Populate artist manually after aggregation
  const populated = await Project.populate(projects, { path: 'artist' })

  res.json(
    populated.map((p: any) => {
      const obj = p.toJSON ? p.toJSON() : p
      obj.id = obj._id?.toString() || obj.id
      delete obj._id
      delete obj.__v
      return obj
    }),
  )
})

/**
 * GET /api/home/trending
 * Projects with most recent purchases
 */
router.get('/trending', async (_req: Request, res: Response) => {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const trending = await Purchase.aggregate([
    { $match: { createdAt: { $gte: sevenDaysAgo } } },
    { $group: { _id: '$project', purchaseCount: { $sum: 1 } } },
    { $sort: { purchaseCount: -1 } },
    { $limit: 10 },
  ])

  if (trending.length > 0) {
    const projectIds = trending.map((t) => t._id)
    const projects = await Project.find({ _id: { $in: projectIds } }).populate('artist')
    res.json(projects.map((p) => p.toJSON()))
    return
  }

  // Fallback: return random projects
  const projects = await Project.find().populate('artist').sort({ createdAt: -1 }).skip(10).limit(5)

  res.json(projects.map((p) => p.toJSON()))
})

export default router
