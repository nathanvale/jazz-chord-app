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

export const maj7Open: IntervalVariant[] = ["M3", "P5", "M7", "M9"];
export const maj7Closed: IntervalVariant[] = ["M7", "M9", "M3", "P5"];
