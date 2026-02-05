import { useNavigate } from '@tanstack/react-router'
import { Search, X, Loader2 } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useSearch } from '@/lib/api/search'

import { Card } from '@/components/ui/Card'
import { Link } from '@tanstack/react-router'
import { useDebounce } from '@/lib/hooks/useDebounce'

export function SearchBar() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const debouncedQuery = useDebounce(query, 300)
  const { data, isLoading } = useSearch(debouncedQuery)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsOpen(false)
      navigate({ to: '/search', search: { q: query } })
    }
    if (e.key === 'Escape') setIsOpen(false)
  }

  return (
    <div ref={wrapperRef} className="w-full max-w-md relative group">
      <div className="relative z-50">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </div>
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder="Search artists, tracks, projects..."
          className="w-full h-10 bg-white/5 border border-transparent focus:bg-background-card focus:border-white/10 rounded-full pl-10 pr-10 text-sm text-white focus:outline-none transition-all shadow-sm"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('')
              setIsOpen(false)
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && query && data && (
        <Card className="absolute top-12 left-0 right-0 z-50 p-2 max-h-[400px] overflow-y-auto bg-background-card border border-white/10 shadow-macos animate-in fade-in zoom-in-95 duration-200">
          {data.projects.length === 0 && data.artists.length === 0 ? (
            <div className="p-4 text-center text-text-muted text-sm">
              No results found for "{query}"
            </div>
          ) : (
            <>
              {data.projects.length > 0 && (
                <div className="mb-2">
                  <h5 className="text-xs font-bold text-text-muted uppercase tracking-wider px-2 py-2">
                    Projects
                  </h5>
                  {data.projects.slice(0, 3).map((p) => (
                    <Link
                      key={p.id}
                      to="/artist/$artistId"
                      params={{ artistId: p.artist.id }}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors group/item"
                    >
                      <img src={p.coverImage} className="h-10 w-10 rounded-md object-cover" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate group-hover/item:text-primary transition-colors">
                          {p.title}
                        </p>
                        <p className="text-xs text-text-muted truncate">{p.artist.displayName}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {data.artists.length > 0 && (
                <div>
                  <h5 className="text-xs font-bold text-text-muted uppercase tracking-wider px-2 py-2">
                    Artists
                  </h5>
                  {data.artists.slice(0, 3).map((a) => (
                    <Link
                      key={a.id}
                      to="/artist/$artistId"
                      params={{ artistId: a.id }}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <img src={a.coverImage} className="h-10 w-10 rounded-full object-cover" />
                      <p className="text-sm font-medium text-white">{a.displayName}</p>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </Card>
      )}
    </div>
  )
}
