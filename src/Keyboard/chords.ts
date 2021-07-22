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

export type ChordVariant =
  | "maj9"
  | "maj9Closed"
  | "min9"
  | "min9Closed"
  | "dom13"
  | "dom13Closed"
  | "majTriad";

export type IntervalVariant =
  // perfect
  | "P1"
  | "P4"
  | "P5"
  | "P8"
  | "P-1"
  | "P-4"
  | "P-5"
  | "P-8"
  // major
  | "M2"
  | "M3"
  | "M6"
  | "M7"
  | "M9"
  | "M10"
  | "M11"
  | "M12"
  | "M13"
  | "M-2"
  | "M-3"
  | "M-6"
  | "M-7"
  | "M-9"
  | "M-10"
  | "M-11"
  | "M-12"
  | "M-13"
  // minor
  | "m2"
  | "m3"
  | "m6"
  | "m7"
  | "m9"
  | "m10"
  | "m11"
  | "m12"
  | "m13"
  | "m-2"
  | "m-3"
  | "m-6"
  | "m-7"
  | "m-9"
  | "m-10"
  | "m-11"
  | "m-12"
  | "m-13"
  // augmented
  | "A1"
  | "A2"
  | "A3"
  | "A4"
  | "A5"
  | "A6"
  | "A7"
  | "A8"
  | "A9"
  | "A10"
  | "A11"
  | "A12"
  | "A13"
  | "A-1"
  | "A-2"
  | "A-3"
  | "A-4"
  | "A-5"
  | "A-6"
  | "A-7"
  | "A-8"
  | "A-9"
  | "A-10"
  | "A-11"
  | "A-12"
  | "A-13"
  // doubly augmented
  | "AA1"
  | "AA2"
  | "AA3"
  | "AA4"
  | "AA5"
  | "AA6"
  | "AA7"
  | "AA8"
  | "AA9"
  | "AA10"
  | "AA11"
  | "AA12"
  | "AA13"
  | "AA-1"
  | "AA-2"
  | "AA-3"
  | "AA-4"
  | "AA-5"
  | "AA-6"
  | "AA-7"
  | "AA-8"
  | "AA-9"
  | "AA-10"
  | "AA-11"
  | "AA-12"
  | "AA-13"
  // diminished
  | "d1"
  | "d2"
  | "d3"
  | "d4"
  | "d5"
  | "d6"
  | "d7"
  | "d8"
  | "d9"
  | "d10"
  | "d11"
  | "d12"
  | "d13"
  | "d-1"
  | "d-2"
  | "d-3"
  | "d-4"
  | "d-5"
  | "d-6"
  | "d-7"
  | "d-8"
  | "d-9"
  | "d-10"
  | "d-11"
  | "d-12"
  | "d-13"
  // doubly diminished
  | "dd1"
  | "dd2"
  | "dd3"
  | "dd4"
  | "dd5"
  | "dd6"
  | "dd7"
  | "dd8"
  | "dd9"
  | "dd10"
  | "dd11"
  | "dd12"
  | "dd13"
  | "dd-1"
  | "dd-2"
  | "dd-3"
  | "dd-4"
  | "dd-5"
  | "dd-6"
  | "dd-7"
  | "dd-8"
  | "dd-9"
  | "dd-10"
  | "dd-11"
  | "dd-12"
  | "dd-13";

type Hand = {
  intervals: IntervalVariant[];
  intervalLabels?: IntervalVariant[];
};
export type ChordAttributes = {
  leftHand: Hand;
  rightHand: Hand;
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
  majTriad: {
    name: "majTriad",
    leftHand: { intervals: ["P1"] },
    rightHand: { intervals: ["P1", "M3", "P5"] },
  },
  maj9: {
    name: "maj9",
    leftHand: { intervals: ["P1"] },
    rightHand: { intervals: ["M3", "P5", "M7", "M9"] },
  },
  maj9Closed: {
    name: "maj9Closed",
    leftHand: { intervals: ["P1"] },
    rightHand: {
      intervals: ["M7", "M9", "M10", "M12"],
      intervalLabels: ["M7", "M9", "M3", "P5"],
    },
  },
  min9: {
    name: "min9",
    leftHand: { intervals: ["P1"] },
    rightHand: { intervals: ["m3", "P5", "m7", "M9"] },
  },
  min9Closed: {
    name: "min9Closed",
    leftHand: { intervals: ["P1"] },
    rightHand: {
      intervals: ["m7", "M9", "m10", "M12"],
      intervalLabels: ["m7", "M9", "m3", "P5"],
    },
  },
  dom13: {
    name: "dom13",
    leftHand: { intervals: ["P1"] },
    rightHand: {
      intervals: ["m7", "M9", "M10", "M13"],
      intervalLabels: ["m7", "M9", "M3", "M13"],
    },
  },
  dom13Closed: {
    name: "dom13Closed",
    leftHand: { intervals: ["P1"] },
    rightHand: {
      intervals: ["M3", "M6", "m7", "M9"],
      intervalLabels: ["M3", "M13", "m7", "M9"],
    },
  },
};
