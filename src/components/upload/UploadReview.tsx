import type { ProjectType } from '@/types'
import { Card } from '@/components/ui/Card'
import { CheckCircle2, Music, DollarSign, Layers } from 'lucide-react'

interface UploadReviewProps {
  data: {
    type: ProjectType | null
    title: string
    description: string
    releaseDate: string
    coverImage: string
    tracks: any[]
    pricePerUnit: number
    totalUnits: number
    genres: string[]
  }
}

export function UploadReview({ data }: UploadReviewProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">Review & Finish</h2>
        <p className="text-text-secondary">Double check everything before creating your release.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left: Project Preview */}
        <div className="md:col-span-1 space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
            <img src={data.coverImage} className="h-full w-full object-cover" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white truncate">{data.title}</h3>
            <p className="text-text-muted capitalize">
              {data.type} • {data.tracks.length} tracks
            </p>
          </div>
        </div>

        {/* Right: Details Summary */}
        <div className="md:col-span-2 grid sm:grid-cols-2 gap-4">
          <Card className="p-4 bg-white/5 border-white/5 space-y-3">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
              <Layers className="h-3 w-3" />
              Release Info
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-[10px] text-text-muted uppercase">Release Date</p>
                <p className="text-sm text-white font-medium">
                  {new Date(data.releaseDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-text-muted uppercase">Description</p>
                <p className="text-sm text-white line-clamp-2 italic">
                  "{data.description || 'No description provided'}"
                </p>
              </div>
              <div>
                <p className="text-[10px] text-text-muted uppercase mb-1">Genres</p>
                <div className="flex flex-wrap gap-1.5">
                  {data.genres.map((genre) => (
                    <span
                      key={genre}
                      className="px-2 py-0.5 bg-white/10 rounded text-[10px] text-white"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white/5 border-white/5 space-y-3">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
              <DollarSign className="h-3 w-3" />
              Economics
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <p className="text-text-muted">Price</p>
                <p className="text-white font-bold">{data.pricePerUnit} USDC</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-text-muted">Supply</p>
                <p className="text-white font-bold">{data.totalUnits} Units</p>
              </div>
              <div className="pt-2 border-t border-white/5 space-y-1">
                <div className="flex justify-between text-xs">
                  <p className="text-text-muted">Artist Share</p>
                  <p className="text-green-400 font-bold">100%</p>
                </div>
                <div className="flex justify-between text-xs">
                  <p className="text-text-muted">Platform Fee</p>
                  <p className="text-green-400 font-bold">0%</p>
                </div>
                <div className="flex justify-between text-xs">
                  <p className="text-text-muted">Backing</p>
                  <p className="text-primary font-bold">50%</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white/5 border-white/5 sm:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                <Music className="h-3 w-3" />
                Tracklist
              </div>
              <span className="text-xs text-text-muted">{data.tracks.length} Tracks Ready</span>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
              {data.tracks.map((track, i) => (
                <div
                  key={track.id}
                  className="flex items-center justify-between text-sm py-1 border-b border-white/5 last:border-0"
                >
                  <span className="text-text-secondary truncate pr-4">
                    <span className="text-text-muted mr-2">{i + 1}.</span>
                    {track.title}
                  </span>
                  <span className="text-text-muted tabular-nums">
                    {Math.floor(track.duration / 60)}:
                    {(track.duration % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-2xl flex items-start gap-3">
        <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
        <p className="text-sm text-text-secondary leading-relaxed">
          By creating, you agree to the{' '}
          <span className="text-white font-medium underline underline-offset-4 cursor-pointer">
            Open Music Artist Agreement
          </span>
          . This release will be immutable on-chain once confirmed.
        </p>
      </div>
    </div>
  )
}
