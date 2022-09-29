import coords from "./intervals-coords.js";

it("should should correct interval for M12", () => {
  const result = coords("M12");
  expect(result).toEqual([1, 1]);
});
