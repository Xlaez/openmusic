import { useRef, useEffect } from 'react'
import { usePlayerStore } from '@/store/player'

export function AudioEngine() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const lastTrackId = useRef<string | null>(null)

  const {
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    updateCurrentTime,
    updateDuration,
    nextTrack,
    repeat,
    setPlaying,
    currentTime: storeTime,
  } = usePlayerStore()

  // Handle Play/Pause and Source
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (!currentTrack) {
      audio.pause()
      audio.src = ''
      lastTrackId.current = null
      return
    }

    // Check if the track has actually changed by ID
    if (currentTrack.id !== lastTrackId.current) {
      audio.src = currentTrack.fileUrl
      audio.load()
      lastTrackId.current = currentTrack.id

      if (isPlaying) {
        audio.play().catch((e) => {
          console.error('Playback failed', e)
          setPlaying(false)
        })
      }
    } else {
      // We are on the same track, just sync play/pause state
      if (isPlaying) {
        const playPromise = audio.play()
        if (playPromise !== undefined) {
          playPromise.catch((e) => {
            if (e.name !== 'AbortError') {
              console.error('Play error', e)
            }
          })
        }
      } else {
        audio.pause()
      }
    }

    // Media Session
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.artist.name,
        artwork: [
          { src: currentTrack.coverImage, sizes: '96x96', type: 'image/jpeg' },
          { src: currentTrack.coverImage, sizes: '128x128', type: 'image/jpeg' },
          { src: currentTrack.coverImage, sizes: '192x192', type: 'image/jpeg' },
          { src: currentTrack.coverImage, sizes: '256x256', type: 'image/jpeg' },
          { src: currentTrack.coverImage, sizes: '384x384', type: 'image/jpeg' },
          { src: currentTrack.coverImage, sizes: '512x512', type: 'image/jpeg' },
        ],
      })

      navigator.mediaSession.setActionHandler('play', () => setPlaying(true))
      navigator.mediaSession.setActionHandler('pause', () => setPlaying(false))
      navigator.mediaSession.setActionHandler('previoustrack', () =>
        usePlayerStore.getState().prevTrack(),
      )
      navigator.mediaSession.setActionHandler('nexttrack', () =>
        usePlayerStore.getState().nextTrack(),
      )
    }
  }, [currentTrack?.id, isPlaying, setPlaying])

  // Handle Volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100
    }
  }, [volume, isMuted])

  // Handle Events
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTimeUpdate = () => {
      // Only update store if the audio's own progress has changed significantly
      // to avoid triggering redundant store updates (though Zustand is efficient)
      updateCurrentTime(audio.currentTime)
    }

    const onLoadedMetadata = () => {
      updateDuration(audio.duration)
    }

    const onEnded = () => {
      if (repeat === 'one') {
        audio.currentTime = 0
        audio.play()
      } else {
        nextTrack()
      }
    }

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('ended', onEnded)

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('ended', onEnded)
    }
  }, [updateCurrentTime, updateDuration, nextTrack, repeat])

  // React to store-initiated seeks (e.g. from progress bar)
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    // If store time is significantly different from audio time, assume it's a seek
    if (Math.abs(audio.currentTime - storeTime) > 1.5) {
      audio.currentTime = storeTime
    }
  }, [storeTime])

  return <audio ref={audioRef} preload="auto" crossOrigin="anonymous" />
}
