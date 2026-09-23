"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { Volume2 } from "lucide-react"
import { profile, type ViewId } from "./data"
import { useAudio } from "./audio-context"

const SHORTCUT_LABELS: { id: ViewId; label: string }[] = [
  { id: "projects", label: "Projects" }, 
  { id: "experiments", label: "Experiments" }, 
  { id: "about", label: "About" }, 
  { id: "now", label: "Now" }, 
  { id: "contact", label: "Contact" }, 
]

export function ProfileView({ onNavigate }: { onNavigate: (id: ViewId) => void }) {
  const { startMelody, stopMelody, startHarmony, stopHarmony, playSpeech, stopSpeech, activeThemeId, setMusicTheme, musicThemes, playClick, playHover } = useAudio()
  const activeTheme = musicThemes.find(t => t.id === activeThemeId) || musicThemes[0]
  const [isPlaying, setIsPlaying] = useState(false)
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false)

  useEffect(() => {
    return () => {
      stopMelody()
      stopSpeech()
      activeTheme.harmonyFrequencies.forEach(freq => stopHarmony(freq))
    }
  }, [stopMelody, stopHarmony, stopSpeech, activeTheme])

  const handleStart = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.type === 'pointerenter') {
      setIsPlaying(true); startMelody()
    }
    if (e.pointerType !== 'mouse' && e.type === 'pointerdown') {
      setIsPlaying(true); startMelody()
    }
  }

  const handleStop = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.type === 'pointerleave') {
      setIsPlaying(false); stopMelody()
    }
    if (e.pointerType !== 'mouse' && (e.type === 'pointerup' || e.type === 'pointercancel')) {
      setIsPlaying(false); stopMelody()
    }
  }

  return (
    <div className="pf-enter mx-auto flex min-h-full max-w-5xl flex-col justify-center px-6 py-16 sm:px-10">
      <div 
        className="flex flex-col items-start gap-10 lg:flex-row lg:items-center lg:gap-16 transition-opacity"
      >
        {/* Photo inside an offset thin frame with corner crosshairs */}
        <div className="flex shrink-0 items-end gap-3">
          <div className="hidden shrink-0 pb-1 font-mono text-[11px] leading-tight text-[var(--pf-muted)] sm:block">
            <div>{"// 01"}</div>
            <div>Profile</div>
          </div>
          <div 
            className="relative p-4 cursor-pointer select-none"
            onPointerEnter={handleStart}
            onPointerLeave={handleStop}
            onPointerDown={handleStart}
            onPointerUp={handleStop}
            onPointerCancel={handleStop}
            onContextMenu={(e) => e.preventDefault()}
            style={{ touchAction: 'none', WebkitTouchCallout: 'none' }}
          >
            {/* offset frame */}
            <div className="pointer-events-none absolute inset-0 border border-[var(--pf-border-strong)]" />
            <Cross className="-left-1.5 -top-1.5" />
            <Cross className="-right-1.5 -top-1.5" />
            <Cross className="-bottom-1.5 -left-1.5" />
            <Cross className="-bottom-1.5 -right-1.5" />
            <div className="relative h-64 w-52 overflow-hidden grayscale sm:h-72 sm:w-60">
              <Image
                src="/profile-placeholder.png"
                alt="Portrait of the software engineer"
                fill
                sizes="240px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>

        {/* Main text */}
        <div className="min-w-0 flex-1">
          <h1 className="font-mono text-6xl leading-none tracking-tight text-[var(--pf-fg)] sm:text-7xl">
            {profile.handle}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 gap-y-2">
            <p className="font-mono text-sm uppercase tracking-[0.35em] text-[var(--pf-muted)]">
              {profile.role}
            </p>
            <div className="flex h-5 items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest transition-colors duration-300">
              {isPlaying ? (
                <>
                  <Volume2 className="size-3 animate-pulse text-[var(--pf-fg)]" />
                  <span className="text-[var(--pf-fg)]">Playing Melody...</span>
                </>
              ) : (
                <span className="text-[var(--pf-faint)]">[ Hover / Hold for audio ]</span>
              )}
            </div>
          </div>
          
          {/* Theme Selector */}
          <div className="mt-3 relative flex items-center font-mono text-[10px] uppercase tracking-widest text-[var(--pf-faint)]">
            <span className="mr-2">Music Theme:</span>
            <div className="relative">
              <button 
                className="flex items-center bg-transparent text-[var(--pf-muted)] outline-none cursor-pointer transition-colors hover:text-[var(--pf-fg)]"
                onClick={(e) => { 
                  e.stopPropagation(); 
                  playClick();
                  setIsThemeDropdownOpen(!isThemeDropdownOpen); 
                }}
                onPointerDown={(e) => e.stopPropagation()}
                onPointerEnter={playHover}
              >
                {activeTheme.name}
                <div className="pointer-events-none ml-2 opacity-50">▾</div>
              </button>
              {isThemeDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 z-50 flex flex-col rounded-md border border-[var(--pf-border-strong)] bg-[var(--pf-surface)] p-1 shadow-xl">
                  {musicThemes.map(t => (
                    <button
                      key={t.id}
                      className={`whitespace-nowrap rounded px-3 py-1.5 text-left text-[10px] uppercase tracking-widest transition-colors hover:bg-[var(--pf-bg)] hover:text-[var(--pf-fg)] ${activeThemeId === t.id ? 'text-[var(--pf-fg)]' : 'text-[var(--pf-muted)]'}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        playClick()
                        setMusicTheme(t.id)
                        setIsThemeDropdownOpen(false)
                      }}
                      onPointerDown={(e) => e.stopPropagation()}
                      onPointerEnter={playHover}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <p className="mt-6 max-w-md text-lg leading-relaxed text-[var(--pf-fg)]">{profile.intro}</p>

          <div className="mt-6 h-px w-12 bg-[var(--pf-border-strong)]" />

          <div className="mt-6 flex flex-wrap gap-2">
            {SHORTCUT_LABELS.map((s, idx) => {
              const freq = activeTheme.harmonyFrequencies[idx]
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    playClick();
                    stopHarmony(freq);
                    stopMelody();
                    onNavigate(s.id);
                  }}
                  onPointerEnter={(e) => {
                    if (e.pointerType === 'mouse') {
                      startHarmony(freq);
                    }
                  }}
                  onPointerLeave={(e) => e.pointerType === 'mouse' && stopHarmony(freq)}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="group font-mono text-sm text-[var(--pf-muted)] transition-colors hover:text-[var(--pf-fg)]"
                >
                  <span className="text-[var(--pf-faint)]">[</span>
                  <span className="px-2">{s.label}</span>
                  <span className="text-[var(--pf-faint)]">]</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Quote, integrated to the side */}
        <blockquote 
          className="hidden max-w-[13rem] shrink-0 border-l border-[var(--pf-border)] pl-4 lg:block cursor-help transition-opacity hover:opacity-80 active:opacity-60"
          onPointerEnter={(e) => e.pointerType === 'mouse' && playSpeech(profile.quote.text)}
          onPointerLeave={(e) => e.pointerType === 'mouse' && stopSpeech()}
          onPointerDown={(e) => e.pointerType !== 'mouse' && playSpeech(profile.quote.text)}
          onPointerUp={(e) => e.pointerType !== 'mouse' && stopSpeech()}
          onPointerCancel={(e) => e.pointerType !== 'mouse' && stopSpeech()}
          style={{ touchAction: 'none' }}
        >
          <p className="font-mono text-sm italic leading-relaxed text-[var(--pf-muted)] group-hover:text-[var(--pf-fg)]">
            <span className="mr-1 text-2xl leading-none text-[var(--pf-faint)]">&ldquo;</span>
            {profile.quote.text}
          </p>
          <footer className="mt-3 font-mono text-xs text-[var(--pf-faint)]">— {profile.quote.author}</footer>
        </blockquote>
      </div>

      {/* Quote for small screens */}
      <blockquote 
        className="mt-12 max-w-md border-l border-[var(--pf-border)] pl-4 lg:hidden cursor-help transition-opacity active:opacity-60"
        onPointerEnter={(e) => e.pointerType === 'mouse' && playSpeech(profile.quote.text)}
        onPointerLeave={(e) => e.pointerType === 'mouse' && stopSpeech()}
        onPointerDown={(e) => e.pointerType !== 'mouse' && playSpeech(profile.quote.text)}
        onPointerUp={(e) => e.pointerType !== 'mouse' && stopSpeech()}
        onPointerCancel={(e) => e.pointerType !== 'mouse' && stopSpeech()}
        style={{ touchAction: 'none' }}
      >
        <p className="font-mono text-sm italic leading-relaxed text-[var(--pf-muted)]">
          <span className="mr-1 text-2xl leading-none text-[var(--pf-faint)]">&ldquo;</span>
          {profile.quote.text}
        </p>
        <footer className="mt-3 font-mono text-xs text-[var(--pf-faint)]">— {profile.quote.author}</footer>
      </blockquote>
    </div>
  )
}

function Cross({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      className={`absolute size-3 text-[var(--pf-muted)] ${className ?? ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      <path d="M6 0v12M0 6h12" />
    </svg>
  )
}
