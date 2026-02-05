import { useAuthStore } from '@/store/auth'
import { toast } from 'sonner'

export const devUtils = {
  resetMockData: () => {
    localStorage.clear()
    window.location.reload()
  },

  addTestFunds: (amount: number = 100) => {
    const { addBalance } = useAuthStore.getState()
    addBalance(amount, 'usdc')
    toast.success(`Added ${amount} USDC to wallet (Dev Mode)`)
  },

  grantArtistRole: () => {
    const { updateProfile } = useAuthStore.getState()
    updateProfile({ role: 'artist' })
    localStorage.setItem('user-role', 'artist')
    toast.success('Artist role granted (Dev Mode)')
  },

  toggleUser: () => {
    // Just a placeholder to swap between mock states if needed
    toast.info('User toggled (Dev Mode)')
  },
}
