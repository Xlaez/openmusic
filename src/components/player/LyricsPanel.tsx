import { useEffect, useRef, useState } from 'react'
import { usePlayerStore } from '@/store/player'
import { X, Sparkles, Loader2, Music2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import { geminiService } from '@/lib/ai/gemini'
import { toast } from 'sonner'

export function LyricsPanel() {
  const { currentTrack, currentTime, toggleLyrics, setTimedLyrics } = usePlayerStore()
  const [isGenerating, setIsGenerating] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const activeLineRef = useRef<HTMLDivElement>(null)

  const handleGenerate = async () => {
    if (!currentTrack) return

    setIsGenerating(true)
    const toastId = toast.loading('Gemini 3 is analyzing audio...')
    try {
      const lyrics = await geminiService.generateTimedLyrics(currentTrack.fileUrl)
      setTimedLyrics(lyrics)
      toast.success('Lyrics generated and synced!', { id: toastId })
    } catch (error) {
      console.error(error)
      toast.error('Failed to generate lyrics. Check your API key.', { id: toastId })
    } finally {
      setIsGenerating(false)
    }
  }

  // Find the current active line based on playback time
  const activeIndex = currentTrack?.timedLyrics
    ? [...currentTrack.timedLyrics].reverse().findIndex((line) => currentTime >= line.time)
    : -1

  const finalActiveIndex =
    activeIndex !== -1 ? currentTrack!.timedLyrics!.length - 1 - activeIndex : -1

  // Auto-scroll to active line
  useEffect(() => {
    if (activeLineRef.current && scrollContainerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [finalActiveIndex])

  if (!currentTrack) return null

  const hasTimedLyrics = currentTrack.timedLyrics && currentTrack.timedLyrics.length > 0

  return (
    <div className="h-full flex flex-col bg-background-primary/95 backdrop-blur-2xl border-l border-white/10 p-6 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-white">Lyrics</h2>
          <div className="flex items-center gap-1.5 mt-1">
            <div
              className={`h-1.5 w-1.5 rounded-full ${hasTimedLyrics ? 'bg-green-500' : 'bg-yellow-500'}`}
            />
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
              {hasTimedLyrics ? 'Synced' : 'Not Synced'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasTimedLyrics && !isGenerating && (
            <button
              onClick={handleGenerate}
              className="p-2 hover:bg-primary/20 rounded-full text-primary transition-colors group"
              title="Re-generate with Gemini"
            >
              <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform" />
            </button>
          )}
          <Button variant="ghost" size="sm" onClick={toggleLyrics} className="rounded-full">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto custom-scrollbar text-left space-y-8 pb-32"
      >
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
              <div className="relative h-20 w-20 bg-background-card border border-white/10 rounded-3xl flex items-center justify-center shadow-2xl">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-primary animate-bounce delay-100" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-lg font-bold text-white">Gemini 3</p>
              <p className="text-sm text-text-muted leading-relaxed max-w-[200px]">
                Analyzing vocal patterns and mapping timestamps...
              </p>
            </div>
          </div>
        ) : hasTimedLyrics ? (
          currentTrack.timedLyrics!.map((line, i) => {
            const isActive = i === finalActiveIndex
            const isPassed = i < finalActiveIndex

            return (
              <div
                key={`${line.time}-${i}`}
                ref={isActive ? activeLineRef : null}
                className={cn(
                  'text-2xl md:text-3xl font-bold transition-all duration-700 cursor-default select-none py-2 px-4 rounded-2xl hover:bg-white/5',
                  isActive
                    ? 'text-white scale-105 origin-left opacity-100 translate-x-2'
                    : isPassed
                      ? 'text-white/40 opacity-80'
                      : 'text-white/20 opacity-60',
                )}
              >
                {line.text}
              </div>
            )
          })
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Music2 className="h-10 w-10 text-primary/40" />
            </div>

            <div className="space-y-2 px-4">
              <h3 className="text-2xl font-bold text-white">Unlock Lyrics Sync</h3>
              <p className="text-text-muted leading-relaxed">
                Experience high-fidelity synced lyrics powered by Google's most advanced AI.
              </p>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full max-w-[280px] h-16 rounded-2xl font-extrabold text-lg gap-3 shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all group overflow-hidden relative"
              onClick={handleGenerate}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <Sparkles className="h-6 w-6 group-hover:rotate-12 transition-transform" />
              Generate with Gemini
            </Button>

            {currentTrack.lyrics && (
              <div className="pt-8 w-full italic text-white/20 select-none px-4">
                <p className="text-[10px] uppercase font-bold tracking-tighter mb-4 opacity-50">
                  Static Backup Available
                </p>
                <p className="text-sm line-clamp-3">{currentTrack.lyrics}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer / Branding */}
      <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
        <span>MetaData v2.4</span>
        <div className="flex items-center gap-1.5 text-primary">
          <Sparkles className="h-3 w-3" />
          <span>Gemini Pro</span>
        </div>
      </div>
    </div>
  )
}
