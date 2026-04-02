import { useQuery } from '@tanstack/react-query'
import { apiFetch } from './client'
import type { Project, Artist } from '@/types'

interface SearchResults {
  projects: Project[]
  artists: Artist[]
}

export const useSearch = (query: string, filter?: 'projects' | 'artists') => {
  return useQuery({
    queryKey: ['search', query, filter],
    queryFn: () => {
      const params = new URLSearchParams({ q: query })
      if (filter) params.append('filter', filter)
      return apiFetch<SearchResults>(`/search?${params.toString()}`)
    },
    enabled: query.length > 0,
  })
}
