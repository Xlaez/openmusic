import type { Project, Artist } from '@/types'
import { ProjectCard } from '@/components/music/ProjectCard'
import { ArtistCard } from '@/components/music/ArtistCard'
import { ScrollableSection } from '@/components/music/ScrollableSection'

interface OverviewTabsProps {
  projects: Project[]
  similarArtists: Artist[]
}

export function OverviewTab({ projects, similarArtists }: OverviewTabsProps) {
  const latestRelease = projects.sort(
    (a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime(),
  )[0]
  const popularProjects = [...projects].sort((a, b) => b.totalUnits - a.totalUnits).slice(0, 5)

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Latest Release */}
      {latestRelease && (
        <section>
          <h2 className="text-xl font-bold text-white mb-6">Latest Release</h2>
          <div className="max-w-md">
            <ProjectCard project={latestRelease} aspect="wide" />
          </div>
        </section>
      )}

      {/* Popular */}
      {popularProjects.length > 0 && (
        <ScrollableSection title="Popular Releases">
          {popularProjects.map((project) => (
            <div key={project.id} className="w-[200px] flex-shrink-0">
              <ProjectCard project={project} />
            </div>
          ))}
        </ScrollableSection>
      )}

      {/* Similar Artists */}
      {similarArtists.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-white mb-6">Fans Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {similarArtists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
