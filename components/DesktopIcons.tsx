"use client";

import { useState } from "react";
import { useDesktopStore } from "@/lib/store";
import type { AppId } from "@/lib/types";

interface DeskFile {
  id: string;
  label: string;
  ext: string;
  color: string;
  open: AppId;
}

const FILES: DeskFile[] = [
  { id: "resume", label: "resume.pdf", ext: "PDF", color: "#ff5f57", open: "preview" },
  { id: "readme", label: "README.txt", ext: "TXT", color: "#8e8e93", open: "notes" },
];

function FileIcon({ color, ext }: { color: string; ext: string }) {
  return (
    <svg viewBox="0 0 48 56" className="h-12 w-12 drop-shadow-md" aria-hidden>
      <path d="M6 2h26l10 10v42a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" fill="#fff" />
      <path d="M32 2l10 10H34a2 2 0 0 1-2-2V2z" fill="#dfe3ea" />
      <rect x="4" y="37" width="40" height="14" rx="2" fill={color} />
      <text x="24" y="47.5" textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff">
        {ext}
      </text>
    </svg>
  );
}

/** A couple of files on the desktop (top-right), macOS-style. Double-click or
    Enter opens the associated app. Hidden on mobile. */
export default function DesktopIcons() {
  const openApp = useDesktopStore((s) => s.openApp);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="pointer-events-none absolute right-3 top-8 z-0 flex flex-col items-center gap-4">
      {FILES.map((f) => (
        <button
          key={f.id}
          type="button"
          onClick={() => setSelected(f.id)}
          onDoubleClick={() => openApp(f.open)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openApp(f.open);
            }
          }}
          aria-label={`${f.label} — open`}
          className={`pointer-events-auto flex w-20 flex-col items-center gap-1 rounded-lg p-1.5 outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${
            selected === f.id ? "bg-white/20" : "hover:bg-white/10"
          }`}
        >
          <FileIcon color={f.color} ext={f.ext} />
          <span className="rounded px-1 text-[12px] text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.6)]">
            {f.label}
          </span>
        </button>
      ))}
    </div>
  );
}
