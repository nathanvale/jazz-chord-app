import { chord } from "./chord";

it("can transpose a chord", () => {
  const c = chord("B", 3, ["M3", "P5", "M7", "M9"]);
  expect(c.simple()).toEqual(["D#4", "F#4", "A#4", "C#5"]);
  expect(c.transpose("m2").simple()).toEqual(["E4", "G4", "B4", "D5"]);
});
