import { useQuery } from '@tanstack/react-query'
import { mockProjects } from './mockData'

// Mock delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const useOwnedProjects = () => {
  return useQuery({
    queryKey: ['library', 'owned'],
    queryFn: async () => {
      await delay(500)
      // Mock: User owns projects with even indices
      // In a real app, this would come from the backend or contract
      // We also merge with local store if we wanted to support "optimistic" updates
      return mockProjects.filter((_, i) => i % 2 === 0)
    },
  })
}
