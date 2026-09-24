"use client"

import type { ComponentType } from "react"
import {
  Folder,
  FlaskConical,
  User,
  FileText,
  Code2,
  Activity,
  ListOrdered,
  TerminalSquare,
  Mail,
  Sun,
  Moon,
  Volume2,
  VolumeX,
} from "lucide-react"
import { profile, type ViewId } from "./data"
import { useAudio } from "./audio-context"

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.05-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.96 0-1.32.47-2.39 1.24-3.23-.12-.31-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.18.77.84 1.24 1.91 1.24 3.23 0 4.63-2.81 5.65-5.49 5.95.43.37.81 1.1.81 2.22 0 1.6-.01 2.9-.01 3.29 0 .32.22.7.83.58A12 12 0 0 0 24 12.5C24 5.87 18.63.5 12 .5Z" />
    </svg>
  )
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  )
}

type NavItem = { id: ViewId; label: string; icon: ComponentType<{ className?: string }> }

const groups: { title: string; items: NavItem[] }[] = [
  {
    title: "Work",
    items: [
      { id: "projects", label: "Projects", icon: Folder },
      { id: "experiments", label: "Experiments", icon: FlaskConical },
    ],
  },
  {
    title: "Profile",
    items: [
      { id: "about", label: "About", icon: User },
      { id: "experience", label: "Experience", icon: FileText },
      { id: "stack", label: "Stack", icon: Code2 },
    ],
  },
  {
    title: "System",
    items: [
      { id: "now", label: "Now", icon: Activity },
      { id: "logs", label: "Logs", icon: ListOrdered },
    ],
  },
  {
    title: "Explore",
    items: [{ id: "terminal", label: "Terminal", icon: TerminalSquare }],
  },
]

type SidebarProps = {
  active: ViewId
  onNavigate: (id: ViewId) => void
  theme: "dark" | "light"
  onToggleTheme: (e: React.MouseEvent) => void
  sound: boolean
  onToggleSound: () => void
}

export function Sidebar({ active, onNavigate, theme, onToggleTheme, sound, onToggleSound }: SidebarProps) {
  const { playClick, playThemeToggle, playExternalLink, playHover } = useAudio()

  const handleNavigate = (id: ViewId) => {
    playClick()
    onNavigate(id)
  }

  const handleToggleTheme = (e: React.MouseEvent) => {
    const isGoingDark = theme === "light"
    playThemeToggle(isGoingDark)
    onToggleTheme(e)
  }

  const handleToggleSound = () => {
    playClick()
    onToggleSound()
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <button
        onClick={() => handleNavigate("profile")}
        className="group flex flex-col items-start px-6 pt-6 pb-5 text-left"
      >
        <span className="flex items-center gap-2">
          <span className="font-mono text-2xl tracking-tight text-[var(--pf-fg)]">{profile.handle}</span>
        </span>
        <span className="mt-1 font-mono text-xs tracking-wide text-[var(--pf-muted)]">{profile.role}</span>
      </button>

      <div className="mx-6 border-t border-[var(--pf-border)]" />

      {/* Scrollable nav */}
      <nav className="pf-scroll flex-1 overflow-y-auto px-3 py-5">
        {groups.map((group) => (
          <div key={group.title} className="mb-6">
            <p className="px-3 pb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--pf-faint)]">
              {group.title}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon
                const isActive = active === item.id
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleNavigate(item.id)}
                      onPointerEnter={playHover}
                      aria-current={isActive ? "page" : undefined}
                      className={[
                        "group flex w-full items-center gap-3 rounded-md px-3 py-1.5 text-sm transition-colors",
                        isActive
                          ? "bg-[var(--pf-elevated)] text-[var(--pf-fg)]"
                          : "text-[var(--pf-muted)] hover:bg-[var(--pf-surface)] hover:text-[var(--pf-fg)]",
                      ].join(" ")}
                    >
                      <Icon className="size-4 shrink-0 opacity-80" />
                      <span className="tracking-wide">{item.label}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}

        {/* Connect */}
        <div className="mb-2">
          <p className="px-3 pb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--pf-faint)]">
            Connect
          </p>
          <ul className="space-y-0.5">
            <li>
              <a
                href={profile.links.github}
                target="_blank"
                rel="noreferrer"
                onClick={playExternalLink}
                onPointerEnter={playHover}
                className="group flex w-full items-center gap-3 rounded-md px-3 py-1.5 text-sm text-[var(--pf-muted)] transition-colors hover:bg-[var(--pf-surface)] hover:text-[var(--pf-fg)]"
              >
                <GithubIcon className="size-4 shrink-0 opacity-80" />
                <span className="tracking-wide">GitHub</span>
              </a>
            </li>
            <li>
              <a
                href={profile.links.linkedin}
                target="_blank"
                rel="noreferrer"
                onClick={playExternalLink}
                onPointerEnter={playHover}
                className="group flex w-full items-center gap-3 rounded-md px-3 py-1.5 text-sm text-[var(--pf-muted)] transition-colors hover:bg-[var(--pf-surface)] hover:text-[var(--pf-fg)]"
              >
                <LinkedinIcon className="size-4 shrink-0 opacity-80" />
                <span className="tracking-wide">LinkedIn</span>
              </a>
            </li>
            <li>
              <a
                href={profile.links.email}
                onClick={playExternalLink}
                onPointerEnter={playHover}
                className="group flex w-full items-center gap-3 rounded-md px-3 py-1.5 text-sm text-[var(--pf-muted)] transition-colors hover:bg-[var(--pf-surface)] hover:text-[var(--pf-fg)]"
              >
                <Mail className="size-4 shrink-0 opacity-80" />
                <span className="tracking-wide">Email</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Footer: status + controls */}
      <div className="mt-auto border-t border-[var(--pf-border)] px-6 py-5">
        <p className="font-mono text-xs text-[var(--pf-muted)]">{profile.statusNote}</p>
        <a
          href={profile.links.email}
          onClick={playExternalLink}
          onPointerEnter={playHover}
          className="mt-1 block font-mono text-xs text-[var(--pf-fg)] underline-offset-4 hover:underline"
        >
          {profile.email}
        </a>

        <div className="mt-5 flex items-center gap-1.5">
          <ControlButton
            label={theme === "dark" ? "Switch to light" : "Switch to dark"}
            active={theme === "light"}
            onClick={handleToggleTheme}
            onPointerEnter={playHover}
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </ControlButton>
          <ControlButton label={sound ? "Mute" : "Unmute"} active={sound} onClick={handleToggleSound} onPointerEnter={playHover}>
            {sound ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
          </ControlButton>
        </div>
      </div>
    </div>
  )
}

function ControlButton({
  children,
  label,
  active,
  onClick,
  onPointerEnter,
}: {
  children: React.ReactNode
  label: string
  active?: boolean
  onClick: React.MouseEventHandler<HTMLButtonElement>
  onPointerEnter?: React.MouseEventHandler<HTMLButtonElement>
}) {
  return (
    <button
      onClick={onClick}
      onPointerEnter={onPointerEnter}
      aria-label={label}
      title={label}
      aria-pressed={active}
      className={[
        "flex size-9 items-center justify-center rounded-full border transition-colors",
        active
          ? "border-[var(--pf-border-strong)] bg-[var(--pf-elevated)] text-[var(--pf-fg)]"
          : "border-[var(--pf-border)] text-[var(--pf-muted)] hover:border-[var(--pf-border-strong)] hover:text-[var(--pf-fg)]",
      ].join(" ")}
    >
      {children}
    </button>
  )
}
