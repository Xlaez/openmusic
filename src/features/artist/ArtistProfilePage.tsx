import { useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { useArtist, useArtistProjects, useSimilarArtists } from '@/lib/api/artist'
import { ArtistHeader } from '@/components/artist/ArtistHeader'
import { OverviewTab } from '@/components/artist/OverviewTab'
import { DiscographyTab } from '@/components/artist/DiscographyTab'
import { AboutTab } from '@/components/artist/AboutTab'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export function ArtistProfilePage() {
  const { artistId } = useParams({ from: '/artist/$artistId' })
  const [activeTab, setActiveTab] = useState<'overview' | 'discography' | 'about'>('overview')

  const { data: artist, isLoading: artistLoading } = useArtist(artistId)
  const { data: projects, isLoading: projectsLoading } = useArtistProjects(artistId)
  const { data: similarArtists, isLoading: similarLoading } = useSimilarArtists(artistId)

  if (artistLoading || projectsLoading || similarLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!artist) return <div className="p-10 text-center text-text-muted">Artist not found</div>

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'discography', label: 'Discography' },
    { id: 'about', label: 'About' },
  ] as const

  return (
    <div className="-mt-6 -mx-6 pb-20">
      <ArtistHeader artist={artist} />

      <div className="px-6 max-w-7xl mx-auto space-y-8">
        {/* Tabs Navigation */}
        <div className="border-b border-white/10">
          <div className="flex gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'pb-4 text-sm font-medium border-b-2 transition-colors duration-200',
                  activeTab === tab.id
                    ? 'border-primary text-white'
                    : 'border-transparent text-text-muted hover:text-white',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[500px]">
          {activeTab === 'overview' && projects && similarArtists && (
            <OverviewTab projects={projects} similarArtists={similarArtists} />
          )}
          {activeTab === 'discography' && projects && <DiscographyTab projects={projects} />}
          {activeTab === 'about' && <AboutTab artist={artist} />}
        </div>
      </div>
    </div>
  )
}
