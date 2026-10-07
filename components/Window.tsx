"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { getApp } from "@/lib/apps";
import { MENU_BAR_H, MOBILE_DOCK_H, useDesktopStore } from "@/lib/store";
import { focusDockItem } from "@/lib/dom";
import type { WindowState } from "@/lib/types";

const TITLE_H = 36;
/** Minimum px of a window kept on-screen so the title bar can't be lost. */
const KEEP = 64;

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}

function TrafficLight({
  color,
  label,
  glyph,
  onClick,
}: {
  color: string;
  label: string;
  glyph: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid h-3.5 w-3.5 place-items-center rounded-full text-[9px] font-bold leading-none text-black/60 outline-none focus-visible:ring-2 focus-visible:ring-white/80"
      style={{ backgroundColor: color }}
    >
      <span className="opacity-0 transition-opacity group-hover/lights:opacity-100">
        {glyph}
      </span>
    </button>
  );
}

export default function Window({
  win,
  mobile = false,
}: {
  win: WindowState;
  mobile?: boolean;
}) {
  const reduce = useReducedMotion();
  const focus = useDesktopStore((s) => s.focus);
  const close = useDesktopStore((s) => s.close);
  const minimize = useDesktopStore((s) => s.minimize);
  const toggleMaximize = useDesktopStore((s) => s.toggleMaximize);
  const move = useDesktopStore((s) => s.move);

  const ref = useRef<HTMLElement>(null);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  // Opening a window moves keyboard focus into it (a11y brief §7).
  useEffect(() => {
    ref.current?.focus();
  }, []);

  const app = getApp(win.appId);
  if (!app) return null;
  const Body = app.component;

  function handleClose() {
    const appId = win.appId;
    close(win.id);
    // After the window unmounts, return focus to its dock item.
    requestAnimationFrame(() => focusDockItem(appId));
  }

  // Dragging is disabled on mobile (windows are full-screen) and while maximized.
  const draggable = !mobile && !win.isMaximized;

  function onTitlePointerDown(e: React.PointerEvent) {
    if (!draggable) return;
    if ((e.target as HTMLElement).closest("button")) return;
    offset.current = { x: e.clientX - win.x, y: e.clientY - win.y };
    dragging.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onTitlePointerMove(e: React.PointerEvent) {
    if (!dragging.current) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const nx = clamp(e.clientX - offset.current.x, KEEP - win.width, vw - KEEP);
    const ny = clamp(e.clientY - offset.current.y, MENU_BAR_H, vh - TITLE_H);
    move(win.id, nx, ny);
  }

  function onTitlePointerUp(e: React.PointerEvent) {
    dragging.current = false;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  }

  // Mobile: full-screen sheet between the menu bar and the bottom dock bar.
  const style = mobile
    ? {
        left: 0,
        right: 0,
        top: MENU_BAR_H,
        bottom: MOBILE_DOCK_H,
        zIndex: win.zIndex,
      }
    : {
        left: win.x,
        top: win.y,
        width: win.width,
        height: win.height,
        zIndex: win.zIndex,
      };

  return (
    <motion.section
      ref={ref}
      role="dialog"
      aria-label={win.title}
      tabIndex={-1}
      onPointerDown={() => focus(win.id)}
      initial={reduce ? false : { opacity: 0, scale: mobile ? 1 : 0.94, y: mobile ? 24 : 0 }}
      animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, scale: mobile ? 1 : 0.94, y: mobile ? 24 : 0 }}
      transition={{ type: "spring", stiffness: 420, damping: 32 }}
      style={style}
      className={`pointer-events-auto absolute flex flex-col overflow-hidden border border-line bg-win shadow-2xl shadow-black/40 outline-none ${
        mobile ? "rounded-none" : "rounded-[12px]"
      }`}
    >
      {/* Title bar (drag handle on desktop) */}
      <div
        onPointerDown={onTitlePointerDown}
        onPointerMove={onTitlePointerMove}
        onPointerUp={onTitlePointerUp}
        onDoubleClick={draggable ? () => toggleMaximize(win.id) : undefined}
        style={{ height: TITLE_H, cursor: draggable ? "grab" : "default" }}
        className="relative flex flex-shrink-0 items-center border-b border-line bg-panel px-3 select-none"
      >
        <div className="group/lights flex items-center gap-2">
          <TrafficLight
            color="#ff5f57"
            label={`Close ${win.title}`}
            glyph="✕"
            onClick={handleClose}
          />
          <TrafficLight
            color="#febc2e"
            label={`Minimize ${win.title}`}
            glyph="–"
            onClick={() => minimize(win.id)}
          />
          {!mobile && (
            <TrafficLight
              color="#28c840"
              label={win.isMaximized ? `Restore ${win.title}` : `Maximize ${win.title}`}
              glyph={win.isMaximized ? "❐" : "+"}
              onClick={() => toggleMaximize(win.id)}
            />
          )}
        </div>
        <span className="pointer-events-none absolute inset-x-0 text-center text-[13px] font-medium text-dim">
          {win.title}
        </span>
      </div>

      {/* Body — scrolls internally if content overflows. */}
      <div className="min-h-0 flex-1 overflow-auto bg-win text-ink">
        <Body />
      </div>
    </motion.section>
  );
}
