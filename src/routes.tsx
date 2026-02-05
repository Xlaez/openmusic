import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import { Layout } from '@/components/layout/Layout'
import { Home } from '@/features/home/Home'
import { Explore } from '@/features/explore/Explore'
import { Library } from '@/features/library/Library'

import { NotFoundPage } from '@/features/error/NotFoundPage'

const rootRoute = createRootRoute({
  component: Layout,
  notFoundComponent: NotFoundPage,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
})

import { SearchPage } from '@/features/search/SearchPage'

const exploreRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/explore',
  component: Explore,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      filter: (search.filter as string) || 'all',
      q: (search.q as string) || '',
    }
  },
})

const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/search', // Keep /search explicit if user wants direct link, though sidebar usually goes to /explore with query
  // Actually Prompt asked for "See all results link navigates to /search?q=query"
  // But SearchBar navigates to /explore currently in my impl.
  // Let's fix SearchBar to point to /search OR /explore?q=.
  // The Prompt says "Search results page (/search)".
  // So I should implement /search.
  component: SearchPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      q: (search.q as string) || '',
    }
  },
})

const libraryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/library',
  component: Library,
})

import { ArtistProfilePage } from '@/features/artist/ArtistProfilePage'
import { ProjectDetailPage } from '@/features/project/ProjectDetailPage'

const artistRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/artist/$artistId',
  component: ArtistProfilePage,
})

const projectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/project/$projectId',
  component: ProjectDetailPage,
})

import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { UploadFlow } from '@/features/dashboard/upload/UploadFlow'

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardPage,
})

const uploadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard/upload',
  component: UploadFlow,
})

import { SignupPage } from '@/features/auth/SignupPage'
import { WalletPage } from '@/features/wallet/WalletPage'
import { ProfilePage } from '@/features/profile/ProfilePage'
import { SettingsPage } from '@/features/settings/SettingsPage'

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth/signup',
  component: SignupPage,
})

const walletRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/wallet',
  component: WalletPage,
})

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage,
})

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  exploreRoute,
  libraryRoute,
  searchRoute,
  artistRoute,
  projectRoute,
  dashboardRoute,
  uploadRoute,
  signupRoute,
  walletRoute,
  profileRoute,
  settingsRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
