import { usePlayerStore } from '@/store/player'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function LyricsPanel() {
  const { currentTrack, toggleLyrics } = usePlayerStore()

  if (!currentTrack) return null

  return (
    <div className="h-full flex flex-col bg-background-primary/95 backdrop-blur-xl border-l border-white/10 p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-white">Lyrics</h2>
        <Button variant="ghost" size="sm" onClick={toggleLyrics}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar text-center text-lg md:text-xl font-medium leading-relaxed space-y-6 text-white/80">
        {currentTrack.lyrics ? (
          <div className="whitespace-pre-wrap">{currentTrack.lyrics}</div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-text-muted">
            <p>Lyrics not available for this track.</p>
          </div>
        )}
      </div>
    </div>
  )
}
