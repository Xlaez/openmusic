import type { Plugin } from 'vite'
import { GoogleGenerativeAI } from '@google/generative-ai'

/**
 * Vite plugin that adds a server-side API route for Gemini lyrics generation.
 * This keeps the GEMINI_API_KEY on the server, never exposing it to the client.
 */
export function geminiApiPlugin(): Plugin {
  return {
    name: 'gemini-api',
    configureServer(server) {
      server.middlewares.use('/api/gemini/lyrics', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        const apiKey = process.env.GEMINI_API_KEY
        if (!apiKey) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'GEMINI_API_KEY is not configured on the server' }))
          return
        }

        try {
          // Parse the request body
          const body = await new Promise<string>((resolve, reject) => {
            let data = ''
            req.on('data', (chunk: Buffer) => {
              data += chunk.toString()
            })
            req.on('end', () => resolve(data))
            req.on('error', reject)
          })

          const { audioUrl } = JSON.parse(body) as { audioUrl: string }

          if (!audioUrl) {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'audioUrl is required' }))
            return
          }

          // Fetch the audio file server-side
          const audioResponse = await fetch(audioUrl)
          const arrayBuffer = await audioResponse.arrayBuffer()
          const base64Data = Buffer.from(arrayBuffer).toString('base64')
          const mimeType = audioResponse.headers.get('content-type') || 'audio/mp3'

          // Call Gemini
          const genAI = new GoogleGenerativeAI(apiKey)
          const model = genAI.getGenerativeModel({
            model: 'gemini-3-flash-preview',
            generationConfig: {
              responseMimeType: 'application/json',
            },
          })

          const prompt = `
            Analyze this audio track and generate highly accurate timed lyrics.
            Return a JSON object with a "lyrics" key containing an array of objects.
            Each object must have:
            - "time": the timestamp in seconds (floating point) when the line starts.
            - "text": the lyric text for that line.
            
            Capture the energy and all vocal segments accurately.
            Format example: {"lyrics": [{"time": 1.2, "text": "Hello world"}]}
          `

          const result = await model.generateContent([
            prompt,
            {
              inlineData: {
                data: base64Data,
                mimeType,
              },
            },
          ])

          const text = result.response.text()
          const parsed = JSON.parse(text)

          const lyrics = parsed.lyrics && Array.isArray(parsed.lyrics) ? parsed.lyrics : []

          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ lyrics }))
        } catch (error) {
          console.error('Gemini API error:', error)
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(
            JSON.stringify({
              error: 'Failed to generate lyrics',
              details: error instanceof Error ? error.message : String(error),
            }),
          )
        }
      })
    },
  }
}
