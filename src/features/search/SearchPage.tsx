import { useSearch } from '@tanstack/react-router'
import { useSearch as useSearchApi } from '@/lib/api/search'
import { ProjectCard } from '@/components/music/ProjectCard'
import { ArtistCard } from '@/components/music/ArtistCard'
import { Loader2 } from 'lucide-react'

export function SearchPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const searchParams: any = useSearch({ from: '/search' })
  const query = searchParams.q || ''

  const { data, isLoading } = useSearchApi(query)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!data || (data.projects.length === 0 && data.artists.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center">
        <h2 className="text-xl font-bold text-white mb-2">No results found</h2>
        <p className="text-text-muted">Try searching for a different artist or track.</p>
      </div>
    )
  }

  return (
    <div className="space-y-10 pb-20">
      <h1 className="text-3xl font-bold text-white">Search results for "{query}"</h1>

      {data.artists.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Artists</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {data.artists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </section>
      )}

      {data.projects.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Projects</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {data.projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
