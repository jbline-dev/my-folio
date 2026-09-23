"use client"

import { ArrowUpRight, Copy, Check } from "lucide-react"
import { useState } from "react"
import { ViewHeader } from "./view-header"
import { about, experience, experiments, logs, nowItems, profile, stack } from "./data"
import { useAudio } from "./audio-context"

export function ExperimentsView() {
  return (
    <div className="pf-enter mx-auto max-w-4xl px-6 py-14 sm:px-10">
      <ViewHeader
        index="02"
        section="Work"
        title="Experiments"
        caption="Small studies and prototypes — unfinished by design."
      />
      <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-[var(--pf-border)] bg-[var(--pf-border)] sm:grid-cols-2">
        {experiments.map((exp) => (
          <div
            key={exp.title}
            className="group flex flex-col gap-2 bg-[var(--pf-bg)] p-6 transition-colors hover:bg-[var(--pf-surface)]"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg text-[var(--pf-fg)]">{exp.title}</h3>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--pf-faint)]">
                {exp.tag}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-[var(--pf-muted)]">{exp.blurb}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AboutView() {
  return (
    <div className="pf-enter mx-auto max-w-2xl px-6 py-14 sm:px-10">
      <ViewHeader index="03" section="Profile" title="About" />
      <div className="mt-10 space-y-5">
        {about.map((para, i) => (
          <p key={i} className="text-lg leading-relaxed text-[var(--pf-fg)]">
            {para}
          </p>
        ))}
      </div>
      <blockquote className="mt-12 border-l border-[var(--pf-border-strong)] pl-5">
        <p className="font-mono text-sm italic leading-relaxed text-[var(--pf-muted)]">
          {profile.quote.text}
        </p>
        <footer className="mt-2 font-mono text-xs text-[var(--pf-faint)]">— {profile.quote.author}</footer>
      </blockquote>
    </div>
  )
}

export function ExperienceView() {
  return (
    <div className="pf-enter mx-auto max-w-3xl px-6 py-14 sm:px-10">
      <ViewHeader index="04" section="Profile" title="Experience" />
      <ol className="mt-12">
        {experience.map((item) => (
          <li
            key={item.company + item.period}
            className="grid grid-cols-1 gap-2 border-t border-[var(--pf-border)] py-7 last:border-b sm:grid-cols-[9rem_1fr]"
          >
            <span className="font-mono text-xs text-[var(--pf-muted)]">{item.period}</span>
            <div>
              <div className="flex flex-wrap items-baseline gap-x-3">
                <h3 className="text-lg text-[var(--pf-fg)]">{item.role}</h3>
                <span className="font-mono text-sm text-[var(--pf-muted)]">{item.company}</span>
              </div>
              <p className="mt-2 leading-relaxed text-[var(--pf-muted)]">{item.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

export function StackView() {
  return (
    <div className="pf-enter mx-auto max-w-3xl px-6 py-14 sm:px-10">
      <ViewHeader index="05" section="Profile" title="Stack" caption="Tools I reach for most often." />
      <div className="mt-12 space-y-10">
        {stack.map((group) => (
          <div key={group.group} className="grid grid-cols-1 gap-3 sm:grid-cols-[9rem_1fr]">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--pf-faint)]">
              {group.group}
            </p>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="rounded-md border border-[var(--pf-border)] px-3 py-1.5 font-mono text-sm text-[var(--pf-fg)]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function NowView() {
  return (
    <div className="pf-enter mx-auto max-w-2xl px-6 py-14 sm:px-10">
      <ViewHeader
        index="06"
        section="System"
        title="Now"
        caption="A snapshot of what I’m focused on at the moment."
      />
      <ul className="mt-10 space-y-4">
        {nowItems.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="mt-2 inline-block size-1.5 shrink-0 rounded-full bg-[var(--pf-muted)]" />
            <span className="text-lg leading-relaxed text-[var(--pf-fg)]">{item}</span>
          </li>
        ))}
      </ul>
      <p className="mt-10 font-mono text-xs text-[var(--pf-faint)]">
        Last updated {logs[0]?.time ?? "—"}
      </p>
    </div>
  )
}

export function LogsView() {
  return (
    <div className="pf-enter mx-auto max-w-3xl px-6 py-14 sm:px-10">
      <ViewHeader index="07" section="System" title="Logs" caption="Recent commits to this workspace." />
      <ul className="mt-10 font-mono text-sm">
        {logs.map((log) => (
          <li
            key={log.hash}
            className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-[var(--pf-border)] py-3"
          >
            <span className="text-[var(--pf-faint)]">{log.time}</span>
            <span className="text-[var(--pf-muted)]">{log.hash}</span>
            <span className="text-[var(--pf-fg)]">{log.message}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ContactView() {
  const { playClick, playHover } = useAudio()
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    playClick()
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard unavailable */
    }
  }
  return (
    <div className="pf-enter mx-auto max-w-2xl px-6 py-14 sm:px-10">
      <ViewHeader
        index="08"
        section="Connect"
        title="Contact"
        caption="Open for a small number of collaborations and interesting problems."
      />
      <div className="mt-10 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4 rounded-lg border border-[var(--pf-border)] bg-[var(--pf-surface)] px-5 py-4">
          <span className="min-w-0 truncate font-mono text-sm text-[var(--pf-fg)]">{profile.email}</span>
          <button
            onClick={copy}
            onPointerEnter={playHover}
            className="inline-flex items-center gap-2 font-mono text-xs text-[var(--pf-muted)] transition-colors hover:text-[var(--pf-fg)]"
          >
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <ContactLink label="GitHub" href={profile.links.github} />
        <ContactLink label="LinkedIn" href={profile.links.linkedin} />
      </div>
    </div>
  )
}

function ContactLink({ label, href }: { label: string; href: string }) {
  const { playHover, playExternalLink } = useAudio()
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={playExternalLink}
      onPointerEnter={playHover}
      className="group flex items-center justify-between rounded-lg border border-[var(--pf-border)] px-5 py-4 transition-colors hover:bg-[var(--pf-surface)]"
    >
      <span className="text-sm text-[var(--pf-fg)]">{label}</span>
      <ArrowUpRight className="size-4 text-[var(--pf-faint)] transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--pf-fg)]" />
    </a>
  )
}
