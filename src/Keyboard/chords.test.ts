import { chord } from "./chord";
import { Keys, Chords, chords } from "./chords";

const createChordMap = (c: Chords) => (note: Keys) => ({
  [note]: chord(note, 3, chords[c]).simple().toString(),
});

it("should create a maj7Open chord", () => {
  expect(createChordMap("maj7Open")("C")).toMatchSnapshot();
});

it("should create a chord interval map", () => {
  expect(chords).toMatchSnapshot();
});
