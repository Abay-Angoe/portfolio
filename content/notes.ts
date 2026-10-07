// Placeholder content — edit freely. NotesApp renders from this array.
// Body is plain text; blank lines separate paragraphs, and a line starting with
// "# " renders as a small heading.

export interface Note {
  id: string;
  title: string;
  pinned?: boolean;
  /** ISO date (YYYY-MM-DD); shown formatted in the list. */
  updated: string;
  body: string;
}

export const NOTES: Note[] = [
  {
    id: "how-i-work",
    title: "How I work",
    pinned: true,
    updated: "2026-07-20",
    body: `# How I work

I like small, reversible steps. Ship something that runs, then make it good.

Bias toward clarity: boring code that reads well beats clever code that doesn't.

Talk to the people who'll use the thing. The best specs come from watching someone get stuck.`,
  },
  {
    id: "principles",
    title: "Principles",
    pinned: true,
    updated: "2026-07-12",
    body: `# Principles

Make the right thing the easy thing.

Details are not details — they make the design.

Leave the codebase a little better than you found it.

If it isn't tested or tried, it doesn't work yet.`,
  },
  {
    id: "reading",
    title: "Reading list",
    updated: "2026-06-30",
    body: `# Reading list

A few things I recommend often:

• "The Design of Everyday Things" — Don Norman
• "A Philosophy of Software Design" — John Ousterhout
• "Refactoring UI" — Adam Wathan & Steve Schoger

Currently reading something new — check back.`,
  },
  {
    id: "about-this-site",
    title: "About this site",
    updated: "2026-07-24",
    body: `# About this site

This portfolio is a macOS desktop rebuilt with Next.js, TypeScript, Tailwind, Framer Motion, and Zustand.

Everything is client-side and the content lives in typed data files — no backend.

Try the Terminal: type "help" to see what it can do.`,
  },
];
