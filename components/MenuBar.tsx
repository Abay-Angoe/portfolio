"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Clock from "@/components/Clock";
import { Menu, MenuItem, MenuSeparator } from "@/components/menubar/Menu";
import {
  ControlCenter,
  WifiMenu,
  BatteryMenu,
  CalendarMenu,
} from "@/components/menubar/panels";
import { getApp } from "@/lib/apps";
import { useDesktopStore } from "@/lib/store";
import { useUIStore } from "@/lib/uiStore";
import type { WindowState } from "@/lib/types";

/* --------------------------------- glyphs --------------------------------- */

function AppleLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden>
      <path d="M16.4 12.6c0-2 1.6-3 1.7-3-.9-1.4-2.4-1.6-2.9-1.6-1.2-.1-2.4.7-3 .7-.6 0-1.6-.7-2.6-.7-1.3 0-2.6.8-3.3 2-1.4 2.4-.4 6 1 8 .7 1 1.4 2 2.4 2 .9 0 1.3-.6 2.4-.6s1.4.6 2.4.6 1.6-.9 2.3-1.9c.7-1 1-2 1-2s-1.9-.7-1.8-3zM14.6 6.2c.5-.6.8-1.5.7-2.4-.7 0-1.6.5-2.1 1.1-.5.5-.9 1.4-.8 2.3.9.1 1.7-.4 2.2-1z" />
    </svg>
  );
}

