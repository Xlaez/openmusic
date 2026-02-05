import { Button } from '@/components/ui/Button'
import { Settings, Copy, Share2, MapPin, Calendar, Verified, Disc, Users } from 'lucide-react'

interface ProfileHeaderProps {
  user: {
    displayName?: string
    username: string
    avatar?: string
    role: string
    walletAddress: string
    bio?: string
    createdAt: string
  }
  isOwnProfile: boolean
  onEdit: () => void
}

export function ProfileHeader({ user, isOwnProfile, onEdit }: ProfileHeaderProps) {
  const copyAddress = () => {
    navigator.clipboard.writeText(user.walletAddress)
  }

  return (
    <div className="relative group">
      {/* Cover Backdrop */}
      <div className="h-64 w-full bg-gradient-to-r from-primary/20 via-purple-500/20 to-blue-500/20 rounded-3xl overflow-hidden relative border border-white/5">
        <div className="absolute inset-0 backdrop-blur-3xl" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="px-8 -mt-20 relative z-10 flex flex-col md:flex-row items-end gap-6 md:gap-8">
        {/* Avatar */}
        <div className="relative group/avatar">
          <div className="h-40 w-40 rounded-3xl border-4 border-background bg-background-card overflow-hidden shadow-2xl relative">
            <img
              src={
                user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`
              }
              alt={user.displayName}
              className="h-full w-full object-cover transition-transform duration-500 group-hover/avatar:scale-110"
            />
          </div>
          {user.role === 'artist' && (
            <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-primary rounded-xl flex items-center justify-center border-4 border-background shadow-lg">
              <Disc className="h-5 w-5 text-white" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 pb-4 space-y-4 text-center md:text-left">
          <div className="space-y-1">
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-2">
              <h1 className="text-4xl font-extrabold text-white tracking-tight">
                {user.displayName || user.username}
              </h1>
              {user.role === 'artist' && (
                <Verified className="h-6 w-6 text-primary fill-primary/10" />
              )}
            </div>
            <p className="text-text-secondary text-lg font-medium opacity-80">@{user.username}</p>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-6 gap-y-2 text-sm text-text-muted font-medium">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>On-chain</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                Joined{' '}
                {new Date(user.createdAt).toLocaleDateString(undefined, {
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
            <button
              onClick={copyAddress}
              className="flex items-center gap-2 hover:text-white transition-colors group/addr"
            >
              <span className="font-mono text-xs bg-white/5 px-2 py-1 rounded-md border border-white/5 group-hover/addr:border-primary/50 transition-all">
                {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
              </span>
              <Copy className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pb-4">
          {isOwnProfile ? (
            <>
              <Button
                variant="secondary"
                onClick={onEdit}
                className="h-12 px-6 rounded-xl font-bold gap-2 bg-white/5 border-white/10 hover:bg-white/10"
              >
                <Settings className="h-5 w-5" />
                Edit Profile
              </Button>
              <Button
                variant="secondary"
                className="h-12 w-12 p-0 rounded-xl bg-white/5 border-white/10 hover:bg-white/10"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <>
              {user.role === 'artist' && (
                <Button
                  variant="primary"
                  className="h-12 px-8 rounded-xl font-bold gap-2 shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                >
                  Follow
                </Button>
              )}
              <Button
                variant="secondary"
                className="h-12 w-12 p-0 rounded-xl bg-white/5 border-white/10 hover:bg-white/10"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
      </div>

      {user.bio && (
        <div className="mt-8 px-2 max-w-2xl">
          <p className="text-text-secondary leading-relaxed text-lg italic opacity-90">
            "{user.bio}"
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="mt-12 grid grid-cols-3 gap-8 md:gap-16 border-t border-white/5 pt-12 max-w-2xl">
        <div className="space-y-1">
          <p className="text-3xl font-extrabold text-white tabular-nums tracking-tight">124</p>
          <p className="text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-1.5">
            <Disc className="h-3 w-3" />
            NFTs Owned
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-3xl font-extrabold text-white tabular-nums tracking-tight">12</p>
          <p className="text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-1.5">
            <Users className="h-3 w-3" />
            Following
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-3xl font-extrabold text-white tabular-nums tracking-tight">8</p>
          <p className="text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-1.5">
            <Verified className="h-3 w-3" />
            Playlists
          </p>
        </div>
      </div>
    </div>
  )
}
