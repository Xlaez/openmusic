import { GoogleGenerativeAI } from '@google/generative-ai'

// In a real app, this would be on a backend or edge function to protect the key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '')

export const geminiService = {
  /**
   * Generates timed lyrics from an audio file.
   * Note: This requires the audio bytes to be sent to Gemini.
   */
  generateTimedLyrics: async (audioUrl: string): Promise<{ time: number; text: string }[]> => {
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      throw new Error('Gemini API Key missing')
    }

    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-3-flash-preview',
        generationConfig: {
          responseMimeType: 'application/json',
        },
      })

      // Fetch the audio file
      const response = await fetch(audioUrl)
      const blob = await response.blob()

      // Convert blob to base64
      const base64Data = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          const base64String = (reader.result as string).split(',')[1]
          resolve(base64String)
        }
        reader.readAsDataURL(blob)
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
            mimeType: blob.type || 'audio/mp3',
          },
        },
      ])

      const text = result.response.text()
      const parsed = JSON.parse(text)

      if (parsed.lyrics && Array.isArray(parsed.lyrics)) {
        return parsed.lyrics
      }

      return []
    } catch (error) {
      console.error('Gemini error:', error)
      throw error
    }
  },
}
