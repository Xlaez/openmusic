import { useState, useMemo } from 'react'
import { X, Search, Plus } from 'lucide-react'
import { GENRES } from '@/lib/constants'
import { cn } from '@/lib/utils/cn'

interface GenreSelectorProps {
  selected: string[]
  onChange: (genres: string[]) => void
  max: number
  className?: string
}

export function GenreSelector({ selected, onChange, max, className }: GenreSelectorProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const filteredGenres = useMemo(() => {
    return GENRES.filter(
      (genre) => genre.toLowerCase().includes(query.toLowerCase()) && !selected.includes(genre),
    )
  }, [query, selected])

  const toggleGenre = (genre: string) => {
    if (selected.includes(genre)) {
      onChange(selected.filter((g) => g !== genre))
    } else if (selected.length < max) {
      onChange([...selected, genre])
      setQuery('')
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-wrap gap-2">
        {selected.map((genre) => (
          <span
            key={genre}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/20 text-primary border border-primary/30 rounded-full text-sm font-medium animate-in zoom-in duration-200"
          >
            {genre}
            <button
              onClick={() => toggleGenre(genre)}
              className="hover:text-white transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        {selected.length === 0 && (
          <span className="text-sm text-text-muted italic">No genres selected</span>
        )}
      </div>

      <div className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            type="text"
            placeholder={
              selected.length >= max ? `Reached limit of ${max}` : 'Search or add genres...'
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            disabled={selected.length >= max}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {selected.length > 0 && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-text-muted">
              {selected.length}/{max}
            </span>
          )}
        </div>

        {isOpen && query.length > 0 && selected.length < max && (
          <div className="absolute z-50 mt-2 w-full bg-background-card border border-white/10 rounded-xl shadow-2xl max-h-60 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2 duration-200">
            {filteredGenres.length > 0 ? (
              filteredGenres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => toggleGenre(genre)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left text-sm text-text-secondary hover:bg-white/5 hover:text-white transition-colors group"
                >
                  {genre}
                  <Plus className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-text-muted">No results found</div>
            )}
          </div>
        )}

        {isOpen && query.length === 0 && selected.length < max && (
          <div className="absolute z-50 mt-2 w-full bg-background-card border border-white/10 rounded-xl shadow-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3 px-1">
              Suggested Genres
            </p>
            <div className="flex flex-wrap gap-2">
              {GENRES.slice(0, 12)
                .filter((g) => !selected.includes(g))
                .map((genre) => (
                  <button
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-xs text-text-secondary hover:text-white rounded-lg transition-all border border-transparent hover:border-white/10"
                  >
                    {genre}
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>

      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </div>
  )
}
