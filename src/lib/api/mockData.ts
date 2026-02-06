import type { Artist, Project, User, Track } from '@/types'

const MOCK_IMAGES = [
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80',
  'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=800&q=80',
  'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80',
  'https://images.unsplash.com/photo-1514525253440-b393452eeb25?w=800&q=80',
  'https://images.unsplash.com/photo-1459749411177-0473ef48ee4c?w=800&q=80',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80',
]

const ARTIST_NAMES = [
  'Neon Pulse',
  'Cyber Soul',
  'Quantum Beats',
  'Ether Wave',
  'Digital Dream',
  'Sonic Horizon',
  'Pixel Harmony',
  'Void Echo',
  'Crypto Chord',
  'Meta Melody',
]
const ALBUM_TITLES = [
  'Midnight Protocol',
  'Virtual Reality',
  'Blockchain Blues',
  'Smart Contract Symphony',
  'Decentralized Dreams',
  'Tokenized Tears',
  'Future Funk',
  'Synthwave Sunset',
  'Crypto Winter',
  'Bull Run Ballads',
]

export const mockArtists: Artist[] = ARTIST_NAMES.map((name, i) => ({
  id: `artist-${i}`,
  walletAddress: `0x${Math.random().toString(16).slice(2)}`,
  role: 'artist',
  username: name.toLowerCase().replace(' ', ''),
  displayName: name,
  bio: `Exploring the boundaries of sound and technology. ${name} brings you the future of music.`,
  coverImage: MOCK_IMAGES[i % MOCK_IMAGES.length],
  verified: Math.random() > 0.3,
  balance: { usdc: 1000, usdt: 500 },
  createdAt: new Date().toISOString(),
  stats: {
    totalSales: Math.floor(Math.random() * 1000),
    totalListeners: Math.floor(Math.random() * 50000),
    projectsReleased: Math.floor(Math.random() * 10) + 1,
  },
}))

const generateTracks = (count: number): Track[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `track-${Math.random().toString(36).substr(2, 9)}`,
    title: `Track ${i + 1}`,
    duration: 120 + Math.floor(Math.random() * 180),
    trackNumber: i + 1,
    fileUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Placeholder audio
  }))
}

export const mockProjects: Project[] = Array.from({ length: 25 }).map((_, i) => {
  const artist = mockArtists[i % mockArtists.length]
  const type = ['album', 'ep', 'single'][Math.floor(Math.random() * 3)] as any
  const trackCount = type === 'single' ? 1 : type === 'ep' ? 4 : 10

  return {
    id: `project-${i}`,
    type,
    title:
      ALBUM_TITLES[i % ALBUM_TITLES.length] +
      (Math.floor(i / 10) > 0 ? ` Vol. ${Math.floor(i / 10) + 1}` : ''),
    artist,
    coverImage: `https://picsum.photos/seed/${i}/400/400`,
    releaseDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
    price: 5 + Math.floor(Math.random() * 45),
    totalUnits: 1000,
    availableUnits: Math.floor(Math.random() * 900),
    tracks: generateTracks(trackCount),
    description: 'A masterpiece of sonic engineering.',
    genres: ['Electronic', 'Hip Hop'].slice(0, Math.floor(Math.random() * 2) + 1),
    contractAddress: `0x${Math.random().toString(16).slice(2)}`,
    tokenId: i,
  }
})

export const mockUser: User = {
  id: 'user-1',
  walletAddress: '0x123...abc',
  role: 'artist',
  username: 'music_fan',
  balance: { usdc: 500, usdt: 100 },
  createdAt: new Date().toISOString(),
  avatar: 'https://github.com/shadcn.png',
}

export const getProjectById = (id: string) => mockProjects.find((p) => p.id === id)
export const getArtistById = (id: string) => mockArtists.find((a) => a.id === id)

export const mockNotifications = [
  {
    id: '1',
    type: 'drop',
    title: 'New Drop from Neon Pulse',
    description: 'Midnight Protocol Vol. 2 is now available for purchase.',
    time: '2 hours ago',
    unread: true,
  },
  {
    id: '2',
    type: 'sale',
    title: 'Item Sold!',
    description: 'Someone purchased your "Blockchain Blues" NFT for 25 USDC.',
    time: '5 hours ago',
    unread: true,
  },
  {
    id: '3',
    type: 'system',
    title: 'Welcome to OpenMusic!',
    description: 'Start exploring and collecting music NFTs directly from your favorite artists.',
    time: '1 day ago',
    unread: false,
  },
  {
    id: '4',
    type: 'follow',
    title: 'New Follower',
    description: 'Crypto Chord started following you.',
    time: '2 days ago',
    unread: false,
  },
]
