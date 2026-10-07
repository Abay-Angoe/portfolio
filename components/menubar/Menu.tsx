"use client";

import type { ReactNode } from "react";
import { useUIStore } from "@/lib/uiStore";

/**
 * A single menu-bar menu: a trigger in the bar and a dropdown panel. Behaves
 * like macOS menu tracking — once any menu is open, hovering a sibling trigger
 * switches to it. Outside-click / Esc closing is handled by MenuBar.
 */
export function Menu({
  id,
  trigger,
  align = "left",
  triggerClassName,
  panelClassName,
  children,
}: {
  id: string;
  trigger: ReactNode;
  align?: "left" | "right";
  triggerClassName?: string;
  panelClassName?: string;
  children: ReactNode;
}) {
  const open = useUIStore((s) => s.openMenu === id);
  const anyOpen = useUIStore((s) => s.openMenu !== null);
  const toggleMenu = useUIStore((s) => s.toggleMenu);
  const setOpenMenu = useUIStore((s) => s.setOpenMenu);

  return (
    <div className="relative flex">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => toggleMenu(id)}
        onMouseEnter={() => {
          if (anyOpen && !open) setOpenMenu(id);
        }}
        className={`flex items-center rounded transition-colors ${
          open ? "bg-white/25" : "hover:bg-white/15"
        } ${triggerClassName ?? ""}`}
      >
        {trigger}
      </button>

      {open && (
        <div
          role="menu"
          className={`absolute top-full z-[9001] mt-1.5 rounded-[8px] border border-line bg-win p-1 text-ink shadow-2xl shadow-black/30 backdrop-blur-2xl backdrop-saturate-150 ${
            align === "right" ? "right-0" : "left-0"
          } ${panelClassName ?? "min-w-[220px]"}`}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function MenuItem({
  label,
  shortcut,
  disabled,
  onSelect,
}: {
  label: string;
  shortcut?: string;
  disabled?: boolean;
  onSelect?: () => void;
}) {
  const setOpenMenu = useUIStore((s) => s.setOpenMenu);
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={() => {
        onSelect?.();
        setOpenMenu(null);
      }}
      className="flex w-full items-center justify-between gap-10 rounded-[5px] px-2 py-[3px] text-left text-[13px] text-ink disabled:opacity-40 enabled:hover:bg-[var(--accent)] enabled:hover:text-white"
    >
      <span>{label}</span>
      {shortcut && <span className="text-[12px] opacity-60">{shortcut}</span>}
    </button>
  );
}

export function MenuSeparator() {
  return <div className="my-1 h-px bg-black/10" role="separator" />;
}
