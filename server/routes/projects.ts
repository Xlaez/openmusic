import { Router, Request, Response } from 'express'
import { Project } from '../models/Project.js'
import { User } from '../models/User.js'
import { requireAuth } from '../middleware/auth.js'
import { uploadProjectFiles } from '../middleware/upload.js'
import { createProjectOnChain, usdcToWei } from '../services/blockchain.js'

const router = Router()

/**
 * GET /api/projects/:id
 * Get a single project by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id).populate('artist')
    if (!project) {
      res.status(404).json({ error: 'Project not found' })
      return
    }
    res.json(project.toJSON())
  } catch (error: any) {
    if (error.name === 'CastError') {
      res.status(400).json({ error: 'Invalid project ID' })
      return
    }
    throw error
  }
})

/**
 * GET /api/projects/:id/related
 * Get related projects (same artist or shared genres)
 */
router.get('/:id/related', async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) {
      res.status(404).json({ error: 'Project not found' })
      return
    }

    // Find projects by same artist or with shared genres, excluding current
    const related = await Project.find({
      _id: { $ne: project._id },
      $or: [{ artist: project.artist }, { genres: { $in: project.genres } }],
    })
      .populate('artist')
      .limit(8)

    res.json(related.map((p) => p.toJSON()))
  } catch (error: any) {
    if (error.name === 'CastError') {
      res.status(400).json({ error: 'Invalid project ID' })
      return
    }
    throw error
  }
})

/**
 * POST /api/projects/create
 * Create a new music project (artist only)
 */
router.post(
  '/create',
  requireAuth,
  uploadProjectFiles.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'tracks', maxCount: 30 },
  ]),
  async (req: Request, res: Response) => {
    if (!req.user) {
      res.status(401).json({ error: 'User not registered' })
      return
    }

    if (req.user.role !== 'artist') {
      res.status(403).json({ error: 'Only artists can create projects' })
      return
    }

    try {
      const { title, description, type, releaseDate, price, totalUnits, genres } = req.body
      const priceNum = parseFloat(price)
      const totalUnitsNum = parseInt(totalUnits, 10)

      if (!title || !type || !price || !totalUnits) {
        res.status(400).json({ error: 'Missing required fields: title, type, price, totalUnits' })
        return
      }

      // Calculate backing deposit (price * 0.5 * 2 reserved units)
      const backingDeposit = priceNum * 0.5 * 2
      if (req.user.balance.usdc < backingDeposit) {
        res.status(400).json({
          error: `Insufficient balance. Need ${backingDeposit} USDC for backing deposit.`,
        })
        return
      }

      // Process uploaded files
      const files = req.files as { [fieldname: string]: Express.Multer.File[] }
      const coverFile = files?.coverImage?.[0]
      const trackFiles = files?.tracks || []

      const coverImageUrl = coverFile ? `/uploads/covers/${coverFile.filename}` : req.body.coverImageUrl || ''

      // Parse track metadata from request body
      let trackMetadata: any[] = []
      try {
        trackMetadata = JSON.parse(req.body.trackMetadata || '[]')
      } catch {
        trackMetadata = []
      }

      // Build tracks array
      const tracks = trackMetadata.map((meta: any, index: number) => {
        const trackFile = trackFiles[index]
        return {
          title: meta.title || `Track ${index + 1}`,
          duration: meta.duration || 0,
          trackNumber: index + 1,
          lyrics: meta.lyrics || undefined,
          timedLyrics: meta.timedLyrics || undefined,
          fileUrl: trackFile ? `/uploads/tracks/${trackFile.filename}` : meta.fileUrl || '',
        }
      })

      // Parse genres
      let genresArray: string[] = []
      try {
        genresArray = typeof genres === 'string' ? JSON.parse(genres) : genres || []
      } catch {
        genresArray = genres ? [genres] : []
      }

      // Deploy on-chain (or simulate)
      const priceInWei = usdcToWei(priceNum)
      const artistAddress = req.user.walletAddress || '0x0000000000000000000000000000000000000000'

      const chainResult = await createProjectOnChain(
        title,
        totalUnitsNum,
        priceInWei,
        artistAddress,
      )

      // Create project in DB
      const project = new Project({
        type,
        title,
        artist: req.user._id,
        coverImage: coverImageUrl,
        releaseDate: releaseDate ? new Date(releaseDate) : new Date(),
        price: priceNum,
        totalUnits: totalUnitsNum,
        availableUnits: totalUnitsNum - 2, // 2 reserved for platform
        tracks,
        description: description || '',
        genres: genresArray,
        contractAddress: chainResult.contractAddress,
        tokenId: chainResult.tokenId,
      })

      await project.save()

      // Deduct backing deposit from artist balance
      await User.findByIdAndUpdate(req.user._id, {
        $inc: {
          'balance.usdc': -backingDeposit,
          'stats.projectsReleased': 1,
        },
      })

      // Populate artist for response
      await project.populate('artist')

      res.status(201).json(project.toJSON())
    } catch (error) {
      console.error('Project creation error:', error)
      throw error
    }
  },
)

export default router
