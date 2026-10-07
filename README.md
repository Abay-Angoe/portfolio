# macOS Desktop Portfolio

An interactive macOS desktop, rebuilt in the browser as a personal portfolio.
Wallpaper, a live menu bar, a magnifying dock, and draggable app windows you can
open, focus, move, minimize, maximize, and close — About (Finder), Notes, a
working Terminal, and a Projects gallery.

Fully client-side: no backend, no database. All content is typed static data.

## Stack

- **Next.js 14** (App Router) + **TypeScript** (strict)
- **Tailwind CSS** for all styling
- **Framer Motion** for window/dock animation (gated by `prefers-reduced-motion`)
- **Zustand** for the window-manager store

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (must pass before deploy)
npx tsc --noEmit   # type check
```

## Where things live

- `lib/store.ts` — the single Zustand store that owns all window state (focus =
  z-index; windows are fixed-size, geometry changes only via drag + maximize).
- `lib/apps.ts` — the `APPS` registry. Adding an app = adding one entry here; the
  dock, menu bar, and window layer all iterate it. App bodies except About are
  lazy-loaded with `next/dynamic`.
- `content/*.ts` — **all copy lives here.** Edit these to change text without
  touching components: `about.ts`, `notes.ts`, `projects.ts`, `terminal.ts`.
- `components/` — `Desktop`, `MenuBar`, `Dock`, `Clock`, generic `Window`, and
  `apps/` bodies.
- `public/wallpapers/`, `public/icons/`, `public/og.png` — self-authored assets
  (no Apple copyrighted material).

## Music app

The Music app plays real, free **Creative-Commons** tracks from the
[Jamendo API](https://devportal.jamendo.com) when `NEXT_PUBLIC_JAMENDO_CLIENT_ID`
is set (get a free client id there). Without a key it falls back to original
browser-synthesized chiptunes (`content/music.ts`) — no network, no assets. See
`.env.example`.

## Mail app

The Mail app sends real messages when `NEXT_PUBLIC_FORMSPREE_ID` is set (create a
free form at [formspree.io](https://formspree.io)). Without it, Send opens the
visitor's own mail client with a prefilled message (mailto). Recipient and copy
live in `content/contact.ts`.

## Editing content

Open `content/` and edit the data. Flagged placeholders to personalize:

- `content/about.ts` — role, location, and the GitHub/LinkedIn handles
  (`your-handle`).
- `content/projects.ts` — replace the placeholder projects; add `image` paths
  (under `/public`) for real screenshots (rendered via `next/image`).

## Deploy (Vercel)

1. Push this repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new) — the Next.js preset is
   auto-detected; no build config needed.
3. Set the env var **`NEXT_PUBLIC_SITE_URL`** to your deployed origin (e.g.
   `https://your-portfolio.vercel.app`) so Open Graph image URLs resolve
   absolutely.
4. Deploy. (Or run `npx vercel` locally.)

## Notes

- Small screens (`< md`) render the focused app full-screen with a bottom dock
  bar; dragging is disabled.
- `Esc` closes the focused window.
