"use client"

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react"

export type MusicTheme = {
  id: string
  name: string
  melodyScale: number[]
  harmonyFrequencies: number[]
  tempo: number
  oscType: OscillatorType
}

export const MUSIC_THEMES: MusicTheme[] = [
  {
    id: "ethereal",
    name: "Ethereal",
    melodyScale: [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00], // C major pentatonic
    harmonyFrequencies: [349.23, 392.00, 440.00, 493.88, 587.33],
    tempo: 200,
    oscType: "sine"
  },
  {
    id: "debussy",
    name: "Clair de Lune",
    melodyScale: [277.18, 311.13, 349.23, 415.30, 466.16, 554.37, 622.25, 698.46, 830.61, 932.33], // Db Major pentatonic
    harmonyFrequencies: [277.18, 349.23, 415.30, 466.16, 554.37], 
    tempo: 280, // slightly slower feel
    oscType: "sine"
  },
  {
    id: "satie",
    name: "Gymnopédie",
    melodyScale: [293.66, 329.63, 370.00, 440.00, 493.88, 587.33, 659.25, 739.99, 880.00, 987.77], // D major scale fragments
    harmonyFrequencies: [293.66, 370.00, 440.00, 554.37, 659.25], 
    tempo: 320, // slower
    oscType: "sine"
  },
  {
    id: "chopin",
    name: "Nocturne",
    melodyScale: [261.63, 311.13, 349.23, 392.00, 466.16, 523.25, 622.25, 698.46, 783.99, 932.33], // C minor pentatonic
    harmonyFrequencies: [261.63, 311.13, 392.00, 466.16, 523.25], 
    tempo: 160, // faster arpeggios
    oscType: "triangle"
  }
]

type AudioContextType = {
  activeThemeId: string
  setMusicTheme: (id: string) => void
  musicThemes: MusicTheme[]
  playClick: () => void
  playKeystroke: () => void
  startMelody: () => void
  stopMelody: () => void
  startHarmony: (freq: number) => void
  stopHarmony: (freq: number) => void
  playSpeech: (text: string) => void
  stopSpeech: () => void
  playThemeToggle: (isGoingDark: boolean) => void
  playExternalLink: () => void
  playHover: () => void
  playSwipe: () => void
  playSwipeClose: () => void
}

const AudioContext = createContext<AudioContextType>({
  activeThemeId: "ethereal",
  setMusicTheme: () => {},
  musicThemes: MUSIC_THEMES,
  playClick: () => {},
  playKeystroke: () => {},
  startMelody: () => {},
  stopMelody: () => {},
  startHarmony: () => {},
  stopHarmony: () => {},
  playSpeech: () => {},
  stopSpeech: () => {},
  playThemeToggle: () => {},
  playExternalLink: () => {},
  playHover: () => {},
  playSwipe: () => {},
  playSwipeClose: () => {},
})

