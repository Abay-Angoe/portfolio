"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { TRACKS } from "@/content/music";
import { fetchJamendoTracks } from "@/lib/jamendo";
import type { PlayerLike, UITrack } from "@/lib/musicTypes";
import { useAudioPlayer } from "@/lib/useAudioPlayer";
import { useMusicPlayer } from "@/lib/useMusicPlayer";

const ACCENT = "#fa233b"; // Apple Music red

const SYNTH_TRACKS: UITrack[] = TRACKS.map((t) => ({
  id: t.id,
  title: t.title,
  artist: t.artist,
  album: t.album,
  accent: t.accent,
}));

function fmt(sec: number): string {
  if (!isFinite(sec) || sec <= 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function Artwork({ track, className }: { track: UITrack; className?: string }) {
  if (track.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={track.image}
        alt={`${track.album} cover`}
        loading="lazy"
        referrerPolicy="no-referrer"
        className={`object-cover ${className ?? ""}`}
      />
    );
  }
  const [from, to] = track.accent ?? ["#c7c7cc", "#8e8e93"];
  return (
    <div
      className={`grid place-items-center overflow-hidden ${className ?? ""}`}
      style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      <svg viewBox="0 0 24 24" className="h-1/3 w-1/3 fill-white/90" aria-hidden>
        <path d="M9 17.5a2.5 2.5 0 11-1-2V6l9-2v8.5a2.5 2.5 0 11-1-2V5.2L9 6.8z" />
      </svg>
    </div>
  );
}

function EqBars({ animate }: { animate: boolean }) {
  const reduce = useReducedMotion();
  return (
    <div className="flex h-3.5 items-end gap-[2px]" aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-sm"
          style={{ backgroundColor: ACCENT }}
          animate={animate && !reduce ? { height: [4, 14, 6, 12, 5] } : { height: 6 }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

const PrevIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
    <path d="M7 6v12H5V6h2zm12 0v12l-8-6 8-6z" />
  </svg>
);
const NextIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
    <path d="M17 6v12h2V6h-2zM5 6v12l8-6-8-6z" />
  </svg>
);
const PlayIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden>
    <path d="M8 5v14l11-7L8 5z" />
  </svg>
);
const PauseIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden>
    <path d="M7 5h4v14H7V5zm6 0h4v14h-4V5z" />
  </svg>
);
const Spinner = () => (
  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
);

/* ------------------------------ shared view ------------------------------- */

function PlayerView({
  player,
  tracks,
  source,
}: {
  player: PlayerLike;
  tracks: UITrack[];
  source: string;
}) {
  const current = tracks[player.index];
  const { isPlaying, currentTime, duration } = player;
  const pct = duration ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <div className="flex h-full w-full bg-sunken text-ink">
      {/* Now playing / controls */}
      <div className="flex w-[280px] shrink-0 flex-col items-center border-r border-line bg-win p-6">
        <Artwork track={current} className="aspect-square w-full rounded-2xl shadow-lg" />
        <h2 className="mt-4 line-clamp-1 text-center text-lg font-semibold">{current.title}</h2>
        <p className="line-clamp-1 text-[13px] text-dim">{current.artist}</p>
        <p className="line-clamp-1 text-[12px] text-faint">{current.album}</p>

        <div className="mt-5 w-full">
          <button
            type="button"
            aria-label="Seek"
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              player.seek((e.clientX - r.left) / r.width);
            }}
            className="relative block h-1.5 w-full rounded-full bg-black/10 dark:bg-white/15"
          >
            <span
              className="absolute inset-y-0 left-0 rounded-full"
              style={{ width: `${pct}%`, backgroundColor: ACCENT }}
            />
          </button>
          <div className="mt-1 flex justify-between text-[11px] tabular-nums text-faint">
            <span>{fmt(currentTime)}</span>
            <span>{fmt(duration)}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-6 text-ink">
          <button type="button" aria-label="Previous track" onClick={player.prev} className="opacity-80 hover:opacity-100">
            <PrevIcon />
          </button>
          <button
            type="button"
            aria-label={isPlaying ? "Pause" : "Play"}
            onClick={player.toggle}
            className="grid h-12 w-12 place-items-center rounded-full text-white shadow-md transition-transform active:scale-95"
            style={{ backgroundColor: ACCENT }}
          >
            {player.loading ? <Spinner /> : isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button type="button" aria-label="Next track" onClick={player.next} className="opacity-80 hover:opacity-100">
            <NextIcon />
          </button>
        </div>

        <div className="mt-5 flex w-full items-center gap-2 text-faint">
          <span className="text-[11px]">Vol</span>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(player.volume * 100)}
            aria-label="Volume"
            onChange={(e) => player.setVolume(Number(e.target.value) / 100)}
            className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-black/10 dark:bg-white/15 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-neutral-500"
          />
        </div>
      </div>

      {/* Queue */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <h1 className="px-5 pb-2 pt-5 text-xl font-bold">Listen Now</h1>
        <ul className="flex-1 overflow-y-auto px-2 pb-2">
          {tracks.map((t, i) => {
            const active = i === player.index;
            return (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => player.select(i)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                    active ? "bg-[var(--hover)]" : "hover:bg-[var(--hover)]"
                  }`}
                >
                  <span className="grid w-5 shrink-0 place-items-center text-[13px] text-faint">
                    {active ? <EqBars animate={isPlaying} /> : i + 1}
                  </span>
                  <Artwork track={t} className="h-10 w-10 shrink-0 rounded-md" />
                  <span className="min-w-0 flex-1">
                    <span
                      className="block truncate text-[14px] font-medium"
                      style={active ? { color: ACCENT } : undefined}
                    >
                      {t.title}
                    </span>
                    <span className="block truncate text-[12px] text-dim">
                      {t.artist} — {t.album}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="border-t border-line px-5 py-2 text-[11px] text-faint">{source}</p>
      </div>
    </div>
  );
}

/* --------------------------- engine wrappers ------------------------------ */

function SynthMusic() {
  const player = useMusicPlayer(TRACKS);
  return <PlayerView player={player} tracks={SYNTH_TRACKS} source="Original browser-synthesized tunes" />;
}

function StreamMusic({ tracks }: { tracks: UITrack[] }) {
  const player = useAudioPlayer(tracks);
  return <PlayerView player={player} tracks={tracks} source="Music via Jamendo — Creative Commons" />;
}

/* ------------------------------ orchestrator ------------------------------ */

export default function MusicApp() {
  const [state, setState] = useState<{ status: "loading" | "stream" | "synth"; tracks?: UITrack[] }>({
    status: "loading",
  });

  useEffect(() => {
    let cancelled = false;
    fetchJamendoTracks()
      .then((tracks) => {
        if (cancelled) return;
        setState(tracks.length ? { status: "stream", tracks } : { status: "synth" });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "synth" });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (state.status === "loading") {
    return (
      <div className="flex h-full w-full items-center justify-center bg-sunken">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-line border-t-dim" />
      </div>
    );
  }
  if (state.status === "stream" && state.tracks) {
    return <StreamMusic tracks={state.tracks} />;
  }
  return <SynthMusic />;
}
