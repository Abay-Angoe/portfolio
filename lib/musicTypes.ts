/** A track as the Music UI needs it — art is either a remote image or a gradient. */
export interface UITrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  /** Remote album-art URL (Jamendo). */
  image?: string;
  /** Gradient [from, to] used when there is no image (synth tracks). */
  accent?: [string, string];
  /** Streamable audio URL (Jamendo); absent for synth tracks. */
  src?: string;
  /** Duration in seconds, if known up front. */
  duration?: number;
}

/**
 * The control surface the shared PlayerView drives. Both the synth engine
 * (useMusicPlayer) and the audio-file engine (useAudioPlayer) implement it.
 */
export interface PlayerLike {
  index: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  /** True while a network track is buffering. */
  loading?: boolean;
  toggle(): void;
  next(): void;
  prev(): void;
  select(i: number): void;
  seek(fraction: number): void;
  setVolume(v: number): void;
}
