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
  // Force project 0 to be the GRIME&ELECTRONIC EP for testing
  const type = i === 0 ? 'ep' : (['album', 'ep', 'single'][Math.floor(Math.random() * 3)] as any)
  const trackCount = i === 0 ? 4 : type === 'single' ? 1 : type === 'ep' ? 4 : 10

  const project = {
    id: `project-${i}`,
    type,
    title:
      i === 0
        ? 'GRIME&ELECTRONIC'
        : ALBUM_TITLES[i % ALBUM_TITLES.length] +
          (Math.floor(i / 10) > 0 ? ` Vol. ${Math.floor(i / 10) + 1}` : ''),
    artist: i === 0 ? { ...artist, displayName: 'Wiley & Skepta' } : artist,
    coverImage:
      i === 0
        ? 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80'
        : `https://picsum.photos/seed/${i}/400/400`,
    releaseDate: new Date().toISOString(),
    price: 30,
    totalUnits: 1000,
    availableUnits: 842,
    tracks:
      i === 0
        ? [
            {
              id: 'track-wiley-1',
              title: 'Givenchy Bag',
              duration: 184,
              trackNumber: 1,
              fileUrl: '/music/GivenchyBag.mp3',
              timedLyrics: [
                { time: 0, text: '[Intro: Wiley]' },
                { time: 5, text: "Yeah, Givenchy bag, I'm at the store" },
                { time: 9, text: 'Spending money, yeah, I need some more' },
                { time: 13, text: 'Wiley, Future, Chip and Nafe' },
                { time: 17, text: "We're top tier, we're the ones they chase" },
                { time: 21, text: '[Verse 1: Nafe Smallz]' },
                { time: 25, text: "I'm in the club and I'm feeling brand new" },
                { time: 29, text: 'Got the Givenchy bags, yeah, for the crew' },
              ],
            },
            {
              id: 'track-skepta-1',
              title: 'Back 2 Back',
              duration: 172,
              trackNumber: 2,
              fileUrl: '/music/Back2Back_SKEPTA.mp3',
              timedLyrics: [
                { time: 0, text: '[Skepta]' },
                { time: 8, text: 'Back to back, we doing it again' },
                { time: 12, text: 'All my brothers, yeah, they my best friends' },
                { time: 16, text: "North London, that's where I'm from" },
                { time: 20, text: "Every beat I touch, it's a home run" },
              ],
            },
            {
              id: 'track-fred-1',
              title: 'Victory Lap',
              duration: 156,
              trackNumber: 3,
              fileUrl: '/music/Fred again_and_Skepta_VictoryLap.mp3',
              timedLyrics: [
                { time: 0, text: '[Intro: Fred again..]' },
                { time: 10, text: "We in the buildin', Skepta here" },
                { time: 15, text: 'Victory lap, no more fear' },
              ],
            },
            {
              id: 'track-skepta-2',
              title: 'London',
              duration: 198,
              trackNumber: 4,
              fileUrl: '/music/Skepta_London.mp3',
              timedLyrics: [
                { time: 0, text: "London city, where it's at" },
                { time: 10, text: 'From Meridian to the Hackney flats' },
              ],
            },
          ]
        : generateTracks(trackCount),
    description:
      i === 0
        ? 'A heavy-hitting collaboration between legends of Grime and Electronic music.'
        : 'A masterpiece of sonic engineering.',
    genres:
      i === 0
        ? ['Grime', 'Electronic']
        : ['Electronic', 'Hip Hop'].slice(0, Math.floor(Math.random() * 2) + 1),
    contractAddress: `0x${Math.random().toString(16).slice(2)}`,
    tokenId: i,
  }

  return project
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
