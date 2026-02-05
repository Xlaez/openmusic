import { useRef } from 'react'
import { cn } from '@/lib/utils/cn'

interface ProgressBarProps {
  current: number
  duration: number
  onSeek: (time: number) => void
  showTime?: boolean
  className?: string
}

export function ProgressBar({
  current,
  duration,
  onSeek,
  showTime = true,
  className,
}: ProgressBarProps) {
  const progressRef = useRef<HTMLDivElement>(null)

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || duration <= 0) return
    const rect = progressRef.current.getBoundingClientRect()
    const percent = Math.min(Math.max(0, e.clientX - rect.left), rect.width) / rect.width
    onSeek(percent * duration)
  }

  const percent = duration > 0 ? (current / duration) * 100 : 0

  return (
    <div className={cn('flex items-center gap-2 w-full group/seek', className)}>
      {showTime && (
        <span className="text-xs text-text-muted w-10 text-right font-variant-numeric tabular-nums">
          {formatTime(current)}
        </span>
      )}

      <div
        ref={progressRef}
        className="relative flex-1 h-1 bg-white/10 rounded-full cursor-pointer hover:h-1.5 transition-all"
        onClick={handleSeek}
      >
        <div
          className="absolute top-0 left-0 h-full bg-primary rounded-full group-hover/seek:bg-primary/80"
          style={{ width: `${percent}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 bg-white h-3 w-3 rounded-full opacity-0 group-hover/seek:opacity-100 transition-opacity shadow-sm pointer-events-none"
          style={{ left: `${percent}%` }}
        />
      </div>

      {showTime && (
        <span className="text-xs text-text-muted w-10 text-left font-variant-numeric tabular-nums">
          {formatTime(duration)}
        </span>
      )}
    </div>
  )
}
