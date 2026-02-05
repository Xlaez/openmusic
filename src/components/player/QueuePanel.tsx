import { usePlayerStore } from '@/store/player'
import type { Track } from '@/store/player'
import { X, GripVertical } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import { useMemo } from 'react'

interface SortableTrackProps {
  track: Track
  id: string
  isActive?: boolean
  onRemove: () => void
  onPlay: () => void
}

function SortableTrack({ track, id, isActive, onRemove, onPlay }: SortableTrackProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors touch-none',
        isActive && 'bg-white/10',
        isDragging && 'opacity-50',
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="text-text-muted hover:text-white cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div className="relative h-10 w-10 flex-shrink-0 cursor-pointer" onClick={onPlay}>
        <img src={track.coverImage} className="h-full w-full object-cover rounded-md" />
        {isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-md">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0" onClick={onPlay}>
        <p
          className={cn(
            'text-sm font-medium truncate cursor-pointer',
            isActive ? 'text-primary' : 'text-white',
          )}
        >
          {track.title}
        </p>
        <p className="text-xs text-text-muted truncate">{track.artist.name}</p>
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="opacity-0 group-hover:opacity-100 h-8 w-8 p-0 text-text-muted hover:text-white"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}

export function QueuePanel() {
  const { queue, currentTrack, reorderQueue, removeFromQueue, playTrack, clearQueue, toggleQueue } =
    usePlayerStore()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const items = useMemo(() => queue.map((t, i) => `${t.id}-${i}`), [queue])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id && over) {
      const oldIndex = items.indexOf(String(active.id))
      const newIndex = items.indexOf(String(over.id))
      if (oldIndex !== -1 && newIndex !== -1) {
        reorderQueue(arrayMove(queue, oldIndex, newIndex))
      }
    }
  }

  if (queue.length === 0) {
    return (
      <div className="h-full flex flex-col p-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-white">Queue</h2>
          <Button variant="ghost" size="sm" onClick={toggleQueue}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1 flex items-center justify-center text-text-muted">
          Queue is empty
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-background-primary/95 backdrop-blur-xl border-l border-white/10">
      <div className="flex items-center justify-between p-6 pb-2">
        <div>
          <h2 className="text-xl font-bold text-white">Queue</h2>
          <p className="text-xs text-text-muted uppercase tracking-wider mt-1">
            {queue.length} Tracks
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={clearQueue}>
            Clear
          </Button>
          <Button variant="ghost" size="sm" onClick={toggleQueue}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <div className="space-y-1">
              {queue.map((track, i) => (
                <SortableTrack
                  key={`${track.id}-${i}`}
                  id={`${track.id}-${i}`}
                  track={track}
                  isActive={currentTrack?.id === track.id}
                  onRemove={() => removeFromQueue(i)}
                  onPlay={() => playTrack(track, queue)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  )
}
