export type UserRole = 'listener' | 'artist'

export interface User {
  id: string
  walletAddress: string
  role: UserRole
  username: string
  displayName?: string
  bio?: string
  email?: string
  avatar?: string
  balance: {
    usdc: number
    usdt: number
  }
  createdAt: string
}

export interface Artist extends User {
  role: 'artist'
  displayName: string
  coverImage?: string
  verified: boolean
  stats: {
    totalSales: number
    totalListeners: number
    projectsReleased: number
  }
}

export type ProjectType = 'album' | 'ep' | 'mixtape' | 'single'

export interface Track {
  id: string
  title: string
  duration: number // in seconds
  trackNumber: number
  lyrics?: string
  fileUrl: string // will be IPFS later
}

export interface Project {
  id: string
  type: ProjectType
  title: string
  artist: Artist
  coverImage: string
  releaseDate: string
  price: number // in USDC
  totalUnits: number
  availableUnits: number
  tracks: Track[]
  description?: string
  genres: string[]
  contractAddress?: string // NFT contract
  tokenId?: number
}

export interface Purchase {
  id: string
  project: Project
  buyer: User
  price: number
  purchaseDate: string
  txHash?: string
}

export interface Playlist {
  id: string
  name: string
  userId: string
  tracks: Track[]
  coverImage?: string
  createdAt: string
  updatedAt: string
}

export type LayoutView = 'horizontal' | 'collapsed' | 'large-grid' | 'small-grid'
