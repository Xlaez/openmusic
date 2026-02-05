import { useOwnedProjects } from '@/lib/api/library'
import { useUIStore } from '@/store/ui'
import { ViewSwitcher } from '@/components/library/ViewSwitcher'
import { ProjectCard } from '@/components/music/ProjectCard'
import { ProjectCardCollapsed } from '@/components/music/ProjectCardCollapsed'
import { Loader2, Music2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils/cn'

export function Library() {
  const { data: projects, isLoading } = useOwnedProjects()
  const { layoutView } = useUIStore()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center max-w-md mx-auto">
        <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
          <Music2 className="h-10 w-10 text-text-muted" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Your library is empty</h2>
        <p className="text-text-muted mb-8">
          You haven't purchased any music yet. Explore to find music you'll love.
        </p>
        <Link to="/explore" search={{ filter: 'all', q: '' }}>
          <Button size="lg">Explore Music</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Your Library</h1>
        <div className="flex items-center gap-4">
          {/* Sort would go here */}
          <ViewSwitcher />
        </div>
      </div>

      <div
        className={cn(
          'grid gap-6',
          layoutView === 'large-grid' && 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
          layoutView === 'small-grid' && 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8',
          layoutView === 'collapsed' && 'grid-cols-1',
        )}
      >
        {projects.map((project) =>
          layoutView === 'collapsed' ? (
            <ProjectCardCollapsed key={project.id} project={project} />
          ) : (
            <ProjectCard key={project.id} project={project} isOwned={true} />
          ),
        )}
      </div>
    </div>
  )
}
