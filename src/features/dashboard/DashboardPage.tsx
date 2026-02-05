import { useState } from 'react'
import {
  useDashboardStats,
  useSalesChart,
  useTopProjects,
  useTopBuyers,
  useRecentActivity,
} from '@/lib/api/dashboard'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { SalesChart } from '@/components/dashboard/SalesChart'
import { TopProjects } from '@/components/dashboard/TopProjects'
import { TopBuyers } from '@/components/dashboard/TopBuyers'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { Button } from '@/components/ui/Button'
import { Loader2, DollarSign, Users, Music, Globe, Upload } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useAuthStore } from '@/store/auth'

export function DashboardPage() {
  const { user } = useAuthStore()
  const [chartRange, setChartRange] = useState<'30d' | '90d' | 'all'>('30d')

  // Guard
  if (!user || user.role !== 'artist') {
    return (
      <div className="p-10 text-center text-red-500">Access Denied. Artist account required.</div>
    )
  }

  const { data: stats, isLoading: statsLoading } = useDashboardStats(user.id)
  const { data: sales, isLoading: salesLoading } = useSalesChart(user.id, chartRange)
  const { data: topProjects } = useTopProjects(user.id)
  const { data: topBuyers } = useTopBuyers(user.id)
  const { data: recentActivity } = useRecentActivity(user.id)

  if (statsLoading || salesLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Artist Dashboard</h1>
          <p className="text-text-muted mt-1">Welcome back, {user.username}</p>
        </div>
        <Link to="/dashboard/upload">
          <Button variant="primary" size="lg" className="rounded-full shadow-lg gap-2">
            <Upload className="h-5 w-5" />
            Upload New Project
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Total Revenue"
          value={`$${stats.totalSales.toLocaleString()}`}
          trend={stats.salesChange}
          icon={<DollarSign className="h-5 w-5" />}
        />
        <StatsCard
          label="Total Listeners"
          value={stats.totalListeners.toLocaleString()}
          subValue="+12% this month"
          icon={<Users className="h-5 w-5" />}
        />
        <StatsCard
          label="Projects Released"
          value={stats.projectsReleased}
          icon={<Music className="h-5 w-5" />}
        />
        <StatsCard
          label="Countries Reached"
          value={stats.countriesReached}
          icon={<Globe className="h-5 w-5" />}
        />
      </div>

      {/* Charts & Tables Grid */}
      <div className="grid lg:grid-cols-3 gap-6 h-auto">
        {/* Main Chart */}
        <div className="lg:col-span-2">
          {sales && <SalesChart data={sales} range={chartRange} onRangeChange={setChartRange} />}
        </div>

        {/* Recent Activity */}
        <div className="bg-background-card border-white/5 rounded-xl">
          {recentActivity && <RecentActivity items={recentActivity} />}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="h-96">{topProjects && <TopProjects projects={topProjects} />}</div>
        <div className="h-96">{topBuyers && <TopBuyers buyers={topBuyers} />}</div>
      </div>
    </div>
  )
}
