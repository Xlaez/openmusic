import { Router, Request, Response } from 'express'
import { generateTimedLyrics } from '../services/gemini.js'

const router = Router()

/**
 * POST /api/gemini/lyrics
 * Generate timed lyrics from audio using Gemini AI
 */
router.post('/lyrics', async (req: Request, res: Response) => {
  const { audioUrl } = req.body

  if (!audioUrl) {
    res.status(400).json({ error: 'audioUrl is required' })
    return
  }

  try {
    const lyrics = await generateTimedLyrics(audioUrl)
    res.json({ lyrics })
  } catch (error) {
    console.error('Gemini API error:', error)
    res.status(500).json({
      error: 'Failed to generate lyrics',
      details: error instanceof Error ? error.message : String(error),
    })
  }
})

export default router
