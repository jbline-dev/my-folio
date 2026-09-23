export function ViewHeader({
  index,
  section,
  title,
  caption,
}: {
  index: string
  section: string
  title: string
  caption?: string
}) {
  return (
    <header>
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--pf-faint)]">
        {index} / {section}
      </p>
      <h2 className="mt-3 text-4xl tracking-tight text-[var(--pf-fg)] sm:text-5xl">{title}</h2>
      {caption ? <p className="mt-4 max-w-lg leading-relaxed text-[var(--pf-muted)]">{caption}</p> : null}
    </header>
  )
}
