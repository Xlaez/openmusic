import { Link, useNavigate } from '@tanstack/react-router'
import { Home, Compass, Library, Disc, Mic2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/auth'
import { useUIStore } from '@/store/ui'
import { toast } from 'sonner'

export function Sidebar() {
  const { user, updateProfile } = useAuthStore()
  const { toggleMobileMenu, mobileMenuOpen } = useUIStore()
  const navigate = useNavigate()

  const handleLinkClick = () => {
    if (mobileMenuOpen) {
      toggleMobileMenu()
    }
  }

  const handleSwitchProfile = () => {
    if (!user) return

    const newRole = user.role === 'artist' ? 'listener' : 'artist'
    updateProfile({ role: newRole })
    localStorage.setItem('user-role', newRole)

    toast.success(`Switched to ${newRole} mode`, {
      description:
        newRole === 'artist' ? 'You can now manage your dashboard.' : 'Explore music as a fan.',
      icon: newRole === 'artist' ? '🎨' : '🎧',
    })

    if (newRole === 'artist') {
      navigate({ to: '/dashboard' })
    } else {
      navigate({ to: '/' })
    }

    if (mobileMenuOpen) {
      toggleMobileMenu()
    }
  }

  const navItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Compass, label: 'Explore', href: '/explore' },
    { icon: Library, label: 'Library', href: '/library' },
  ]

  if (user?.role === 'artist') {
    navItems.push({ icon: Disc, label: 'Dashboard', href: '/dashboard' })
  }

  return (
    <div className="flex h-full w-[240px] flex-col border-r border-white/5 bg-background-card p-4">
      <div className="mb-8 flex items-center px-4 pt-2">
        <Disc className="mr-2 h-8 w-8 text-primary" />
        <span className="text-xl font-bold tracking-tight text-white">OpenMusic</span>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            search={item.href === '/explore' ? { filter: 'all', q: '' } : undefined}
            activeProps={{
              className: 'bg-white/10 text-white shadow-sm',
            }}
            inactiveProps={{
              className: 'text-text-secondary hover:text-white hover:bg-white/5',
            }}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200"
            onClick={handleLinkClick}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-8 px-4">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-text-muted mb-4">
          <span>Your Collection</span>
          <Button variant="ghost" size="sm" className="h-auto p-0 hover:bg-transparent">
            <Plus className="h-4 w-4 hover:text-white transition-colors" />
          </Button>
        </div>
        <div className="space-y-1">
          <Link
            to="/artist/$artistId"
            params={{ artistId: '1' }}
            className="flex items-center gap-3 rounded-xl px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-white/5 hover:text-white"
            onClick={handleLinkClick}
          >
            <Mic2 className="h-4 w-4" />
            <span>Liked Artists</span>
          </Link>
        </div>
      </div>

      <div className="mt-auto px-2 pb-4">
        <div className="rounded-2xl bg-gradient-to-br from-primary/20 to-purple-900/10 p-4 border border-white/5">
          <h4 className="font-semibold text-white">
            {user?.role === 'artist' ? 'Artist Dashboard' : 'Artist Mode'}
          </h4>
          <p className="mt-1 text-xs text-text-secondary leading-relaxed">
            {user?.role === 'artist'
              ? 'Manage your releases and view your earnings.'
              : 'Upload music and sell directly to your fans.'}
          </p>
          {user?.role === 'artist' ? (
            <div className="space-y-2 mt-3">
              <Link to="/dashboard" onClick={handleLinkClick} className="block">
                <Button size="sm" variant="primary" className="w-full rounded-lg h-10 font-bold">
                  Open Dashboard
                </Button>
              </Link>
              <button
                onClick={handleSwitchProfile}
                className="w-full text-[10px] font-bold text-text-muted hover:text-white uppercase tracking-widest transition-colors py-1"
              >
                Switch to Listener
              </button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="secondary"
              className="mt-3 w-full"
              onClick={handleSwitchProfile}
            >
              Switch Profile
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
