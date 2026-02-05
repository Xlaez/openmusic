import type { Artist } from '@/types'
import { BadgeCheck, Users, Link as LinkIcon, Edit3 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface ArtistHeaderProps {
  artist: Artist
  isOwner?: boolean
}

export function ArtistHeader({ artist, isOwner }: ArtistHeaderProps) {
  return (
    <div className="relative w-full overflow-hidden">
      {/* Banner / Parallax Hero */}
      <div
        className="h-[300px] md:h-[400px] w-full bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: `url(${artist.coverImage})`, backgroundAttachment: 'fixed' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/20 to-background-primary" />
      </div>

      {/* Info Content - Overlapping */}
      <div className="relative px-6 -mt-32 md:-mt-40 max-w-7xl mx-auto flex flex-col items-center md:items-start md:flex-row gap-6 md:gap-10 pb-8">
        {/* Avatar */}
        <div className="relative h-40 w-40 md:h-52 md:w-52 rounded-full border-4 border-background-primary shadow-2xl overflow-hidden shrink-0 group">
          <img
            src={artist.coverImage}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>

        {/* Text Details */}
        <div className="flex-1 flex flex-col items-center md:items-start pt-12 md:pt-20 text-center md:text-left space-y-4">
          <div>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                {artist.displayName}
              </h1>
              {artist.verified && <BadgeCheck className="h-6 w-6 md:h-8 md:w-8 text-primary" />}
            </div>
            <p className="text-text-muted mt-2 max-w-2xl line-clamp-2 md:line-clamp-none">
              {artist.bio}
            </p>
          </div>

          <div className="flex items-center gap-4 text-sm font-medium text-text-secondary">
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              {artist.stats.totalListeners.toLocaleString()} Listeners
            </span>
            <span>•</span>
            <span>{artist.stats.projectsReleased} Projects</span>
            <span>•</span>
            <span>{artist.stats.totalSales} Sales</span>
          </div>

          <div className="flex items-center gap-3 pt-2">
            {isOwner ? (
              <Button variant="secondary" className="gap-2">
                <Edit3 className="h-4 w-4" />
                Edit Profile
              </Button>
            ) : (
              <Button variant="primary" size="lg" className="rounded-full px-8">
                Subscribe
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="rounded-full border border-white/10 hover:bg-white/10 h-10 w-10 p-0"
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
