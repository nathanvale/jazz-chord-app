import React from "react";
import { render, screen, within, fireEvent } from "@testing-library/react";
import { KeyboardController } from "./KeyboardController";
import { Chord, chords, keys } from "../Keyboard/chords";

function renderKeyboardController() {
  render(<KeyboardController />);
  const toggleButtonChords = screen.getByLabelText("Toggle button chords");
  const toggleButtonKeys = screen.getByLabelText("Toggle button keys");
  return { toggleButtonChords, toggleButtonKeys };
}

it("should have all toggle button chords", () => {
  const { toggleButtonChords } = renderKeyboardController();
  let buttons = within(toggleButtonChords).getAllByRole("button");
  buttons.map((button, index) => {
    const chord = Object.keys(chords)[index] as Chord;
    expect(button).toHaveTextContent(chord);
  });
});

it("should have all toggle button keys", () => {
  const { toggleButtonKeys } = renderKeyboardController();
  let buttons = within(toggleButtonKeys).getAllByRole("button");
  buttons.map((button, index) => {
    const key = keys[index];
    expect(button).toHaveTextContent(key);
  });
});

it("should have disabled keys when no chord is selected", () => {
  const { toggleButtonChords, toggleButtonKeys } = renderKeyboardController();
  let buttons = within(toggleButtonChords).getAllByRole("button");
  buttons.map((button) => {
    expect(button).toHaveAttribute("aria-pressed", "false");
  });
  buttons = within(toggleButtonKeys).getAllByRole("button");
  buttons.map((button) => {
    expect(button).toBeDisabled();
  });
});

it("should toggle between chords", () => {
  const { toggleButtonChords, toggleButtonKeys } = renderKeyboardController();
  let chord: Chord = "maj9";
  let button = within(toggleButtonChords).getByRole("button", {
    name: new RegExp(chord, "i"),
  });
  fireEvent.click(button);

  function clickFirstKey() {
    button = within(toggleButtonKeys).getByRole("button", {
      name: new RegExp(keys[0], "i"),
    });
    fireEvent.click(button);
  }

  clickFirstKey();

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

  chord = "min9";
  button = within(toggleButtonChords).getByRole("button", {
    name: new RegExp(chord, "i"),
  });
  fireEvent.click(button);

  clickFirstKey();

  expect(leftHandActiveKeys.getByText("C3")).toBeTruthy();
  expect(leftHandActiveKeys.getByText("P1")).toBeTruthy();

  expect(rightHandActiveKeys.getByText("Eb3")).toBeTruthy();
  expect(rightHandActiveKeys.getByText("m3")).toBeTruthy();

  expect(rightHandActiveKeys.getByText("G3")).toBeTruthy();
  expect(rightHandActiveKeys.getByText("P5")).toBeTruthy();

  expect(rightHandActiveKeys.getByText("Bb3")).toBeTruthy();
  expect(rightHandActiveKeys.getByText("m7")).toBeTruthy();

  expect(rightHandActiveKeys.getByText("D4")).toBeTruthy();
  expect(rightHandActiveKeys.getByText("M9")).toBeTruthy();
});
