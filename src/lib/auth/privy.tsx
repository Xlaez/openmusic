import { PrivyProvider, usePrivy, useWallets } from '@privy-io/react-auth'
import { createContext, useContext, type ReactNode } from 'react'

const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID

/** True when Privy credentials are present in environment. */
export const PRIVY_CONFIGURED = Boolean(PRIVY_APP_ID)

// ─────────────────────────────────────────────────────────────────────────────
// Unified auth context — always provided, so useAuthContext() is always safe
// to call with no conditional hook invocations anywhere.
// ─────────────────────────────────────────────────────────────────────────────

export interface AuthCtxValue {
  login: () => void
  logout: () => Promise<void>
  user: ReturnType<typeof usePrivy>['user'] | null
  authenticated: boolean
  ready: boolean
  wallets: ReturnType<typeof useWallets>['wallets']
  getAccessToken: ReturnType<typeof usePrivy>['getAccessToken'] | undefined
}

const AuthCtx = createContext<AuthCtxValue>({
  login: () => { },
  logout: async () => { },
  user: null,
  authenticated: false,
  ready: true,
  wallets: [],
  getAccessToken: undefined,
})

export function useAuthContext() {
  return useContext(AuthCtx)
}

// ─── Inner bridge component (only rendered inside PrivyProvider) ─────────────

function PrivyBridge({ children }: { children: ReactNode }) {
  const { login, logout, user, authenticated, ready, getAccessToken } = usePrivy()
  const { wallets } = useWallets()
  const value: AuthCtxValue = { login, logout, user, authenticated, ready, wallets, getAccessToken }
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

// ─── Public provider ─────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  if (!PRIVY_CONFIGURED) {
    if (import.meta.env.DEV) {
      console.warn(
        '[AuthProvider] VITE_PRIVY_APP_ID is not set. ' +
        'Copy .env.example to .env and add your Privy App ID to enable authentication.',
      )
    }
    // AuthCtx default values (ready:true, authenticated:false) used as-is.
    return <>{children}</>
  }

  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        loginMethods: ['email', 'google', 'wallet'],
        appearance: {
          theme: 'dark',
          accentColor: '#6B46C1',
          showWalletLoginFirst: false,
        },
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'users-without-wallets',
          },
        },
      }}
    >
      <PrivyBridge>{children}</PrivyBridge>
    </PrivyProvider>
  )
}
