import type { Artist } from '@/types'
import { Link } from '@tanstack/react-router'
import { Card } from '@/components/ui/Card'
import { Users, BadgeCheck } from 'lucide-react'

export function ArtistCard({ artist }: { artist: Artist }) {
  return (
    <Link to="/artist/$artistId" params={{ artistId: artist.id }} className="block">
      <Card
        hover
        className="p-4 flex flex-col items-center text-center bg-transparent border-transparent hover:bg-white/5 h-full"
      >
        <div className="relative mb-4">
          <img
            src={artist.coverImage || 'https://github.com/shadcn.png'}
            alt={artist.displayName}
            className="h-32 w-32 md:h-40 md:w-40 rounded-full object-cover shadow-lg group-hover:shadow-2xl transition-shadow"
          />
          {artist.verified && (
            <div
              className="absolute bottom-1 right-1 bg-background-card text-blue-400 rounded-full p-1 border border-background-card"
              title="Verified Artist"
            >
              <BadgeCheck className="h-5 w-5 fill-current" />
            </div>
          )}
        </div>

        <h3 className="font-bold text-white text-lg truncate w-full">{artist.displayName}</h3>

        <div className="flex items-center gap-1 text-sm text-text-muted mt-1">
          <Users className="h-3 w-3" />
          <span>{artist.stats.totalListeners.toLocaleString()} listeners</span>
        </div>
      </Card>
    </Link>
  )
}
