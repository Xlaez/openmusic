import { useQuery } from '@tanstack/react-query'
import { apiFetch } from './client'
import type { Artist, Project } from '@/types'

export function useArtist(artistId: string) {
  return useQuery({
    queryKey: ['artist', artistId],
    queryFn: () => apiFetch<Artist>(`/artists/${artistId}`),
    enabled: !!artistId,
  })
}

export function useArtistProjects(artistId: string) {
  return useQuery({
    queryKey: ['artist-projects', artistId],
    queryFn: () => apiFetch<Project[]>(`/artists/${artistId}/projects`),
    enabled: !!artistId,
  })
}

export function useSimilarArtists(artistId: string) {
  return useQuery({
    queryKey: ['similar-artists', artistId],
    queryFn: () => apiFetch<Artist[]>(`/artists/${artistId}/similar`),
    enabled: !!artistId,
  })
}
