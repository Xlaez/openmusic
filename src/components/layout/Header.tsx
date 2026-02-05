import { Bell, Menu, Disc } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/auth'
import { useUIStore } from '@/store/ui'
import { SearchBar } from '@/components/layout/SearchBar'
import { UserMenu } from '@/components/layout/UserMenu'
import { useAuth } from '@/lib/auth/useAuth'
import { Link } from '@tanstack/react-router'

export function Header() {
  const { user, isAuthenticated } = useAuthStore()
  const { login } = useAuth()
  const { toggleSidebar } = useUIStore()

  return (
    <header className="flex h-16 items-center justify-between border-b border-white/5 bg-background-primary/80 px-6 backdrop-blur-xl sticky top-0 z-40 transition-all duration-300">
      <div className="flex items-center gap-4 flex-1">
        <Button variant="ghost" size="sm" className="md:hidden -ml-2" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
        <Link to="/" className="md:hidden flex items-center gap-2">
          <Disc className="h-6 w-6 text-primary" />
        </Link>
        <div className="hidden sm:block w-full max-w-md">
          <SearchBar />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        <Button
          variant="ghost"
          size="sm"
          className="relative rounded-full h-10 w-10 p-0 text-text-secondary hover:text-white"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-primary border-2 border-background-primary shadow-[0_0_8px_rgba(107,70,193,0.5)]" />
        </Button>

        {isAuthenticated && user ? (
          <UserMenu />
        ) : (
          <Button
            variant="primary"
            onClick={() => login()}
            className="px-6 rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
          >
            Login
          </Button>
        )}
      </div>
    </header>
  )
}
