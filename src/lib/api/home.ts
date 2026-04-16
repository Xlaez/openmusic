import { useQuery } from '@tanstack/react-query'
import { apiFetch } from './client'
import type { Project } from '@/types'

export const useRecentlyPlayed = () => {
  return useQuery({
    queryKey: ['home', 'recently-played'],
    queryFn: () => apiFetch<Project[]>('/home/recently-played'),
  })
}

export const useNewFromFavorites = () => {
  return useQuery({
    queryKey: ['home', 'new-from-favorites'],
    queryFn: () => apiFetch<Project[]>('/home/new-from-favorites'),
  })
}

export const useRecommended = () => {
  return useQuery({
    queryKey: ['home', 'recommended'],
    queryFn: () => apiFetch<Project[]>('/home/recommended'),
  })
}

export const useTrending = () => {
  return useQuery({
    queryKey: ['home', 'trending'],
    queryFn: () => apiFetch<Project[]>('/home/trending'),
  })
}
