import { IntervalVariant } from "teoria";

export type KeyVariant =
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

export type ChordVariant = "maj9" | "maj9Closed" | "min9" | "majTriad";

export type ChordAttributes = {
  intervals: IntervalVariant[];
  intervalLabels?: IntervalVariant[];
  open?: boolean;
  name: ChordVariant;
};

export const keys: KeyVariant[] = [
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

export const chords: Record<ChordVariant, ChordAttributes> = {
  majTriad: { name: "majTriad", intervals: ["P1", "M3", "P5"], open: false },
  maj9: { name: "maj9", intervals: ["M3", "P5", "M7", "M9"], open: true },
  maj9Closed: {
    name: "maj9Closed",
    intervals: ["M7", "M9", "M10", "M12"],
    intervalLabels: ["M7", "M9", "M3", "P5"],
    open: true,
  },
  min9: { name: "min9", intervals: ["m3", "P5", "m7", "M9"], open: true },
};
