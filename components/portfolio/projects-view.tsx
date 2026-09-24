"use client";

import { useState } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { projects, type Project } from "./data";
import { ViewHeader } from "./view-header";
import { useAudio } from "./audio-context";

export function ProjectsView({ initialSlug }: { initialSlug?: string }) {
  const { playClick, playHover } = useAudio();
  const [selected, setSelected] = useState<Project | null>(
    initialSlug ? (projects.find((p) => p.slug === initialSlug) ?? null) : null,
  );

  if (selected) {
    return (
      <ProjectDetail
        project={selected}
        onBack={() => {
          playClick();
          setSelected(null);
        }}
      />
    );
  }

  return (
    <div className="pf-enter mx-auto max-w-4xl px-6 py-14 sm:px-10">
      <ViewHeader
        index="01"
        section="Work"
        title="Projects"
        caption="Currently a placeholders, will be updated soon"
      />

      <ul className="mt-12">
        {projects.map((project) => (
          <li key={project.slug}>
            <button
              onClick={() => {
                playClick();
                setSelected(project);
              }}
              onPointerEnter={playHover}
              className="group block w-full border-t border-[var(--pf-border)] py-8 text-left transition-colors last:border-b hover:bg-[var(--pf-surface)]"
            >
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-xs text-[var(--pf-faint)]">
                  {project.index}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="text-2xl tracking-tight text-[var(--pf-fg)] sm:text-3xl">
                      {project.title}
                    </h3>
                    <span className="font-mono text-xs text-[var(--pf-muted)]">
                      {project.year} · {project.role}
                    </span>
                  </div>
                  <p className="mt-3 max-w-xl leading-relaxed text-[var(--pf-muted)]">
                    {project.summary}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="font-mono text-[11px] text-[var(--pf-faint)] transition-colors group-hover:text-[var(--pf-muted)]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <ArrowUpRight className="mt-1 size-5 shrink-0 text-[var(--pf-faint)] transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--pf-fg)]" />
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProjectDetail({
  project,
  onBack,
}: {
  project: Project;
  onBack: () => void;
}) {
  const { playHover } = useAudio();
  return (
    <div className="pf-enter mx-auto max-w-3xl px-6 py-14 sm:px-10">
      <button
        onClick={onBack}
        onPointerEnter={playHover}
        className="group mb-10 inline-flex items-center gap-2 font-mono text-xs text-[var(--pf-muted)] transition-colors hover:text-[var(--pf-fg)]"
      >
        <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
        All projects
      </button>

      <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--pf-faint)]">
        Project / {project.index}
      </p>
      <h2 className="mt-4 text-5xl tracking-tight text-[var(--pf-fg)] sm:text-6xl">
        {project.title}
      </h2>

      <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-y border-[var(--pf-border)] py-6 sm:grid-cols-4">
        <Meta label="Year" value={project.year} />
        <Meta label="Role" value={project.role} />
        <Meta label="Status" value={project.status} />
        <Meta label="Stack" value={project.tech.length + " tools"} />
      </dl>

      {/* Visual placeholder */}
      <div className="mt-10 flex aspect-[16/9] items-center justify-center overflow-hidden border border-[var(--pf-border)] bg-[var(--pf-surface)]">
        <div className="flex flex-col items-center gap-2 text-[var(--pf-faint)]">
          <div
            aria-hidden
            className="size-12 border border-dashed border-[var(--pf-border-strong)]"
            style={{
              background:
                "repeating-linear-gradient(45deg, transparent, transparent 6px, var(--pf-border) 6px, var(--pf-border) 7px)",
            }}
          />
          <span className="font-mono text-[11px]">visual placeholder</span>
        </div>
      </div>

      <div className="mt-10 space-y-4">
        {project.description.map((para, i) => (
          <p key={i} className="leading-relaxed text-[var(--pf-fg)]">
            {para}
          </p>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {project.tech.map((t) => (
          <span
            key={t}
            className="rounded-full border border-[var(--pf-border)] px-3 py-1 font-mono text-[11px] text-[var(--pf-muted)]"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="mt-10 border-l-2 border-[var(--pf-border-strong)] pl-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--pf-faint)]">
          Outcome
        </p>
        <p className="mt-2 leading-relaxed text-[var(--pf-fg)]">
          {project.outcome}
        </p>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--pf-faint)]">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-[var(--pf-fg)]">{value}</dd>
    </div>
  );
}
