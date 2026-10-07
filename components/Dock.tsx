"use client";

import { useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { APPS } from "@/lib/apps";
import { useDesktopStore } from "@/lib/store";

const DOCK_APPS = APPS.filter((a) => !a.hideFromDock);

const SPRING = { type: "spring" as const, stiffness: 400, damping: 22 };

/** macOS-style magnification: hovered icon largest, neighbors fall off by distance. */
function scaleFor(index: number, hovered: number | null, reduce: boolean) {
  if (reduce || hovered === null) return 1;
  const d = Math.abs(index - hovered);
  if (d === 0) return 1.5;
  if (d === 1) return 1.28;
  if (d === 2) return 1.12;
  return 1;
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 512 512" className="h-full w-full" aria-hidden>
      <rect width="512" height="512" rx="115" fill="#d7dbe3" />
      <g fill="none" stroke="#5b6270" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round">
        <path d="M170 190h172l-14 168a24 24 0 01-24 22H208a24 24 0 01-24-22z" />
        <path d="M150 190h212" />
        <path d="M214 190v-24a20 20 0 0120-20h44a20 20 0 0120 20v24" />
        <path d="M226 232v112M286 232v112" />
      </g>
    </svg>
  );
}

function DockIcon({
  index,
  hovered,
  setHovered,
  reduce,
  label,
  ariaLabel,
  dockAppId,
  onClick,
  showDot,
  children,
}: {
  index: number;
  hovered: number | null;
  setHovered: (i: number | null) => void;
  reduce: boolean;
  /** Visible tooltip/title text (the app name). */
  label: string;
  /** Accessible action label, e.g. "Open Terminal". */
  ariaLabel: string;
  /** Marks this as an app button so focus can return here on window close. */
  dockAppId?: string;
  onClick?: () => void;
  showDot: boolean;
  children: ReactNode;
}) {
  const scale = scaleFor(index, hovered, reduce);
  return (
    <div
      className="relative flex flex-col items-center"
      onMouseEnter={() => setHovered(index)}
    >
      {hovered === index && !reduce && (
        <motion.span
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-none absolute bottom-full mb-9 whitespace-nowrap rounded-md bg-neutral-800/90 px-2 py-1 text-xs text-white shadow-lg"
        >
          {label}
        </motion.span>
      )}
      <motion.button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        title={label}
        data-dock-app={dockAppId}
        animate={{ scale }}
        transition={SPRING}
        style={{ transformOrigin: "bottom" }}
        className="h-14 w-14 rounded-[14px] outline-none focus-visible:ring-2 focus-visible:ring-white/80"
      >
        {children}
      </motion.button>
      <span
        aria-hidden
        className={`mt-1 h-1 w-1 rounded-full transition-colors ${
          showDot ? "bg-white/90" : "bg-transparent"
        }`}
      />
    </div>
  );
}

/**
 * The dock. Reads the set of open apps as a stable string so dragging a window
 * (which mutates positions constantly) doesn't re-render the dock — only opening
 * or closing an app does.
 */
export default function Dock({ mobile = false }: { mobile?: boolean }) {
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState<number | null>(null);
  const openApp = useDesktopStore((s) => s.openApp);
  const openIds = useDesktopStore((s) =>
    Array.from(new Set(s.windows.map((w) => w.appId))).sort().join(","),
  );
  const open = new Set(openIds ? openIds.split(",") : []);

  const trashIndex = DOCK_APPS.length;

  // Mobile: a plain, non-magnifying bottom bar of app icons.
  if (mobile) {
    return (
      <nav
        aria-label="Dock"
        className="fixed inset-x-0 bottom-0 z-[8000] flex h-16 items-center justify-around border-t border-white/15 bg-black/35 px-2 backdrop-blur-2xl backdrop-saturate-150"
      >
        {DOCK_APPS.map((app) => (
          <button
            key={app.id}
            type="button"
            data-dock-app={app.id}
            onClick={() => openApp(app.id)}
            aria-label={`Open ${app.name}`}
            className="relative flex h-12 w-12 flex-col items-center justify-center rounded-[12px] outline-none focus-visible:ring-2 focus-visible:ring-white/80"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={app.icon}
              alt=""
              draggable={false}
              className="h-10 w-10 rounded-[10px] object-contain drop-shadow"
            />
            <span
              aria-hidden
              className={`mt-0.5 h-1 w-1 rounded-full ${
                open.has(app.id) ? "bg-white/90" : "bg-transparent"
              }`}
            />
          </button>
        ))}
      </nav>
    );
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-2 z-[8000] flex justify-center">
      <motion.div
        initial={reduce ? false : { y: 90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...SPRING, delay: 0.15 }}
        onMouseLeave={() => setHovered(null)}
        className="pointer-events-auto flex items-end gap-2 rounded-[22px] border border-white/20 bg-white/15 px-3 py-2 shadow-2xl shadow-black/40 backdrop-blur-2xl backdrop-saturate-150"
      >
        {DOCK_APPS.map((app, i) => (
          <DockIcon
            key={app.id}
            index={i}
            hovered={hovered}
            setHovered={setHovered}
            reduce={reduce ?? false}
            label={app.name}
            ariaLabel={`Open ${app.name}`}
            dockAppId={app.id}
            onClick={() => openApp(app.id)}
            showDot={open.has(app.id)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={app.icon}
              alt=""
              draggable={false}
              className="h-full w-full rounded-[14px] object-contain drop-shadow-md"
            />
          </DockIcon>
        ))}

        <div className="mx-1 h-12 w-px self-center bg-white/25" aria-hidden />

        <DockIcon
          index={trashIndex}
          hovered={hovered}
          setHovered={setHovered}
          reduce={reduce ?? false}
          label="Trash"
          ariaLabel="Trash"
          showDot={false}
        >
          <TrashIcon />
        </DockIcon>
      </motion.div>
    </div>
  );
}
