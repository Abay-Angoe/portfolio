"use client";

import { useEffect } from "react";
import DesktopIcons from "@/components/DesktopIcons";
import Dock from "@/components/Dock";
import MenuBar from "@/components/MenuBar";
import Spotlight from "@/components/Spotlight";
import WindowLayer from "@/components/WindowLayer";
import { APPS } from "@/lib/apps";
import { focusDockItem } from "@/lib/dom";
import { useDesktopStore } from "@/lib/store";
import { applyTheme, useUIStore } from "@/lib/uiStore";
import { useIsMobile } from "@/lib/useIsMobile";

/**
 * The desktop shell: full-viewport wallpaper, top menu bar, the window layer,
 * and the dock. On mobile the window layer goes full-screen and the dock
 * becomes a bottom bar. Boot apps (About) open once on mount.
 */
export default function Desktop() {
  const openApp = useDesktopStore((s) => s.openApp);
  const isMobile = useIsMobile();

  useEffect(() => {
    APPS.filter((a) => a.openOnBoot).forEach((a) => openApp(a.id));
  }, [openApp]);

  // When appearance is set to Auto, follow the OS light/dark preference live.
  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (useUIStore.getState().theme === "auto") applyTheme("auto");
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Global shortcuts: ⌘K / ⌘Space toggles Spotlight; Esc closes the top-most
  // transient thing (Spotlight → menu → focused window).
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && (e.key.toLowerCase() === "k" || e.code === "Space")) {
        e.preventDefault();
        useUIStore.getState().toggleSpotlight();
        return;
      }
      if (e.key !== "Escape") return;

      const ui = useUIStore.getState();
      if (ui.spotlight) {
        ui.setSpotlight(false);
        return;
      }
      if (ui.openMenu !== null) {
        ui.setOpenMenu(null);
        return;
      }
      const { windows, close } = useDesktopStore.getState();
      const visible = windows.filter((w) => !w.isMinimized);
      if (visible.length === 0) return;
      const top = visible.reduce((a, b) => (b.zIndex > a.zIndex ? b : a));
      close(top.id);
      requestAnimationFrame(() => focusDockItem(top.appId));
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="relative h-[100dvh] w-screen overflow-hidden">
      {/* Wallpaper — driven by the --wallpaper CSS var so Settings can swap it
          (image or gradient) with a crossfade. */}
      <div
        className="absolute inset-0 transition-[background] duration-500"
        style={{ background: "var(--wallpaper)" }}
      />

      <MenuBar />

      {!isMobile && <DesktopIcons />}

      <WindowLayer mobile={isMobile} />

      <Spotlight />

      <Dock mobile={isMobile} />
    </div>
  );
}
