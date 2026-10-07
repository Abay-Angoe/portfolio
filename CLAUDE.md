# CLAUDE.md

Guidance for working in this repo. Read `PROJECT_BRIEF.md` for the full spec; this file is the short list of rules to follow on every change.

## What this is

An interactive **macOS desktop portfolio** — a client-side Next.js app that renders a wallpaper, menu bar, dock, and draggable app windows. No backend, no database. All content is static data.

## Stack (do not swap without asking)

- Next.js 14.x, **App Router**, TypeScript, strict mode.
- Tailwind CSS for all styling — utility classes only, no CSS-in-JS, no separate `.css` files beyond `globals.css`. Use arbitrary values (`w-[92px]`, `rounded-[12px]`) to hit exact metrics.
- Framer Motion for window/dock animation.
- Zustand for state. **No Redux, no Context for window state.**
- Do **not** add `react-rnd` or `react-draggable` — dragging is hand-rolled with Pointer Events.

## Golden rules

1. **One store owns all window state.** `lib/store.ts` (Zustand) is the single source of truth for open windows, positions, sizes, and z-index. Never duplicate this state in component `useState`. The dock and menu bar are *consumers*, not owners.
2. **Focus is z-index.** Focusing a window sets `zIndex = ++topZ`. Don't reorder arrays to change stacking.
3. **Apps are registry entries.** Every app is one object in `lib/apps.ts` (`APPS`). Adding an app must not require editing the dock, menu bar, or window layer — they all iterate the registry.
4. **Content is data, not JSX.** All copy lives in `/content/*.ts`. Components render from that data. Never hard-code bio/notes/project text inside components.
5. **Client components.** Most things need `"use client"`. Keep the root layout/shell as the only place that touches server-side metadata.

## Conventions

- Files: `components/` PascalCase; `lib/` and `content/` camelCase. App bodies live in `components/apps/`.
- Keep the generic `<Window>` chrome (traffic lights, title bar, drag) separate from each app's body. App bodies never render their own window frame.
- Traffic-light buttons and dock items are real `<button>`s with `aria-label`s.
- Gate every animation behind `useReducedMotion()`.
- Prefer small, composable components. Don't let `Desktop.tsx` become a god component.

## Accessibility & responsive (don't skip)

- `< md` screens: focused app renders full-screen, dragging disabled, dock becomes a bottom bar. Detect with a `matchMedia` hook.
- `Esc` closes the focused window. Opening a window moves keyboard focus into it.

## Assets & legal

- Icons in `/public/icons/<appId>.png`, wallpapers in `/public/wallpapers/`.
- **Do not commit Apple's copyrighted wallpapers or icons.** Use your own, generated, or CC0/licensed equivalents.

## Working style

- Build in the phases listed in `PROJECT_BRIEF.md` §10. **Each phase must compile and `npm run dev` cleanly before moving on.**
- After a phase, run `npm run build` and `npx tsc --noEmit` and fix type/lint errors before continuing.
- Small, focused commits with conventional messages (`feat:`, `fix:`, `refactor:`, `chore:`).
- When something in the brief is ambiguous, ask rather than guessing at product/content decisions.

## Commands

- `npm run dev` — local dev
- `npm run build` — production build (must pass before deploy)
- `npx tsc --noEmit` — type check

Claude Code docs, if needed: https://docs.claude.com/en/docs/claude-code/overview
