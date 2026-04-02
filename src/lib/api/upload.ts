import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Project, ProjectType } from '@/types'
import { apiFetch } from './client'

interface CreateProjectParams {
  title: string
  description: string
  type: ProjectType
  releaseDate: string
  coverImage: string | File
  tracks: { title: string; duration: number; file: File; lyrics?: string }[]
  price: number
  totalUnits: number
  genres: string[]
}

export function useCreateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: CreateProjectParams) => {
      const formData = new FormData()

      // Add metadata fields
      formData.append('title', params.title)
      formData.append('description', params.description)
      formData.append('type', params.type)
      formData.append('releaseDate', params.releaseDate)
      formData.append('price', params.price.toString())
      formData.append('totalUnits', params.totalUnits.toString())
      formData.append('genres', JSON.stringify(params.genres))

      // Add cover image
      if (params.coverImage instanceof File) {
        formData.append('coverImage', params.coverImage)
      } else if (typeof params.coverImage === 'string') {
        formData.append('coverImageUrl', params.coverImage)
      }

      // Add track files and metadata
      const trackMetadata = params.tracks.map((t) => ({
        title: t.title,
        duration: t.duration,
        lyrics: t.lyrics,
      }))
      formData.append('trackMetadata', JSON.stringify(trackMetadata))

      for (const track of params.tracks) {
        formData.append('tracks', track.file)
      }

      // Don't set Content-Type header — browser sets multipart boundary automatically
      const result = await apiFetch<Project>('/projects/create', {
        method: 'POST',
        body: formData,
      })

      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artist-projects'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      queryClient.invalidateQueries({ queryKey: ['explore'] })
    },
  })
}
