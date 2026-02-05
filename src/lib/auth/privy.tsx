import { PrivyProvider } from '@privy-io/react-auth'
import type { ReactNode } from 'react'

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <PrivyProvider
      appId="clwpv6k9n0000000000000000" // Placeholder ID for dev
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
      {children}
    </PrivyProvider>
  )
}
