import { Bell, Disc, ShoppingBag, Info, UserPlus, X } from 'lucide-react'
import { mockNotifications } from '@/lib/api/mockData'
import { cn } from '@/lib/utils/cn'

interface NotificationsCardProps {
  onClose: () => void
}

export function NotificationsCard({ onClose }: NotificationsCardProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'drop':
        return <Disc className="h-4 w-4 text-primary" />
      case 'sale':
        return <ShoppingBag className="h-4 w-4 text-green-500" />
      case 'follow':
        return <UserPlus className="h-4 w-4 text-blue-500" />
      default:
        return <Info className="h-4 w-4 text-text-muted" />
    }
  }

  return (
    <div className="fixed md:absolute top-20 md:top-auto right-4 left-4 md:right-0 md:left-auto md:mt-3 w-auto md:w-96 bg-background-card border border-white/10 rounded-2xl shadow-2xl z-[100] animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">Notifications</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/5 rounded-full text-text-muted hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="max-h-[400px] overflow-y-auto custom-scrollbar divide-y divide-white/5">
        {mockNotifications.map((notification) => (
          <div
            key={notification.id}
            className={cn(
              'p-4 hover:bg-white/[0.02] transition-colors cursor-pointer group relative',
              notification.unread && 'bg-primary/5',
            )}
          >
            {notification.unread && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full shadow-[0_0_8px_rgba(107,70,193,0.5)]" />
            )}

            <div className="flex gap-4">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:border-white/10 transition-colors">
                {getIcon(notification.type)}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-white leading-tight">{notification.title}</p>
                <p className="text-xs text-text-muted leading-relaxed line-clamp-2 italic">
                  {notification.description}
                </p>
                <p className="text-[10px] text-primary/60 font-medium uppercase tracking-wider pt-1">
                  {notification.time}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-white/5 bg-white/[0.02] text-center">
        <button className="text-[10px] font-bold text-text-muted hover:text-white uppercase tracking-widest transition-colors">
          View All Notifications
        </button>
      </div>
    </div>
  )
}
