import { GoogleGenerativeAI } from '@google/generative-ai'
import { env } from '../config/env.js'

interface TimedLyric {
  time: number
  text: string
}

/**
 * Generate timed lyrics from an audio URL using Gemini AI
 */
export async function generateTimedLyrics(audioUrl: string): Promise<TimedLyric[]> {
  if (!env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured on the server')
  }

  // Fetch the audio file
  const audioResponse = await fetch(audioUrl)
  const arrayBuffer = await audioResponse.arrayBuffer()
  const base64Data = Buffer.from(arrayBuffer).toString('base64')
  const mimeType = audioResponse.headers.get('content-type') || 'audio/mp3'

  // Call Gemini
  const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY)
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

  return parsed.lyrics && Array.isArray(parsed.lyrics) ? parsed.lyrics : []
}
