import { useQuery } from '@tanstack/react-query'
import { mockProjects, mockArtists } from './mockData'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const useSearch = (query: string, filter?: 'projects' | 'artists') => {
  return useQuery({
    queryKey: ['search', query, filter],
    queryFn: async () => {
      await delay(300)
      const q = query.toLowerCase()

      const projects = mockProjects.filter(
        (p) => p.title.toLowerCase().includes(q) || p.artist.displayName.toLowerCase().includes(q),
      )

      const artists = mockArtists.filter((a) => a.displayName.toLowerCase().includes(q))

      if (filter === 'projects') return { projects, artists: [] }
      if (filter === 'artists') return { projects: [], artists }

      return { projects, artists }
    },
    enabled: query.length > 0,
  })
}
