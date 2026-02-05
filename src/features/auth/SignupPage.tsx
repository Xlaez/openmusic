import { useNavigate } from '@tanstack/react-router'
import { RoleSelection } from './RoleSelection'
import { useAuth } from '@/lib/auth/useAuth'
import type { UserRole } from '@/types'
import { Disc } from 'lucide-react'

export function SignupPage() {
  const navigate = useNavigate()
  const { login, authenticated } = useAuth()

  const handleRoleSelect = (role: UserRole) => {
    localStorage.setItem('user-role', role)
    login()
  }

  // If already authenticated, redirect to home/dashboard
  if (authenticated) {
    const role = localStorage.getItem('user-role')
    if (role === 'artist') {
      navigate({ to: '/dashboard' })
    } else {
      navigate({ to: '/' })
    }
    return null
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="mb-12 flex items-center gap-3">
        <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
          <Disc className="h-7 w-7 text-white" />
        </div>
        <span className="text-3xl font-bold tracking-tighter text-white">OPEN MUSIC</span>
      </div>

      <RoleSelection onSelect={handleRoleSelect} />

      <p className="mt-8 text-sm text-text-muted">
        Already have an account?{' '}
        <button onClick={() => login()} className="text-primary font-bold hover:underline">
          Log in here
        </button>
      </p>
    </div>
  )
}
