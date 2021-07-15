import React from "react";
import { render, screen, within, fireEvent } from "@testing-library/react";
import { KeyboardController } from "./KeyboardController";

it("should toggle between chords", () => {
  render(<KeyboardController />);
  const toggleButton = screen.getByLabelText("Circle of fifths");
  const button = within(toggleButton).getByText("C");
  fireEvent.click(button);

  const keyboard = screen.getByLabelText("Keyboard");

  let leftHandActiveKeys = within(
    within(keyboard).getByLabelText("Left hand active keys")
  );

  let rightHandActiveKeys = within(
    within(keyboard).getByLabelText("Right hand active keys")
  );

  expect(leftHandActiveKeys.getByText("C3")).toBeTruthy();
  expect(leftHandActiveKeys.getByText("P1")).toBeTruthy();

  expect(rightHandActiveKeys.getByText("E3")).toBeTruthy();
  expect(rightHandActiveKeys.getByText("M3")).toBeTruthy();

  expect(rightHandActiveKeys.getByText("G3")).toBeTruthy();
  expect(rightHandActiveKeys.getByText("P5")).toBeTruthy();

  expect(rightHandActiveKeys.getByText("B3")).toBeTruthy();
  expect(rightHandActiveKeys.getByText("M7")).toBeTruthy();

  expect(rightHandActiveKeys.getByText("D4")).toBeTruthy();
  expect(rightHandActiveKeys.getByText("M9")).toBeTruthy();
});
