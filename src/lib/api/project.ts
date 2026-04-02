import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/auth'
import { useLibraryStore } from '@/store/library'
import { apiFetch } from './client'
import type { Project } from '@/types'

export function useProject(projectId: string) {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: () => apiFetch<Project>(`/projects/${projectId}`),
    enabled: !!projectId,
  })
}

export function useRelatedProjects(projectId: string) {
  return useQuery({
    queryKey: ['related-projects', projectId],
    queryFn: () => apiFetch<Project[]>(`/projects/${projectId}/related`),
    enabled: !!projectId,
  })
}

export function usePurchaseProject() {
  const queryClient = useQueryClient()
  const { addProject } = useLibraryStore.getState()
  const { deductBalance } = useAuthStore.getState()

  return useMutation({
    mutationFn: async ({ project, currency }: { project: Project; currency: 'usdc' | 'usdt' }) => {
      const result = await apiFetch<any>('/purchases', {
        method: 'POST',
        body: { projectId: project.id, currency },
      })

      // Update local state to stay in sync
      const NETWORK_FEE = 10
      deductBalance(project.price + NETWORK_FEE, currency)
      addProject(project)

      return result.project || project
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owned-projects'] })
      queryClient.invalidateQueries({ queryKey: ['library', 'owned'] })
    },
  })
}
