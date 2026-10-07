"use client";

import { useEffect, useRef, useState } from "react";
import type { PlayerLike, UITrack } from "@/lib/musicTypes";

/**
 * Plays a list of tracks that have real audio URLs (`src`) via a single
 * HTMLAudioElement. Conforms to PlayerLike so it drives the same PlayerView as
 * the synth engine.
 */
export function useAudioPlayer(tracks: UITrack[]): PlayerLike {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(tracks[0]?.duration ?? 0);
  const [volume, setVol] = useState(0.8);
  const [loading, setLoading] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const indexRef = useRef(0);

  useEffect(() => {
    const a = new Audio();
    a.preload = "metadata";
    a.volume = 0.8;
    audioRef.current = a;

    const onTime = () => setCurrentTime(a.currentTime);
    const onMeta = () => setDuration(a.duration || 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onWaiting = () => setLoading(true);
    const onPlaying = () => setLoading(false);
    const onEnded = () => {
      // advance and keep playing
      const ni = (indexRef.current + 1) % tracks.length;
      indexRef.current = ni;
      setIndex(ni);
      setCurrentTime(0);
      a.src = tracks[ni].src ?? "";
      void a.play().catch(() => {});
    };

    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("durationchange", onMeta);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("waiting", onWaiting);
    a.addEventListener("playing", onPlaying);
    a.addEventListener("ended", onEnded);

    a.src = tracks[0]?.src ?? "";

    return () => {
      a.pause();
      a.removeAttribute("src");
      a.load();
      audioRef.current = null;
    };
    // tracks is fixed for the lifetime of this component instance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAndPlay = (i: number) => {
    const a = audioRef.current;
    if (!a) return;
    indexRef.current = i;
    setIndex(i);
    setCurrentTime(0);
    a.src = tracks[i].src ?? "";
    void a.play().catch(() => {});
  };

  return {
    index,
    isPlaying,
    currentTime,
    duration,
    volume,
    loading,
    toggle: () => {
      const a = audioRef.current;
      if (!a) return;
      if (a.paused) void a.play().catch(() => {});
      else a.pause();
    },
    next: () => loadAndPlay((indexRef.current + 1) % tracks.length),
    prev: () => {
      const a = audioRef.current;
      if (a && a.currentTime > 3) a.currentTime = 0;
      else loadAndPlay((indexRef.current - 1 + tracks.length) % tracks.length);
    },
    select: (i) => loadAndPlay(i),
    seek: (fraction) => {
      const a = audioRef.current;
      if (a && a.duration) a.currentTime = Math.max(0, Math.min(1, fraction)) * a.duration;
    },
    setVolume: (v) => {
      setVol(v);
      if (audioRef.current) audioRef.current.volume = v;
    },
  };
}
