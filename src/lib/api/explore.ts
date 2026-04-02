import { useQuery } from '@tanstack/react-query'
import { apiFetch } from './client'
import type { Project, Artist, ProjectType } from '@/types'

export const useExploreProjects = (filter: ProjectType | 'all' = 'all') => {
  return useQuery({
    queryKey: ['explore', 'projects', filter],
    queryFn: () => apiFetch<Project[]>(`/explore/projects?filter=${filter}`),
  })
}

export const useDiscoverArtists = () => {
  return useQuery({
    queryKey: ['explore', 'artists'],
    queryFn: () => apiFetch<Artist[]>('/explore/artists'),
  })
}
