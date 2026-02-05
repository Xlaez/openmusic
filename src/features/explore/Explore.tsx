import { useNavigate, useSearch } from '@tanstack/react-router'
import { useExploreProjects, useDiscoverArtists } from '@/lib/api/explore'
import { FilterChips } from '@/components/ui/FilterChips'
import { ProjectCard } from '@/components/music/ProjectCard'
import { ArtistCard } from '@/components/music/ArtistCard'
import { Loader2 } from 'lucide-react'
import type { ProjectType } from '@/types'

export function Explore() {
  const navigate = useNavigate()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const search: any = useSearch({ from: '/explore' })
  const filter = (search.filter as ProjectType | 'all') || 'all'

  const { data: projects, isLoading: projectsLoading } = useExploreProjects(filter)
  const { data: artists, isLoading: artistsLoading } = useDiscoverArtists()

  const setFilter = (value: string) => {
    navigate({ to: '.', search: (old) => ({ ...old, filter: value }) })
  }

  const chips = [
    { label: 'All', value: 'all' },
    { label: 'Albums', value: 'album' },
    { label: 'EPs', value: 'ep' },
    { label: 'Singles', value: 'single' },
  ]

  if (projectsLoading || artistsLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Filter Bar */}
      <div className="sticky top-16 z-30 bg-background-primary/95 backdrop-blur-xl py-4 -mx-6 px-6 border-b border-white/5">
        <FilterChips options={chips} activeValue={filter} onChange={setFilter} />
      </div>

      {filter === 'all' && artists && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Discover Artists</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {artists.slice(0, 5).map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </section>
      )}

      {projects && (
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">
            {filter === 'all'
              ? 'New Releases'
              : `${filter.charAt(0).toUpperCase() + filter.slice(1)}s`}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
