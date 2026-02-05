import { useQuery } from '@tanstack/react-query'
import { mockArtists, mockProjects } from './mockData'

// Mock delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function useArtist(artistId: string) {
  return useQuery({
    queryKey: ['artist', artistId],
    queryFn: async () => {
      await delay(500)
      const artist = mockArtists.find((a) => a.id === artistId)
      if (!artist) throw new Error('Artist not found')
      return artist
    },
    enabled: !!artistId,
  })
}

export function useArtistProjects(artistId: string) {
  return useQuery({
    queryKey: ['artist-projects', artistId],
    queryFn: async () => {
      await delay(600)
      return mockProjects.filter((p) => p.artist.id === artistId)
    },
    enabled: !!artistId,
  })
}

export function useSimilarArtists(artistId: string) {
  return useQuery({
    queryKey: ['similar-artists', artistId],
    queryFn: async () => {
      await delay(400)
      // Mock: return random 5 artists excluding current
      return mockArtists
        .filter((a) => a.id !== artistId)
        .sort(() => 0.5 - Math.random())
        .slice(0, 5)
    },
    enabled: !!artistId,
  })
}
