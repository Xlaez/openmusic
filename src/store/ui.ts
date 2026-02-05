import { create } from 'zustand'
import type { LayoutView } from '@/types'

interface UIState {
  sidebarCollapsed: boolean
  layoutView: LayoutView
  toggleSidebar: () => void
  setLayoutView: (view: LayoutView) => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  layoutView: 'large-grid',
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setLayoutView: (view) => set({ layoutView: view }),
}))
