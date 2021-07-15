import { chord } from "./chord";
import { circleOfFifths, Keys, Chords, chords } from "./chords";

const createChordMap = (c: Chords) => (note: Keys) => ({
  [note]: chord(note, 3, chords[c]).simple().toString(),
});

it("should create correct chords", () => {
  const c = Object.keys(chords).map((chord) => {
    return { [chord]: circleOfFifths.map(createChordMap(chord as Chords)) };
  });
  expect(c).toMatchSnapshot();
});
