import { usePrivy, useWallets } from '@privy-io/react-auth'
import { useEffect } from 'react'
import { useAuthStore } from '@/store/auth'
import type { UserRole } from '@/types'

export function useAuth() {
  const { login, logout, user: privyUser, authenticated, ready } = usePrivy()
  const { wallets } = useWallets()
  const { setUser, setAuthenticated, logout: storeLogout } = useAuthStore()

  useEffect(() => {
    if (ready) {
      if (authenticated && privyUser) {
        const wallet = wallets[0]?.address || privyUser.wallet?.address || ''

        setUser({
          id: privyUser.id,
          walletAddress: wallet,
          role: (localStorage.getItem('user-role') as UserRole) || 'listener',
          username: privyUser.email?.address?.split('@')[0] || 'user_' + privyUser.id.slice(-4),
          balance: { usdc: 0, usdt: 0 },
          createdAt: new Date().toISOString(),
        })
        setAuthenticated(true)
      } else {
        setAuthenticated(false)
      }
    }
  }, [ready, authenticated, privyUser, wallets, setUser, setAuthenticated])

  const handleLogout = async () => {
    await logout()
    storeLogout()
  }

  return {
    login,
    logout: handleLogout,
    user: privyUser,
    authenticated,
    ready,
  }
}
