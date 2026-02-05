import { usePrivy, useWallets } from '@privy-io/react-auth'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/auth'
import type { UserRole } from '@/types'

export function useAuth() {
  const { login, logout, user: privyUser, authenticated, ready: privyReady } = usePrivy()
  const { wallets } = useWallets()
  const { setUser, setAuthenticated, logout: storeLogout } = useAuthStore()

  // Dev bypass for placeholder App ID
  const [devReady, setDevReady] = useState(false)

  useEffect(() => {
    if (privyReady) {
      setDevReady(true)
    } else {
      // In dev, if it takes more than 3s, assume we want to view the app anyway
      const timer = setTimeout(() => {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Privy taking too long to initialize. Bypassing for development.')
          setDevReady(true)
        }
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [privyReady])

  useEffect(() => {
    if (privyReady) {
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
  }, [privyReady, authenticated, privyUser, wallets, setUser, setAuthenticated])

  const handleLogout = async () => {
    await logout()
    storeLogout()
  }

  return {
    login,
    logout: handleLogout,
    user: privyUser,
    authenticated,
    ready: devReady, // Use dev-bypassed ready state
  }
}
