import { chord } from "../Keyboard/chord";
import { chords } from "../Keyboard/chords";
import { getKeyboardLabels } from "./utils";

it("converts a maj9 chord to labels", () => {
  const c = chord("C", 3, chords["maj9"].rightHand.intervals);
  expect(getKeyboardLabels(c)).toEqual({
    B3: "M7",
    D4: "M9",
    E3: "M3",
    G3: "P5",
  });
});

it("converts a maj9Closed chord to labels", () => {
  const c = chord("C", 3, chords["maj9Closed"].rightHand.intervals);
  expect(getKeyboardLabels(c, ["M7", "M9", "M3", "P5"])).toEqual({
    B3: "M7",
    D4: "M9",
    E4: "M3",
    G4: "P5",
  });
});
