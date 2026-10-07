"use client";

import { useState } from "react";
import { ABOUT, type AboutLocation } from "@/content/about";
import { useDesktopStore } from "@/lib/store";
import type { AppId } from "@/lib/types";

// Finder-style two-pane layout: a sidebar of "locations" on the left and a main
// pane on the right. All copy comes from content/about.ts.
export default function AboutApp() {
  const [view, setView] = useState<"profile" | "contact">("profile");
  const [activeId, setActiveId] = useState("profile");
  const openApp = useDesktopStore((s) => s.openApp);

  function onSelect(loc: AboutLocation) {
    if (loc.target.startsWith("app:")) {
      openApp(loc.target.slice(4) as AppId);
      return;
    }
    setActiveId(loc.id);
    setView(loc.target as "profile" | "contact");
  }

  return (
    <div className="flex h-full w-full text-[13px] text-ink">
      {/* Sidebar */}
      <aside className="w-44 shrink-0 space-y-4 overflow-y-auto border-r border-line bg-panel px-2 py-3">
        {ABOUT.sidebar.map((group) => (
          <div key={group.heading}>
            <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-faint">
              {group.heading}
            </p>
            <ul>
              {group.items.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(item)}
                    aria-current={activeId === item.id ? "true" : undefined}
                    style={activeId === item.id ? { backgroundColor: "var(--accent)" } : undefined}
                    className={`flex w-full items-center gap-2 rounded-md px-2 py-1 text-left transition-colors ${
                      activeId === item.id ? "text-white" : "hover:bg-[var(--hover)]"
                    }`}
                  >
                    <span className="text-[13px] leading-none">{item.glyph}</span>
                    <span className="truncate">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>

      {/* Main pane */}
      <main className="flex-1 overflow-y-auto p-6">
        <header className="flex items-center gap-4">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-xl font-semibold text-white">
            {ABOUT.initials}
          </div>
          <div>
            <h1 className="text-xl font-semibold text-ink">{ABOUT.name}</h1>
            <p className="text-dim">{ABOUT.role}</p>
            <p className="text-[12px] text-faint">{ABOUT.location}</p>
          </div>
        </header>

        {view === "profile" ? (
          <div className="mt-5 space-y-4">
            <p className="text-[14px] font-medium text-ink">{ABOUT.tagline}</p>
            {ABOUT.bio.map((para, i) => (
              <p key={i} className="leading-relaxed text-dim">
                {para}
              </p>
            ))}
            <div className="flex flex-wrap gap-2 pt-1">
              {ABOUT.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-[var(--hover)] px-3 py-1 text-[12px] text-dim"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-5 space-y-2">
            <p className="text-dim">Get in touch:</p>
            <ul className="space-y-2">
              {ABOUT.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    style={{ color: "var(--accent)" }}
                    className="inline-flex items-center gap-2 rounded-lg border border-line px-3 py-2 transition-colors hover:bg-[var(--hover)]"
                  >
                    <span className="w-5 text-center">{link.glyph}</span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
