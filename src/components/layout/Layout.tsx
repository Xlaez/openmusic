import { Outlet } from '@tanstack/react-router'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { Player } from '@/components/player/Player'
import { DevToolbar } from '@/components/dev/DevToolbar'
import { cn } from '@/lib/utils/cn'
import { useUIStore } from '@/store/ui'
import { useAuth } from '@/lib/auth/useAuth'
import { Disc, Loader2 } from 'lucide-react'

export function Layout() {
  const { sidebarCollapsed, mobileMenuOpen, toggleMobileMenu } = useUIStore()
  const { ready } = useAuth()

  if (!ready) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background-primary gap-6 animate-in fade-in duration-500">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150 animate-pulse" />
          <div className="h-20 w-20 bg-background-card border border-white/5 rounded-2xl flex items-center justify-center shadow-2xl relative z-10">
            <Disc className="h-10 w-10 text-primary animate-spin-slow" />
          </div>
        </div>
        <div className="space-y-2 text-center">
          <p className="text-xl font-bold text-white tracking-widest uppercase">OpenMusic</p>
          <div className="flex items-center gap-2 justify-center text-text-muted">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm font-medium">Syncing with server...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full flex-col bg-background-primary overflow-hidden font-sans text-text-primary selection:bg-primary/30 selection:text-white">
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-background-primary/60 backdrop-blur-sm z-[50] md:hidden animate-in fade-in duration-300"
            onClick={toggleMobileMenu}
          />
        )}

        {/* Sidebar wrapper */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-[60] md:static md:block transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] will-change-transform md:will-change-width',
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
            sidebarCollapsed ? 'md:w-0 md:overflow-hidden md:opacity-0' : 'md:w-[240px]',
          )}
        >
          <Sidebar />
        </aside>

        <main className="flex flex-1 flex-col min-w-0 bg-background-primary relative z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none h-[500px]" />

          <Header />

          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 scroll-smooth custom-scrollbar relative z-10">
            <div className="mx-auto max-w-7xl pb-10">
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      <Player />
      <DevToolbar />
    </div>
  )
}
