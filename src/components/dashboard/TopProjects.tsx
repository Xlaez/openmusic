import type { TopProject } from '@/lib/api/dashboard'
import { Card } from '@/components/ui/Card'
import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'

export function TopProjects({ projects }: { projects: TopProject[] }) {
  return (
    <Card className="flex flex-col h-full bg-background-card border-white/5">
      <div className="p-6 border-b border-white/5 flex justify-between items-center">
        <h3 className="font-bold text-white">Top Projects</h3>
        <Link
          to="/library"
          className="text-xs text-primary hover:text-primary/80 flex items-center"
        >
          View All <ArrowUpRight className="h-3 w-3 ml-1" />
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-text-muted font-medium border-b border-white/5 bg-white/[0.02]">
            <tr>
              <th className="p-4 pl-6">Project</th>
              <th className="p-4">Type</th>
              <th className="p-4 text-right">Revenue</th>
              <th className="p-4 text-right">Sales</th>
              <th className="p-4 text-right pr-6">Stock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {projects.map((project) => (
              <tr
                key={project.id}
                className="hover:bg-white/5 transition-colors group cursor-pointer relative"
              >
                <td className="p-4 pl-6 font-medium text-white group-hover:text-primary transition-colors">
                  <Link
                    to="/project/$projectId"
                    params={{ projectId: project.id }}
                    className="absolute inset-0"
                  />
                  {project.title}
                </td>
                <td className="p-4 text-text-muted capitalize">{project.type}</td>
                <td className="p-4 text-right font-medium text-white">
                  ${project.revenue.toLocaleString()}
                </td>
                <td className="p-4 text-right text-text-secondary">{project.sales}</td>
                <td className="p-4 text-right pr-6 text-text-muted">
                  {project.available} / {project.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
