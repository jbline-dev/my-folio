"use client"

import { useCallback, useEffect, useState, useRef } from "react"
import { Menu, X, ChevronLeft } from "lucide-react"
import { StarryCanvas } from "@/components/portfolio/starry-canvas"
import { Sidebar } from "@/components/portfolio/sidebar"
import { CommandBar } from "@/components/portfolio/command-bar"
import { ProfileView } from "@/components/portfolio/profile-view"
import { ProjectsView } from "@/components/portfolio/projects-view"
import { Terminal } from "@/components/portfolio/terminal"
import {
  AboutView,
  ContactView,
  ExperienceView,
  ExperimentsView,
  LogsView,
  NowView,
  StackView,
} from "@/components/portfolio/views"
import type { ViewId } from "@/components/portfolio/data"
import { AudioProvider, useAudio } from "@/components/portfolio/audio-context"

export default function Page() {
  const [view, setView] = useState<ViewId>("profile")
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  const [sound, setSound] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hasEntered, setHasEntered] = useState(false)
  const [isFading, setIsFading] = useState(false)
  const [bootStep, setBootStep] = useState(0)

  const hasStartedRef = useRef(false)

  const handleEnter = () => {
    if (hasStartedRef.current) return
    hasStartedRef.current = true
    setSound(true)
    setBootStep(1)
    
    setTimeout(() => setBootStep(2), 300)
    setTimeout(() => setBootStep(3), 500)
    setTimeout(() => setBootStep(4), 800)
    setTimeout(() => {
      setBootStep(5)
      setIsFading(true)
      setTimeout(() => setHasEntered(true), 700)
    }, 1200)
  }

  const navigate = useCallback((id: ViewId) => {
    setView(id)
    setMobileOpen(false)
    window.history.pushState({ view: id }, "", `#${id}`)
  }, [])

  // Handle browser back/forward and initial load
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state && e.state.view) {
        setView(e.state.view)
      } else {
        const hash = window.location.hash.slice(1) as ViewId
        setView(hash || "profile")
      }
    }

    const hash = window.location.hash.slice(1) as ViewId
    if (hash) {
      setView(hash)
    }
    window.history.replaceState({ view: hash || "profile" }, "", window.location.hash || "#profile")

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  // Close mobile drawer on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const touchStartRef = useRef(0)
  const touchEndRef = useRef(0)
  const scrollRef = useRef<HTMLElement>(null)
  const scrollPositions = useRef<Record<string, number>>({})

  // Restore scroll position when view changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollPositions.current[view] || 0
    }
  }, [view])

  const onTouchStart = (e: React.TouchEvent) => {
    // Ignore edge swipes (e.g., native back navigation)
    if (e.targetTouches[0].clientX < 30 || e.targetTouches[0].clientX > (typeof window !== 'undefined' ? window.innerWidth - 30 : 500)) {
      touchStartRef.current = 0
      return
    }
    touchEndRef.current = 0
    touchStartRef.current = e.targetTouches[0].clientX
  }

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndRef.current = e.targetTouches[0].clientX
  }

  const onTouchEnd = () => {
    if (!touchStartRef.current || !touchEndRef.current) return
    const distance = touchStartRef.current - touchEndRef.current
    const minSwipeDistance = 50

    if (distance < -minSwipeDistance && !mobileOpen) {
      setMobileOpen(true) // Swipe Right to open
    } else if (distance > minSwipeDistance && mobileOpen) {
      setMobileOpen(false) // Swipe Left to close
    }
  }

  return (
    <AudioProvider soundEnabled={sound}>
      <div
        className="pf flex h-dvh w-full overflow-hidden bg-[var(--pf-bg)] font-sans text-[var(--pf-fg)]"
        data-theme={theme}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {!hasEntered && (
          <div className={`absolute inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--pf-bg)] transition-transform duration-700 ease-[cubic-bezier(0.7,0,0.3,1)] ${isFading ? 'pointer-events-none -translate-y-full' : 'translate-y-0'}`}>
            <div className="flex w-full max-w-sm flex-col items-center gap-8 px-6">
              <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--pf-muted)]">
                portfolio-os v1.0.0
              </div>
              
              {bootStep === 0 ? (
                <button
                  onClick={handleEnter}
                  onPointerDown={handleEnter}
                  onTouchStart={handleEnter}
                  className="group flex items-center gap-3 border border-[var(--pf-border)] px-6 py-3 font-mono text-sm tracking-[0.2em] text-[var(--pf-fg)] transition-colors hover:border-[var(--pf-fg)] hover:bg-[var(--pf-fg)] hover:text-[var(--pf-bg)] touch-manipulation"
                >
                  <span>[ INITIALIZE ]</span>
                  <span className="inline-block h-4 w-2 animate-pulse bg-current" />
                </button>
              ) : (
                <div className="flex w-full flex-col gap-2 font-mono text-xs text-[var(--pf-muted)]">
                  {bootStep >= 1 && <div>&gt; Loading kernel...</div>}
                  {bootStep >= 2 && <div>&gt; Initializing audio matrix...</div>}
                  {bootStep >= 3 && <div>&gt; Mounting file system...</div>}
                  {bootStep >= 4 && <div className="text-[var(--pf-fg)]">&gt; Access granted.</div>}
                  {bootStep < 5 && <div className="animate-pulse text-[var(--pf-fg)]">&gt; <span className="inline-block h-3 w-1.5 bg-[var(--pf-fg)] align-middle" /></div>}
                </div>
              )}
            </div>
          </div>
        )}
        {/* Mobile top bar */}
        <MobileHeader mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} navigate={navigate} />

      {/* Sidebar */}
      <aside
        className={[
          "z-40 w-72 shrink-0 border-r border-[var(--pf-border)] bg-[var(--pf-bg-sidebar)]",
          "fixed inset-y-0 left-0 transition-transform duration-300 lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <Sidebar
          active={view}
          onNavigate={navigate}
          theme={theme}
          onToggleTheme={(e) => {
            const isDark = theme === "dark"
            const next = isDark ? "light" : "dark"

            if (!document.startViewTransition) {
              setTheme(next)
              return
            }

            const x = e.clientX
            const y = e.clientY

            const transition = document.startViewTransition(() => {
              setTheme(next)
            })

            transition.ready.then(() => {
              const radius = Math.hypot(
                Math.max(x, window.innerWidth - x),
                Math.max(y, window.innerHeight - y)
              )

              document.documentElement.animate(
                {
                  clipPath: [
                    `circle(0px at ${x}px ${y}px)`,
                    `circle(${radius}px at ${x}px ${y}px)`,
                  ],
                },
                {
                  duration: 500,
                  easing: "cubic-bezier(0.16, 1, 0.3, 1)",
                  pseudoElement: "::view-transition-new(root)",
                }
              )
            })
          }}
          sound={sound}
          onToggleSound={() => setSound((s) => !s)}
        />
      </aside>

      {/* Backdrop for mobile */}
      {mobileOpen ? (
        <button
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
        />
      ) : null}

      {/* Main workspace */}
      <div className="relative flex min-w-0 flex-1 flex-col pt-14 lg:pt-0">
        <StarryCanvas />
        {/* Readability scrim: keeps content legible over the artwork, heavier on dense views */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[5]"
          style={{
            background:
              view === "profile"
                ? "radial-gradient(120% 100% at 60% 40%, transparent 45%, color-mix(in oklch, var(--pf-bg) 55%, transparent) 100%)"
                : "color-mix(in oklch, var(--pf-bg) 62%, transparent)",
          }}
        />
        <main 
          ref={scrollRef}
          onScroll={(e) => {
            scrollPositions.current[view] = e.currentTarget.scrollTop
          }}
          className="pf-scroll relative z-10 min-h-0 flex-1 overflow-y-auto"
        >
          <Workspace view={view} onNavigate={navigate} />
        </main>
          <div className="relative z-10">
            <CommandBar />
          </div>
        </div>
      </div>
    </AudioProvider>
  )
}

function Workspace({ view, onNavigate }: { view: ViewId; onNavigate: (id: ViewId) => void }) {
  switch (view) {
    case "profile":
      return <ProfileView onNavigate={onNavigate} />
    case "projects":
      return <ProjectsView />
    case "experiments":
      return <ExperimentsView />
    case "about":
      return <AboutView />
    case "experience":
      return <ExperienceView />
    case "stack":
      return <StackView />
    case "now":
      return <NowView />
    case "logs":
      return <LogsView />
    case "contact":
      return <ContactView />
    case "terminal":
      return <Terminal onNavigate={onNavigate} />
    default:
      return <ProfileView onNavigate={onNavigate} />
  }
}

function MobileHeader({ mobileOpen, setMobileOpen, navigate }: { mobileOpen: boolean, setMobileOpen: (v: boolean) => void, navigate: (id: ViewId) => void }) {
  const { playClick, playSwipe, playSwipeClose } = useAudio()
  
  const prevOpen = useRef(mobileOpen)
  useEffect(() => {
    if (prevOpen.current && !mobileOpen) {
      playSwipeClose()
    } else if (!prevOpen.current && mobileOpen) {
      playSwipe()
    }
    prevOpen.current = mobileOpen
  }, [mobileOpen, playSwipe, playSwipeClose])

  const toggleMenu = () => {
    playClick()
    setMobileOpen(!mobileOpen)
  }

  return (
    <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between border-b border-[var(--pf-border)] bg-[var(--pf-bg-sidebar)] px-4 py-3 lg:hidden">
      <button 
        onClick={() => { playClick(); navigate("profile"); }}
        className="font-mono text-lg tracking-tight transition-colors hover:text-[var(--pf-muted)]"
      >
        jb.line
      </button>
      <button
        onClick={toggleMenu}
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
        className="relative flex size-9 items-center justify-center rounded-md border border-[var(--pf-border)] text-[var(--pf-muted)] overflow-hidden"
      >
        <Menu className={`absolute size-4 transition-all duration-300 ${mobileOpen ? "rotate-90 opacity-0 scale-75" : "rotate-0 opacity-100 scale-100"}`} />
        <X className={`absolute size-4 transition-all duration-300 ${mobileOpen ? "rotate-0 opacity-100 scale-100" : "-rotate-90 opacity-0 scale-75"}`} />
      </button>
    </div>
  )
}
