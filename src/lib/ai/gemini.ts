export const geminiService = {
  /**
   * Generates timed lyrics by calling the server-side Gemini proxy.
   * The API key is kept on the server and never exposed to the client.
   */
  generateTimedLyrics: async (audioUrl: string): Promise<{ time: number; text: string }[]> => {
    try {
      const response = await fetch('/api/gemini/lyrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioUrl }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to generate lyrics')
      }

      const data = await response.json()
      return data.lyrics || []
    } catch (error) {
      console.error('Gemini error:', error)
      throw error
    }
  },
}
