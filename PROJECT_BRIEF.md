# Project Brief — macOS Desktop Portfolio

## 1. What we're building

A personal portfolio site that presents itself as a **fully interactive macOS desktop in the browser**: a wallpaper, a top menu bar with a live clock, a bottom dock, and draggable "app" windows the visitor can open, move, focus, minimize, and close. It should feel like sitting down at a Mac, not like reading a webpage.

This is a single-page client app. There is no backend and no database — all content is static data compiled into the bundle.

### The four apps (v1 scope)

1. **About / Finder** — the landing window. A Finder-style two-pane layout: a sidebar of "locations" and a main pane with a short bio, role, and links. This is what opens on load.
2. **Notes** — an Apple Notes clone: a list of notes in a sidebar, note body in the main pane. Holds longer-form content (bio, principles, "how I work", reading list). Content is plain data.
3. **Terminal** — a working fake terminal. Accepts typed commands (`help`, `about`, `ls`, `cat <file>`, `open <app>`, `whoami`, `contact`, `clear`) and prints canned output. `open projects` should actually open the Projects window (the terminal can dispatch to the window store).
4. **Projects / Photos gallery** — a grid of project cards (or a Photos-style thumbnail grid). Clicking a card expands it to show detail: title, description, tech, links, screenshot.

## 2. Stack (non-negotiable unless a blocker appears)

- **Next.js (latest 14.x), App Router**, TypeScript.
- **Tailwind CSS** for all styling. Prefer utility classes; use arbitrary values (`w-[92px]`, `rounded-[12px]`) freely to hit exact macOS metrics.
- **Framer Motion** for window open/close/minimize springs and dock hover. (Do **not** use `react-rnd` / `react-draggable` — dragging is hand-rolled, see §4.)
- **Zustand** for the window-manager store (see §3). No Redux.
- Deploy target: **Vercel**.

Everything runs client-side. Most components will need `"use client"`. There is no need for server components beyond the root layout shell.

## 3. State architecture — the window manager (the core of the app)

A **single Zustand store** owns all window state. Do not scatter window state across components.

```ts
type WindowId = string;      // unique per open window instance
type AppId = "about" | "notes" | "terminal" | "projects";

interface WindowState {
  id: WindowId;
  appId: AppId;
  title: string;
  x: number; y: number;          // top-left position in px
  width: number; height: number;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  prevRect?: { x:number; y:number; width:number; height:number }; // for un-maximize
}

interface DesktopStore {
  windows: WindowState[];
  topZ: number;                  // monotonically increasing focus counter
  openApp(appId: AppId): void;   // opens (or focuses if already open + single-instance)
  close(id: WindowId): void;
  focus(id: WindowId): void;     // sets zIndex = ++topZ
  minimize(id: WindowId): void;
  toggleMaximize(id: WindowId): void;
  move(id: WindowId, x: number, y: number): void;
  resize(id: WindowId, w: number, h: number): void;
}
```

Rules:

- **Focus = z-index.** `focus()` assigns the window `++topZ`. Never reorder the array; sort by `zIndex` at render or just set CSS `z-index`.
- **Single instance per app** for v1 (opening Notes when Notes is open just focuses it). Keep the `id`/`appId` split so multi-instance is possible later.
- The **dock** and **menu bar** are consumers of this store, not owners of state.

### Apps registry

One config array is the source of truth for what apps exist. The dock, the window renderer, and the Finder sidebar all read from it, so adding an app = adding one entry.

```ts
interface AppDef {
  id: AppId;
  name: string;                    // menu-bar + dock label
  icon: string;                    // /public/icons/<id>.png
  component: React.ComponentType;  // the window body
  defaultSize: { width: number; height: number };
  openOnBoot?: boolean;            // About = true
}
export const APPS: AppDef[] = [ /* about, notes, terminal, projects */ ];
```

## 4. Window component & dragging

A single generic `<Window>` wraps every app body and renders the chrome: title bar with the three **traffic-light buttons** (close = red, minimize = amber, maximize = green), the title, and a content slot.

Dragging is **hand-rolled with Pointer Events** on the title bar:

- `onPointerDown` on the title bar: `focus(id)`, record offset between pointer and window origin, `setPointerCapture`.
- `onPointerMove`: `move(id, e.clientX - offsetX, e.clientY - offsetY)`. Clamp so the title bar can't leave the viewport.
- `onPointerUp`: release capture.

Use Framer Motion only for **enter/exit/minimize** transitions (scale + opacity spring), not for drag. Respect `prefers-reduced-motion`.

## 5. Desktop chrome

- **Wallpaper**: full-viewport background image (`/public/wallpapers/`). Support a crossfade when it changes (`transition-[background] duration-500`). Ship one good default (a macOS-style gradient/photo you have rights to — don't ship Apple's copyrighted wallpapers; generate or use a CC0/licensed one).
- **Menu bar** (fixed, top): left shows the focused app's name + menus (can be non-functional decorative menus for v1); right shows battery/wifi/control-center glyphs and a **live clock** (updates each minute). The app name must react to which window is focused.
- **Dock** (fixed, bottom, centered): icons from `APPS`, plus a divider and Trash. Hover magnification (scale the hovered icon and lightly its neighbors). A small dot under apps that are currently open. Click = `openApp`.
- **Desktop icons** (optional, nice-to-have): a couple of files on the desktop (`README.md`, `resume.pdf`) that open a window or download.

