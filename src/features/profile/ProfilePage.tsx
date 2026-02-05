import { useState } from 'react'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { EditProfileModal } from '@/components/profile/EditProfileModal'
import { useAuthStore } from '@/store/auth'
import { Disc, Music, Heart, LayoutGrid } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export function ProfilePage() {
  const { user, updateProfile } = useAuthStore()
  const [showEdit, setShowEdit] = useState(false)
  const [activeTab, setActiveTab] = useState<'owned' | 'created' | 'liked'>('owned')

  if (!user) return null

  return (
    <div className="max-w-6xl mx-auto space-y-16 animate-in fade-in duration-700 pb-20">
      <ProfileHeader user={user} isOwnProfile={true} onEdit={() => setShowEdit(true)} />

      {/* Tabs */}
      <div className="space-y-8">
        <div className="flex items-center gap-12 border-b border-white/5">
          {[
            { id: 'owned', label: 'Owned', icon: Disc },
            { id: 'created', label: 'Created', icon: Music, hidden: user.role !== 'artist' },
            { id: 'liked', label: 'Liked', icon: Heart },
          ]
            .filter((t) => !t.hidden)
            .map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'pb-4 text-sm font-bold uppercase tracking-widest flex items-center gap-2 transition-all relative',
                  activeTab === tab.id ? 'text-primary' : 'text-text-muted hover:text-white',
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-full shadow-[0_-4px_10px_rgba(107,70,193,0.5)]" />
                )}
              </button>
            ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {/* Placeholder Empty State */}
          <div className="col-span-full py-32 flex flex-col items-center justify-center text-center space-y-4 opacity-50">
            <div className="h-20 w-20 bg-white/5 rounded-full flex items-center justify-center border border-white/5">
              <LayoutGrid className="h-10 w-10 text-text-muted" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">No items found</h3>
              <p className="text-sm text-text-muted">
                Start exploring and collecting on Open Music.
              </p>
            </div>
          </div>
        </div>
      </div>

      {showEdit && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEdit(false)}
          onSave={(updates) => updateProfile(updates)}
        />
      )}
    </div>
  )
}
