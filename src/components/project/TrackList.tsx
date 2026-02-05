import type { Project, Track } from '@/types'
import { Play, Lock, MoreHorizontal, Pause } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import { usePlayerStore } from '@/store/player'

interface TrackListProps {
  project: Project
  tracks: Track[]
  isOwned: boolean
}

export function TrackList({ project, tracks, isOwned }: TrackListProps) {
  const { playTrack, currentTrack, isPlaying, togglePlay } = usePlayerStore()

  const handlePlay = (track: Track) => {
    if (!isOwned) return
    if (currentTrack?.id === track.id) {
      togglePlay()
    } else {
      playTrack(
        {
          id: track.id,
          title: track.title,
          artist: {
            id: project.artist.id,
            name: project.artist.displayName,
            avatar: project.artist.coverImage,
          }, // Map domain artist to simple artist
          coverImage: project.coverImage,
          duration: track.duration,
          fileUrl: track.fileUrl,
          projectId: project.id,
        },
        tracks.map((t) => ({
          id: t.id,
          title: t.title,
          artist: {
            id: project.artist.id,
            name: project.artist.displayName,
            avatar: project.artist.coverImage,
          },
          coverImage: project.coverImage,
          duration: t.duration,
          fileUrl: t.fileUrl,
          projectId: project.id,
        })),
      )
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="w-full">
      <div className="flex items-center text-xs uppercase tracking-wider text-text-muted px-4 py-2 border-b border-white/5 mb-2">
        <div className="w-10 text-center">#</div>
        <div className="flex-1">Title</div>
        <div className="w-16 text-right">Time</div>
        <div className="w-12"></div>
      </div>

      <div className="space-y-1">
        {tracks.map((track, i) => {
          const isCurrent = currentTrack?.id === track.id

          return (
            <div
              key={track.id}
              className={cn(
                'group flex items-center px-4 py-3 rounded-lg border border-transparent transition-colors',
                isOwned ? 'hover:bg-white/5 cursor-pointer' : 'opacity-60',
                isCurrent && 'bg-white/10 border-white/5',
              )}
              onClick={() => handlePlay(track)}
            >
              <div className="w-10 text-center text-sm text-text-muted flex justify-center">
                {isCurrent && isPlaying ? (
                  <div className="flex items-end gap-[2px] h-3">
                    <div className="w-[3px] bg-primary animate-[music-bar_0.5s_ease-in-out_infinite]" />
                    <div className="w-[3px] bg-primary animate-[music-bar_0.6s_ease-in-out_infinite_0.1s]" />
                    <div className="w-[3px] bg-primary animate-[music-bar_0.7s_ease-in-out_infinite_0.2s]" />
                  </div>
                ) : (
                  <span
                    className={cn('group-hover:hidden', isCurrent && 'text-primary font-medium')}
                  >
                    {i + 1}
                  </span>
                )}

                <div
                  className={cn(
                    'hidden group-hover:block',
                    !isOwned && 'text-text-muted',
                    isCurrent ? 'block' : '',
                  )}
                >
                  {isOwned ? (
                    isCurrent && isPlaying ? (
                      <Pause className="h-4 w-4 fill-current text-primary" />
                    ) : (
                      <Play className="h-4 w-4 fill-current text-white" />
                    )
                  ) : (
                    <Lock className="h-4 w-4" />
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0 pr-4">
                <p
                  className={cn(
                    'text-base font-medium truncate',
                    isCurrent ? 'text-primary' : 'text-white',
                  )}
                >
                  {track.title}
                </p>
                <p className="text-xs text-text-muted truncate group-hover:text-text-secondary transition-colors">
                  {project.artist.displayName}
                </p>
              </div>

              <div className="w-16 text-right text-sm text-text-muted tabular-nums">
                {formatTime(track.duration)}
              </div>

              <div className="w-12 flex justify-end">
                {isOwned && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 p-0 text-text-muted hover:text-white"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
