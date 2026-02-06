import { create } from 'zustand'
import type { LayoutView } from '@/types'

interface UIState {
  sidebarCollapsed: boolean
  mobileMenuOpen: boolean
  layoutView: LayoutView
  toggleSidebar: () => void
  toggleMobileMenu: () => void
  setLayoutView: (view: LayoutView) => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  mobileMenuOpen: false,
  layoutView: 'large-grid',
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  setLayoutView: (view) => set({ layoutView: view }),
}))
