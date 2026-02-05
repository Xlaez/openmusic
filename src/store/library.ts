import { create } from 'zustand'
import type { Project } from '@/types'

interface LibraryState {
  ownedProjects: Project[]
  addProject: (project: Project) => void
}

export const useLibraryStore = create<LibraryState>((set) => ({
  ownedProjects: [],
  addProject: (project) => set((state) => ({ ownedProjects: [...state.ownedProjects, project] })),
}))
