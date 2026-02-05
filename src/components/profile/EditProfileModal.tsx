import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { X, Camera, Loader2, Sparkles, User, FileText } from 'lucide-react'

interface EditProfileModalProps {
  user: any
  onClose: () => void
  onSave: (updates: any) => void
}

export function EditProfileModal({ user, onClose, onSave }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    displayName: user.displayName || '',
    username: user.username || '',
    bio: user.bio || '',
    avatar: user.avatar || '',
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((r) => setTimeout(r, 1000))
    onSave(formData)
    setIsSaving(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <Card className="max-w-lg w-full p-8 border-white/5 bg-background-card space-y-8 relative overflow-hidden group">
        <div className="absolute -right-20 -top-20 h-40 w-40 bg-primary/5 rounded-full blur-3xl transition-all group-hover:bg-primary/10" />

        <div className="flex justify-between items-center relative z-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Edit Profile</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full text-text-muted transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6 relative z-10">
          {/* Avatar Edit */}
          <div className="flex justify-center">
            <div className="relative group/avatar">
              <div className="h-28 w-28 rounded-3xl overflow-hidden bg-white/5 border border-white/10 shadow-xl">
                <img
                  src={
                    formData.avatar ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.username}`
                  }
                  className="h-full w-full object-cover"
                />
              </div>
              <button className="absolute -bottom-2 -right-2 h-10 w-10 bg-primary rounded-xl flex items-center justify-center border-4 border-background-card shadow-lg hover:scale-110 active:scale-95 transition-all text-white">
                <Camera className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-muted uppercase tracking-widest pl-1 flex items-center gap-2">
                <User className="h-3 w-3" />
                Display Name
              </label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-white/10"
                placeholder="Your name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-text-muted uppercase tracking-widest pl-1 flex items-center gap-2">
                <span className="text-text-muted">@</span>
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-white/10"
                placeholder="username"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-text-muted uppercase tracking-widest pl-1 flex items-center gap-2">
                <FileText className="h-3 w-3" />
                Bio
              </label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-white/10 resize-none"
                placeholder="Tell your fans about yourself..."
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 relative z-10 pt-4">
          <Button variant="ghost" onClick={onClose} className="flex-1 h-14 rounded-2xl font-bold">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isSaving}
            className="flex-[2] h-14 rounded-2xl text-lg font-bold gap-3 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                Saving...
              </>
            ) : (
              <>Save Changes</>
            )}
          </Button>
        </div>
      </Card>
    </div>
  )
}
