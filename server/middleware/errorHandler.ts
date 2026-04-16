import { Request, Response, NextFunction } from 'express'

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error('Server error:', err)

  if (err.name === 'ValidationError') {
    res.status(400).json({ error: 'Validation error', details: err.message })
    return
  }

  if (err.name === 'CastError') {
    res.status(400).json({ error: 'Invalid ID format' })
    return
  }

  if (err.message === 'Invalid image file type' || err.message === 'Invalid audio file type') {
    res.status(400).json({ error: err.message })
    return
  }

  if ((err as any).code === 'LIMIT_FILE_SIZE') {
    res.status(400).json({ error: 'File too large' })
    return
  }

  res.status(500).json({
    error: 'Internal server error',
    ...(process.env.NODE_ENV !== 'production' && { details: err.message }),
  })
}
