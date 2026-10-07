import type { ComponentType } from "react";

/** Unique id per open window instance. */
export type WindowId = string;

/** The set of apps that exist in v1. */
export type AppId =
  | "about"
  | "notes"
  | "terminal"
  | "projects"
  | "music"
  | "mail"
  | "settings"
  | "preview";

/**
 * Per-window state owned by the Zustand store (see lib/store.ts, Phase 2).
 * Windows are fixed-size in v1: geometry only changes via drag (x/y) and
 * maximize/restore. There is no resize action.
 */
export interface WindowState {
  id: WindowId;
  appId: AppId;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  /** Saved rect so maximize can be restored. */
  prevRect?: { x: number; y: number; width: number; height: number };
}

/**
 * One entry per app. The dock, menu bar, window layer, and Finder sidebar all
 * iterate this registry — adding an app means adding an entry here and nothing
 * else. Defined in lib/apps.ts.
 */
export interface AppDef {
  id: AppId;
  /** Menu-bar + dock label. */
  name: string;
  /** Path under /public/icons/<id>.png. */
  icon: string;
  /** The window body component (chrome is provided by <Window>). */
  component: ComponentType;
  defaultSize: { width: number; height: number };
  /** About opens on boot. */
  openOnBoot?: boolean;
  /** Openable (Spotlight, desktop icons, menus) but not shown in the dock. */
  hideFromDock?: boolean;
}