## 6. Content as data

Keep all copy out of components, in typed files under `/content`:

- `content/about.ts`, `content/notes.ts` (array of `{ id, title, pinned, updated, body }`), `content/projects.ts` (array of `{ id, title, blurb, tech[], links, image }`), `content/terminal.ts` (command → output map).

This lets the site owner edit text without touching JSX, and lets Claude Code generate components generically.

## 7. Responsive & accessibility

- **Mobile / small screens**: free-floating draggable windows don't work on phones. On `< md`, render the focused app **full-screen** (or as a stacked sheet), turn the dock into a simple bottom bar, and disable dragging. Detect via a `matchMedia` hook, not just CSS.
- **Keyboard**: `Esc` closes the focused window; `Tab` order sane; traffic-light buttons are real `<button>`s with `aria-label`s.
- **Reduced motion**: gate all Framer Motion springs behind `useReducedMotion()`.
- **Focus management**: opening a window moves focus into it; closing returns focus to the dock item.

## 8. Performance & SEO

- Lazy-load app bodies (`next/dynamic`) so Terminal/Projects code isn't in the initial bundle; the shell + About should be the critical path.
- Real `<title>`, meta description, and Open Graph tags (og:image = a screenshot of the desktop) in the App Router `metadata` export — the page reads as an empty shell to crawlers otherwise, so the metadata matters.
- Use `next/image` for project screenshots and the wallpaper.

## 9. Suggested folder structure

```
app/
  layout.tsx            // metadata, fonts, <Desktop/> shell
  page.tsx              // renders <Desktop/>
components/
  Desktop.tsx           // wallpaper + menubar + dock + window layer
  MenuBar.tsx  Dock.tsx  Clock.tsx
  Window.tsx            // generic chrome + drag + traffic lights
  apps/
    AboutApp.tsx  NotesApp.tsx  TerminalApp.tsx  ProjectsApp.tsx
lib/
  store.ts              // Zustand desktop store
  apps.ts               // APPS registry
  useIsMobile.ts
content/
  about.ts  notes.ts  projects.ts  terminal.ts
public/
  icons/  wallpapers/
```

## 10. Build in phases (each phase should compile & run)

- **Phase 0** — Scaffold `create-next-app` (TS, Tailwind, App Router), add Framer Motion + Zustand, set up folders and the `APPS` registry with placeholder bodies.
- **Phase 1** — Static desktop shell: wallpaper, menu bar with live clock, dock rendering icons from `APPS` (no interactivity yet).
- **Phase 2** — The window manager. **Windows are fixed-size: no edge/corner resize handles.** The only geometry interactions are drag-to-move and maximize/restore. Build:
  - **Zustand store** (`lib/store.ts`) with actions `openApp`, `close`, `focus`, `minimize`, `toggleMaximize`, and `move`. **Omit the `resize` action** and drop `width`/`height` from the store's per-window mutations — size comes from the app's `defaultSize` in the registry and never changes except via maximize.
  - **Generic `<Window>`** with the three traffic lights: red = `close`, amber = `minimize`, green = `toggleMaximize`. Render at the store's `x/y` and the registry `defaultSize`; there are no resize handles and no resize cursors on the edges.
  - **Hand-rolled drag** on the title bar via Pointer Events: `onPointerDown` → `focus(id)`, record pointer-to-origin offset, `setPointerCapture`; `onPointerMove` → `move(id, clientX-offsetX, clientY-offsetY)`, clamped so the title bar can't leave the viewport; `onPointerUp` → release. Dragging is disabled while maximized.
  - **Focus = z-index**: `focus()` sets `zIndex = ++topZ`.
  - **Maximize/restore**: on maximize, save the current `{x, y}` to `prevRect` and expand to fill the desktop area (full viewport minus the menu bar); on restore, put it back. Window body scrolls internally if content overflows the fixed size.
  - Wire the **dock** to `openApp` (single-instance: focus if already open). One placeholder app proves the whole loop end-to-end.
- **Phase 3** — Build the four real apps against `/content` data. About opens on boot.
- **Phase 4** — Polish: menu bar reflects focused app, dock open-indicators, dock hover magnification, a subtle boot/entry animation.
- **Phase 5** — Responsive (mobile full-screen mode) + accessibility + reduced motion.
- **Phase 6** — Metadata/OG image, `next/image`, lazy-loading, deploy to Vercel.

## 11. Explicit non-goals for v1

- No real multitasking beyond single-instance windows.
- No persistence of window positions (can add `zustand/middleware` `persist` later).
- Decorative menu-bar dropdowns can be non-functional.
- Don't ship Apple's copyrighted icons/wallpapers — use your own or licensed/CC0 equivalents.
