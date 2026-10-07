"use client";

import { useState } from "react";
import { DEFAULT_WALLPAPER, useUIStore, type ThemeMode } from "@/lib/uiStore";

const ACCENTS: { name: string; hex: string }[] = [
  { name: "Blue", hex: "#0a84ff" },
  { name: "Purple", hex: "#bf5af2" },
  { name: "Pink", hex: "#ff375f" },
  { name: "Red", hex: "#ff453a" },
  { name: "Orange", hex: "#ff9f0a" },
  { name: "Yellow", hex: "#ffd60a" },
  { name: "Green", hex: "#32d74b" },
  { name: "Graphite", hex: "#8e8e93" },
];

const WALLPAPERS: { id: string; name: string; css: string }[] = [
  { id: "aurora", name: "Aurora", css: DEFAULT_WALLPAPER },
  { id: "sunrise", name: "Sunrise", css: "linear-gradient(135deg,#ff9a56,#ff6a88,#b56cff)" },
  { id: "ocean", name: "Ocean", css: "linear-gradient(135deg,#2af598,#009efd)" },
  { id: "grape", name: "Grape", css: "linear-gradient(135deg,#7028e4,#e5b2ca)" },
  { id: "mint", name: "Mint", css: "linear-gradient(160deg,#a8ff78,#78ffd6)" },
  { id: "graphite", name: "Graphite", css: "linear-gradient(135deg,#3a3a3c,#161618)" },
];

const SECTIONS = [
  { id: "appearance", label: "Appearance", glyph: "◐" },
  { id: "wallpaper", label: "Wallpaper", glyph: "🖼" },
  { id: "about", label: "About", glyph: "ⓘ" },
] as const;

type Section = (typeof SECTIONS)[number]["id"];

function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line py-3">
      <span className="text-[13px] text-ink">{title}</span>
      {children}
    </div>
  );
}

export default function SettingsApp() {
  const [section, setSection] = useState<Section>("appearance");
  const { theme, accent, wallpaper, setTheme, setAccent, setWallpaper } = useUIStore();

  return (
    <div className="flex h-full w-full bg-win text-ink">
      {/* Sidebar */}
      <aside className="w-48 shrink-0 space-y-1 border-r border-line bg-panel p-2">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSection(s.id)}
            aria-current={section === s.id ? "true" : undefined}
            className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] transition-colors ${
              section === s.id ? "text-white" : "text-ink hover:bg-[var(--hover)]"
            }`}
            style={section === s.id ? { backgroundColor: accent } : undefined}
          >
            <span className="w-4 text-center">{s.glyph}</span>
            {s.label}
          </button>
        ))}
      </aside>

      {/* Panel */}
      <main className="flex-1 overflow-y-auto p-6">
        {section === "appearance" && (
          <div className="mx-auto max-w-md">
            <h1 className="mb-4 text-lg font-semibold">Appearance</h1>

            <Row title="Theme">
              <div className="flex overflow-hidden rounded-lg border border-line">
                {(["light", "dark", "auto"] as ThemeMode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setTheme(m)}
                    className={`px-3 py-1 text-[12px] capitalize ${
                      theme === m ? "text-white" : "text-dim hover:bg-[var(--hover)]"
                    }`}
                    style={theme === m ? { backgroundColor: accent } : undefined}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </Row>

            <Row title="Accent color">
              <div className="flex flex-wrap justify-end gap-2">
                {ACCENTS.map((a) => (
                  <button
                    key={a.hex}
                    type="button"
                    aria-label={a.name}
                    title={a.name}
                    onClick={() => setAccent(a.hex)}
                    className={`h-6 w-6 rounded-full ring-2 ring-offset-2 ring-offset-[var(--win)] transition ${
                      accent === a.hex ? "ring-[var(--accent)]" : "ring-transparent"
                    }`}
                    style={{ backgroundColor: a.hex }}
                  />
                ))}
              </div>
            </Row>

            <p className="mt-4 text-[12px] text-dim">
              Auto follows your system setting. Your choice is remembered on this
              device.
            </p>
          </div>
        )}

        {section === "wallpaper" && (
          <div>
            <h1 className="mb-4 text-lg font-semibold">Wallpaper</h1>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {WALLPAPERS.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setWallpaper(w.css)}
                  className={`overflow-hidden rounded-xl border-2 transition ${
                    wallpaper === w.css ? "border-[var(--accent)]" : "border-line"
                  }`}
                >
                  <span className="block h-20 w-full bg-cover bg-center" style={{ background: w.css }} />
                  <span className="block bg-panel px-2 py-1 text-[12px] text-ink">{w.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {section === "about" && (
          <div className="mx-auto max-w-md">
            <h1 className="mb-4 text-lg font-semibold">About</h1>
            <Row title="Name">
              <span className="text-[13px] text-dim">Christopher’s Mac</span>
            </Row>
            <Row title="Software">
              <span className="text-[13px] text-dim">portfolioOS 1.0</span>
            </Row>
            <Row title="Made with">
              <span className="text-[13px] text-dim">Next.js · Tailwind · Zustand</span>
            </Row>
          </div>
        )}
      </main>
    </div>
  );
}
