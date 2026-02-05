import { useRef, useEffect } from 'react'
import { usePlayerStore } from '@/store/player'

export function AudioEngine() {
  const audioRef = useRef<HTMLAudioElement>(null)

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
  } = usePlayerStore()

  // Handle Play/Pause and Source
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (!currentTrack) {
      audio.pause()
      audio.src = ''
      return
    }

    // If source changed
    if (currentTrack.fileUrl && audio.src !== currentTrack.fileUrl) {
      audio.src = currentTrack.fileUrl
      audio.load()
      // If was playing or intended to play
      if (isPlaying) {
        audio.play().catch((e) => {
          console.error('Playback failed', e)
          setPlaying(false)
        })
      }
    } else {
      // Just toggle
      if (isPlaying) {
        audio.play().catch((e) => console.error('Play error', e))
      } else {
        audio.pause()
      }
    }

    // Media Session
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.artist.name,
        artwork: [{ src: currentTrack.coverImage, sizes: '512x512', type: 'image/jpeg' }],
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
  }, [currentTrack, isPlaying, setPlaying])

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
      // Sync minimal internal state, but also sync store
      // We sync store for UI.
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

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    // Only seek if difference is significant
    if (Math.abs(audio.currentTime - usePlayerStore.getState().currentTime) > 1) {
      audio.currentTime = usePlayerStore.getState().currentTime
    }
  }, [usePlayerStore.getState().currentTime])

  return <audio ref={audioRef} preload="auto" crossOrigin="anonymous" />
}
