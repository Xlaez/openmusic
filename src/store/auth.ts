import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  ready: boolean
  setUser: (user: User | null) => void
  setAuthenticated: (auth: boolean) => void
  setReady: (ready: boolean) => void
  logout: () => void
  updateProfile: (updates: Partial<User>) => void
  deductBalance: (amount: number, currency: 'usdc' | 'usdt') => boolean
  addBalance: (amount: number, currency: 'usdc' | 'usdt') => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      ready: false,
      setUser: (user) => set({ user }),
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setReady: (ready) => set({ ready }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateProfile: (updates) => {
        const { user } = get()
        if (user) set({ user: { ...user, ...updates } })
      },
      addBalance: (amount, currency) => {
        const { user } = get()
        if (!user) return
        set({
          user: {
            ...user,
            balance: {
              ...user.balance,
              [currency]: (user.balance[currency] || 0) + amount,
            },
          },
        })
      },
      deductBalance: (amount, currency) => {
        const { user } = get()
        if (!user) return false

        const currentBalance = user.balance[currency]
        if (currentBalance < amount) return false

        set({
          user: {
            ...user,
            balance: {
              ...user.balance,
              [currency]: currentBalance - amount,
            },
          },
        })
        return true
      },
    }),
    {
      name: 'open-music-auth',
    },
  ),
)
