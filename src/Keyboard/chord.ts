/* eslint-disable no-console */
import { Interval, Note, IntervalVariant } from "teoria";

export class Chord {
  private _rootNote: Note;
  private _voicing: IntervalVariant[];
  private _notes: Note[];

  constructor(rootNote: Note, voicing: IntervalVariant[]) {
    this._rootNote = rootNote; //?
    this._notes = voicing.map((interval) => {
      return rootNote.interval(interval);
    });
    this._voicing = voicing;
  }

  rootNote() {
    return this._rootNote;
  }

  rootNoteName() {
    return this._rootNote.name().toUpperCase() + this._rootNote.accidental();
  }

  notes() {
    return this._notes;
  }

  invertUp() {
    const newNote = this._notes[0].interval(Interval.toCoord("P8"));
    this._notes.push(newNote);
    this._notes.shift();
    const interval = this._voicing.shift();
    if (interval) this._voicing.push(interval);
    return this;
  }

  doubleInvertUp() {
    return this.invertUp().invertUp();
  }

  invertDown() {
    const newNote = this._notes[this._notes.length - 1].interval(
      Interval.toCoord("P-8")
    );
    this._notes.unshift(newNote);
    this._notes.pop();
    const interval = this._voicing.pop();
    if (interval) this._voicing.unshift(interval);
    return this;
  }

  doubleInvertDown() {
    return this.invertDown().invertDown();
  }

  voicing() {
    return this._voicing;
  }

  simple() {
    return this._notes.map((n) => {
      const key = n.toString(true);
      const string = key.charAt(0).toUpperCase() + key.slice(1) + n.octave(); //?
      return string;
    });
  }
}

export function chord(
  root: string,
  octave: number,
  voicing: IntervalVariant[]
) {
  let r, o;
  if (typeof root === "string") {
    r = root.match(/^([a-h])(x|#|bb|b?)/i); //?
    if (r && r[0]) {
      o = typeof octave === "number" ? octave.toString(10) : "4"; //?
      return new Chord(Note.fromString(r[0].toLowerCase() + o), voicing);
    }
  }

  throw new Error("Invalid Chord. Couldn't find note name");
}

//const c = chord("Eb", 4, ["M3", "P5", "M7", "M9"]); //?
// console.log(c.notes());
// console.log(c.simple());
// //console.log(c.invertDown().simple());
// console.log(c.voicing());
// console.log(c.rootNoteName());
// console.log(c.rootNote().accidental());
