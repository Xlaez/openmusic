import { Router, Request, Response } from 'express'
import { User } from '../models/User.js'
import { Project } from '../models/Project.js'

const router = Router()

/**
 * GET /api/artists/:id
 * Get an artist profile by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const artist = await User.findById(req.params.id)
    if (!artist || artist.role !== 'artist') {
      res.status(404).json({ error: 'Artist not found' })
      return
    }
    res.json(artist.toJSON())
  } catch (error: any) {
    if (error.name === 'CastError') {
      res.status(400).json({ error: 'Invalid artist ID' })
      return
    }
    throw error
  }
})

/**
 * GET /api/artists/:id/projects
 * Get all projects by an artist
 */
router.get('/:id/projects', async (req: Request, res: Response) => {
  try {
    const projects = await Project.find({ artist: req.params.id })
      .populate('artist')
      .sort({ releaseDate: -1 })

    res.json(projects.map((p) => p.toJSON()))
  } catch (error: any) {
    if (error.name === 'CastError') {
      res.status(400).json({ error: 'Invalid artist ID' })
      return
    }
    throw error
  }
})

/**
 * GET /api/artists/:id/similar
 * Get similar artists based on shared genres
 */
router.get('/:id/similar', async (req: Request, res: Response) => {
  try {
    const artistProjects = await Project.find({ artist: req.params.id })
    const genres = [...new Set(artistProjects.flatMap((p) => p.genres))]

    let similarArtists: any[] = []

    if (genres.length > 0) {
      // Find projects with matching genres from other artists
      const matchingProjects = await Project.find({
        artist: { $ne: req.params.id },
        genres: { $in: genres },
      }).distinct('artist')

      similarArtists = await User.find({
        _id: { $in: matchingProjects },
        role: 'artist',
      }).limit(5)
    }

    // If not enough, fill with random artists
    if (similarArtists.length < 5) {
      const existingIds = similarArtists.map((a) => a._id)
      const more = await User.find({
        _id: { $nin: [...existingIds, req.params.id] },
        role: 'artist',
      }).limit(5 - similarArtists.length)

      similarArtists = [...similarArtists, ...more]
    }

    res.json(similarArtists.map((a) => a.toJSON()))
  } catch (error: any) {
    if (error.name === 'CastError') {
      res.status(400).json({ error: 'Invalid artist ID' })
      return
    }
    throw error
  }
})

export default router
