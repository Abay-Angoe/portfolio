// Original chiptune-style tracks, composed as note data and synthesized live in
// the browser (see lib/useMusicPlayer.ts). No copyrighted audio ships with the
// site. Each note is [pitch, beats]; pitch null = rest. Tempo is in BPM.
//
// To use real audio files instead, add `src: "/audio/foo.mp3"` to a track and
// extend the player to prefer an <audio> element when src is present.

export type Note = [string | null, number];

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  bpm: number;
  /** Melody timbre. */
  wave?: OscillatorType;
  /** Album-art gradient [from, to]. */
  accent: [string, string];
  melody: Note[];
  bass?: Note[];
}

// --- helpers to keep the note arrays readable -------------------------------

/** An arpeggio bar of 8 eighth-notes. */
const arp = (notes: string[]): Note[] => notes.map((n) => [n, 0.5]);
const times = <T,>(n: number, xs: T[]): T[] => Array.from({ length: n }, () => xs).flat();

export const TRACKS: Track[] = [
  {
    id: "morning-light",
    title: "Morning Light",
    artist: "Angoe",
    album: "Desktop Sessions",
    bpm: 100,
    wave: "triangle",
    accent: ["#ffd36e", "#ff8a5b"],
    melody: times(2, [
      ...arp(["C4", "E4", "G4", "C5", "G4", "E4", "G4", "E4"]),
      ...arp(["D4", "G4", "B4", "D5", "B4", "G4", "B4", "G4"]),
      ...arp(["A3", "C4", "E4", "A4", "E4", "C4", "E4", "C4"]),
      ...arp(["F3", "A3", "C4", "F4", "C4", "A3", "C4", "A3"]),
    ]),
    bass: times(2, [
      ["C2", 4],
      ["G2", 4],
      ["A2", 4],
      ["F2", 4],
    ]),
  },
  {
    id: "night-drive",
    title: "Night Drive",
    artist: "Angoe",
    album: "After Hours",
    bpm: 116,
    wave: "square",
    accent: ["#3a1c71", "#5b7cfa"],
    melody: times(2, [
      ["A4", 1], ["C5", 0.5], ["B4", 0.5], ["A4", 1], ["E4", 1],
      ["F4", 1], ["A4", 0.5], ["G4", 0.5], ["F4", 1], ["C4", 1],
      ["G4", 1], ["C5", 0.5], ["E5", 0.5], ["D5", 1], ["G4", 1],
      ["G4", 1], ["B4", 0.5], ["D5", 0.5], ["G4", 1], ["B4", 1],
    ]),
    bass: times(2, [
      ["A2", 1], ["E3", 1], ["A2", 1], ["E3", 1],
      ["F2", 1], ["C3", 1], ["F2", 1], ["C3", 1],
      ["C2", 1], ["G2", 1], ["C2", 1], ["G2", 1],
      ["G2", 1], ["D3", 1], ["G2", 1], ["D3", 1],
    ]),
  },
  {
    id: "afterglow",
    title: "Afterglow",
    artist: "Angoe",
    album: "Desktop Sessions",
    bpm: 84,
    wave: "triangle",
    accent: ["#ff9a9e", "#fa233b"],
    melody: times(2, [
      ["A4", 2], ["C5", 1], ["A4", 1],
      ["A4", 2], ["D5", 1], ["A4", 1],
      ["Bb4", 2], ["D5", 1], ["Bb4", 1],
      ["C5", 2], ["G4", 1], ["E4", 1],
    ]),
    bass: times(2, [
      ["F2", 4],
      ["D2", 4],
      ["Bb2", 4],
      ["C2", 4],
    ]),
  },
  {
    id: "pixel-parade",
    title: "Pixel Parade",
    artist: "Angoe",
    album: "8-Bit Hearts",
    bpm: 128,
    wave: "square",
    accent: ["#43e97b", "#38f9d7"],
    melody: times(2, [
      ...arp(["G4", "B4", "D5", "B4", "G4", "B4", "D5", "G5"]),
      ...arp(["E4", "G4", "B4", "G4", "E4", "G4", "B4", "E5"]),
      ...arp(["C4", "E4", "G4", "E4", "C4", "E4", "G4", "C5"]),
      ...arp(["D4", "F#4", "A4", "F#4", "D4", "A4", "D5", "A4"]),
    ]),
    bass: times(2, [
      ["G2", 1], ["D3", 1], ["G2", 1], ["D3", 1],
      ["E2", 1], ["B2", 1], ["E2", 1], ["B2", 1],
      ["C2", 1], ["G2", 1], ["C2", 1], ["G2", 1],
      ["D2", 1], ["A2", 1], ["D2", 1], ["A2", 1],
    ]),
  },
];
