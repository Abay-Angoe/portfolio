import { create } from "zustand";

/** Keys for the fake-but-functional system toggles surfaced in Control Center. */
export type ToggleKey = "wifi" | "bluetooth" | "airdrop" | "dnd" | "lowPower";
export type NumKey = "volume" | "brightness";
export type ThemeMode = "light" | "dark" | "auto";

export const DEFAULT_ACCENT = "#0a84ff";
export const DEFAULT_WALLPAPER = "url('/wallpapers/default.png') center / cover no-repeat";
const STORE_KEY = "portfolio-ui";

interface Persisted {
  theme?: ThemeMode;
  accent?: string;
  wallpaper?: string;
}

function readStored(): Persisted {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || "{}") as Persisted;
  } catch {
    return {};
  }
}

function persist(partial: Persisted) {
  if (typeof window === "undefined") return;
  const cur = readStored();
  localStorage.setItem(STORE_KEY, JSON.stringify({ ...cur, ...partial }));
}

/** Resolve and apply the effective light/dark class to <html>. */
export function applyTheme(mode: ThemeMode) {
  if (typeof document === "undefined") return;
  const dark =
    mode === "dark" ||
    (mode === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
}

interface UIStore {
  /** Id of the currently open menu-bar menu/popover, or null. */
  openMenu: string | null;
  setOpenMenu: (id: string | null) => void;
  toggleMenu: (id: string) => void;

  /** Whether the Spotlight search overlay is open. */
  spotlight: boolean;
  setSpotlight: (open: boolean) => void;
  toggleSpotlight: () => void;

  // System state — not real, but persists across open/close and drives the
  // menu-bar icons (e.g. the Wi-Fi glyph dims when wifi is off).
  wifi: boolean;
  bluetooth: boolean;
  airdrop: boolean;
  dnd: boolean;
  lowPower: boolean;
  volume: number;
  brightness: number;
  wifiNetwork: string;

  toggle: (key: ToggleKey) => void;
  setNum: (key: NumKey, value: number) => void;
  setWifiNetwork: (name: string) => void;

  // Appearance (persisted to localStorage; the no-flash script in layout.tsx
  // applies these before first paint).
  theme: ThemeMode;
  accent: string;
  wallpaper: string;
  setTheme: (mode: ThemeMode) => void;
  setAccent: (hex: string) => void;
  setWallpaper: (css: string) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  openMenu: null,
  setOpenMenu: (id) => set({ openMenu: id }),
  toggleMenu: (id) => set((s) => ({ openMenu: s.openMenu === id ? null : id })),

  spotlight: false,
  setSpotlight: (open) => set({ spotlight: open }),
  toggleSpotlight: () => set((s) => ({ spotlight: !s.spotlight })),

  wifi: true,
  bluetooth: true,
  airdrop: false,
  dnd: false,
  lowPower: false,
  volume: 65,
  brightness: 80,
  wifiNetwork: "Home-5G",

  toggle: (key) => set((s) => ({ [key]: !s[key] }) as Partial<UIStore>),
  setNum: (key, value) => set({ [key]: value } as Partial<UIStore>),
  setWifiNetwork: (name) => set({ wifiNetwork: name }),

  theme: readStored().theme ?? "auto",
  accent: readStored().accent ?? DEFAULT_ACCENT,
  wallpaper: readStored().wallpaper ?? DEFAULT_WALLPAPER,
  setTheme: (mode) => {
    applyTheme(mode);
    persist({ theme: mode });
    set({ theme: mode });
  },
  setAccent: (hex) => {
    document.documentElement.style.setProperty("--accent", hex);
    persist({ accent: hex });
    set({ accent: hex });
  },
  setWallpaper: (css) => {
    document.documentElement.style.setProperty("--wallpaper", css);
    persist({ wallpaper: css });
    set({ wallpaper: css });
  },
}));
