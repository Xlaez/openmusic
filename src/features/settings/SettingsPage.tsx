import { useState } from 'react'
import { SettingsSection, SettingsItem } from '@/components/settings/SettingsSection'
import { Button } from '@/components/ui/Button'
import { LogOut, ChevronRight } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { useAuth } from '@/lib/auth/useAuth'

export function SettingsPage() {
  const { user } = useAuthStore()
  const { logout } = useAuth()
  const [quality, setQuality] = useState('high')
  const [autoplay, setAutoplay] = useState(true)

  if (!user) return null

  return (
    <div className="max-w-4xl mx-auto space-y-16 animate-in fade-in duration-700 pb-20">
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Settings</h1>
        <p className="text-text-secondary text-lg">Manage your account and app preferences.</p>
      </div>

      <div className="space-y-12">
        {/* Account */}
        <SettingsSection title="Account" description="Manage your identity and wallet connection.">
          <SettingsItem
            label="Wallet Address"
            description="The public address associated with your account."
          >
            <span className="font-mono text-sm text-text-muted px-3 py-1.5 bg-white/5 rounded-lg border border-white/5">
              {user.walletAddress}
            </span>
          </SettingsItem>
          <SettingsItem
            label="Connected Email"
            description="Used for project updates and security."
          >
            <span className="text-white font-medium">{user.username}@gmail.com</span>
          </SettingsItem>
          <button className="w-full flex items-center justify-between p-6 hover:bg-white/[0.02] transition-colors group">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500">
                <LogOut className="h-5 w-5" />
              </div>
              <span className="font-bold text-red-500">Logout of all sessions</span>
            </div>
            <ChevronRight className="h-5 w-5 text-text-muted transition-transform group-hover:translate-x-1" />
          </button>
        </SettingsSection>

        {/* Preferences */}
        <SettingsSection title="Playback & UI" description="Customize your listening experience.">
          <SettingsItem label="Audio Quality" description="Higher quality uses more data.">
            <div className="flex bg-white/5 p-1 rounded-xl">
              {['low', 'medium', 'high'].map((q) => (
                <button
                  key={q}
                  onClick={() => setQuality(q)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    quality === q
                      ? 'bg-primary text-white shadow-lg'
                      : 'text-text-muted hover:text-white'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </SettingsItem>
          <SettingsItem
            label="Autoplay"
            description="Automatically play similar tracks when your queue ends."
          >
            <button
              onClick={() => setAutoplay(!autoplay)}
              className={`h-7 w-12 rounded-full p-1 transition-all ${autoplay ? 'bg-primary' : 'bg-white/10'}`}
            >
              <div
                className={`h-5 w-5 bg-white rounded-full shadow-lg transition-all ${autoplay ? 'translate-x-5' : 'translate-x-0'}`}
              />
            </button>
          </SettingsItem>
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection title="Notifications" description="Control when and how you stay updated.">
          <SettingsItem
            label="Project Updates"
            description="Get notified when followed artists drop new music."
          >
            <input type="checkbox" defaultChecked className="h-5 w-5 accent-primary" />
          </SettingsItem>
          <SettingsItem
            label="Marketing Emails"
            description="Stay in the loop with news and releases."
          >
            <input type="checkbox" className="h-5 w-5 accent-primary" />
          </SettingsItem>
        </SettingsSection>

        {/* Danger Zone */}
        <div className="pt-8 border-t border-white/5">
          <Button
            variant="ghost"
            onClick={logout}
            className="text-red-500 hover:text-red-400 hover:bg-red-500/5 font-bold gap-2 rounded-xl"
          >
            <LogOut className="h-4 w-4" />
            Log Out
          </Button>
        </div>
      </div>
    </div>
  )
}
