import type { ActivityItem } from '@/lib/api/dashboard'
import { Card } from '@/components/ui/Card'
import { ShoppingBag } from 'lucide-react'

export function RecentActivity({ items }: { items: ActivityItem[] }) {
  return (
    <Card className="flex flex-col h-full bg-background-card border-white/5">
      <div className="p-6 border-b border-white/5">
        <h3 className="font-bold text-white">Recent Activity</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-0">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
          >
            <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white">
                <span className="font-bold">{item.user}</span> purchased{' '}
                <span className="text-primary">{item.project}</span>
              </p>
              <p className="text-xs text-text-muted">{item.timeAgo}</p>
            </div>
            <div className="text-sm font-medium text-green-400">+${item.amount}</div>
          </div>
        ))}
      </div>
    </Card>
  )
}
