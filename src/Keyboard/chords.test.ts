import { chord } from "./chord";
import { Key, Chord, chords } from "./chords";

const createChordMap = (c: Chord) => (note: Key) => ({
  [note]: chord(note, 3, chords[c]).simple().toString(),
});

it("should create a maj9ww chord", () => {
  expect(createChordMap("maj9")("C")).toMatchSnapshot();
});

it("should create a chord interval map", () => {
  expect(chords).toMatchSnapshot();
});
