import dynamic from "next/dynamic";
import type { AppDef } from "@/lib/types";
import AppFallback from "@/components/apps/AppFallback";
// About is on the critical path (opens on boot), so it's imported eagerly.
import AboutApp from "@/components/apps/AboutApp";

// The other app bodies are code-split so their JS isn't in the initial bundle;
// each chunk loads the first time its window opens.
const NotesApp = dynamic(() => import("@/components/apps/NotesApp"), {
  loading: AppFallback,
});
const TerminalApp = dynamic(() => import("@/components/apps/TerminalApp"), {
  loading: AppFallback,
});
const ProjectsApp = dynamic(() => import("@/components/apps/ProjectsApp"), {
  loading: AppFallback,
});
const MusicApp = dynamic(() => import("@/components/apps/MusicApp"), {
  loading: AppFallback,
});
const MailApp = dynamic(() => import("@/components/apps/MailApp"), {
  loading: AppFallback,
});
const SettingsApp = dynamic(() => import("@/components/apps/SettingsApp"), {
  loading: AppFallback,
});
const PreviewApp = dynamic(() => import("@/components/apps/PreviewApp"), {
  loading: AppFallback,
});

/**
 * The single source of truth for what apps exist. The dock, menu bar, window
 * layer, and Finder sidebar all iterate this array, so adding an app means
 * adding one entry here — nothing else needs to change.
 */
export const APPS: AppDef[] = [
  {
    id: "about",
    name: "About",
    icon: "/icons/about.svg",
    component: AboutApp,
    defaultSize: { width: 720, height: 480 },
    openOnBoot: true,
  },
  {
    id: "notes",
    name: "Notes",
    icon: "/icons/notes.svg",
    component: NotesApp,
    defaultSize: { width: 640, height: 460 },
  },
  {
    id: "terminal",
    name: "Terminal",
    icon: "/icons/terminal.svg",
    component: TerminalApp,
    defaultSize: { width: 640, height: 400 },
  },
  {
    id: "projects",
    name: "Projects",
    icon: "/icons/projects.svg",
    component: ProjectsApp,
    defaultSize: { width: 800, height: 520 },
  },
  {
    id: "music",
    name: "Music",
    icon: "/icons/music.svg",
    component: MusicApp,
    defaultSize: { width: 720, height: 480 },
  },
  {
    id: "mail",
    name: "Mail",
    icon: "/icons/mail.svg",
    component: MailApp,
    defaultSize: { width: 620, height: 500 },
  },
  {
    id: "settings",
    name: "System Settings",
    icon: "/icons/settings.svg",
    component: SettingsApp,
    defaultSize: { width: 680, height: 460 },
  },
  {
    id: "preview",
    name: "Preview",
    icon: "/icons/preview.svg",
    component: PreviewApp,
    defaultSize: { width: 760, height: 560 },
    hideFromDock: true, // opened via the résumé desktop icon and Spotlight
  },
];

/** Look up a single app definition by id. */
export function getApp(id: AppDef["id"]): AppDef | undefined {
  return APPS.find((app) => app.id === id);
}
