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

export type Chord = "maj9" | "min9";

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
  "F",
];

export const chords: Record<Chord, IntervalVariant[]> = {
  maj9: ["M7", "M9", "M3", "P5"],
  min9: ["m3", "P5", "m7", "M9"],
};
