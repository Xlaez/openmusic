import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Project, Track as DomainTrack, Playlist } from '@/types'

// Enhanced Track type for player including project metadata
export interface Track {
  id: string
  title: string
  artist: { id: string; name: string; avatar?: string }
  coverImage: string
  duration: number
  fileUrl: string
  lyrics?: string
  timedLyrics?: { time: number; text: string }[]
  projectId: string
}

interface PlayerState {
  // Playback
  currentTrack: Track | null
  queue: Track[]
  originalQueue: Track[] // For unstuffing
  queueIndex: number
  isPlaying: boolean
  currentTime: number // Synced periodically
  duration: number
  volume: number
  isMuted: boolean

  // Modes
  shuffle: boolean
  repeat: 'off' | 'all' | 'one'

  // UI
  isLyricsOpen: boolean
  isQueueOpen: boolean
  isExpanded: boolean // full-screen player mode

  // Actions
  playTrack: (track: Track, queue?: Track[]) => void
  playProject: (project: Project) => void
  playPlaylist: (playlist: Playlist) => void
  togglePlay: () => void
  setPlaying: (isPlaying: boolean) => void
  nextTrack: () => void
  prevTrack: () => void
  seekTo: (time: number) => void
  setVolume: (volume: number) => void
  toggleMute: () => void
  toggleShuffle: () => void
  toggleRepeat: () => void
  addToQueue: (track: Track) => void
  removeFromQueue: (index: number) => void
  reorderQueue: (newQueue: Track[]) => void // Simplified signature for dnd-kit
  updateCurrentTime: (time: number) => void
  updateDuration: (duration: number) => void
  toggleLyrics: () => void
  toggleQueue: () => void
  toggleExpanded: () => void
  closeExpanded: () => void
  clearQueue: () => void
  setTimedLyrics: (lyrics: { time: number; text: string }[]) => void
}

const mapDomainTrackToPlayerTrack = (track: DomainTrack, project: Project): Track => ({
  id: track.id,
  title: track.title,
  artist: {
    id: project.artist.id,
    name: project.artist.displayName,
    avatar: project.artist.coverImage,
  },
  coverImage: project.coverImage,
  duration: track.duration,
  fileUrl: track.fileUrl,
  lyrics: track.lyrics,
  timedLyrics: track.timedLyrics,
  projectId: project.id,
})

