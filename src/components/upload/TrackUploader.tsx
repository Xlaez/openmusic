import { useState } from 'react'
import { FileDropzone } from '@/components/ui/FileDropzone'
import { FileMusic, X, GripVertical, Edit2, Check, Music } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { DragEndEvent } from '@dnd-kit/core'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface UploadedTrack {
  id: string
  title: string
  duration: number
  file: File
  lyrics?: string
}

interface TrackUploaderProps {
  tracks: UploadedTrack[]
  onChange: (tracks: UploadedTrack[]) => void
}

// Sortable Item Component
function SortableTrackItem({
  track,
  index,
  onRemove,
  onEdit,
}: {
  track: UploadedTrack
  index: number
  onRemove: () => void
  onEdit: (id: string, newTitle: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: track.id,
  })
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(track.title)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
  }

  const handleSave = () => {
    onEdit(track.id, editTitle)
    setIsEditing(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-4 bg-white/5 border border-white/5 p-3 rounded-xl group transition-all',
        isDragging ? 'opacity-50 scale-95 shadow-2xl' : 'hover:border-white/10',
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="text-text-muted hover:text-white cursor-grab active:cursor-grabbing px-1"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div className="h-10 w-10 flex items-center justify-center bg-primary/10 rounded-lg text-primary shrink-0">
        <Music className="h-5 w-5" />
      </div>

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              autoFocus
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              className="flex-1 bg-black/20 border border-primary/30 rounded-md px-2 py-1 text-sm text-white focus:outline-none"
            />
            <button
              onClick={handleSave}
              className="text-green-400 p-1 hover:bg-green-400/10 rounded"
            >
              <Check className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <p className="font-medium text-white truncate text-sm">
              <span className="text-text-muted mr-2 font-normal tabular-nums">{index + 1}.</span>
              {track.title}
            </p>
            <button
              onClick={() => setIsEditing(true)}
              className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-white transition-opacity"
            >
              <Edit2 className="h-3 w-3" />
            </button>
          </div>
        )}
        <p className="text-xs text-text-muted">
          {formatTime(track.duration)} • {track.file.name}
        </p>
      </div>

      <button
        onClick={onRemove}
        className="text-text-muted hover:text-red-400 p-2 group-hover:bg-red-400/10 rounded-lg transition-all"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export function TrackUploader({ tracks, onChange }: TrackUploaderProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleDrop = (files: File[]) => {
    // Simulate metadata extraction
    const newTracks: UploadedTrack[] = files.map((file) => ({
      id: `track-${Math.random().toString(36).substr(2, 9)}`,
      title: file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '),
      duration: 180 + Math.floor(Math.random() * 60), // Mock 3-4 mins
      file,
    }))
    onChange([...tracks, ...newTracks])
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (active.id !== over?.id && over) {
      const oldIndex = tracks.findIndex((t) => t.id === active.id)
      const newIndex = tracks.findIndex((t) => t.id === over.id)
      onChange(arrayMove(tracks, oldIndex, newIndex))
    }
  }

  const removeTrack = (id: string) => {
    onChange(tracks.filter((t) => t.id !== id))
  }

  const editTrack = (id: string, newTitle: string) => {
    onChange(tracks.map((t) => (t.id === id ? { ...t, title: newTitle } : t)))
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">Upload Tracks</h2>
        <p className="text-text-secondary">
          Upload your audio files. WAV, FLAC or high-quality MP3.
        </p>
      </div>

      <div className="space-y-6">
        {/* Upload Zone */}
        <FileDropzone
          label="Add Audio Files"
          subLabel="Drag & drop multiple files or a whole folder"
          accept={{ 'audio/*': ['.mp3', '.wav', '.flac', '.m4a'] }}
          onDrop={handleDrop}
          className="min-h-[160px]"
        />

        {/* Tracks List */}
        {tracks.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-bold text-white flex items-center gap-2">
                Tracklist{' '}
                <span className="text-xs font-normal text-text-muted">
                  ({tracks.length} tracks selected)
                </span>
              </h3>
              {tracks.length > 1 && <p className="text-xs text-text-muted">Drag to reorder</p>}
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={tracks.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {tracks.map((track, index) => (
                    <SortableTrackItem
                      key={track.id}
                      track={track}
                      index={index}
                      onRemove={() => removeTrack(track.id)}
                      onEdit={editTrack}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}

        {tracks.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 bg-white/[0.02] border border-dashed border-white/5 rounded-2xl">
            <FileMusic className="h-12 w-12 text-white/10 mb-4" />
            <p className="text-sm text-text-muted">No tracks uploaded yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
