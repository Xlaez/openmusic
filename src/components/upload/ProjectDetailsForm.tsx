import { useState } from 'react'
import { FileDropzone } from '@/components/ui/FileDropzone'
import { Calendar, Image as ImageIcon, X, Tags } from 'lucide-react'
import { GenreSelector } from './GenreSelector'
import type { ProjectType } from '@/types'

interface ProjectDetailsData {
  title: string
  description: string
  releaseDate: string
  coverImage: string // Base64 or Blob URL for preview
  genres: string[]
}

interface ProjectDetailsFormProps {
  data: ProjectDetailsData
  projectType: ProjectType | null
  onChange: (data: Partial<ProjectDetailsData>) => void
}

export function ProjectDetailsForm({ data, projectType, onChange }: ProjectDetailsFormProps) {
  const [preview, setPreview] = useState<string | null>(data.coverImage || null)

  const handleImageDrop = (files: File[]) => {
    if (files[0]) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setPreview(result)
        onChange({ coverImage: result })
      }
      reader.readAsDataURL(files[0])
    }
  }

  const removeImage = () => {
    setPreview(null)
    onChange({ coverImage: '' })
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">Project Details</h2>
        <p className="text-text-secondary">Provide the basic info for your release.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Basic Info */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary pl-1">Project Title</label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => onChange({ title: e.target.value })}
              placeholder="e.g., Midnight Protocol"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-white/20"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary pl-1">Description</label>
            <textarea
              value={data.description}
              onChange={(e) => onChange({ description: e.target.value })}
              placeholder="Tell your fans about this release..."
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-white/20 resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary pl-1">Release Date</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
              <input
                type="date"
                value={data.releaseDate}
                onChange={(e) => onChange({ releaseDate: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary pl-1 flex items-center gap-2">
              <Tags className="h-4 w-4" />
              Genres
            </label>
            <GenreSelector
              selected={data.genres}
              onChange={(genres) => onChange({ genres })}
              max={projectType === 'single' ? 8 : 15}
            />
          </div>
        </div>

        {/* Cover Image */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-text-secondary pl-1">Cover Artwork</label>

          {preview ? (
            <div className="relative aspect-square w-full rounded-xl overflow-hidden border border-white/10 shadow-2xl group">
              <img
                src={preview}
                alt="Cover Preview"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={removeImage}
                  className="p-3 bg-red-500 rounded-full text-white shadow-lg hover:scale-110 active:scale-95 transition-all"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
          ) : (
            <FileDropzone
              label="Upload Cover Image"
              subLabel="JPEG, PNG or WebP (Min 1000x1000px, 1:1 aspect recommended)"
              accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] }}
              onDrop={handleImageDrop}
              single
              className="h-full min-h-[300px]"
            />
          )}

          <div className="flex items-start gap-2 p-3 bg-primary/5 rounded-lg border border-primary/10">
            <ImageIcon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <p className="text-xs text-text-muted leading-tight">
              Your artwork is the first thing fans see. Make it count with high-quality, original
              visuals.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
