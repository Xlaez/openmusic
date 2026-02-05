import { useQuery } from '@tanstack/react-query'
import { mockProjects } from './mockData'

// Mock delay to simulate network request
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const useRecentlyPlayed = () => {
  return useQuery({
    queryKey: ['home', 'recently-played'],
    queryFn: async () => {
      await delay(500)
      // Mock: return first 5 projects
      return mockProjects.slice(0, 5)
    },
  })
}

export const useNewFromFavorites = () => {
  return useQuery({
    queryKey: ['home', 'new-from-favorites'],
    queryFn: async () => {
      await delay(600)
      // Mock: return next 5 projects
      return mockProjects.slice(5, 10)
    },
  })
}

export const useRecommended = () => {
  return useQuery({
    queryKey: ['home', 'recommended'],
    queryFn: async () => {
      await delay(700)
      // Mock: return random projects
      return [...mockProjects].sort(() => 0.5 - Math.random()).slice(0, 8)
    },
  })
}

export const useTrending = () => {
  return useQuery({
    queryKey: ['home', 'trending'],
    queryFn: async () => {
      await delay(800)
      // Mock: return projects with highest "id" (pretending newer/popular)
      return mockProjects.slice(10, 15)
    },
  })
}