// Fisher-Yates shuffle
const shuffleArray = <T>(array: T[]) => {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      // Initial State
      currentTrack: null,
      queue: [],
      originalQueue: [],
      queueIndex: -1,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 80,
      isMuted: false,
      shuffle: false,
      repeat: 'off',
      isLyricsOpen: false,
      isQueueOpen: false,
      isExpanded: false,

      // Actions
      playTrack: (track, newQueue) => {
        const { shuffle } = get()
        let finalQueue = newQueue || [track]
        let originalQueue = [...finalQueue]
        let index = finalQueue.findIndex((t) => t.id === track.id)

        if (shuffle && newQueue) {
          // Keep current track first, shuffle the rest
          const rest = finalQueue.filter((t) => t.id !== track.id)
          finalQueue = [track, ...shuffleArray(rest)]
          index = 0
        }

        set({
          currentTrack: track,
          queue: finalQueue,
          originalQueue: originalQueue,
          queueIndex: index,
          isPlaying: true,
          currentTime: 0,
          isExpanded: false, // Don't auto expand on new track usually
        })
      },

      playProject: (project) => {
        const tracks = project.tracks.map((t) => mapDomainTrackToPlayerTrack(t, project))
        get().playTrack(tracks[0], tracks)
      },

      playPlaylist: (playlist) => {
        // Mock mapping since playlist structure might differ slightly or need project fetching
        // For now assuming playlist tracks have enough info or we fetch it.
        // Given current types, Playlist tracks are DomainTrack but we lack Project info.
        // This is a gap in the types/mock data.
        // FALLBACK: map with dummy project info for now to satisfy types
        const tracks = playlist.tracks.map((t) => ({
          id: t.id,
          title: t.title,
          artist: { id: 'unknown', name: 'Unknown Artist' },
          coverImage: playlist.coverImage || '',
          duration: t.duration,
          fileUrl: t.fileUrl,
          projectId: 'playlist-' + playlist.id,
        }))
        get().playTrack(tracks[0], tracks)
      },

      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

      setPlaying: (val) => set({ isPlaying: val }),

      nextTrack: () => {
        const { queue, queueIndex, repeat } = get()
        if (queue.length === 0) return

        let nextIndex = queueIndex + 1

        if (nextIndex >= queue.length) {
          if (repeat === 'all') {
            nextIndex = 0
          } else {
            // Stop playback or loop single?
            // If repeat is one, we normally just loop current, handled by 'ended' event mostly
            // But manual next should probably go to next track or wrap if repeat all
            set({ isPlaying: false, currentTime: 0 })
            return
          }
        }

        set({
          currentTrack: queue[nextIndex],
          queueIndex: nextIndex,
          currentTime: 0,
          isPlaying: true,
        })
      },

      prevTrack: () => {
        const { queue, queueIndex, currentTime } = get()
        // If > 3 seconds, restart track
        if (currentTime > 3) {
          set({ currentTime: 0 }) // AudioEngine will obey this
          return
        }

        const prevIndex = queueIndex - 1
        if (prevIndex < 0) return // or loop to end?

        set({
          currentTrack: queue[prevIndex],
          queueIndex: prevIndex,
          currentTime: 0,
          isPlaying: true,
        })
      },

      seekTo: (time) => set({ currentTime: time }),

      setVolume: (volume) => set({ volume }),

      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

      toggleShuffle: () => {
        const { shuffle, queue, currentTrack, originalQueue } = get()
        const newShuffle = !shuffle

        let newQueue = [...queue]
        let newIndex = get().queueIndex

        if (newShuffle) {
          // Turn ON shuffle
          if (currentTrack) {
            const rest = originalQueue.filter((t) => t.id !== currentTrack.id)
            newQueue = [currentTrack, ...shuffleArray(rest)]
            newIndex = 0
          } else {
            newQueue = shuffleArray(originalQueue)
            newIndex = -1
          }
        } else {
          // Turn OFF shuffle - restore original order
          newQueue = [...originalQueue]
          if (currentTrack) {
            newIndex = newQueue.findIndex((t) => t.id === currentTrack.id)
          }
        }

        set({ shuffle: newShuffle, queue: newQueue, queueIndex: newIndex })
      },

      toggleRepeat: () =>
        set((state) => {
          const modes: ('off' | 'all' | 'one')[] = ['off', 'all', 'one']
          const next = modes[(modes.indexOf(state.repeat) + 1) % modes.length]
          return { repeat: next }
        }),

      addToQueue: (track) =>
        set((state) => {
          const newQueue = [...state.queue, track]
          const newOriginal = [...state.originalQueue, track]
          return { queue: newQueue, originalQueue: newOriginal }
        }),

      removeFromQueue: (index) =>
        set((state) => {
          const newQueue = [...state.queue]
          newQueue.splice(index, 1)
          // Sync original queue remove? Complex if shuffled.
          // For simplicity, lets just update queue. Re-shuffle might be weird.
          // Better: just remove from both if possible, or just queue.
          return { queue: newQueue }
        }),

      reorderQueue: (newQueue) => set({ queue: newQueue }),

      clearQueue: () => set({ queue: [], originalQueue: [], currentTrack: null, isPlaying: false }),

      updateCurrentTime: (time) => set({ currentTime: time }),

      updateDuration: (duration) => set({ duration }),

      toggleLyrics: () => set((state) => ({ isLyricsOpen: !state.isLyricsOpen })),

      toggleQueue: () => set((state) => ({ isQueueOpen: !state.isQueueOpen })),

      toggleExpanded: () => set((state) => ({ isExpanded: !state.isExpanded })),

      closeExpanded: () => set({ isExpanded: false }),
      setTimedLyrics: (lyrics) =>
        set((state) => {
          if (!state.currentTrack) return state
          const updatedTrack = { ...state.currentTrack, timedLyrics: lyrics }
          // Update in queue as well
          const newQueue = state.queue.map((t) => (t.id === updatedTrack.id ? updatedTrack : t))
          return { currentTrack: updatedTrack, queue: newQueue }
        }),
    }),
    {
      name: 'player-storage',
      partialize: (state) => ({
        volume: state.volume,
        shuffle: state.shuffle,
        repeat: state.repeat,
      }), // Only persist preferences, not current track state which might be stale
    },
  ),
)
