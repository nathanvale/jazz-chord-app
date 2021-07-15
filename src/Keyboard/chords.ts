import { IntervalVariant } from "teoria";

export type Keys =
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

export type Chords = "maj7Open" | "maj7Closed";

export const circleOfFifths: Keys[] = [
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

export const chords: Record<Chords, IntervalVariant[]> = {
  maj7Open: ["M3", "P5", "M7", "M9"],
  maj7Closed: ["M7", "M9", "M3", "P5"],
};
