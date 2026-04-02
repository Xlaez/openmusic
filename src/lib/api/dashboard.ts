import { useQuery } from '@tanstack/react-query'
import { apiFetch } from './client'

// Types
export interface DashboardStats {
  totalSales: number
  totalListeners: number
  projectsReleased: number
  countriesReached: number
  salesChange: number
}

export interface SalesDataPoint {
  date: string
  revenue: number
}

export interface TopProject {
  id: string
  title: string
  type: string
  sales: number
  revenue: number
  available: number
  total: number
}

export interface Buyer {
  id: string
  username: string
  avatar: string
  purchases: number
  totalSpent: number
  joinDate: string
}

export interface ActivityItem {
  id: string
  user: string
  action: string
  project: string
  timeAgo: string
  amount?: number
}

export function useDashboardStats(artistId: string) {
  return useQuery({
    queryKey: ['dashboard-stats', artistId],
    queryFn: () => apiFetch<DashboardStats>(`/dashboard/stats/${artistId}`),
    enabled: !!artistId,
  })
}

export function useSalesChart(artistId: string, range: '30d' | '90d' | 'all') {
  return useQuery({
    queryKey: ['sales-chart', artistId, range],
    queryFn: () => apiFetch<SalesDataPoint[]>(`/dashboard/sales/${artistId}?range=${range}`),
    enabled: !!artistId,
  })
}

export function useTopProjects(artistId: string) {
  return useQuery({
    queryKey: ['top-projects', artistId],
    queryFn: () => apiFetch<TopProject[]>(`/dashboard/top-projects/${artistId}`),
    enabled: !!artistId,
  })
}

export function useTopBuyers(artistId: string) {
  return useQuery({
    queryKey: ['top-buyers', artistId],
    queryFn: () => apiFetch<Buyer[]>(`/dashboard/top-buyers/${artistId}`),
    enabled: !!artistId,
  })
}

export function useRecentActivity(artistId: string) {
  return useQuery({
    queryKey: ['recent-activity', artistId],
    queryFn: () => apiFetch<ActivityItem[]>(`/dashboard/activity/${artistId}`),
    enabled: !!artistId,
  })
}
