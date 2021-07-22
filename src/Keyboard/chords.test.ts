import { chord } from "./chord";
import { KeyVariant, ChordVariant, chords } from "./chords";

const createChordMap = (c: ChordVariant) => (note: KeyVariant) => ({
  [note]: chord(note, 3, chords[c].rightHand.intervals).simple().toString(),
});

it("should create a maj9 chord", () => {
  expect(createChordMap("maj9")("C")).toMatchSnapshot();
});

it("should create a chord interval map", () => {
  expect(chords).toMatchSnapshot();
});
