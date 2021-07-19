import { IntervalVariant } from "teoria";

export type Key =
  | "C"
  | "G"
  | "D"
  | "A"
  | "E"
  | "B"
  | "F#"
  | "Db"
  | "Ab"
  | "Eb"
  | "Bb"
  | "F";

export type ChordVariant = "maj9" | "min9";

export type Chord = {
  intervals: IntervalVariant[];
  open?: boolean;
};

export const keys: Key[] = [
  "C",
  "G",
  "D",
  "A",
  "E",
  "B",
  "F#",
  "Db",
  "Ab",
  "Eb",
  "Bb",
  "F"
];

export const chords: Record<ChordVariant, Chord> = {
  maj9: { intervals: ["M7", "M9", "M3", "P5"], open: true },
  min9: { intervals: ["m3", "P5", "m7", "M9"], open: true }
};
