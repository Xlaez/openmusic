import { useQuery } from '@tanstack/react-query'

// MOCK DATA TYPES
export interface DashboardStats {
  totalSales: number
  totalListeners: number
  projectsReleased: number
  countriesReached: number
  salesChange: number // percentage
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

// MOCK DATA GENERATORS
const generateSalesData = (days: number): SalesDataPoint[] => {
  return Array.from({ length: days }).map((_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (days - 1 - i))
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: Math.floor(Math.random() * 500) + 50,
    }
  })
}

// API HOOKS
export function useDashboardStats(artistId: string) {
  return useQuery({
    queryKey: ['dashboard-stats', artistId],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 600))
      return {
        totalSales: 12450,
        totalListeners: 3240,
        projectsReleased: 12,
        countriesReached: 24,
        salesChange: 15,
      } as DashboardStats
    },
    enabled: !!artistId,
  })
}

export function useSalesChart(artistId: string, range: '30d' | '90d' | 'all') {
  return useQuery({
    queryKey: ['sales-chart', artistId, range],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 800))
      const days = range === '30d' ? 30 : range === '90d' ? 90 : 12
      // For 'all' we simulate months
      if (range === 'all') {
        return Array.from({ length: 12 }).map((_, i) => ({
          date: new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short' }),
          revenue: Math.floor(Math.random() * 5000) + 1000,
        }))
      }
      return generateSalesData(days)
    },
    enabled: !!artistId,
  })
}

export function useTopProjects(artistId: string) {
  return useQuery({
    queryKey: ['top-projects', artistId],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 500))
      return [
        {
          id: '1',
          title: 'Midnight Protocol',
          type: 'Album',
          sales: 450,
          revenue: 9000,
          available: 120,
          total: 1000,
        },
        {
          id: '2',
          title: 'Neon Dreams',
          type: 'EP',
          sales: 120,
          revenue: 1200,
          available: 320,
          total: 500,
        },
        {
          id: '3',
          title: 'Cyber Heart',
          type: 'Single',
          sales: 850,
          revenue: 1700,
          available: 50,
          total: 2000,
        },
        {
          id: '4',
          title: 'Glitch in Time',
          type: 'Single',
          sales: 300,
          revenue: 600,
          available: 150,
          total: 500,
        },
        {
          id: '5',
          title: 'Future Funk',
          type: 'Mixtape',
          sales: 50,
          revenue: 0,
          available: 950,
          total: 1000,
        }, // Free?
      ] as TopProject[]
    },
    enabled: !!artistId,
  })
}

export function useTopBuyers(artistId: string) {
  return useQuery({
    queryKey: ['top-buyers', artistId],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 700))
      return Array.from({ length: 10 }).map((_, i) => ({
        id: `buyer-${i}`,
        username: `@cryptofan${i}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
        purchases: Math.floor(Math.random() * 10) + 1,
        totalSpent: Math.floor(Math.random() * 500) + 20,
        joinDate: 'Jan 2024',
      })) as Buyer[]
    },
    enabled: !!artistId,
  })
}

export function useRecentActivity(artistId: string) {
  return useQuery({
    queryKey: ['recent-activity', artistId],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 1000))
      return Array.from({ length: 8 }).map((_, i) => ({
        id: `act-${i}`,
        user: `@user${Math.floor(Math.random() * 1000)}`,
        action: 'purchased',
        project: 'Midnight Protocol',
        timeAgo: `${i * 15 + 2} mins ago`,
        amount: 20,
      })) as ActivityItem[]
    },
    enabled: !!artistId,
  })
}
