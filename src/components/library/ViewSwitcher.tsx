import { LayoutGrid, List, Grid } from 'lucide-react'
import { useUIStore } from '@/store/ui'
import type { LayoutView } from '@/types'
import { cn } from '@/lib/utils/cn'

export function ViewSwitcher() {
  const { layoutView, setLayoutView } = useUIStore()

  const options: { value: LayoutView; icon: any; label: string }[] = [
    { value: 'large-grid', icon: LayoutGrid, label: 'Grid' },
    { value: 'small-grid', icon: Grid, label: 'Compact' },
    { value: 'collapsed', icon: List, label: 'List' },
  ]

  return (
    <div className="flex bg-white/5 p-1 rounded-lg border border-white/5">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => setLayoutView(option.value)}
          className={cn(
            'p-2 rounded-md transition-all text-text-muted hover:text-white',
            layoutView === option.value && 'bg-background-card text-primary shadow-sm',
          )}
          title={option.label}
        >
          <option.icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  )
}
