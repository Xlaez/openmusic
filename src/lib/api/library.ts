import { useQuery } from '@tanstack/react-query'
import { apiFetch } from './client'
import type { Project } from '@/types'

export const useOwnedProjects = () => {
  return useQuery({
    queryKey: ['library', 'owned'],
    queryFn: () => apiFetch<Project[]>('/library/owned'),
  })
}
