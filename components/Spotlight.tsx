"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { APPS } from "@/lib/apps";
import { NOTES } from "@/content/notes";
import { PROJECTS } from "@/content/projects";
import { useDesktopStore } from "@/lib/store";
import { useUIStore } from "@/lib/uiStore";

interface Item {
  key: string;
  title: string;
  subtitle: string;
  iconUrl?: string;
  glyph?: string;
  run: () => void;
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 fill-none stroke-dim" strokeWidth="2" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}

export default function Spotlight() {
  const reduce = useReducedMotion();
  const open = useUIStore((s) => s.spotlight);
  const setSpotlight = useUIStore((s) => s.setSpotlight);
  const setTheme = useUIStore((s) => s.setTheme);
  const openApp = useDesktopStore((s) => s.openApp);

  const [query, setQuery] = useState("");
  const [sel, setSel] = useState(0);

  const items = useMemo<Item[]>(() => {
    const list: Item[] = [];
    APPS.forEach((a) =>
      list.push({ key: `app:${a.id}`, title: a.name, subtitle: "Application", iconUrl: a.icon, run: () => openApp(a.id) }),
    );
    NOTES.forEach((n) =>
      list.push({ key: `note:${n.id}`, title: n.title, subtitle: "Note", glyph: "📝", run: () => openApp("notes") }),
    );
    PROJECTS.forEach((p) =>
      list.push({ key: `proj:${p.id}`, title: p.title, subtitle: "Project", glyph: "🗂", run: () => openApp("projects") }),
    );
    list.push({
      key: "cmd:theme",
      title: "Toggle Dark Mode",
      subtitle: "Command",
      glyph: "◐",
      run: () => setTheme(document.documentElement.classList.contains("dark") ? "light" : "dark"),
    });
    return list;
  }, [openApp, setTheme]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items.filter((i) => i.subtitle === "Application");
    return items
      .filter((i) => i.title.toLowerCase().includes(q) || i.subtitle.toLowerCase().includes(q))
      .slice(0, 8);
  }, [items, query]);

  // Reset the highlighted row whenever the query changes.
  useEffect(() => setSel(0), [query]);
  // Clear the query each time the overlay opens.
  useEffect(() => {
    if (open) setQuery("");
  }, [open]);

  function activate(i: number) {
    const item = results[i];
    if (!item) return;
    setSpotlight(false);
    item.run();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSel((s) => Math.min(s + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSel((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      activate(sel);
    } else if (e.key === "Escape") {
      setSpotlight(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-start justify-center bg-black/30 pt-[14vh] backdrop-blur-sm"
          initial={reduce ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSpotlight(false)}
        >
          <motion.div
            role="dialog"
            aria-label="Spotlight Search"
            onClick={(e) => e.stopPropagation()}
            initial={reduce ? false : { scale: 0.98, y: -8 }}
            animate={{ scale: 1, y: 0 }}
            exit={reduce ? undefined : { scale: 0.98, y: -8 }}
            transition={{ type: "spring", stiffness: 500, damping: 34 }}
            className="w-[560px] max-w-[90vw] overflow-hidden rounded-2xl border border-line bg-win shadow-2xl shadow-black/40"
          >
            <div className="flex items-center gap-3 border-b border-line px-4 py-3">
              <SearchIcon />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Spotlight Search"
                aria-label="Spotlight Search"
                className="flex-1 bg-transparent text-[18px] text-ink outline-none placeholder:text-faint"
              />
            </div>
            <ul className="max-h-[50vh] overflow-y-auto py-1">
              {results.map((item, i) => (
                <li key={item.key}>
                  <button
                    type="button"
                    onMouseEnter={() => setSel(i)}
                    onClick={() => activate(i)}
                    style={i === sel ? { backgroundColor: "var(--accent)" } : undefined}
                    className={`flex w-full items-center gap-3 px-4 py-2 text-left ${
                      i === sel ? "text-white" : "text-ink"
                    }`}
                  >
                    {item.iconUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.iconUrl} alt="" className="h-7 w-7 shrink-0 rounded-md object-contain" />
                    ) : (
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-[var(--hover)] text-[14px]">
                        {item.glyph}
                      </span>
                    )}
                    <span className="flex-1 truncate text-[14px]">{item.title}</span>
                    <span className={`text-[12px] ${i === sel ? "text-white/70" : "text-faint"}`}>
                      {item.subtitle}
                    </span>
                  </button>
                </li>
              ))}
              {results.length === 0 && (
                <li className="px-4 py-8 text-center text-[13px] text-dim">No results</li>
              )}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
