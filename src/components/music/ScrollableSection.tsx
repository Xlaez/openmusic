import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'

interface ScrollableSectionProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  className?: string
}

export function ScrollableSection({
  title,
  subtitle,
  children,
  className,
}: ScrollableSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef
      const scrollAmount = direction === 'left' ? -current.offsetWidth / 2 : current.offsetWidth / 2
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <section className={cn('space-y-4 group/section', className)}>
      <div className="flex items-end justify-between px-1">
        <div>
          {subtitle && (
            <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
              {subtitle}
            </p>
          )}
          <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
        </div>
        <div className="hidden md:flex gap-2 opacity-0 group-hover/section:opacity-100 transition-opacity">
          <Button
            variant="secondary"
            size="sm"
            className="h-8 w-8 p-0 rounded-full"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="h-8 w-8 p-0 rounded-full"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
      </div>
    </section>
  )
}
