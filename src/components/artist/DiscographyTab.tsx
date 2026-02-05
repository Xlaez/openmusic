import { useState } from 'react'
import type { Project } from '@/types'
import { ProjectCard } from '@/components/music/ProjectCard'
import { ProjectCardCollapsed } from '@/components/music/ProjectCardCollapsed'
import { FilterChips } from '@/components/ui/FilterChips'
import { ViewSwitcher } from '@/components/library/ViewSwitcher'
import { useUIStore } from '@/store/ui'

interface DiscographyTabProps {
  projects: Project[]
}

export function DiscographyTab({ projects }: DiscographyTabProps) {
  const [filter, setFilter] = useState('all')
  const { layoutView } = useUIStore()

  const filteredProjects = projects.filter((p) => filter === 'all' || p.type === filter)

  const chips = [
    { label: 'All', value: 'all' },
    { label: 'Albums', value: 'album' },
    { label: 'EPs', value: 'ep' },
    { label: 'Singles', value: 'single' },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <FilterChips options={chips} activeValue={filter} onChange={setFilter} />
        <div className="ml-auto">
          <ViewSwitcher />
        </div>
      </div>

      <div
        className={
          layoutView === 'large-grid'
            ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'
            : layoutView === 'small-grid'
              ? 'grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4'
              : 'grid grid-cols-1 gap-2'
        }
      >
        {filteredProjects.map((project) =>
          layoutView === 'collapsed' ? (
            <ProjectCardCollapsed key={project.id} project={project} />
          ) : (
            <ProjectCard key={project.id} project={project} />
          ),
        )}
      </div>
    </div>
  )
}
