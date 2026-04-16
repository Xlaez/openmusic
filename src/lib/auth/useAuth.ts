import { useEffect, useCallback, useRef } from 'react'
import { useAuthStore } from '@/store/auth'
import { setAccessTokenProvider, setDevToken, apiFetch } from '@/lib/api/client'
import type { User, UserRole } from '@/types'
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
  const { login, logout, user: privyUser, authenticated, ready, wallets, getAccessToken } = useAuthContext()
  const { setUser, setAuthenticated, setReady, logout: storeLogout } = useAuthStore()
  const syncedRef = useRef(false)

  // Register the access token provider for the API client
  useEffect(() => {
    if (getAccessToken) {
      setAccessTokenProvider(getAccessToken)
    }
  }, [getAccessToken])

  useEffect(() => {
    if (!ready) return

    if (authenticated && privyUser) {
      // Avoid duplicate sync calls
      if (syncedRef.current) return
      syncedRef.current = true

      // Fetch or create the user from the backend
      const syncUser = async () => {
        try {
          const user = await apiFetch<User>('/auth/me')
          setUser(user)
          setAuthenticated(true)
        } catch (error: any) {
          if (error?.status === 404) {
            // User not registered yet — set basic info so role selection page works
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
            console.error('Failed to sync user:', error)
            // Fallback to client-side user construction
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
          }
        }
      }

      syncUser()
    } else {
      syncedRef.current = false
      setAuthenticated(false)
    }
  }, [ready, authenticated, privyUser, wallets, setUser, setAuthenticated, setReady])

  const handleLogout = useCallback(async () => {
    syncedRef.current = false
    await logout()
    storeLogout()
  }, [logout, storeLogout])

  return {
    login,
    logout: handleLogout,
    user: privyUser,
    authenticated,
    ready,
  }
}

/**
 * Initialize the API client for development mode (no Privy).
 * Call with a user ID from the seed data.
 */
export function initDevAuth(userId: string) {
  setDevToken(userId)
}
