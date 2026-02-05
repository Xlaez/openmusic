import type { Project } from '@/types'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/Button'
import { Play, MoreVertical, Clock } from 'lucide-react'
import { usePlayerStore } from '@/store/player'

export function ProjectCardCollapsed({ project }: { project: Project }) {
  const { playProject } = usePlayerStore()

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault()
    playProject(project)
  }

  return (
    <Link to="/project/$projectId" params={{ projectId: project.id }} className="group block">
      <div className="flex items-center gap-4 p-2 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
        <div className="relative h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
          <img src={project.coverImage} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <Button
              size="sm"
              variant="ghost"
              className="text-white p-0 hover:bg-transparent"
              onClick={handlePlay}
            >
              <Play className="h-5 w-5 fill-current" />
            </Button>
          </div>
        </div>

        <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-center">
          <div className="min-w-0">
            <h4 className="font-medium text-white truncate text-sm">{project.title}</h4>
            <p className="text-xs text-text-muted truncate mobile-only">
              {project.artist.displayName}
            </p>
          </div>
          <div className="hidden md:block min-w-0">
            <p className="text-sm text-text-secondary truncate hover:text-white transition-colors">
              {project.artist.displayName}
            </p>
          </div>
          <div className="hidden lg:flex items-center gap-2 text-text-muted text-sm">
            <Clock className="h-3 w-3" />
            <span>{project.tracks.length} tracks</span>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </Link>
  )
}
