import { useCallback, useState } from 'react'
import { Upload } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface FileDropzoneProps {
  accept: Record<string, string[]> // e.g., { 'image/*': ['.png', '.jpg'] }
  maxSize?: number // bytes
  onDrop: (files: File[]) => void
  label: string
  subLabel?: string
  className?: string
  single?: boolean
}

export function FileDropzone({
  accept,
  maxSize = 10 * 1024 * 1024,
  onDrop,
  label,
  subLabel,
  className,
  single,
}: FileDropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragActive(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragActive(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragActive(false)
    setError(null)

    const files = Array.from(e.dataTransfer.files)
    validateAndPass(files)
  }, [])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      validateAndPass(files)
    }
  }, [])

  const validateAndPass = (files: File[]) => {
    if (files.length === 0) return

    // Check size
    const invalidFile = files.find((f) => f.size > maxSize)
    if (invalidFile) {
      setError(
        `File ${invalidFile.name} exceeds size limit of ${Math.round(maxSize / 1024 / 1024)}MB`,
      )
      return
    }

    // Basic type check (browser input handles accept usually, but drag drop needs manual)
    // Skipping complex mime check for now

    if (single && files.length > 1) {
      onDrop([files[0]])
    } else {
      onDrop(files)
    }
  }

  return (
    <div className={className}>
      <label
        className={cn(
          'relative flex flex-col items-center justify-center w-full h-48 rounded-xl border-2 border-dashed transition-all cursor-pointer group',
          isDragActive
            ? 'border-primary bg-primary/10'
            : 'border-white/10 hover:border-white/20 hover:bg-white/5',
          error ? 'border-red-500/50 bg-red-500/5' : '',
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
          <div className="p-3 bg-white/5 rounded-full mb-3 group-hover:scale-110 transition-transform">
            <Upload className="w-6 h-6 text-text-secondary group-hover:text-primary" />
          </div>
          <p className="mb-2 text-sm text-text-primary font-medium">
            {error ? <span className="text-red-400">{error}</span> : label}
          </p>
          <p className="text-xs text-text-secondary">
            {subLabel || 'Drag & drop or click to upload'}
          </p>
        </div>
        <input
          type="file"
          className="hidden"
          multiple={!single}
          accept={Object.values(accept).flat().join(',')}
          onChange={handleChange}
        />
      </label>
    </div>
  )
}
