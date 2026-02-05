import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Project, ProjectType } from '@/types'
import { useAuthStore } from '@/store/auth'

interface CreateProjectParams {
  title: string
  description: string
  type: ProjectType
  releaseDate: string
  coverImage: string
  tracks: { title: string; duration: number; file: File; lyrics?: string }[]
  price: number
  totalUnits: number
  genres: string[]
}

// Mock delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function useCreateProject() {
  const queryClient = useQueryClient()
  const { deductBalance } = useAuthStore.getState()
  // const { addProject } = useLibraryStore.getState() // Artists might have separate store or just added to global entries

  return useMutation({
    mutationFn: async (params: CreateProjectParams) => {
      await delay(2000)

      // Calculate backing deposit: 50% of price per unit for the 2 reserved units
      const backingDeposit = params.price * 0.5 * 2

      const success = deductBalance(backingDeposit, 'usdc')
      if (!success) {
        throw new Error('Insufficient balance to create project')
      }

      // Create Mock Project
      const newProject: Project = {
        id: `proj-${Date.now()}`,
        type: params.type,
        title: params.title,
        artist: {
          // Mock current user artist
          id: 'artist-current', // In real app from auth
          username: 'currentartist',
          walletAddress: '0x123',
          role: 'artist',
          displayName: 'Current Artist',
          verified: true,
          createdAt: new Date().toISOString(),
          balance: { usdc: 0, usdt: 0 },
          stats: { totalSales: 0, totalListeners: 0, projectsReleased: 0 },
        },
        description: params.description,
        coverImage: params.coverImage,
        releaseDate: params.releaseDate,
        price: params.price,
        totalUnits: params.totalUnits,
        availableUnits: params.totalUnits - 2, // Platform holds 2
        genres: params.genres,
        contractAddress: `0x${Math.random().toString(16).slice(2)}`,
        tracks: params.tracks.map((t, i) => ({
          id: `track-${Date.now()}-${i}`,
          title: t.title,
          duration: t.duration,
          trackNumber: i + 1,
          fileUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Mock
          lyrics: t.lyrics,
        })),
      }

      return newProject
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artist-projects'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
  })
}
