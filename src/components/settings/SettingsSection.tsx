import type { ReactNode } from 'react'

interface SettingsSectionProps {
  title: string
  description?: string
  children: ReactNode
}

export function SettingsSection({ title, description, children }: SettingsSectionProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
        {description && <p className="text-sm text-text-muted">{description}</p>}
      </div>
      <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
        {children}
      </div>
    </div>
  )
}

interface SettingsItemProps {
  label: string
  description?: string
  children: ReactNode
}

export function SettingsItem({ label, description, children }: SettingsItemProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 hover:bg-white/[0.02] transition-colors">
      <div className="space-y-1">
        <p className="font-bold text-white text-base">{label}</p>
        {description && (
          <p className="text-xs text-text-muted pr-8 leading-relaxed">{description}</p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}
