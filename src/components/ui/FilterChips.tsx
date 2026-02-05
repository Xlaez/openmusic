import { cn } from '@/lib/utils/cn'

interface FilterChipsProps {
  options: { label: string; value: string }[]
  activeValue: string
  onChange: (value: any) => void
}

export function FilterChips({ options, activeValue, onChange }: FilterChipsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar mask-gradient-r">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all border',
            activeValue === option.value
              ? 'bg-white text-black border-white'
              : 'bg-white/5 text-text-secondary border-white/10 hover:bg-white/10 hover:text-white',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
