import type { ProjectType } from '@/types'
import { Card } from '@/components/ui/Card'
import { Disc, Music, Mic2, Layers } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface TypeSelectionProps {
  selected: ProjectType | null
  onSelect: (type: ProjectType) => void
}

export function TypeSelection({ selected, onSelect }: TypeSelectionProps) {
  const types = [
    {
      id: 'album',
      title: 'Album',
      icon: Disc,
      description: 'Standard full-length release. Typically 10+ tracks.',
      color: 'bg-blue-500/10 text-blue-400',
    },
    {
      id: 'ep',
      title: 'EP',
      icon: Layers,
      description: 'Extended Play. Usually 4-6 tracks.',
      color: 'bg-purple-500/10 text-purple-400',
    },
    {
      id: 'mixtape',
      title: 'Mixtape',
      icon: Music,
      description: 'Informal collection. Any number of tracks.',
      color: 'bg-orange-500/10 text-orange-400',
    },
    {
      id: 'single',
      title: 'Single',
      icon: Mic2,
      description: 'One to three tracks. Great for quick releases.',
      color: 'bg-green-500/10 text-green-400',
    },
  ] as const

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">What are you releasing?</h2>
        <p className="text-text-secondary">Select the format that best fits your new project.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {types.map((type) => {
          const Icon = type.icon
          const isActive = selected === type.id

          return (
            <Card
              key={type.id}
              onClick={() => onSelect(type.id)}
              className={cn(
                'p-6 cursor-pointer border-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]',
                isActive
                  ? 'border-primary bg-primary/5 shadow-[0_0_20px_rgba(139,92,246,0.15)]'
                  : 'border-white/5 bg-background-card hover:border-white/10',
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn('p-3 rounded-xl shrink-0', type.color)}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="space-y-1 text-left">
                  <h3 className="font-bold text-lg text-white">{type.title}</h3>
                  <p className="text-sm text-text-muted leading-relaxed">{type.description}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
