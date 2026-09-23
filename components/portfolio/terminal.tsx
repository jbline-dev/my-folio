"use client"

import { useEffect, useRef, useState } from "react"
import { X } from "lucide-react"
import { about, experience, logs, nowItems, profile, projects, stack, type ViewId } from "./data"
import { useAudio } from "./audio-context"

type Line = { kind: "input" | "output" | "resume" | "neofetch"; text: string }

const PROMPT = "dev@localhost:~$"

const HELP = [
  "Available commands:",
  "  open <name>  open a view (e.g. open projects)",
  "  resume       view my resume",
  "  git log      recent commits",
  "  neofetch     system summary",
  "  clear        clear the screen",
  "  help         show this message",
]


export function Terminal({ onNavigate }: { onNavigate: (id: ViewId) => void }) {
  const [lines, setLines] = useState<Line[]>([
    { kind: "output", text: "portfolio-os 1.0 — type 'help' for available commands." },
  ])
  const [value, setValue] = useState("")
  const [cursorIdx, setCursorIdx] = useState(0)
  const [history, setHistory] = useState<string[]>([])
  const [historyIdx, setHistoryIdx] = useState<number | null>(null)
  const [showResume, setShowResume] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { playKeystroke, playClick, playHover } = useAudio()

  useEffect(() => {
    setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    
    inputRef.current?.focus()
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowResume(false)
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines])

  function run(raw: string) {
    const cmd = raw.trim()
    const out: Line[] = [{ kind: "input", text: `${PROMPT} ${cmd}` }]
    const [name, ...args] = cmd.toLowerCase().split(/\s+/)

    const push = (text: string | string[]) => {
      const arr = Array.isArray(text) ? text : [text]
      arr.forEach((t) => out.push({ kind: "output", text: t }))
    }

    switch (name) {
      case "":
        break
      case "help":
        push(HELP)
        break
      case "resume":
        push("Generating resume preview...")
        setLines((prev) => [...prev, ...out])
        
        // Simulate a slight loading delay to make it feel like real terminal execution
        setTimeout(() => {
          setLines((prev) => [
            ...prev,
            { kind: "resume", text: "" },
            { kind: "output", text: "Successfully mounted resume viewer." }
          ])
        }, 600)
        return
      case "sudo":
        push("sudo: user is not in the sudoers file. This incident will be reported.")
        break
      case "git":
        if (args[0] === "log") {
          push(logs.map((l) => `  ${l.hash}  ${l.time}  ${l.message}`))
        } else {
          push(`git: '${args.join(" ")}' is not a supported subcommand. Try 'git log'.`)
        }
        break
      case "neofetch": {
        out.push({ kind: "neofetch", text: "" })
        break
      }
      case "open": {
        const target = args[0]
        const valid: ViewId[] = [
          "projects",
          "experiments",
          "about",
          "experience",
          "stack",
          "now",
          "logs",
          "contact",
          "profile",
        ]
        if (target && (valid as string[]).includes(target)) {
          push(`opening ${target}…`)
          setTimeout(() => onNavigate(target as ViewId), 250)
        } else {
          push(`open: unknown view '${target ?? ""}'. Try: ${valid.join(", ")}`)
        }
        break
      }
      case "clear":
        setLines([])
        return
      case "rps": {
        const choices = ["rock", "paper", "scissors"]
        const userChoice = args[0]?.toLowerCase()
        
        if (!userChoice || !choices.includes(userChoice)) {
          push("Usage: rps <rock|paper|scissors>")
          break
        }
        
        const botChoice = choices[Math.floor(Math.random() * choices.length)]
        push(`You played: ${userChoice}`)
        push(`Bot played: ${botChoice}`)
        
        if (userChoice === botChoice) {
          push("Result: It's a tie!")
        } else if (
          (userChoice === "rock" && botChoice === "scissors") ||
          (userChoice === "paper" && botChoice === "rock") ||
          (userChoice === "scissors" && botChoice === "paper")
        ) {
          push("Result: You win! 🎉")
        } else {
          push("Result: Bot wins! 🤖")
        }
        break
      }
      default:
        push(`command not found: ${name}. Type 'help'.`)
    }

    setLines((prev) => [...prev, ...out])
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    playClick()
    if (!value.trim() && value === "") {
      run("")
    } else {
      run(value)
      setHistory((h) => [...h, value])
    }
    setValue("")
    setCursorIdx(0)
    setHistoryIdx(null)
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return
    playKeystroke()
    if (e.key === "ArrowUp") {
      e.preventDefault()
      if (history.length === 0) return
      const idx = historyIdx === null ? history.length - 1 : Math.max(0, historyIdx - 1)
      setHistoryIdx(idx)
      setValue(history[idx])
      setTimeout(() => setCursorIdx(history[idx].length), 0)
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIdx === null) return
      const idx = historyIdx + 1
      if (idx >= history.length) {
        setHistoryIdx(null)
        setValue("")
        setCursorIdx(0)
      } else {
        setHistoryIdx(idx)
        setValue(history[idx])
        setTimeout(() => setCursorIdx(history[idx].length), 0)
      }
    }
  }

  return (
    <div className="pf-enter mx-auto flex h-full max-w-4xl flex-col px-6 py-10 sm:px-10">
      <div
        className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-[var(--pf-border)] bg-[var(--pf-surface)]"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex items-center gap-2 border-b border-[var(--pf-border)] px-4 py-2.5">
          <span className="size-2.5 rounded-full border border-[var(--pf-border-strong)]" />
          <span className="size-2.5 rounded-full border border-[var(--pf-border-strong)]" />
          <span className="size-2.5 rounded-full border border-[var(--pf-border-strong)]" />
          <span className="ml-2 font-mono text-xs text-[var(--pf-muted)]">dev@localhost — terminal</span>
        </div>

        <div ref={scrollRef} className="pf-scroll min-h-0 flex-1 overflow-y-auto p-4 font-mono text-sm leading-relaxed">
          {lines.map((line, i) => {
            if (line.kind === "neofetch") {
              const topSkills = stack.flatMap((s) => s.items).slice(0, 3).join(" · ")
              const title = `${profile.handle} @ localhost`
              const underline = "-".repeat(title.length)
              return (
                <div key={i} className="my-4 flex flex-col items-start gap-8 sm:flex-row">
                  <div className="shrink-0 overflow-hidden rounded-md border border-[var(--pf-border-strong)] bg-white/5 shadow-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src="/profile-placeholder.png" 
                      alt="Profile" 
                      className="h-56 w-48 object-cover grayscale" 
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        const fallback = document.createElement('div')
                        fallback.className = 'h-56 w-48 flex items-center justify-center text-xs text-[var(--pf-faint)]'
                        fallback.innerText = 'profile-placeholder.png'
                        e.currentTarget.parentElement?.appendChild(fallback)
                      }}
                    />
                  </div>
                  <div className="flex flex-col font-mono text-sm leading-relaxed text-[var(--pf-muted)]">
                    <span className="font-bold text-[var(--pf-fg)]">{title}</span>
                    <span className="text-[var(--pf-faint)]">{underline}</span>
                    <span><span className="text-[var(--pf-fg)]">os:</span> portfolio-os 1.0</span>
                    <span><span className="text-[var(--pf-fg)]">shell:</span> /bin/dev</span>
                    <span><span className="text-[var(--pf-fg)]">role:</span> {profile.role}</span>
                    <span><span className="text-[var(--pf-fg)]">stack:</span> {topSkills}</span>
                    <span><span className="text-[var(--pf-fg)]">status:</span> {profile.status.toLowerCase()}</span>
                    <span><span className="text-[var(--pf-fg)]">location:</span> {profile.location.split('°')[0]}°</span>
                  </div>
                </div>
              )
            }
            if (line.kind === "resume") {
              return (
                <div key={i} className="my-4 flex max-w-md flex-col overflow-hidden rounded-lg border border-[var(--pf-border-strong)] bg-[var(--pf-bg)]">
                  <div className="flex items-center justify-between border-b border-[var(--pf-border)] bg-[var(--pf-bg-sidebar)] px-3 py-2">
                    <span className="font-mono text-xs text-[var(--pf-fg)]">resume.pdf</span>
                    <span className="font-mono text-[10px] text-[var(--pf-muted)]">PDF Document</span>
                  </div>
                  <div 
                    className="group relative h-48 w-full cursor-pointer overflow-hidden bg-white/5"
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      playClick(); 
                      setShowResume(true);
                    }}
                    onPointerEnter={playHover}
                  >
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                      <span className="rounded-md border border-[var(--pf-border-strong)] bg-[var(--pf-bg)] px-3 py-1.5 font-mono text-xs text-[var(--pf-fg)] shadow-xl">
                        Click to expand
                      </span>
                    </div>
                    {/* Render a zoomed-out thumbnail of the PDF */}
                    <iframe 
                      src="/resume.pdf#toolbar=0&navpanes=0&scrollbar=0" 
                      className="pointer-events-none h-[200%] w-[200%] origin-top-left scale-50 border-none opacity-60 transition-opacity group-hover:opacity-100" 
                      title="Resume Preview"
                      tabIndex={-1}
                    />
                  </div>
                </div>
              )
            }
            return (
              <div
                key={i}
                className={line.kind === "input" ? "mt-2 text-[var(--pf-fg)]" : "whitespace-pre-wrap text-[var(--pf-muted)]"}
              >
                {line.text}
              </div>
            )
          })}

          <form onSubmit={onSubmit} className="mt-1 flex items-center gap-2">
            <span className="shrink-0 text-[var(--pf-fg)]">{PROMPT}</span>
            <div className="relative flex-1">
              <input
                ref={inputRef}
                value={value}
                onChange={(e) => {
                  setValue(e.target.value)
                  setCursorIdx(e.target.selectionStart || 0)
                }}
                onSelect={(e) => setCursorIdx(e.currentTarget.selectionStart || 0)}
                onKeyUp={(e) => setCursorIdx(e.currentTarget.selectionStart || 0)}
                onKeyDown={onKeyDown}
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="off"
                aria-label="Terminal input"
                className="w-full bg-transparent text-[var(--pf-fg)] caret-transparent outline-none"
              />
              <span 
                className="pf-cursor absolute top-1/2 -translate-y-1/2 inline-block h-4 w-2 bg-[var(--pf-fg)] pointer-events-none" 
                style={{ left: `${cursorIdx}ch` }} 
                aria-hidden 
              />
            </div>
          </form>
        </div>
      </div>
      <p className="mt-3 font-mono text-[11px] text-[var(--pf-faint)]">
        Tip: use ↑ / ↓ for history, or keep browsing with the sidebar.
      </p>

      {/* PDF Viewer Modal */}
      {showResume && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm sm:p-8 animate-in fade-in duration-200">
          <div className="relative flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-[var(--pf-border-strong)] bg-[var(--pf-bg)] shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[var(--pf-border)] bg-[var(--pf-bg-sidebar)] px-4 py-3">
              <span className="font-mono text-sm tracking-wide text-[var(--pf-fg)]">resume.pdf</span>
              <button
                onClick={() => {
                  playClick()
                  setShowResume(false)
                }}
                onPointerEnter={playHover}
                className="rounded-md p-1 text-[var(--pf-muted)] transition-colors hover:bg-[var(--pf-surface)] hover:text-[var(--pf-fg)]"
                aria-label="Close resume viewer"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden bg-[var(--pf-surface)] relative">
              <iframe
                src="/pdfjs/web/viewer.html?file=/resume.pdf"
                className="h-full w-full border-none bg-white"
                title="Resume PDF Viewer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
