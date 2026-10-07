import { create } from "zustand";
import { getApp } from "@/lib/apps";
import type { AppId, WindowId, WindowState } from "@/lib/types";

/** Height of the fixed top menu bar (px). Windows never sit above this. */
export const MENU_BAR_H = 24;

/** Height of the mobile bottom dock bar (px). Full-screen windows stop above it. */
export const MOBILE_DOCK_H = 64;

/** Per-open-window cascade offset so stacked windows don't perfectly overlap. */
const CASCADE = 28;

interface DesktopStore {
  windows: WindowState[];
  /** Monotonically increasing focus counter — focus() assigns ++topZ. */
  topZ: number;
  openApp(appId: AppId): void;
  close(id: WindowId): void;
  focus(id: WindowId): void;
  minimize(id: WindowId): void;
  toggleMaximize(id: WindowId): void;
  move(id: WindowId, x: number, y: number): void;
}

function viewport() {
  if (typeof window === "undefined") return { vw: 1280, vh: 800 };
  return { vw: window.innerWidth, vh: window.innerHeight };
}

/** Centered spawn position with a per-window cascade. Size comes from the registry. */
function spawnRect(
  size: { width: number; height: number },
  index: number,
): { x: number; y: number; width: number; height: number } {
  const { vw, vh } = viewport();
  const { width, height } = size;
  const availH = vh - MENU_BAR_H;
  const baseX = Math.max(8, (vw - width) / 2);
  const baseY = Math.max(MENU_BAR_H + 8, MENU_BAR_H + (availH - height) / 2);
  const off = (index % 6) * CASCADE;
  return {
    x: Math.round(baseX + off),
    y: Math.round(baseY + off),
    width,
    height,
  };
}

export const useDesktopStore = create<DesktopStore>((set) => ({
  windows: [],
  topZ: 0,

  // Single-instance in v1: opening an app that's already open just focuses and
  // un-minimizes it. The id/appId split is kept so multi-instance is possible later.
  openApp: (appId) =>
    set((state) => {
      const nextZ = state.topZ + 1;
      const existing = state.windows.find((w) => w.appId === appId);
      if (existing) {
        return {
          topZ: nextZ,
          windows: state.windows.map((w) =>
            w.id === existing.id
              ? { ...w, isMinimized: false, zIndex: nextZ }
              : w,
          ),
        };
      }

      const app = getApp(appId);
      if (!app) return state;

      const rect = spawnRect(app.defaultSize, state.windows.length);
      const win: WindowState = {
        id: appId, // single instance → id == appId for now
        appId,
        title: app.name,
        ...rect,
        zIndex: nextZ,
        isMinimized: false,
        isMaximized: false,
      };
      return { topZ: nextZ, windows: [...state.windows, win] };
    }),

  close: (id) =>
    set((state) => ({ windows: state.windows.filter((w) => w.id !== id) })),

  // Focus is z-index: assign the window the next topZ. Never reorder the array.
  focus: (id) =>
    set((state) => {
      const nextZ = state.topZ + 1;
      return {
        topZ: nextZ,
        windows: state.windows.map((w) =>
          w.id === id ? { ...w, zIndex: nextZ } : w,
        ),
      };
    }),

  minimize: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMinimized: true } : w,
      ),
    })),

  // Maximize fills the desktop area (viewport minus the menu bar) and saves the
  // prior rect to prevRect; restore puts it back.
  toggleMaximize: (id) =>
    set((state) => {
      const { vw, vh } = viewport();
      const nextZ = state.topZ + 1;
      return {
        topZ: nextZ,
        windows: state.windows.map((w) => {
          if (w.id !== id) return w;
          if (w.isMaximized) {
            const r = w.prevRect;
            return {
              ...w,
              isMaximized: false,
              zIndex: nextZ,
              x: r ? r.x : w.x,
              y: r ? r.y : w.y,
              width: r ? r.width : w.width,
              height: r ? r.height : w.height,
              prevRect: undefined,
            };
          }
          return {
            ...w,
            isMaximized: true,
            zIndex: nextZ,
            prevRect: { x: w.x, y: w.y, width: w.width, height: w.height },
            x: 0,
            y: MENU_BAR_H,
            width: vw,
            height: vh - MENU_BAR_H,
          };
        }),
      };
    }),

  // Position-only move; ignored while maximized. Callers clamp to the viewport.
  move: (id, x, y) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id && !w.isMaximized ? { ...w, x, y } : w,
      ),
    })),
}));
