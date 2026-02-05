import { useState, useRef, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { User, Wallet, Settings, LogOut, ChevronDown, Sparkles } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { useAuth } from '@/lib/auth/useAuth'
import { cn } from '@/lib/utils/cn'

export function UserMenu() {
  const { user } = useAuthStore()
  const { logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!user) return null

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-white/5 border border-white/5 hover:border-white/10 transition-all',
          isOpen && 'border-primary bg-primary/10',
        )}
      >
        <div className="h-8 w-8 rounded-full bg-background overflow-hidden border border-white/10">
          <img
            src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
            alt={user.displayName}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="hidden lg:block text-left">
          <p className="text-xs font-extrabold text-white leading-tight truncate max-w-[80px]">
            {user.displayName || user.username}
          </p>
          <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider leading-tight">
            {user.role}
          </p>
        </div>
        <ChevronDown
          className={cn('h-4 w-4 text-text-muted transition-transform', isOpen && 'rotate-180')}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-background-card border border-white/10 rounded-2xl shadow-2xl p-2 z-[200] animate-in fade-in zoom-in-95 duration-200">
          {/* Header Info */}
          <div className="px-4 py-4 border-b border-white/5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl overflow-hidden border border-white/10">
                <img
                  src={
                    user.avatar ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`
                  }
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-white truncate">
                  {user.displayName || user.username}
                </p>
                <p className="text-[10px] text-text-muted font-mono">
                  {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="px-3 py-2 bg-white/5 rounded-xl border border-white/5">
                <p className="text-[9px] text-text-muted uppercase font-bold tracking-widest">
                  USDC
                </p>
                <p className="text-xs font-bold text-white">${user.balance.usdc.toFixed(2)}</p>
              </div>
              <div className="px-3 py-2 bg-white/5 rounded-xl border border-white/5">
                <p className="text-[9px] text-text-muted uppercase font-bold tracking-widest">
                  USDT
                </p>
                <p className="text-xs font-bold text-white">${user.balance.usdt.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2 space-y-1">
            <Link
              to="/profile"
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-text-secondary hover:text-white hover:bg-white/5 rounded-xl transition-all group"
              onClick={() => setIsOpen(false)}
            >
              <User className="h-4 w-4 group-hover:text-primary transition-colors" />
              Profile
            </Link>
            <Link
              to="/wallet"
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-text-secondary hover:text-white hover:bg-white/5 rounded-xl transition-all group"
              onClick={() => setIsOpen(false)}
            >
              <Wallet className="h-4 w-4 group-hover:text-primary transition-colors" />
              Wallet
            </Link>
            <Link
              to="/settings"
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-text-secondary hover:text-white hover:bg-white/5 rounded-xl transition-all group"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="h-4 w-4 group-hover:text-primary transition-colors" />
              Settings
            </Link>
            <div className="px-4 py-2.5 flex items-center gap-3 text-xs font-bold text-primary bg-primary/5 rounded-xl border border-primary/10 mx-1">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Beta Access Active</span>
            </div>
          </div>

          {/* Logout */}
          <div className="pt-2 border-t border-white/5">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-500/5 rounded-xl transition-all"
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
