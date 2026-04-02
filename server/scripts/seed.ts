import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

import { User } from '../models/User.js'
import { Project } from '../models/Project.js'
import { Purchase } from '../models/Purchase.js'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/openmusic'

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

const GENRES = [
  'Electronic',
  'Hip Hop',
  'Grime',
  'House',
  'Techno',
  'R&B',
  'Pop',
  'Ambient',
  'Drum & Bass',
  'Dubstep',
]

async function seed() {
  console.log('🌱 Seeding database...')
  console.log(`   Connecting to: ${MONGODB_URI}`)

  await mongoose.connect(MONGODB_URI)
  console.log('   Connected to MongoDB')

  // Clear existing data
  await User.deleteMany({})
  await Project.deleteMany({})
  await Purchase.deleteMany({})
  console.log('   Cleared existing data')

  // Create a test listener user
  const listener = await User.create({
    privyId: 'dev-listener',
    walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
    role: 'listener',
    username: 'music_fan',
    displayName: 'Music Fan',
    email: 'fan@openmusic.io',
    avatar: 'https://github.com/shadcn.png',
    balance: { usdc: 500, usdt: 100 },
    stats: { totalSales: 0, totalListeners: 0, projectsReleased: 0 },
  })
  console.log('   Created test listener: music_fan')

  // Create artists
  const artists = []
  for (let i = 0; i < ARTIST_NAMES.length; i++) {
    const name = ARTIST_NAMES[i]
    const artist = await User.create({
      privyId: `dev-artist-${i}`,
      walletAddress: `0x${(i + 1).toString(16).padStart(40, '0')}`,
      role: 'artist',
      username: name.toLowerCase().replace(/\s/g, ''),
      displayName: name,
      bio: `Exploring the boundaries of sound and technology. ${name} brings you the future of music.`,
      avatar: MOCK_IMAGES[i % MOCK_IMAGES.length],
      coverImage: MOCK_IMAGES[(i + 2) % MOCK_IMAGES.length],
      verified: Math.random() > 0.3,
      balance: { usdc: 1000, usdt: 500 },
      stats: {
        totalSales: Math.floor(Math.random() * 1000),
        totalListeners: Math.floor(Math.random() * 50000),
        projectsReleased: 0, // Will be updated after creating projects
      },
    })
    artists.push(artist)
  }
  console.log(`   Created ${artists.length} artists`)

  // Create Wiley & Skepta as the first artist for the special project
  const wileySkeptaArtist = artists[0]
  await User.findByIdAndUpdate(wileySkeptaArtist._id, {
    displayName: 'Wiley & Skepta',
    username: 'wileyskeptagrime',
    bio: 'Legends of Grime and Electronic music, pushing boundaries since day one.',
    verified: true,
  })

  // Create projects
  const projects = []

  // Special project: GRIME&ELECTRONIC EP
  const grimeEP = await Project.create({
    type: 'ep',
    title: 'GRIME&ELECTRONIC',
    artist: wileySkeptaArtist._id,
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80',
    releaseDate: new Date(),
    price: 30,
    totalUnits: 1000,
    availableUnits: 842,
    tracks: [
      {
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
        title: 'London',
        duration: 198,
        trackNumber: 4,
        fileUrl: '/music/Skepta_London.mp3',
        timedLyrics: [
          { time: 0, text: "London city, where it's at" },
          { time: 10, text: 'From Meridian to the Hackney flats' },
        ],
      },
    ],
    description: 'A heavy-hitting collaboration between legends of Grime and Electronic music.',
    genres: ['Grime', 'Electronic'],
    contractAddress: `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
    tokenId: 0,
  })
  projects.push(grimeEP)

  // Generate 24 more projects
  const projectTypes: ('album' | 'ep' | 'single' | 'mixtape')[] = ['album', 'ep', 'single', 'mixtape']

  for (let i = 1; i < 25; i++) {
    const artist = artists[i % artists.length]
    const type = projectTypes[Math.floor(Math.random() * projectTypes.length)]
    const trackCount = type === 'single' ? 1 : type === 'ep' ? 4 : type === 'mixtape' ? 6 : 10

    const tracks = Array.from({ length: trackCount }).map((_, t) => ({
      title: `Track ${t + 1}`,
      duration: 120 + Math.floor(Math.random() * 180),
      trackNumber: t + 1,
      fileUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    }))

    const title =
      ALBUM_TITLES[i % ALBUM_TITLES.length] +
      (Math.floor(i / 10) > 0 ? ` Vol. ${Math.floor(i / 10) + 1}` : '')

    const project = await Project.create({
      type,
      title,
      artist: artist._id,
      coverImage: `https://picsum.photos/seed/${i}/400/400`,
      releaseDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
      price: Math.floor(Math.random() * 40) + 10,
      totalUnits: Math.floor(Math.random() * 900) + 100,
      availableUnits: Math.floor(Math.random() * 800) + 50,
      tracks,
      description: `A masterpiece of sonic engineering from ${artist.displayName}.`,
      genres: [GENRES[Math.floor(Math.random() * GENRES.length)], GENRES[Math.floor(Math.random() * GENRES.length)]],
      contractAddress: `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      tokenId: i,
    })

    projects.push(project)
  }
  console.log(`   Created ${projects.length} projects`)

  // Update artist projectsReleased counts
  for (const artist of artists) {
    const count = await Project.countDocuments({ artist: artist._id })
    await User.findByIdAndUpdate(artist._id, { 'stats.projectsReleased': count })
  }

  // Create some mock purchases
  let purchaseCount = 0
  for (let i = 0; i < 50; i++) {
    const project = projects[Math.floor(Math.random() * projects.length)]
    const buyer = Math.random() > 0.3 ? listener : artists[Math.floor(Math.random() * artists.length)]

    // Don't let an artist buy their own project
    if (buyer._id.toString() === project.artist.toString()) continue

    await Purchase.create({
      project: project._id,
      buyer: buyer._id,
      price: project.price,
      txHash: `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      tokenId: i,
      createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
    })
    purchaseCount++
  }
  console.log(`   Created ${purchaseCount} mock purchases`)

  console.log('\n✅ Database seeded successfully!')
  console.log(`   Test listener ID: ${listener._id}`)
  console.log(`   First artist ID: ${artists[0]._id}`)
  console.log(`   First project ID: ${projects[0]._id}`)

  await mongoose.disconnect()
}

seed().catch((error) => {
  console.error('Seed error:', error)
  process.exit(1)
})
