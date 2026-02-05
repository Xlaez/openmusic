import type { Project } from '@/types'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/Button'
import { Check, Plus, Heart } from 'lucide-react'

interface ProjectHeaderProps {
  project: Project
  onBuy: () => void
  isOwned: boolean
}

export function ProjectHeader({ project, onBuy, isOwned }: ProjectHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row gap-8 md:gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Cover Art */}
      <div className="relative group shrink-0 mx-auto md:mx-0 w-64 md:w-80 lg:w-96 aspect-square shadow-2xl rounded-lg overflow-hidden">
        <img
          src={project.coverImage}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {isOwned && (
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5 shadow-lg">
            <Check className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wide text-white">Owned</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col justify-end items-center md:items-start text-center md:text-left space-y-6 flex-1 min-w-0">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
            {project.title}
          </h1>
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-2 gap-y-1 text-lg text-text-secondary font-medium">
            <Link
              to="/artist/$artistId"
              params={{ artistId: project.artist.id }}
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <img src={project.artist.coverImage} className="h-6 w-6 rounded-full" />
              {project.artist.displayName}
            </Link>
            <span>•</span>
            <span className="capitalize">{project.type}</span>
            <span>•</span>
            <span>{new Date(project.releaseDate).getFullYear()}</span>
            <span>•</span>
            <span>{project.tracks.length} tracks</span>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
            {project.genres.map((genre) => (
              <span
                key={genre}
                className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-xs font-medium text-text-muted hover:text-white hover:bg-white/10 transition-colors"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>

        {!isOwned ? (
          <div className="space-y-4 w-full md:w-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <Button
                onClick={onBuy}
                size="lg"
                variant="primary"
                className="px-8 h-12 text-lg rounded-full shadow-lg hover:shadow-primary/20 hover:scale-105 transition-all"
              >
                Buy for {project.price} USDC
              </Button>
              <Button size="lg" variant="secondary" className="px-6 h-12 rounded-full gap-2">
                <Heart className="h-5 w-5" />
                Wishlist
              </Button>
            </div>
            <div className="text-sm text-text-muted">
              {project.availableUnits} / {project.totalUnits} editions available
            </div>
          </div>
        ) : (
          <div className="flex gap-4">
            <Button
              size="lg"
              variant="primary"
              className="px-10 h-12 rounded-full shadow-lg hover:scale-105 transition-all"
            >
              Play
            </Button>
            <Button size="lg" variant="secondary" className="px-6 h-12 rounded-full gap-2">
              <Plus className="h-5 w-5" />
              Add to Playlist
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
