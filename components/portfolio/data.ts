export type ViewId =
  | "profile"
  | "projects"
  | "experiments"
  | "about"
  | "experience"
  | "stack"
  | "now"
  | "logs"
  | "terminal"
  | "contact"

export const profile = {
  handle: "jb.line",
  role: "Software Engineer",
  intro: "I build digital products, interfaces and systems.",
  email: "johnrobertgaufo1@gmail.com",
  location: "38.8828° N  77.0089° W",
  status: "Available",
  statusNote: "For work & collaborations",
  quote: {
    text: "I am always doing what I cannot do yet, in order to learn how to do it.",
    author: "Vincent van Gogh",
  },
  links: {
    github: "https://github.com/jbline-dev",
    linkedin: "https://www.linkedin.com/in/john-robert-gaufo-3687ba333",
    email: "mailto:johnrobertgaufo1@gmail.com",
  },
}

export type Project = {
  slug: string
  index: string
  title: string
  year: string
  role: string
  tech: string[]
  summary: string
  description: string[]
  outcome: string
  status: "Shipped" | "In progress" | "Archived"
}

export const projects: Project[] = [
  {
    slug: "atlas",
    index: "01",
    title: "Atlas",
    year: "2025",
    role: "Lead Engineer",
    tech: ["TypeScript", "Next.js", "PostgreSQL", "WebGL"],
    summary: "A spatial data platform for visualizing large geographic datasets in the browser.",
    description: [
      "Atlas renders millions of points on an interactive map without dropping frames, streaming tiles on demand and compositing layers on the GPU.",
      "I designed the rendering pipeline, the query layer, and the collaborative annotation system that lets teams mark up datasets in real time.",
    ],
    outcome: "Adopted by three research teams; reduced dataset exploration time from hours to minutes.",
    status: "Shipped",
  },
  {
    slug: "signal",
    index: "02",
    title: "Signal",
    year: "2024",
    role: "Founding Engineer",
    tech: ["React", "Rust", "WebSockets", "Redis"],
    summary: "A low-latency messaging runtime for distributed developer tools.",
    description: [
      "Signal is a transport layer that keeps editors, terminals and dashboards in sync across machines with sub-50ms propagation.",
      "I owned the client SDK and the reconnection model that gracefully recovers state after network partitions.",
    ],
    outcome: "Powers live collaboration for an internal tooling suite used daily by 400+ engineers.",
    status: "Shipped",
  },
  {
    slug: "grain",
    index: "03",
    title: "Grain",
    year: "2024",
    role: "Designer & Engineer",
    tech: ["Next.js", "Canvas", "TypeScript"],
    summary: "A minimalist note system that treats writing as a spatial canvas.",
    description: [
      "Grain rethinks the document as an infinite plane where notes cluster, link and drift into structure over time.",
      "I built the layout engine and the keyboard-first interaction model from scratch.",
    ],
    outcome: "Open-sourced; 2.1k stars and an active contributor community.",
    status: "In progress",
  },
  {
    slug: "quiet",
    index: "04",
    title: "Quiet",
    year: "2023",
    role: "Engineer",
    tech: ["Swift", "Go", "gRPC"],
    summary: "A focus tool that shapes notifications around deep work rhythms.",
    description: [
      "Quiet learns when you concentrate and defers interruptions to natural breakpoints instead of fixed schedules.",
      "I built the scheduling model and the cross-device sync layer.",
    ],
    outcome: "Featured in two productivity roundups; retired to focus on newer work.",
    status: "Archived",
  },
]

export type Experiment = {
  title: string
  blurb: string
  tag: string
}

export const experiments: Experiment[] = [
  { title: "Flow Fields", blurb: "Vector-field particle systems rendered on the GPU.", tag: "WebGL" },
  { title: "Type Weather", blurb: "Variable fonts that respond to live weather data.", tag: "Canvas" },
  { title: "Latency Map", blurb: "Real-time visualization of global network round-trips.", tag: "D3" },
  { title: "Sketch DB", blurb: "A query language you draw instead of type.", tag: "Research" },
  { title: "Ambient CLI", blurb: "A terminal that reacts to the time of day.", tag: "Rust" },
  { title: "Paper Radio", blurb: "Generative ambient audio from text input.", tag: "Web Audio" },
]

export type ExperienceItem = {
  period: string
  company: string
  role: string
  detail: string
}

export const experience: ExperienceItem[] = [
  {
    period: "2023 — Now",
    company: "Independent",
    role: "Software Engineer & Consultant",
    detail: "Design and build products, interfaces and internal tooling for early-stage teams.",
  },
  {
    period: "2021 — 2023",
    company: "Northlight",
    role: "Senior Frontend Engineer",
    detail: "Led the design systems and data-visualization efforts across the core product.",
  },
  {
    period: "2019 — 2021",
    company: "Fieldwork",
    role: "Product Engineer",
    detail: "Shipped the collaborative editor and real-time presence infrastructure.",
  },
  {
    period: "2017 — 2019",
    company: "Studio Verse",
    role: "Frontend Developer",
    detail: "Built interactive marketing sites and creative campaigns for agencies.",
  },
]

export const stack: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["TypeScript", "Rust", "Go", "Python", "SQL"] },
  { group: "Frontend", items: ["React", "Next.js", "Tailwind", "WebGL", "Canvas"] },
  { group: "Backend", items: ["Node", "PostgreSQL", "Redis", "gRPC", "GraphQL"] },
  { group: "Tools", items: ["Figma", "Vercel", "Docker", "Linear", "Vim"] },
]

export const nowItems: string[] = [
  "Building a spatial note-taking tool.",
  "Reading about rendering pipelines and GPU compute.",
  "Available for a small number of collaborations.",
  "Learning to sketch with ink.",
]

export type LogEntry = { time: string; hash: string; message: string }

export const logs: LogEntry[] = [
  { time: "2026-09-21", hash: "a3f9c1e", message: "refactor: streamline canvas render loop" },
  { time: "2026-09-18", hash: "7b2d0aa", message: "feat: add reduced-motion background fallback" },
  { time: "2026-09-14", hash: "e91c4d2", message: "docs: rewrite project case studies" },
  { time: "2026-09-09", hash: "1cc78ff", message: "feat: ship terminal command palette" },
  { time: "2026-09-02", hash: "44ab903", message: "perf: batch strokes into single path" },
  { time: "2026-08-27", hash: "9de1207", message: "chore: migrate to typed design tokens" },
]

export const about: string[] = [
  "I’m a software engineer focused on the space where interface, systems and craft overlap. I like building tools that feel calm to use and honest about what they do underneath.",
  "Most of my work lives at the intersection of the frontend and the runtime beneath it — rendering, real-time data, and the small interactions that make software feel considered.",
  "Outside of code I spend time drawing, reading about design history, and taking apart interfaces I admire to understand how they were made.",
]
