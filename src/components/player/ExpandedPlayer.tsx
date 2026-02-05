import { usePlayerStore } from '@/store/player'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  ChevronDown,
  ListMusic,
  Mic2,
  MoreVertical,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from './ProgressBar'
import { cn } from '@/lib/utils/cn'

export function ExpandedPlayer() {
  const store = usePlayerStore()
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    nextTrack,
    prevTrack,
    currentTime,
    duration,
    seekTo,
    shuffle,
    repeat,
    toggleShuffle,
    toggleRepeat,
    closeExpanded,
    toggleLyrics,
    toggleQueue,
  } = store

  if (!currentTrack) return null

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-background-primary transition-all duration-500 animate-in slide-in-from-bottom-full fade-in">
      {/* Backdrop Blur */}
      <div
        className="absolute inset-0 z-[-1] opacity-30 blur-[100px] scale-150 transition-colors duration-1000"
        style={{
          backgroundImage: `url(${currentTrack.coverImage})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      />
      <div className="absolute inset-0 z-[-1] bg-black/60" />

      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <Button variant="ghost" className="text-white hover:bg-white/10" onClick={closeExpanded}>
          <ChevronDown className="h-6 w-6 mr-2" />
          <span className="text-sm font-medium uppercase tracking-wider">Now Playing</span>
        </Button>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full px-8 gap-8 md:gap-12">
        {/* Cover Art */}
        <div className="relative aspect-square w-full max-w-[320px] md:max-w-[480px] shadow-2xl rounded-xl overflow-hidden group">
          <img
            src={currentTrack.coverImage}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Info & Controls */}
        <div className="w-full space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
                {currentTrack.title}
              </h1>
              <h2 className="text-lg md:text-xl text-text-secondary">{currentTrack.artist.name}</h2>
            </div>
            {/* Like button could go here */}
          </div>

          <div className="space-y-4">
            <ProgressBar
              current={currentTime}
              duration={duration}
              onSeek={seekTo}
              className="h-2"
            />

            <div className="flex items-center justify-between max-w-2xl mx-auto">
              <Button
                variant="ghost"
                className={cn('h-12 w-12', shuffle && 'text-primary')}
                onClick={toggleShuffle}
              >
                <Shuffle className="h-6 w-6" />
              </Button>

              <Button variant="ghost" className="h-12 w-12" onClick={prevTrack}>
                <SkipBack className="h-8 w-8 fill-current" />
              </Button>

              <Button
                variant="primary"
                className="h-20 w-20 rounded-full p-0 shadow-xl hover:scale-105 transition-transform"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <Pause className="h-10 w-10 fill-current" />
                ) : (
                  <Play className="h-10 w-10 fill-current pl-1" />
                )}
              </Button>

              <Button variant="ghost" className="h-12 w-12" onClick={nextTrack}>
                <SkipForward className="h-8 w-8 fill-current" />
              </Button>

              <Button
                variant="ghost"
                className={cn('h-12 w-12', repeat !== 'off' && 'text-primary')}
                onClick={toggleRepeat}
              >
                <Repeat className="h-6 w-6" />
                {repeat === 'one' && (
                  <span className="absolute text-[10px] font-bold top-2 right-2">1</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Tabs */}
      <div className="flex justify-center gap-8 pb-12 pt-4">
        <Button
          variant="ghost"
          className="flex-col gap-1 h-auto py-2 text-text-muted hover:text-white"
          onClick={toggleLyrics}
        >
          <Mic2 className="h-5 w-5" />
          <span className="text-xs uppercase tracking-wide">Lyrics</span>
        </Button>
        <Button
          variant="ghost"
          className="flex-col gap-1 h-auto py-2 text-text-muted hover:text-white"
          onClick={toggleQueue}
        >
          <ListMusic className="h-5 w-5" />
          <span className="text-xs uppercase tracking-wide">Queue</span>
        </Button>
      </div>
    </div>
  )
}
