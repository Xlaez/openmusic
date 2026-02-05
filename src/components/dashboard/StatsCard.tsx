import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils/cn'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface StatsCardProps {
  label: string
  value: string | number
  subValue?: string
  trend?: number // percentage
  icon?: React.ReactNode
}

export function StatsCard({ label, value, subValue, trend, icon }: StatsCardProps) {
  return (
    <Card className="p-6 bg-background-card border-white/5 space-y-4">
      <div className="flex justify-between items-start">
        <p className="text-text-secondary text-sm font-medium">{label}</p>
        {icon && <div className="text-primary bg-primary/10 p-2 rounded-lg">{icon}</div>}
      </div>

      <div>
        <h3 className="text-2xl font-bold text-white">{value}</h3>
        {(subValue || trend !== undefined) && (
          <div className="flex items-center gap-2 mt-1">
            {trend !== undefined && (
              <span
                className={cn(
                  'flex items-center text-sm font-medium',
                  trend >= 0 ? 'text-green-400' : 'text-red-400',
                )}
              >
                {trend >= 0 ? (
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                )}
                {Math.abs(trend)}%
              </span>
            )}
            {subValue && <span className="text-xs text-text-muted">{subValue}</span>}
          </div>
        )}
      </div>
    </Card>
  )
}
