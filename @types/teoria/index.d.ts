/* eslint-disable one-var */
declare module "teoria" {
  export type IntervalConstructor = (
    interval: IntervalCoord | IntervalVariant
  ) => Note;
  export type ChordConstructor = (
    root: string | NoteInstance,
    name?: string
  ) => Chord;

  export interface Duration {
    value: number;
    dots: number;
  }
  export interface Chord extends Duration {
    interval: IntervalConstructor;
    toString: () => string;
    voicing: (voicing?: IntervalVariant[]) => Chord;
    simple: () => string[];
    transpose: (intervalCoord: IntervalCoord) => Chord;
    notes: () => NoteInstance[];
    bass: () => string;
    root: {
      duration: Duration;
      coord: [number, number];
    };
    symbol: string;
    intervals: IntervalCoord[];
    resetVoicing: () => void;
  }

  export interface IntervalCoord {
    coord: [number, number];
  }

  export class Interval {
    static toCoord: (interval: IntervalVariant) => IntervalCoord;
  }

  export class Note {
    static fromString: (str: string) => NoteInstance;
    interval: IntervalConstructor;
    chord: (root: string, name?: string) => Chord;
    transpose: (intervalCoord: IntervalCoord) => NoteInstance;
    name: () => string;
    accidental: () => string;
    toString: (dont?: Boolean) => string;
    octave: () => string;
  }

  export type NoteVariant = string;

  /*
  P: 'perfect',
  M: 'major',
  m: 'minor',
  A: 'augmented',
  AA: 'doubly augmented',
  d: 'diminished',
  dd: 'doubly diminished'
  */

  export const note: (name: NoteVariant, duration?: any) => NoteInstance;

  
