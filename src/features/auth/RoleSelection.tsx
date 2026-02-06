import { useState } from 'react'
import { Music, Mic2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import type { UserRole } from '@/types'

interface RoleSelectionProps {
  onSelect: (role: UserRole) => void
}

export function RoleSelection({ onSelect }: RoleSelectionProps) {
  const [selected, setSelected] = useState<UserRole | null>(null)

  return (
    <div className="max-w-md w-full mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-white tracking-tight">Join OpenMusic</h1>
        <p className="text-text-secondary text-lg">Choose your path in the ecosystem.</p>
      </div>

      <div className="grid gap-4">
        <button
          onClick={() => setSelected('listener')}
          className={cn(
            'group relative flex items-center gap-6 p-6 rounded-2xl border-2 transition-all duration-300 text-left',
            selected === 'listener'
              ? 'bg-primary/20 border-primary shadow-[0_0_20px_rgba(107,70,193,0.3)]'
              : 'bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/10',
          )}
        >
          <div
            className={cn(
              'h-14 w-14 rounded-xl flex items-center justify-center transition-colors duration-300',
              selected === 'listener'
                ? 'bg-primary text-white'
                : 'bg-white/5 text-text-secondary group-hover:text-white',
            )}
          >
            <Music className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white text-xl">Music Listener</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Collect limited releases and support your favorite artists.
            </p>
          </div>
        </button>

        <button
          onClick={() => setSelected('artist')}
          className={cn(
            'group relative flex items-center gap-6 p-6 rounded-2xl border-2 transition-all duration-300 text-left',
            selected === 'artist'
              ? 'bg-purple-500/20 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
              : 'bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/10',
          )}
        >
          <div
            className={cn(
              'h-14 w-14 rounded-xl flex items-center justify-center transition-colors duration-300',
              selected === 'artist'
                ? 'bg-purple-500 text-white'
                : 'bg-white/5 text-text-secondary group-hover:text-white',
            )}
          >
            <Mic2 className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white text-xl">Artist</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Upload your projects, set pricing, and keep 100% of your earnings.
            </p>
          </div>
        </button>
      </div>

      <Button
        variant="primary"
        size="lg"
        disabled={!selected}
        onClick={() => selected && onSelect(selected)}
        className="w-full h-14 rounded-xl text-lg font-bold gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all"
      >
        Continue
        <ArrowRight className="h-5 w-5" />
      </Button>
    </div>
  )
}