export function AudioProvider({ children, soundEnabled }: { children: ReactNode; soundEnabled: boolean }) {
  // Use 'any' to handle the standard AudioContext across browsers
  const ctxRef = useRef<any>(null)
  const melodyRef = useRef<any>(null)
  const harmonyRefs = useRef<{ [freq: number]: any }>({})
  const [activeThemeId, setActiveThemeId] = useState<string>("ethereal")
  const activeTheme = MUSIC_THEMES.find(t => t.id === activeThemeId) || MUSIC_THEMES[0]

  useEffect(() => {
    // Only init AudioContext if sound is enabled and running in browser
    if (soundEnabled && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtx && !ctxRef.current) {
        ctxRef.current = new AudioCtx()
        
        // Play OS Boot-up sound immediately on first interaction
        setTimeout(() => {
          const ctx = ctxRef.current
          if (!ctx || ctx.state === "suspended") return
          const now = ctx.currentTime
          
          // A quick techy sweep up
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = "sine"
          osc.frequency.setValueAtTime(200, now)
          osc.frequency.exponentialRampToValueAtTime(1200, now + 0.15)
          
          gain.gain.setValueAtTime(0, now)
          gain.gain.linearRampToValueAtTime(0.15, now + 0.05)
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4)
          
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.start(now)
          osc.stop(now + 0.4)
        }, 50)
      }
      
      if (ctxRef.current && ctxRef.current.state === "suspended") {
        ctxRef.current.resume()
      }
    }

    // Pre-load speech synthesis voices to avoid fallback robot voice on first click
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.getVoices()
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices()
      }
    }
  }, [soundEnabled])

  const playClick = () => {
    if (!soundEnabled || !ctxRef.current) return
    const ctx = ctxRef.current
    if (ctx.state === "suspended") ctx.resume()
    const now = ctx.currentTime

    // 1. The Tick (Square wave, sharp decay)
    const tickOsc = ctx.createOscillator()
    const tickGain = ctx.createGain()
    tickOsc.type = "square"
    tickOsc.frequency.setValueAtTime(400, now)
    tickOsc.frequency.exponentialRampToValueAtTime(50, now + 0.02)
    
    tickGain.gain.setValueAtTime(0, now)
    tickGain.gain.linearRampToValueAtTime(0.1, now + 0.005)
    tickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03)

    tickOsc.connect(tickGain)
    tickGain.connect(ctx.destination)
    tickOsc.start(now)
    tickOsc.stop(now + 0.03)

    // 2. The Ping (Sine wave, slightly delayed, smooth decay)
    const pingOsc = ctx.createOscillator()
    const pingGain = ctx.createGain()
    pingOsc.type = "sine"
    pingOsc.frequency.setValueAtTime(1200, now + 0.01) // High clear pitch
    
    pingGain.gain.setValueAtTime(0, now + 0.01)
    pingGain.gain.linearRampToValueAtTime(0.15, now + 0.02)
    pingGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)

    pingOsc.connect(pingGain)
    pingGain.connect(ctx.destination)
    pingOsc.start(now + 0.01)
    pingOsc.stop(now + 0.2)
  }

  const playHover = () => {
    if (!soundEnabled || !ctxRef.current) return
    const ctx = ctxRef.current
    if (ctx.state === "suspended") ctx.resume()
    const now = ctx.currentTime

    // 1. Sharp sawtooth sweep
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = "sawtooth"
    osc.frequency.setValueAtTime(6000, now) 
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.015) 

    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.12, now + 0.001) // Increased volume (was 0.04)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.015) // Slightly longer decay

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.015)

    // 2. High-pass filtered noise burst for extra crisp "texture"
    const bufferSize = ctx.sampleRate * 0.015 // 15ms of noise
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }
    const noise = ctx.createBufferSource()
    noise.buffer = buffer

    const noiseFilter = ctx.createBiquadFilter()
    noiseFilter.type = "highpass"
    noiseFilter.frequency.value = 2000 // Lowered from 5000Hz to add more midrange body

    const noiseGain = ctx.createGain()
    noiseGain.gain.setValueAtTime(0, now)
    noiseGain.gain.linearRampToValueAtTime(0.15, now + 0.001) // Increased volume (was 0.05)
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015) // Slightly longer decay

    noise.connect(noiseFilter)
    noiseFilter.connect(noiseGain)
    noiseGain.connect(ctx.destination)
    noise.start(now)

    // 3. Low-end "Thump" for thickness
    const subOsc = ctx.createOscillator()
    const subGain = ctx.createGain()
    subOsc.type = "sine"
    subOsc.frequency.setValueAtTime(300, now)
    subOsc.frequency.exponentialRampToValueAtTime(50, now + 0.015)

    subGain.gain.setValueAtTime(0, now)
    subGain.gain.linearRampToValueAtTime(0.2, now + 0.002) // Strong attack for punch
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015)

    subOsc.connect(subGain)
    subGain.connect(ctx.destination)
    subOsc.start(now)
    subOsc.stop(now + 0.015)
  }

  const playKeystroke = () => {
    if (!soundEnabled || !ctxRef.current) return
    const ctx = ctxRef.current
    if (ctx.state === "suspended") ctx.resume()

    // Create a very short noise burst for a mechanical keystroke sound
    const bufferSize = ctx.sampleRate * 0.02 // 20ms
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }

    const noise = ctx.createBufferSource()
    noise.buffer = buffer

    // Filter to make it sound like a muted thud rather than harsh static
    const filter = ctx.createBiquadFilter()
    filter.type = "bandpass"
    filter.frequency.setValueAtTime(800, ctx.currentTime)

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.005)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02)

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    noise.start(ctx.currentTime)
  }

  const startMelody = () => {
    if (!soundEnabled || !ctxRef.current) return
    const ctx = ctxRef.current
    if (ctx.state === "suspended") ctx.resume()

    const now = ctx.currentTime

    if (melodyRef.current) {
      const { masterGain, fadeTimeout, themeId } = melodyRef.current
      if (themeId === activeThemeId) {
        // If it's the SAME theme, cancel the fade-out and ramp volume back up
        if (fadeTimeout) {
          clearTimeout(fadeTimeout)
          melodyRef.current.fadeTimeout = null
        }
        masterGain.gain.cancelScheduledValues(now)
        masterGain.gain.setValueAtTime(masterGain.gain.value, now)
        masterGain.gain.linearRampToValueAtTime(0.15, now + 0.5)
        return
      } else {
        // If it's a DIFFERENT theme, stop it immediately so the new one can start
        stopMelody(true)
      }
    }

    const notes = activeTheme.melodyScale
    const masterGain = ctx.createGain()
    masterGain.gain.setValueAtTime(0, now)
    masterGain.gain.linearRampToValueAtTime(0.15, now + 0.5) // fade in
    masterGain.connect(ctx.destination)
    
    const newMelody = { masterGain, interval: null as any, fadeTimeout: null as any, themeId: activeThemeId }
    melodyRef.current = newMelody
    
    let noteIndex = 0
    
    const playNote = () => {
      if (melodyRef.current !== newMelody) return
      const t = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = activeTheme.oscType
      osc.frequency.value = notes[noteIndex]
      
      gain.gain.setValueAtTime(0, t)
      gain.gain.linearRampToValueAtTime(1, t + 0.05)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1)
      
      osc.connect(gain)
      gain.connect(masterGain)
      osc.start(t)
      osc.stop(t + 1)
      
      // Random walk for melody heavily favoring small jumps
      const jump = Math.random() < 0.7 ? 1 : Math.random() < 0.5 ? -1 : 2
      noteIndex = (noteIndex + jump + notes.length) % notes.length
    }
    
    playNote()
    newMelody.interval = setInterval(playNote, activeTheme.tempo)
  }

  const stopMelody = (immediate = false) => {
    if (!melodyRef.current || !ctxRef.current) return
    const ctx = ctxRef.current
    const now = ctx.currentTime
    
    const currentMelody = melodyRef.current
    const { masterGain, interval, fadeTimeout } = currentMelody
    
    if (immediate) {
      if (fadeTimeout) clearTimeout(fadeTimeout)
      clearInterval(interval)
      masterGain.gain.cancelScheduledValues(now)
      masterGain.gain.setValueAtTime(masterGain.gain.value, now)
      masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1)
      if (melodyRef.current === currentMelody) melodyRef.current = null
      return
    }

    if (fadeTimeout) return // already fading out
    
    // Smooth 8-second fade out (sustain pedal effect)
    masterGain.gain.cancelScheduledValues(now)
    masterGain.gain.setValueAtTime(masterGain.gain.value, now)
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + 8)
    
    currentMelody.fadeTimeout = setTimeout(() => {
      clearInterval(interval)
      if (melodyRef.current === currentMelody) {
        melodyRef.current = null
      }
    }, 8000)
  }

  const startHarmony = (freq: number) => {
    if (!soundEnabled || !ctxRef.current) return
    const ctx = ctxRef.current
    if (ctx.state === "suspended") ctx.resume()

    if (harmonyRefs.current[freq]) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.type = activeTheme.oscType === "triangle" ? "triangle" : "sine" // keep harmony softer
    osc.frequency.value = freq
    
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.05, now + 0.5) // soft fade in

    // Slight tremolo effect for the harmony to make it feel alive
    const lfo = ctx.createOscillator()
    lfo.type = "sine"
    lfo.frequency.value = 2 // 2Hz wobble
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 0.02
    lfo.connect(lfoGain)
    lfoGain.connect(gain.gain)
    lfo.start(now)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    
    harmonyRefs.current[freq] = { osc, gain, lfo }
  }

  const stopHarmony = (freq: number) => {
    if (!harmonyRefs.current[freq] || !ctxRef.current) return
    const ctx = ctxRef.current
    const now = ctx.currentTime
    
    const { osc, gain, lfo } = harmonyRefs.current[freq]
    
    gain.gain.cancelScheduledValues(now)
    gain.gain.setValueAtTime(gain.gain.value, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5)
    
    setTimeout(() => {
      try { 
        osc.stop()
        lfo.stop()
      } catch (e) {}
    }, 500)
    
    delete harmonyRefs.current[freq]
  }

  const speechAudioRef = useRef<HTMLAudioElement | null>(null)

  const playSpeech = (text: string) => {
    if (!soundEnabled) return
    stopSpeech()
    
    // Primary strategy: Load a pre-recorded high-quality MP3 from the public folder
    const url = `/quote.mp3`
    const audio = new Audio(url)
    audio.playbackRate = 1.0 // Reset playback rate for local MP3
    speechAudioRef.current = audio

    audio.play().catch((err) => {
      console.warn("Failed to play quote.mp3:", err)
    })
  }

  const stopSpeech = () => {
    if (speechAudioRef.current) {
      speechAudioRef.current.pause()
      speechAudioRef.current.currentTime = 0
      speechAudioRef.current = null
    }
  }

  const playThemeToggle = (isGoingDark: boolean) => {
    if (!soundEnabled || !ctxRef.current) return
    const ctx = ctxRef.current
    if (ctx.state === "suspended") ctx.resume()

    const now = ctx.currentTime

    // 1. Oscillator for the "energy" / tonal sweep
    const osc = ctx.createOscillator()
    const oscGain = ctx.createGain()
    osc.type = "sine"
    
    if (isGoingDark) {
      // Light to Dark: Sweep down (power down / calm)
      osc.frequency.setValueAtTime(400, now)
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.4)
    } else {
      // Dark to Light: Sweep up (flash / power up)
      osc.frequency.setValueAtTime(100, now)
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.3)
    }

    oscGain.gain.setValueAtTime(0, now)
    oscGain.gain.linearRampToValueAtTime(0.2, now + 0.05)
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5)

    osc.connect(oscGain)
    oscGain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.6)

    // 2. Filtered white noise for the "whoosh / flash" breath
    const bufferSize = ctx.sampleRate * 0.5
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }

    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    
    const noiseFilter = ctx.createBiquadFilter()
    noiseFilter.type = "bandpass"
    noiseFilter.Q.value = 1
    
    if (isGoingDark) {
      noiseFilter.frequency.setValueAtTime(2000, now)
      noiseFilter.frequency.exponentialRampToValueAtTime(200, now + 0.4)
    } else {
      noiseFilter.frequency.setValueAtTime(200, now)
      noiseFilter.frequency.exponentialRampToValueAtTime(3000, now + 0.3)
    }

    const noiseGain = ctx.createGain()
    noiseGain.gain.setValueAtTime(0, now)
    noiseGain.gain.linearRampToValueAtTime(isGoingDark ? 0.05 : 0.1, now + 0.05)
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5)

    noise.connect(noiseFilter)
    noiseFilter.connect(noiseGain)
    noiseGain.connect(ctx.destination)
    
    noise.start(now)
  }

  const playExternalLink = () => {
    if (!soundEnabled || !ctxRef.current) return
    const ctx = ctxRef.current
    if (ctx.state === "suspended") ctx.resume()
    
    const now = ctx.currentTime

    // 1. Initial mechanical tick (matches the regular click)
    const tickOsc = ctx.createOscillator()
    const tickGain = ctx.createGain()
    tickOsc.type = "square"
    tickOsc.frequency.setValueAtTime(400, now)
    tickOsc.frequency.exponentialRampToValueAtTime(50, now + 0.02)
    
    tickGain.gain.setValueAtTime(0, now)
    tickGain.gain.linearRampToValueAtTime(0.1, now + 0.005)
    tickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03)

    tickOsc.connect(tickGain)
    tickGain.connect(ctx.destination)
    tickOsc.start(now)
    tickOsc.stop(now + 0.03)

    // 2. Rising double-ping to indicate an outward action
    const playPing = (time: number, freq: number) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = "sine"
      
      osc.frequency.setValueAtTime(freq, time)
      
      gain.gain.setValueAtTime(0, time)
      gain.gain.linearRampToValueAtTime(0.15, time + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15)
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(time)
      osc.stop(time + 0.15)
    }

    playPing(now + 0.01, 1200)
    playPing(now + 0.08, 1600)
  }

  const playSwipe = () => {
    if (!soundEnabled || !ctxRef.current) return
    const ctx = ctxRef.current
    if (ctx.state === "suspended") ctx.resume()
    const now = ctx.currentTime

    const bufferSize = ctx.sampleRate * 0.15
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }

    const noise = ctx.createBufferSource()
    noise.buffer = buffer

    const filter = ctx.createBiquadFilter()
    filter.type = "lowpass"
    filter.frequency.setValueAtTime(400, now)
    filter.frequency.exponentialRampToValueAtTime(3000, now + 0.1)

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.15, now + 0.05)
    gain.gain.linearRampToValueAtTime(0, now + 0.15)

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    noise.start(now)
  }

  const playSwipeClose = () => {
    if (!soundEnabled || !ctxRef.current) return
    const ctx = ctxRef.current
    if (ctx.state === "suspended") ctx.resume()
    const now = ctx.currentTime

    const bufferSize = ctx.sampleRate * 0.15
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }

    const noise = ctx.createBufferSource()
    noise.buffer = buffer

    const filter = ctx.createBiquadFilter()
    filter.type = "lowpass"
    filter.frequency.setValueAtTime(3000, now)
    filter.frequency.exponentialRampToValueAtTime(200, now + 0.1)

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.1, now + 0.05)
    gain.gain.linearRampToValueAtTime(0, now + 0.15)

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    noise.start(now)
  }

  return (
    <AudioContext.Provider value={{ activeThemeId, setMusicTheme: setActiveThemeId, musicThemes: MUSIC_THEMES, playClick, playKeystroke, startMelody, stopMelody, startHarmony, stopHarmony, playSpeech, stopSpeech, playThemeToggle, playExternalLink, playHover, playSwipe, playSwipeClose }}>
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  return useContext(AudioContext)
}
