import { useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { useProject, useRelatedProjects } from '@/lib/api/project'
import { useLibraryStore } from '@/store/library'
import { ProjectHeader } from '@/components/project/ProjectHeader'
import { TrackList } from '@/components/project/TrackList'
import { PurchaseModal } from '@/components/project/PurchaseModal'
import { ProjectCard } from '@/components/music/ProjectCard'
import { Loader2 } from 'lucide-react'

export function ProjectDetailPage() {
  const { projectId } = useParams({ from: '/project/$projectId' })
  const { data: project, isLoading } = useProject(projectId)
  const { data: relatedProjects } = useRelatedProjects(projectId)
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false)
  const { ownedProjects } = useLibraryStore()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!project) return <div className="p-10 text-center text-text-muted">Project not found</div>

  const isOwned = ownedProjects.some((p) => p.id === project.id)

  return (
    <div className="pb-20 space-y-12">
      <ProjectHeader
        project={project}
        isOwned={isOwned}
        onBuy={() => setIsPurchaseModalOpen(true)}
      />

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Main Content: Tracks */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Tracklist</h2>
              <div className="text-sm text-text-muted">{project.tracks.length} songs</div>
            </div>
            <TrackList project={project} tracks={project.tracks} isOwned={isOwned} />
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">About</h2>
            <div className="text-text-secondary leading-relaxed bg-white/5 p-6 rounded-lg">
              <p className="mb-4">{project.description}</p>
              {/* Mock extra metadata */}
              <div className="grid grid-cols-2 gap-4 text-sm mt-6 border-t border-white/10 pt-4">
                <div>
                  <span className="text-text-muted block">Released</span>
                  <span className="text-white">
                    {new Date(project.releaseDate).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-text-muted block">Genre</span>
                  <span className="text-white capitalize">{project.type}</span>
                </div>
                <div>
                  <span className="text-text-muted block">Copyright</span>
                  <span className="text-white">℗ 2024 {project.artist.displayName}</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar: Related */}
        <div className="space-y-8">
          {relatedProjects && relatedProjects.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-white mb-6">More like this</h2>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                {relatedProjects.map((p) => (
                  <div key={p.id}>
                    <ProjectCard project={p} aspect="square" className="bg-transparent p-0" />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <PurchaseModal
        project={project}
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
      />
    </div>
  )
}
