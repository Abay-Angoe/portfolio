"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Track } from "@/content/music";

/* ------------------------------ note → freq ------------------------------- */

const SEMITONE: Record<string, number> = {
  C: 0, "C#": 1, Db: 1, D: 2, "D#": 3, Eb: 3, E: 4, F: 5, "F#": 6,
  Gb: 6, G: 7, "G#": 8, Ab: 8, A: 9, "A#": 10, Bb: 10, B: 11,
};

function noteToFreq(name: string): number {
  const m = name.match(/^([A-G][#b]?)(-?\d)$/);
  if (!m) return 440;
  const midi = (parseInt(m[2], 10) + 1) * 12 + (SEMITONE[m[1]] ?? 0);
  return 440 * Math.pow(2, (midi - 69) / 12);
}

/* ------------------------------- event list ------------------------------- */

interface Voice {
  time: number;
  freq: number;
  dur: number;
  gain: number;
  type: OscillatorType;
}

function buildEvents(track: Track): { list: Voice[]; duration: number } {
  const spb = 60 / track.bpm;
  const list: Voice[] = [];
  const addVoice = (notes: Track["melody"], gain: number, type: OscillatorType) => {
    let t = 0;
    for (const [pitch, beats] of notes) {
      const dur = beats * spb;
      if (pitch) list.push({ time: t, freq: noteToFreq(pitch), dur, gain, type });
      t += dur;
    }
    return t;
  };
  const melLen = addVoice(track.melody, 0.16, track.wave ?? "triangle");
  const bassLen = track.bass ? addVoice(track.bass, 0.15, "sine") : 0;
  list.sort((a, b) => a.time - b.time);
  return { list, duration: Math.max(melLen, bassLen) };
}

/* --------------------------------- hook ----------------------------------- */

export interface MusicPlayer {
  index: number;
  track: Track;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  select: (i: number) => void;
  seek: (fraction: number) => void;
  setVolume: (v: number) => void;
}

export function useMusicPlayer(tracks: Track[]): MusicPlayer {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolumeState] = useState(0.8);

  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const activeRef = useRef<OscillatorNode[]>([]);
  const eventsRef = useRef(buildEvents(tracks[0]));
  const playheadRef = useRef(0);
  const nextIdxRef = useRef(0);
  const lastTsRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const playingRef = useRef(false);
  const indexRef = useRef(0);

  const track = tracks[index];
  const duration = useMemo(() => buildEvents(track).duration, [track]);

  const ensureCtx = useCallback(() => {
    if (!ctxRef.current) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctor();
      const master = ctx.createGain();
      master.gain.value = volume;
      master.connect(ctx.destination);
      ctxRef.current = ctx;
      masterRef.current = master;
    }
    return ctxRef.current;
  }, [volume]);

  const stopActive = useCallback(() => {
    for (const osc of activeRef.current) {
      try {
        osc.stop();
      } catch {
        /* already stopped */
      }
    }
    activeRef.current = [];
  }, []);

  const trigger = useCallback((ev: Voice) => {
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (!ctx || !master) return;
    const t0 = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = ev.type;
    osc.frequency.value = ev.freq;
    const len = ev.dur * 0.92;
    const atk = 0.008;
    const rel = 0.05;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(ev.gain, t0 + atk);
    g.gain.setValueAtTime(ev.gain, t0 + Math.max(atk, len - rel));
    g.gain.linearRampToValueAtTime(0.0001, t0 + len);
    osc.connect(g).connect(master);
    osc.start(t0);
    osc.stop(t0 + len + 0.02);
    activeRef.current.push(osc);
    osc.onended = () => {
      activeRef.current = activeRef.current.filter((o) => o !== osc);
    };
  }, []);

  const loop = useCallback(
    (ts: number) => {
      if (!playingRef.current) return;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;
      playheadRef.current += dt;

      const { list, duration: dur } = eventsRef.current;
      while (nextIdxRef.current < list.length && list[nextIdxRef.current].time <= playheadRef.current) {
        trigger(list[nextIdxRef.current]);
        nextIdxRef.current += 1;
      }
      setCurrentTime(playheadRef.current);

      if (playheadRef.current >= dur) {
        // advance to the next track and keep playing
        const nextI = (indexRef.current + 1) % tracks.length;
        indexRef.current = nextI;
        setIndex(nextI);
        eventsRef.current = buildEvents(tracks[nextI]);
        playheadRef.current = 0;
        nextIdxRef.current = 0;
      }
      rafRef.current = requestAnimationFrame(loop);
    },
    [tracks, trigger],
  );

  const start = useCallback(() => {
    const ctx = ensureCtx();
    void ctx.resume();
    playingRef.current = true;
    setIsPlaying(true);
    lastTsRef.current = performance.now();
    rafRef.current = requestAnimationFrame(loop);
  }, [ensureCtx, loop]);

  const pause = useCallback(() => {
    playingRef.current = false;
    setIsPlaying(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    stopActive();
  }, [stopActive]);

  const select = useCallback(
    (i: number) => {
      stopActive();
      indexRef.current = i;
      setIndex(i);
      eventsRef.current = buildEvents(tracks[i]);
      playheadRef.current = 0;
      nextIdxRef.current = 0;
      setCurrentTime(0);
      start();
    },
    [start, stopActive, tracks],
  );

  const toggle = useCallback(() => {
    if (playingRef.current) pause();
    else start();
  }, [pause, start]);

  const next = useCallback(() => select((indexRef.current + 1) % tracks.length), [select, tracks.length]);
  const prev = useCallback(() => {
    if (playheadRef.current > 3) select(indexRef.current);
    else select((indexRef.current - 1 + tracks.length) % tracks.length);
  }, [select, tracks.length]);

  const seek = useCallback((fraction: number) => {
    const { list, duration: dur } = eventsRef.current;
    const target = Math.max(0, Math.min(1, fraction)) * dur;
    stopActive();
    playheadRef.current = target;
    nextIdxRef.current = list.findIndex((e) => e.time >= target);
    if (nextIdxRef.current < 0) nextIdxRef.current = list.length;
    setCurrentTime(target);
  }, [stopActive]);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    if (masterRef.current) masterRef.current.gain.value = v;
  }, []);

  // Clean up audio when the app unmounts (e.g. window closed).
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      stopActive();
      void ctxRef.current?.close();
    };
  }, [stopActive]);

  return {
    index,
    track,
    isPlaying,
    currentTime,
    duration,
    volume,
    toggle,
    next,
    prev,
    select,
    seek,
    setVolume,
  };
}
