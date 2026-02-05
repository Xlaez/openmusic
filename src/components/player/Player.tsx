import { useEffect } from 'react'
import { usePlayerStore } from '@/store/player'
import { AudioEngine } from './AudioEngine'
import { CompactPlayer } from './CompactPlayer'
import { ExpandedPlayer } from './ExpandedPlayer'
import { QueuePanel } from './QueuePanel'
import { LyricsPanel } from './LyricsPanel'
import { cn } from '@/lib/utils/cn'

export function Player() {
  const {
    currentTrack,
    isExpanded,
    isQueueOpen,
    isLyricsOpen,
    togglePlay,
    setVolume,
    volume,
    nextTrack,
    prevTrack,
    toggleMute,
    toggleLyrics,
    toggleQueue,
  } = usePlayerStore()

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      switch (e.code) {
        case 'Space':
          e.preventDefault()
          togglePlay()
          break
        case 'ArrowRight':
          // Only skip track for now, seek handled natively maybe?
          // Request said Arrow Right = +5s.
          // Since we don't have seekRelative action exposed directly, we'd need to get state.
          // We can access store directly.
          if (e.metaKey || e.ctrlKey) nextTrack()
          else usePlayerStore.getState().seekTo(usePlayerStore.getState().currentTime + 5)
          break
        case 'ArrowLeft':
          if (e.metaKey || e.ctrlKey) prevTrack()
          else usePlayerStore.getState().seekTo(usePlayerStore.getState().currentTime - 5)
          break
        case 'ArrowUp':
          e.preventDefault()
          setVolume(Math.min(100, volume + 10))
          break
        case 'ArrowDown':
          e.preventDefault()
          setVolume(Math.max(0, volume - 10))
          break
        case 'KeyM':
          toggleMute()
          break
        case 'KeyL':
          toggleLyrics()
          break
        case 'KeyQ':
          toggleQueue()
          break
        case 'KeyN':
          nextTrack()
          break
        case 'KeyP':
          prevTrack()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [togglePlay, nextTrack, prevTrack, toggleMute, toggleLyrics, toggleQueue, setVolume, volume])

  if (!currentTrack) {
    // Even if hidden, keep audio engine mounted so it can clean up or be ready?
    // AudioEngine handles !currentTrack gracefully.
    return <AudioEngine />
  }

  return (
    <>
      <AudioEngine />

      {/* Expanded Player Overlay */}
      {isExpanded && <ExpandedPlayer />}

      {/* Persistent Bar Position - Fixed Bottom */}
      {!isExpanded && (
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <CompactPlayer />
        </div>
      )}

      {/* Side Panels (Queue / Lyrics) */}
      {/* Show these as overlays on top of everything, sliding from right */}
      {/* On desktop, they might push content? Request said "Right sidebar overlay" */}

      <div
        className={cn(
          'fixed right-0 w-full md:w-96 transform transition-transform duration-300 shadow-2xl bg-background-primary',
          isExpanded ? 'top-0 bottom-0 z-[70]' : 'top-0 bottom-20 z-[55]',
          isQueueOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <QueuePanel />
      </div>

      <div
        className={cn(
          'fixed right-0 w-full md:w-96 transform transition-transform duration-300 shadow-2xl bg-background-primary',
          isExpanded ? 'top-0 bottom-0 z-[70]' : 'top-0 bottom-20 z-[55]',
          isLyricsOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <LyricsPanel />
      </div>

      {/* If Expanded, panels might need different positioning (full height?) */}
      {/* Request: "Tabs at bottom" in Expanded. Usually that implies switching the view IN the expanded player. */}
      {/* But here I have separate sidebars. */}
      {/* Optimization: If Expanded, these panels could render INSIDE ExpandedPlayer layout or just be hidden. */}
      {/* For now, I'll keep them as global sidebars which works fine for Compact mode. */}
      {/* If Expanded is open, maybe these should be separate modals? */}
      {/* The ExpandedPlayer currently has buttons to toggle them. Let's make them high Z-index so they appear over ExpandedPlayer if open? */}
      {/* Or ExpandedPlayer should render them internally. */}
      {/* Given styling, sidebars over expanded video/art looks good (YouTube style). But YouTube Music mobile usually flips the main view to Lyric view. */}
      {/* Let's adjust z-index to be > ExpandedPlayer (60). */}
    </>
  )
}
