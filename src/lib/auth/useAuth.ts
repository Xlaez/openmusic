import { useEffect } from 'react'
import { useAuthStore } from '@/store/auth'
import type { UserRole } from '@/types'
import { useAuthContext } from './privy'

/**
 * Unified auth hook.
 *
 * Always reads from the `AuthCtx` context (provided by `AuthProvider` in
 * `privy.tsx`). When Privy is configured the context is backed by real Privy
 * values; otherwise it returns safe defaults.  No conditional hook calls —
 * the same hooks are called in the same order on every render.
 */
export function useAuth() {
  const { login, logout, user: privyUser, authenticated, ready, wallets } = useAuthContext()
  const { setUser, setAuthenticated, logout: storeLogout } = useAuthStore()

  useEffect(() => {
    if (!ready) return
    if (authenticated && privyUser) {
      const wallet = wallets[0]?.address || privyUser.wallet?.address || ''
      setUser({
        id: privyUser.id,
        walletAddress: wallet,
        role: (localStorage.getItem('user-role') as UserRole) || 'listener',
        username:
          privyUser.email?.address?.split('@')[0] || 'user_' + privyUser.id.slice(-4),
        balance: { usdc: 0, usdt: 0 },
        createdAt: new Date().toISOString(),
      })
      setAuthenticated(true)
    } else {
      setAuthenticated(false)
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
