import type { Artist } from '@/types'
import { Card } from '@/components/ui/Card'

interface AboutTabProps {
  artist: Artist
}

export function AboutTab({ artist }: AboutTabProps) {
  return (
    <div className="max-w-4xl space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <section>
            <h2 className="text-xl font-bold text-white mb-4">Biography</h2>
            <div className="text-text-secondary leading-relaxed whitespace-pre-line">
              {artist.bio || 'No biography available.'}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <Card className="p-6 space-y-4 bg-white/5 border-white/10">
            <h3 className="font-bold text-white">Stats</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center text-text-secondary">
                <span>Total Listeners</span>
                <span className="text-white font-medium">
                  {artist.stats.totalListeners.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-text-secondary">
                <span>Total Sales</span>
                <span className="text-white font-medium">
                  {artist.stats.totalSales.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-text-secondary">
                <span>Projects</span>
                <span className="text-white font-medium">{artist.stats.projectsReleased}</span>
              </div>
              <div className="flex justify-between items-center text-text-secondary">
                <span>Verified</span>
                <span className="text-primary font-medium">{artist.verified ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
