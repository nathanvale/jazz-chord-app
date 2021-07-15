import { chord } from "../Keyboard/chord";
import { chords } from "../Keyboard/chords";
import { getKeyboardLabels } from "./utils";

it("converts a chord to labels", () => {
  const c = chord("C", 3, chords.maj7Open);
  expect(getKeyboardLabels(c)).toEqual({
    B3: "M7",
    D4: "M9",
    E3: "M3",
    G3: "P5",
  });
});
