// Placeholder content — edit freely. TerminalApp reads static command output
// from here; dynamic commands (ls, cat, open, clear) are handled in the
// component. Each value is an array of lines.

export interface TerminalContent {
  /** Printed once when the terminal mounts. */
  banner: string[];
  help: string[];
  about: string[];
  whoami: string;
  contact: string[];
  /** Virtual files for `ls` and `cat <file>`. */
  files: Record<string, string[]>;
}

export const TERMINAL: TerminalContent = {
  banner: [
    "portfolio-os — v1.0",
    'Type "help" to get started.',
    "",
  ],
  help: [
    "Available commands:",
    "  help            show this help",
    "  about           who is this",
    "  whoami          current user",
    "  ls              list files",
    "  cat <file>      print a file",
    "  open <app>      open an app (about, notes, projects, music, mail, settings)",
    "  contact         how to reach me",
    "  clear           clear the screen",
  ],
  about: [
    "Christopher Angoe — Software Engineer.",
    "I build web apps and care about the details.",
    'Try "open projects" to see some work.',
  ],
  whoami: "guest",
  contact: [
    "email    christopher.angoe@amalitech.com",
    "github   github.com/your-handle",
    "linkedin linkedin.com/in/your-handle",
  ],
  files: {
    "about.txt": [
      "Christopher Angoe",
      "Software Engineer based in Accra, Ghana.",
    ],
    "skills.txt": [
      "TypeScript, React, Next.js, Node.js, Tailwind CSS.",
    ],
    "contact.txt": [
      "christopher.angoe@amalitech.com",
    ],
  },
};
