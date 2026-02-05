import { Play, Check, Lock } from 'lucide-react'
import type { Project } from '@/types'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import { Link } from '@tanstack/react-router'
import { usePlayerStore } from '@/store/player'

interface ProjectCardProps {
  project: Project
  isOwned?: boolean
  aspect?: 'square' | 'wide'
  className?: string
}

export function ProjectCard({
  project,
  isOwned = false,
  aspect = 'square',
  className,
}: ProjectCardProps) {
  const { playProject } = usePlayerStore()

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    playProject(project)
  }

  return (
    <Link to="/project/$projectId" params={{ projectId: project.id }} className="block">
      <Card
        hover
        className={cn(
          'group h-full bg-transparent border-transparent p-3 hover:bg-white/5',
          className,
        )}
      >
        <div
          className={cn(
            'relative overflow-hidden rounded-md mb-3 shadow-lg group-hover:shadow-2xl transition-all',
            aspect === 'square' ? 'aspect-square' : 'aspect-video',
          )}
        >
          <img
            src={project.coverImage}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
            {isOwned ? (
              <Button
                size="md"
                variant="primary"
                className="rounded-full w-12 h-12 p-0 scale-90 group-hover:scale-100 transition-transform shadow-xl"
                onClick={handlePlay}
              >
                <Play className="h-5 w-5 fill-current ml-0.5" />
              </Button>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Lock className="h-8 w-8 text-white/80" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Locked
                </span>
              </div>
            )}
          </div>

          {/* Owned Badge */}
          {isOwned && (
            <div
              className="absolute top-2 right-2 bg-black/50 backdrop-blur-md p-1 rounded-full border border-white/20"
              title="Owned"
            >
              <Check className="h-3 w-3 text-primary" />
            </div>
          )}
        </div>

        <div className="space-y-1">
          <h3 className="font-semibold text-white truncate text-sm md:text-base group-hover:underline decoration-white/30 underline-offset-4">
            {project.title}
          </h3>

          <div className="flex items-center justify-between text-xs md:text-sm text-text-secondary">
            <span className="truncate hover:text-white transition-colors">
              {project.artist.displayName}
            </span>
            {!isOwned && (
              <span className="font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20 shrink-0 ml-2">
                {project.price} USDC
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span className="capitalize">{project.type}</span>
            <span>•</span>
            <span>{project.releaseDate.split('-')[0]}</span>
          </div>
        </div>
      </Card>
    </Link>
  )
}
