// Placeholder content — edit freely. The structure is stable; AboutApp renders
// from this data, so you never need to touch JSX to change copy.

export interface AboutLink {
  label: string;
  href: string;
  /** Short glyph shown next to the link. */
  glyph: string;
}

/** A selectable "location" in the Finder-style sidebar. */
export interface AboutLocation {
  id: string;
  label: string;
  glyph: string;
  /** Which main-pane view this selects. "app:<id>" opens another app instead. */
  target: "profile" | "contact" | `app:${string}`;
}

export interface AboutData {
  name: string;
  role: string;
  location: string;
  tagline: string;
  /** Initials rendered in the avatar circle. */
  initials: string;
  bio: string[];
  skills: string[];
  links: AboutLink[];
  sidebar: { heading: string; items: AboutLocation[] }[];
}

export const ABOUT: AboutData = {
  name: "Christopher Angoe",
  role: "Software Engineer", // placeholder role — edit
  location: "Accra, Ghana", // placeholder — edit
  tagline: "I build things for the web and care about how they feel.",
  initials: "CA",
  bio: [
    "Hi — I’m Christopher, a software engineer who enjoys turning fuzzy ideas into interfaces people actually like using.",
    "This site is a little playground: a macOS desktop rebuilt in the browser. Open the apps in the dock, drag the windows around, and poke at the Terminal.",
    "Most of my time goes into front-end and product engineering, but I’m happiest anywhere the details matter.",
  ],
  skills: [
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Tailwind CSS",
    "UI/UX",
    "Accessibility",
  ],
  links: [
    { label: "Email", href: "mailto:christopher.angoe@amalitech.com", glyph: "✉" },
    // Replace the handles below with your real profiles.
    { label: "GitHub", href: "https://github.com/your-handle", glyph: "⌘" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/your-handle", glyph: "in" },
  ],
  sidebar: [
    {
      heading: "Favorites",
      items: [
        { id: "profile", label: "About Me", glyph: "👤", target: "profile" },
        { id: "contact", label: "Contact", glyph: "✉", target: "contact" },
        { id: "projects", label: "Projects", glyph: "🗂", target: "app:projects" },
      ],
    },
    {
      heading: "iCloud",
      items: [
        { id: "docs", label: "Documents", glyph: "📄", target: "profile" },
        { id: "desktop", label: "Desktop", glyph: "🖥", target: "profile" },
      ],
    },
  ],
};
