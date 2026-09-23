"use client"

import { useState, useEffect } from "react"
import { ChevronRight } from "lucide-react"
import { profile } from "./data"

const MESSAGES = [
  "System initialized. Welcome to portfolio-os.",
  "Tip: Type 'resume' in the terminal to view my CV.",
  "Secret: Want to play a game? Type 'rps rock' in the terminal.",
  "Joke: Why do programmers prefer dark mode? Because light attracts bugs.",
  "Joke: Anong paboritong kanta ng mga programmer? ... Edi 'C# (See You Again)'.",
  "Tip: You can use the arrow keys in the terminal to navigate history.",
  "Secret: Try typing 'sudo' in the terminal for a surprise.",
  "Joke: How many programmers does it take to change a light bulb? None, that's a hardware problem.",
  "Joke: Bakit malungkot ang website? Kasi wala siyang 'cache'.",
]

export function CommandBar() {
  const [msgIdx, setMsgIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const handleStart = () => setIsPaused(true)
  const handleStop = () => setIsPaused(false)

  useEffect(() => {
    const currentMsg = MESSAGES[msgIdx]
    let timeout: NodeJS.Timeout

    if (!isDeleting && charIdx < currentMsg.length) {
      // Typing: if paused, type much faster to instantly reveal the sentence
      const speed = isPaused ? 5 : 40 + Math.random() * 40
      timeout = setTimeout(() => setCharIdx((prev) => prev + 1), speed)
    } else if (!isDeleting && charIdx === currentMsg.length) {
      // Pause at the end before deleting
      // Only transition to deleting if NOT paused
      if (!isPaused) {
        timeout = setTimeout(() => setIsDeleting(true), 4000)
      }
    } else if (isDeleting && charIdx > 0) {
      // Fast delete
      timeout = setTimeout(() => setCharIdx((prev) => prev - 1), 15)
    } else if (isDeleting && charIdx === 0) {
      // Move to next message
      setIsDeleting(false)
      setMsgIdx((prev) => (prev + 1) % MESSAGES.length)
    }

    return () => clearTimeout(timeout)
  }, [charIdx, isDeleting, msgIdx, isPaused])

  const text = MESSAGES[msgIdx].substring(0, charIdx)

  return (
    <div 
      className="flex items-center justify-between gap-4 border-t border-[var(--pf-border)] bg-[var(--pf-bg)]/70 px-4 py-2.5 backdrop-blur-sm cursor-help sm:px-6"
      onPointerEnter={handleStart}
      onPointerLeave={handleStop}
      onPointerDown={handleStart}
      onPointerUp={handleStop}
      onPointerCancel={handleStop}
      style={{ touchAction: 'none' }} // Prevents scrolling while holding on mobile
    >
      <div className="flex min-w-0 flex-1 items-start gap-1.5 sm:gap-2">
        <ChevronRight className="mt-[1px] size-3.5 shrink-0 text-[var(--pf-muted)] sm:mt-0.5 sm:size-4" />
        <div className="font-mono text-[10px] leading-relaxed text-[var(--pf-fg)] sm:text-xs sm:leading-relaxed">
          {text}
          <span className="ml-0.5 inline-block h-[1.1em] w-1.5 animate-pulse bg-[var(--pf-muted)] align-middle sm:ml-1 sm:w-2" />
        </div>
      </div>
      
      {/* Right side indicators */}
      <div className="flex shrink-0 items-center gap-4">
        <span className={`hidden font-mono text-[9px] uppercase tracking-widest transition-colors sm:inline ${isPaused ? "text-[var(--pf-fg)]" : "text-[var(--pf-faint)]"}`}>
          [ Hover / Hold to pause ]
        </span>
        <span className={`inline font-mono text-[9px] uppercase tracking-widest transition-colors sm:hidden ${isPaused ? "text-[var(--pf-fg)]" : "text-[var(--pf-faint)]"}`}>
          [ Hold to pause ]
        </span>
        <span className="hidden shrink-0 font-mono text-[11px] text-[var(--pf-faint)] lg:block">
          {profile.location}
        </span>
      </div>
    </div>
  )
}
