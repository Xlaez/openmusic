import { useState } from 'react'
import { RefreshCcw, DollarSign, UserPlus, X, Box, ShieldAlert } from 'lucide-react'
import { devUtils } from '@/lib/utils/dev'

export function DevToolbar() {
  const [isVisible, setIsVisible] = useState(false)

  if (process.env.NODE_ENV === 'production') return null

  return (
    <div className="fixed bottom-24 right-6 z-[9999]">
      {isVisible ? (
        <div className="bg-background-card border border-white/10 rounded-2xl shadow-2xl p-4 w-60 animate-in slide-in-from-right-4 fade-in duration-300">
          <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
            <div className="flex items-center gap-2 text-primary">
              <ShieldAlert className="h-4 w-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white">
                Dev Console
              </span>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-white/5 rounded-full text-text-muted"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => devUtils.addTestFunds(100)}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-primary/10 hover:border-primary/20 border border-transparent transition-all group"
            >
              <span className="text-xs font-bold text-text-secondary group-hover:text-white">
                Add $100 USDC
              </span>
              <DollarSign className="h-4 w-4 text-green-400" />
            </button>
            <button
              onClick={() => devUtils.grantArtistRole()}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-primary/10 hover:border-primary/20 border border-transparent transition-all group"
            >
              <span className="text-xs font-bold text-text-secondary group-hover:text-white">
                Become Artist
              </span>
              <UserPlus className="h-4 w-4 text-blue-400" />
            </button>
            <button
              onClick={() => devUtils.resetMockData()}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition-all group"
            >
              <span className="text-xs font-bold text-text-secondary group-hover:text-white">
                Reset App Data
              </span>
              <RefreshCcw className="h-4 w-4 text-red-500" />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsVisible(true)}
          className="h-12 w-12 bg-background-card border border-white/10 rounded-2xl flex items-center justify-center text-primary shadow-2xl hover:scale-110 active:scale-95 transition-all hover:border-primary/50 group"
          title="Open Dev Toolbar"
        >
          <Box className="h-6 w-6 group-hover:rotate-12 transition-transform" />
        </button>
      )}
    </div>
  )
}
