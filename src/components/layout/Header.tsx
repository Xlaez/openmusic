import { useState, useRef, useEffect } from 'react'
import { Bell, Menu, Disc, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/auth'
import { useUIStore } from '@/store/ui'
import { SearchBar } from '@/components/layout/SearchBar'
import { UserMenu } from '@/components/layout/UserMenu'
import { NotificationsCard } from '@/components/layout/NotificationsCard'
import { useAuth } from '@/lib/auth/useAuth'
import { Link } from '@tanstack/react-router'

export function Header() {
  const { user, isAuthenticated } = useAuthStore()
  const { login } = useAuth()
  const { toggleMobileMenu, mobileMenuOpen } = useUIStore()
  const [showNotifications, setShowNotifications] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="flex h-16 items-center justify-between border-b border-white/5 bg-background-primary/80 px-6 backdrop-blur-xl sticky top-0 z-40 transition-all duration-300">
      <div className="flex items-center gap-4 flex-1">
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden -ml-2 h-10 w-10 p-0 rounded-xl hover:bg-white/5 transition-all active:scale-95"
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? <X className="h-5 w-5 text-primary" /> : <Menu className="h-5 w-5" />}
        </Button>
        <Link to="/" className="md:hidden flex items-center gap-2">
          <Disc className="h-6 w-6 text-primary" />
        </Link>
        <div className="hidden sm:block w-full max-w-md">
          <SearchBar />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-6 relative">
        <div ref={notificationRef}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative rounded-full h-10 w-10 p-0 transition-all ${
              showNotifications
                ? 'bg-primary/10 text-primary'
                : 'text-text-secondary hover:text-white'
            }`}
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-primary border-2 border-background-primary shadow-[0_0_8px_rgba(107,70,193,0.5)]" />
          </Button>

          {showNotifications && <NotificationsCard onClose={() => setShowNotifications(false)} />}
        </div>

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
