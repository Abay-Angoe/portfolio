// Placeholder content — edit freely. ProjectsApp renders the grid and the
// detail view from this array. `image` is optional; when omitted a gradient
// thumbnail is generated from `accent`.

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  id: string;
  title: string;
  /** One-line summary shown on the card. */
  blurb: string;
  /** Longer copy shown in the detail view. */
  description: string;
  tech: string[];
  links: ProjectLink[];
  /** Optional screenshot path under /public. */
  image?: string;
  /** Two colors for the generated gradient thumbnail. */
  accent: [string, string];
}

export const PROJECTS: Project[] = [
  {
    id: "desktop-portfolio",
    title: "Desktop Portfolio",
    blurb: "The macOS desktop you're looking at, built in the browser.",
    description:
      "A client-side Next.js app that renders a wallpaper, menu bar, dock, and draggable app windows. A hand-rolled window manager (Zustand) owns focus, z-index, drag, and maximize. No backend — all content is typed data.",
    tech: ["Next.js", "TypeScript", "Tailwind", "Framer Motion", "Zustand"],
    links: [{ label: "Source", href: "https://github.com/your-handle" }],
    accent: ["#3a7dff", "#b06bff"],
  },
  {
    id: "project-two",
    title: "Project Two",
    blurb: "A short, punchy description of what this project does.",
    description:
      "Replace this with a real project. Describe the problem, your role, and the outcome — a metric or a result reads better than a feature list.",
    tech: ["React", "Node.js", "PostgreSQL"],
    links: [
      { label: "Live", href: "https://example.com" },
      { label: "Source", href: "https://github.com/your-handle" },
    ],
    accent: ["#28c840", "#12b5c9"],
  },
  {
    id: "project-three",
    title: "Project Three",
    blurb: "Another placeholder card to show the grid layout.",
    description:
      "Swap in your work here. The grid grows automatically as you add entries to content/projects.ts — no component changes needed.",
    tech: ["TypeScript", "Tailwind"],
    links: [{ label: "Source", href: "https://github.com/your-handle" }],
    accent: ["#febc2e", "#ff5f57"],
  },
  {
    id: "project-four",
    title: "Project Four",
    blurb: "Yet another example project tile.",
    description:
      "Each project supports a title, blurb, longer description, a tech list, links, and an optional screenshot image.",
    tech: ["Next.js", "Framer Motion"],
    links: [{ label: "Live", href: "https://example.com" }],
    accent: ["#ff9ecb", "#7c5bd0"],
  },
];
