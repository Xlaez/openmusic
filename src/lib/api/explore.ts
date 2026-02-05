import { useQuery } from '@tanstack/react-query'
import { mockProjects, mockArtists } from './mockData'
import type { ProjectType } from '@/types'

// Mock delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const useExploreProjects = (filter: ProjectType | 'all' = 'all') => {
  return useQuery({
    queryKey: ['explore', 'projects', filter],
    queryFn: async () => {
      await delay(600)
      if (filter === 'all') {
        return mockProjects
      }
      return mockProjects.filter((p) => p.type === filter)
    },
  })
}

export const useDiscoverArtists = () => {
  return useQuery({
    queryKey: ['explore', 'artists'],
    queryFn: async () => {
      await delay(500)
      return mockArtists
    },
  })
}
