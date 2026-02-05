import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mockProjects } from './mockData'
import { useLibraryStore } from '@/store/library'
import { useAuthStore } from '@/store/auth'
import type { Project } from '@/types'

// Mock delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function useProject(projectId: string) {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      await delay(500)
      const project = mockProjects.find((p) => p.id === projectId)
      if (!project) throw new Error('Project not found')
      return project
    },
    enabled: !!projectId,
  })
}

export function useRelatedProjects(projectId: string) {
  return useQuery({
    queryKey: ['related-projects', projectId],
    queryFn: async () => {
      await delay(600)
      const project = mockProjects.find((p) => p.id === projectId)
      if (!project) return []

      // Return other projects by same artist + similar genre (random for now)
      return mockProjects
        .filter(
          (p) => p.id !== projectId && (p.artist.id === project.artist.id || Math.random() > 0.7),
        )
        .slice(0, 8)
    },
    enabled: !!projectId,
  })
}

export function usePurchaseProject() {
  const queryClient = useQueryClient()
  const { addProject } = useLibraryStore.getState()
  const { deductBalance } = useAuthStore.getState()

  return useMutation({
    mutationFn: async ({ project, currency }: { project: Project; currency: 'usdc' | 'usdt' }) => {
      await delay(1000)

      const NETWORK_FEE = 10
      const totalCost = project.price + NETWORK_FEE

      const success = deductBalance(totalCost, currency)
      if (!success) {
        throw new Error('Insufficient balance')
      }

      addProject(project)
      return project
    },
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ['owned-projects'] })
      queryClient.setQueryData(['project', project.id], (old: Project) => ({
        ...old,
        isOwned: true,
      })) // Naive update if we had valid isOwned field
    },
  })
}
