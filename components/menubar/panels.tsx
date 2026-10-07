"use client";

import { useUIStore, type ToggleKey } from "@/lib/uiStore";
import { MenuItem, MenuSeparator } from "@/components/menubar/Menu";

/* ------------------------------- primitives ------------------------------- */

function Switch({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onClick}
      className={`flex h-[22px] w-[38px] shrink-0 items-center rounded-full p-[2px] transition-colors ${
        on ? "bg-green-500" : "bg-neutral-300 dark:bg-neutral-600"
      }`}
    >
      <span
        className={`h-[18px] w-[18px] rounded-full bg-white shadow transition-transform ${
          on ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function Slider({
  value,
  onChange,
  ariaLabel,
}: {
  value: number;
  onChange: (v: number) => void;
  ariaLabel: string;
}) {
  return (
    <input
      type="range"
      min={0}
      max={100}
      value={value}
      aria-label={ariaLabel}
      onChange={(e) => onChange(Number(e.target.value))}
      className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-neutral-300 dark:bg-neutral-600 accent-white [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow"
    />
  );
}

/* ----------------------------- control center ----------------------------- */

function TileIcon({ name }: { name: ToggleKey }) {
  const cls = "h-4 w-4 fill-none stroke-current";
  if (name === "wifi") {
    return (
      <svg viewBox="0 0 20 16" className={cls} strokeWidth="1.6" strokeLinecap="round">
        <path d="M4.5 8.2a8 8 0 0111 0M2 5.5a11.5 11.5 0 0116 0M6.8 10.8a4.7 4.7 0 016.4 0" />
        <circle cx="10" cy="13.4" r="0.4" className="fill-current" />
      </svg>
    );
  }
  if (name === "bluetooth") {
    return (
      <svg viewBox="0 0 16 20" className={cls} strokeWidth="1.6" strokeLinejoin="round">
        <path d="M4 6l8 8-4 3.5V2.5L12 6l-8 8" />
      </svg>
    );
  }
  // airdrop
  return (
    <svg viewBox="0 0 20 20" className={cls} strokeWidth="1.6">
      <circle cx="10" cy="8" r="6.5" />
      <path d="M6.5 10.5a4.5 4.5 0 017 0M10 20l-3-4h6z" className="fill-current stroke-none" />
    </svg>
  );
}

function ToggleTile({ tkey, title, subtitle }: { tkey: ToggleKey; title: string; subtitle: string }) {
  const on = useUIStore((s) => s[tkey]);
  const toggle = useUIStore((s) => s.toggle);
  return (
    <button
      type="button"
      onClick={() => toggle(tkey)}
      aria-pressed={on}
      className="flex w-full items-center gap-2.5 rounded-xl px-2 py-1.5 text-left transition-colors hover:bg-[var(--hover)]"
    >
      <span
        className={`grid h-8 w-8 place-items-center rounded-full transition-colors ${
          on ? "bg-blue-500 text-white" : "bg-neutral-300 dark:bg-neutral-600 text-dim"
        }`}
      >
        <TileIcon name={tkey} />
      </span>
      <span className="leading-tight">
        <span className="block text-[13px] font-medium text-ink">{title}</span>
        <span className="block text-[11px] text-dim">{subtitle}</span>
      </span>
    </button>
  );
}

export function ControlCenter() {
  const { wifi, dnd, wifiNetwork, volume, brightness, toggle, setNum } = useUIStore();

  return (
    <div className="w-[320px] space-y-3">
      {/* connectivity card */}
      <div className="rounded-2xl bg-black/5 dark:bg-white/10 p-1.5 shadow-inner">
        <ToggleTile tkey="wifi" title="Wi-Fi" subtitle={wifi ? wifiNetwork : "Off"} />
        <ToggleTile tkey="bluetooth" title="Bluetooth" subtitle="On" />
        <ToggleTile tkey="airdrop" title="AirDrop" subtitle="Contacts Only" />
      </div>

      {/* focus / mirroring */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => toggle("dnd")}
          aria-pressed={dnd}
          className="flex flex-col justify-between rounded-2xl bg-black/5 dark:bg-white/10 p-3 text-left shadow-inner transition-colors hover:bg-[var(--hover)]"
        >
          <span className={`text-lg ${dnd ? "text-violet-500" : "text-dim"}`}>☾</span>
          <span className="mt-2 text-[12px] font-medium text-ink">
            Do Not Disturb
          </span>
          <span className="text-[11px] text-dim">{dnd ? "On" : "Off"}</span>
        </button>
        <div className="flex flex-col justify-between rounded-2xl bg-black/5 dark:bg-white/10 p-3 shadow-inner">
          <svg viewBox="0 0 20 20" className="h-5 w-5 fill-none stroke-neutral-500" strokeWidth="1.6" strokeLinejoin="round">
            <rect x="2" y="3" width="16" height="11" rx="1.5" />
            <path d="M7 17h6M10 14v3" strokeLinecap="round" />
          </svg>
          <span className="mt-2 text-[12px] font-medium text-ink">Screen Mirroring</span>
          <span className="text-[11px] text-dim">Off</span>
        </div>
      </div>

      {/* sliders */}
      <div className="space-y-2 rounded-2xl bg-black/5 dark:bg-white/10 p-3 shadow-inner">
        <p className="text-[12px] font-medium text-ink">Display</p>
        <Slider value={brightness} onChange={(v) => setNum("brightness", v)} ariaLabel="Display brightness" />
      </div>
      <div className="space-y-2 rounded-2xl bg-black/5 dark:bg-white/10 p-3 shadow-inner">
        <p className="text-[12px] font-medium text-ink">Sound</p>
        <Slider value={volume} onChange={(v) => setNum("volume", v)} ariaLabel="Sound volume" />
      </div>
    </div>
  );
}

/* --------------------------------- wi-fi ---------------------------------- */

const NETWORKS = ["Home-5G", "Home-2.4G", "CoffeeShop_Guest", "Airport_Free_WiFi", "NETGEAR-A7"];

export function WifiMenu() {
  const wifi = useUIStore((s) => s.wifi);
  const toggle = useUIStore((s) => s.toggle);
  const current = useUIStore((s) => s.wifiNetwork);
  const setNetwork = useUIStore((s) => s.setWifiNetwork);

  return (
    <div className="w-[260px]">
      <div className="flex items-center justify-between px-2 py-1">
        <span className="text-[13px] font-semibold text-ink">Wi-Fi</span>
        <Switch on={wifi} onClick={() => toggle("wifi")} label="Wi-Fi" />
      </div>
      <MenuSeparator />
      {wifi ? (
        <>
          <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-faint">
            Networks
          </p>
          {NETWORKS.map((name) => (
            <MenuItem
              key={name}
              label={`${name === current ? "✓  " : "     "}${name}`}
              onSelect={() => setNetwork(name)}
            />
          ))}
          <MenuSeparator />
          <MenuItem label="Other Networks…" />
          <MenuItem label="Wi-Fi Settings…" />
        </>
      ) : (
        <p className="px-2 py-2 text-[12px] text-dim">Wi-Fi is off.</p>
      )}
    </div>
  );
}

/* -------------------------------- battery --------------------------------- */

export function BatteryMenu() {
  const lowPower = useUIStore((s) => s.lowPower);
  const toggle = useUIStore((s) => s.toggle);
  const pct = 87; // fake, static

  return (
    <div className="w-[240px]">
      <div className="px-2 py-1">
        <p className="text-[13px] font-semibold text-ink">Battery</p>
        <p className="text-[12px] text-dim">{pct}% · Power Source: Battery</p>
      </div>
      <MenuSeparator />
      <div className="flex items-center justify-between px-2 py-1">
        <span className="text-[13px] text-ink">Low Power Mode</span>
        <Switch on={lowPower} onClick={() => toggle("lowPower")} label="Low Power Mode" />
      </div>
      <MenuSeparator />
      <MenuItem label="Battery Settings…" />
    </div>
  );
}

/* ------------------------------- calendar --------------------------------- */

export function CalendarMenu({ now }: { now: Date }) {
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();
  const first = new Date(year, month, 1).getDay(); // 0 = Sun
  const days = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: first }, () => null),
    ...Array.from({ length: days }, (_, i) => i + 1),
  ];
  const monthName = now.toLocaleDateString("en-GB", { month: "long", year: "numeric" });

  return (
    <div className="w-[260px]">
      <p className="px-1 text-[15px] font-semibold text-ink">
        {now.toLocaleDateString("en-GB", { weekday: "long" })}
      </p>
      <p className="mb-2 px-1 text-[13px] text-dim">{monthName}</p>
      <div className="grid grid-cols-7 gap-y-1 text-center text-[11px] text-faint">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-y-1 text-center text-[12px]">
        {cells.map((d, i) => (
          <span key={i} className="flex justify-center">
            {d === null ? (
              ""
            ) : (
              <span
                className={`grid h-6 w-6 place-items-center rounded-full ${
                  d === today ? "bg-red-500 font-semibold text-white" : "text-ink"
                }`}
              >
                {d}
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