function BatteryGlyph({ low }: { low: boolean }) {
  return (
    <svg viewBox="0 0 28 14" className="h-3.5 w-7" aria-hidden>
      <rect x="1" y="2" width="22" height="10" rx="3" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
      <rect x="3" y="4" width="16" height="6" rx="1.5" fill={low ? "#febc2e" : "currentColor"} />
      <rect x="24.5" y="5" width="2" height="4" rx="1" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

function WifiGlyph({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 20 16" className="h-3.5 w-4" aria-hidden opacity={on ? 1 : 0.4}>
      <path d="M10 13.5a1.6 1.6 0 100-3.2 1.6 1.6 0 000 3.2z" fill="currentColor" />
      <path
        d="M4.5 8.2a8 8 0 0111 0M2 5.5a11.5 11.5 0 0116 0M6.8 10.8a4.7 4.7 0 016.4 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {!on && <line x1="3" y1="14" x2="17" y2="2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />}
    </svg>
  );
}

function ControlGlyph() {
  return (
    <svg viewBox="0 0 20 16" className="h-3.5 w-4" aria-hidden>
      <rect x="1" y="2" width="18" height="5" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <rect x="1" y="9" width="18" height="5" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="6" cy="4.5" r="1.6" fill="currentColor" />
      <circle cx="14" cy="11.5" r="1.6" fill="currentColor" />
    </svg>
  );
}

/* ------------------------------- menu model ------------------------------- */

type Entry = "sep" | { label: string; shortcut?: string; disabled?: boolean; onSelect?: () => void };

const trigBase = "h-6 px-2 text-[13px] text-white";

/* --------------------------------- render --------------------------------- */

export default function MenuBar() {
  const reduce = useReducedMotion();
  const openApp = useDesktopStore((s) => s.openApp);
  const hasFocused = useDesktopStore((s) => s.windows.some((w) => !w.isMinimized));
  const appName = useDesktopStore((s) => {
    const visible = s.windows.filter((w) => !w.isMinimized);
    if (visible.length === 0) return "Finder";
    const top = visible.reduce((a, b) => (b.zIndex > a.zIndex ? b : a));
    return getApp(top.appId)?.name ?? "Finder";
  });

  const wifi = useUIStore((s) => s.wifi);
  const lowPower = useUIStore((s) => s.lowPower);
  const anyOpen = useUIStore((s) => s.openMenu !== null);
  const setOpenMenu = useUIStore((s) => s.setOpenMenu);
  const setSpotlight = useUIStore((s) => s.setSpotlight);

  // Run an action against the focused (top-most, non-minimized) window.
  function focusedDo(fn: (id: WindowState["id"]) => void) {
    const s = useDesktopStore.getState();
    const visible = s.windows.filter((w) => !w.isMinimized);
    if (visible.length === 0) return;
    const top = visible.reduce((a, b) => (b.zIndex > a.zIndex ? b : a));
    fn(top.id);
  }
  const closeFocused = () => focusedDo((id) => useDesktopStore.getState().close(id));
  const minFocused = () => focusedDo((id) => useDesktopStore.getState().minimize(id));
  const zoomFocused = () => focusedDo((id) => useDesktopStore.getState().toggleMaximize(id));

  const now = new Date();

  const leftMenus: { id: string; trigger: ReactNode; items: Entry[] }[] = [
    {
      id: "apple",
      trigger: <AppleLogo />,
      items: [
        { label: "About This Mac", onSelect: () => openApp("about") },
        "sep",
        { label: "System Settings…", onSelect: () => openApp("settings") },
        { label: "App Store…" },
        "sep",
        { label: "Force Quit…", shortcut: "⌥⌘⎋", disabled: !hasFocused, onSelect: closeFocused },
        "sep",
        { label: "Sleep" },
        { label: "Restart…" },
        { label: "Shut Down…" },
        "sep",
        { label: "Lock Screen", shortcut: "⌃⌘Q" },
        { label: "Log Out…", shortcut: "⇧⌘Q" },
      ],
    },
    {
      id: "app",
      trigger: <span className="font-semibold">{appName}</span>,
      items: [
        { label: `About ${appName}`, onSelect: () => openApp("about") },
        { label: "Settings…", shortcut: "⌘,", onSelect: () => openApp("settings") },
        "sep",
        { label: `Hide ${appName}`, shortcut: "⌘H", disabled: !hasFocused, onSelect: minFocused },
        { label: "Hide Others", shortcut: "⌥⌘H" },
        "sep",
        { label: `Quit ${appName}`, shortcut: "⌘Q", disabled: !hasFocused, onSelect: closeFocused },
      ],
    },
    {
      id: "file",
      trigger: "File",
      items: [
        { label: "New Window", shortcut: "⌘N", onSelect: () => openApp("about") },
        { label: "New Folder", shortcut: "⇧⌘N" },
        { label: "Open…", shortcut: "⌘O", onSelect: () => openApp("about") },
        "sep",
        { label: "Close Window", shortcut: "⌘W", disabled: !hasFocused, onSelect: closeFocused },
        { label: "Get Info", shortcut: "⌘I", disabled: !hasFocused },
      ],
    },
    {
      id: "edit",
      trigger: "Edit",
      items: [
        { label: "Undo", shortcut: "⌘Z", disabled: true },
        { label: "Redo", shortcut: "⇧⌘Z", disabled: true },
        "sep",
        { label: "Cut", shortcut: "⌘X" },
        { label: "Copy", shortcut: "⌘C" },
        { label: "Paste", shortcut: "⌘V" },
        { label: "Select All", shortcut: "⌘A" },
      ],
    },
    {
      id: "view",
      trigger: "View",
      items: [
        { label: "as Icons", shortcut: "⌘1" },
        { label: "as List", shortcut: "⌘2" },
        { label: "as Columns", shortcut: "⌘3" },
        "sep",
        { label: "Show Path Bar", shortcut: "⌥⌘P" },
        { label: "Show Status Bar", shortcut: "⌘/" },
      ],
    },
    {
      id: "go",
      trigger: "Go",
      items: [
        { label: "Back", shortcut: "⌘[", disabled: true },
        { label: "Forward", shortcut: "⌘]", disabled: true },
        "sep",
        { label: "Recents", onSelect: () => openApp("about") },
        { label: "Documents" },
        { label: "Desktop" },
        { label: "Downloads" },
      ],
    },
    {
      id: "window",
      trigger: "Window",
      items: [
        { label: "Minimize", shortcut: "⌘M", disabled: !hasFocused, onSelect: minFocused },
        { label: "Zoom", disabled: !hasFocused, onSelect: zoomFocused },
        "sep",
        { label: "Bring All to Front" },
      ],
    },
    {
      id: "help",
      trigger: "Help",
      items: [
        { label: "Search" },
        "sep",
        { label: "macOS Help", onSelect: () => openApp("notes") },
      ],
    },
  ];

  function renderItems(items: Entry[]) {
    return items.map((it, i) =>
      it === "sep" ? (
        <MenuSeparator key={i} />
      ) : (
        <MenuItem
          key={i}
          label={it.label}
          shortcut={it.shortcut}
          disabled={it.disabled}
          onSelect={it.onSelect}
        />
      ),
    );
  }

  const [apple, app, ...rest] = leftMenus;

  return (
    <>
      {/* Outside-click / right-click catcher while a menu is open. */}
      {anyOpen && (
        <div
          className="fixed inset-0 z-[8999]"
          aria-hidden
          onClick={() => setOpenMenu(null)}
          onContextMenu={(e) => {
            e.preventDefault();
            setOpenMenu(null);
          }}
        />
      )}

      <motion.header
        initial={reduce ? false : { y: -28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
        className="fixed inset-x-0 top-0 z-[9000] flex h-6 items-center justify-between bg-black/25 px-2 text-[13px] text-white backdrop-blur-md backdrop-saturate-150 select-none"
      >
        <nav className="flex items-center">
          <Menu id={apple.id} trigger={apple.trigger} triggerClassName={trigBase}>
            {renderItems(apple.items)}
          </Menu>
          <Menu id={app.id} trigger={app.trigger} triggerClassName={trigBase}>
            {renderItems(app.items)}
          </Menu>
          <div className="hidden items-center sm:flex">
            {rest.map((m) => (
              <Menu key={m.id} id={m.id} trigger={m.trigger} triggerClassName={trigBase}>
                {renderItems(m.items)}
              </Menu>
            ))}
          </div>
        </nav>

        <div className="flex items-center text-white/90">
          <button
            type="button"
            aria-label="Spotlight Search"
            onClick={() => setSpotlight(true)}
            className="flex h-6 items-center rounded px-1.5 hover:bg-white/15"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current" strokeWidth="2.2" aria-hidden>
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
            </svg>
          </button>
          <Menu id="wifi" align="right" trigger={<WifiGlyph on={wifi} />} triggerClassName="h-6 px-1.5">
            <WifiMenu />
          </Menu>
          <Menu id="battery" align="right" trigger={<BatteryGlyph low={lowPower} />} triggerClassName="h-6 px-1.5">
            <BatteryMenu />
          </Menu>
          <Menu id="control" align="right" trigger={<ControlGlyph />} triggerClassName="h-6 px-1.5" panelClassName="w-auto">
            <ControlCenter />
          </Menu>
          <Menu id="clock" align="right" trigger={<Clock />} triggerClassName="h-6 px-1.5" panelClassName="w-auto">
            <CalendarMenu now={now} />
          </Menu>
        </div>
      </motion.header>
    </>
  );
}
