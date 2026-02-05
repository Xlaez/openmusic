import { useRecentlyPlayed, useNewFromFavorites, useRecommended, useTrending } from '@/lib/api/home'
import { ScrollableSection } from '@/components/music/ScrollableSection'
import { ProjectCard } from '@/components/music/ProjectCard'
import { Loader2 } from 'lucide-react'

export function Home() {
  const recentlyPlayed = useRecentlyPlayed()
  const newFromFavorites = useNewFromFavorites()
  const recommended = useRecommended()
  const trending = useTrending()

  const isLoading =
    recentlyPlayed.isLoading ||
    newFromFavorites.isLoading ||
    recommended.isLoading ||
    trending.isLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-12 pb-20">
      {recentlyPlayed.data && recentlyPlayed.data.length > 0 && (
        <ScrollableSection title="Recently Played">
          {recentlyPlayed.data.map((project) => (
            <div key={project.id} className="w-[180px] md:w-[220px] flex-shrink-0">
              <ProjectCard project={project} isOwned={true} />
            </div>
          ))}
        </ScrollableSection>
      )}

      {newFromFavorites.data && newFromFavorites.data.length > 0 && (
        <ScrollableSection title="New from Artists You Love" subtitle="Your Favorites">
          {newFromFavorites.data.map((project) => (
            <div key={project.id} className="w-[180px] md:w-[220px] flex-shrink-0">
              <ProjectCard project={project} />
            </div>
          ))}
        </ScrollableSection>
      )}

      {recommended.data && recommended.data.length > 0 && (
        <ScrollableSection title="Recommended for You" subtitle="Based on your listening">
          {recommended.data.map((project) => (
            <div key={project.id} className="w-[180px] md:w-[220px] flex-shrink-0">
              <ProjectCard project={project} />
            </div>
          ))}
        </ScrollableSection>
      )}

      {trending.data && trending.data.length > 0 && (
        <ScrollableSection title="Trending Now" subtitle="Global Top 50">
          {trending.data.map((project) => (
            <div key={project.id} className="w-[280px] md:w-[360px] flex-shrink-0">
              <ProjectCard project={project} aspect="wide" />
            </div>
          ))}
        </ScrollableSection>
      )}
    </div>
  )
}
