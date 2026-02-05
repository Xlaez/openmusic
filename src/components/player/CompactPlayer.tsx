import { usePlayerStore } from '@/store/player'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  VolumeX,
  ListMusic,
  ChevronUp,
  Mic2,
  Maximize2,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from './ProgressBar'
import { cn } from '@/lib/utils/cn'

export function CompactPlayer() {
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
    volume,
    setVolume,
    toggleMute,
    isMuted,
    shuffle,
    repeat,
    toggleShuffle,
    toggleRepeat,
    toggleQueue,
    toggleExpanded,
    toggleLyrics,
  } = store

  if (!currentTrack) return null

  return (
    <div className="h-20 bg-background-primary/95 backdrop-blur-xl border-t border-white/10 flex items-center px-4 justify-between transition-all duration-300 relative z-50">
      {/* Track Info */}
      <div
        className="flex items-center gap-4 w-[30%] min-w-0 group cursor-pointer"
        onClick={toggleExpanded}
      >
        <div className="relative h-14 w-14 group-hover:scale-105 transition-transform">
          <img
            src={currentTrack.coverImage}
            className="h-full w-full object-cover rounded-md shadow-md"
          />
          <div className="absolute top-1 right-1 bg-black/60 p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <Maximize2 className="h-3 w-3 text-white" />
          </div>
        </div>
        <div className="min-w-0">
          <h4 className="text-white font-medium truncate text-sm hover:underline">
            {currentTrack.title}
          </h4>
          <p className="text-text-muted text-xs truncate hover:text-white transition-colors">
            {currentTrack.artist.name}
          </p>
        </div>
      </div>

      {/* Controls & Progress - Center */}
      <div className="flex flex-col items-center flex-1 max-w-[40%] gap-1">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'text-text-muted hover:text-white transition-colors h-8 w-8 p-0',
              shuffle && 'text-primary hover:text-primary',
            )}
            onClick={toggleShuffle}
          >
            <Shuffle className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:text-primary transition-colors h-8 w-8 p-0"
            onClick={prevTrack}
          >
            <SkipBack className="h-5 w-5 fill-current" />
          </Button>

          <Button
            variant="primary"
            size="md"
            className="rounded-full h-10 w-10 p-0 hover:scale-105 transition-transform shadow-lg"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 fill-current" />
            ) : (
              <Play className="h-5 w-5 fill-current pl-0.5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:text-primary transition-colors h-8 w-8 p-0"
            onClick={nextTrack}
          >
            <SkipForward className="h-5 w-5 fill-current" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'text-text-muted hover:text-white transition-colors h-8 w-8 p-0',
              repeat !== 'off' && 'text-primary hover:text-primary',
            )}
            onClick={toggleRepeat}
          >
            <Repeat className="h-4 w-4" />
            {repeat === 'one' && (
              <span className="absolute text-[8px] font-bold top-[6px] right-[6px]">1</span>
            )}
          </Button>
        </div>

        <div className="w-full px-4">
          <ProgressBar current={currentTime} duration={duration} onSeek={seekTo} className="h-1" />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center justify-end gap-2 w-[30%] min-w-0">
        <Button
          variant="ghost"
          size="sm"
          className="hidden lg:flex text-text-muted hover:text-white h-9 w-9 p-0"
          onClick={toggleLyrics}
          title="Lyrics"
        >
          <Mic2 className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="text-text-muted hover:text-white h-9 w-9 p-0"
          onClick={toggleQueue}
          title="Queue"
        >
          <ListMusic className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2 group/vol w-32">
          <Button
            variant="ghost"
            size="sm"
            className="text-text-muted hover:text-white h-9 w-9 p-0"
            onClick={toggleMute}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="h-1 bg-white/10 rounded-lg appearance-none cursor-pointer flex-1 accent-white hover:accent-primary"
          />
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden text-text-muted"
          onClick={toggleExpanded}
        >
          <ChevronUp className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
