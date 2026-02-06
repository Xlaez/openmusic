import { GoogleGenerativeAI } from '@google/generative-ai'

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY || '')
  // Note: The SDK doesn't expose a direct listModels yet in a simple way sometimes,
  // but we can try to fetch the list via the REST endpoint or check the current recommended model names.
  console.log('Checking available models...')
}

listModels()
