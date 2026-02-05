import { RouterProvider } from '@tanstack/react-router'
import { router } from './routes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './lib/auth/privy'
import { Toaster } from 'sonner'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster position="bottom-right" theme="dark" closeButton richColors />
      </AuthProvider>
    </QueryClientProvider>
  )
}
