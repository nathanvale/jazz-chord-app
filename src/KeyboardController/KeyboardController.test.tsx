import React from "react";
import { render, screen, within, fireEvent } from "@testing-library/react";
import { KeyboardController } from "./KeyboardController";
import { ChordVariant, chords, keys, KeyVariant } from "../Keyboard/chords";

function renderKeyboardController() {
  render(<KeyboardController />);
  const toggleButtonChords = screen.getByLabelText("Toggle button chords");
  const toggleButtonKeys = screen.getByLabelText("Toggle button keys");
  const keyboard = screen.getByLabelText("Keyboard");

  const leftHandActiveKeys = within(
    within(keyboard).getByLabelText("Left hand active keys")
  );

  const rightHandActiveKeys = within(
    within(keyboard).getByLabelText("Right hand active keys")
  );

  function selectChord(chord: ChordVariant) {
    const button = within(toggleButtonChords).getByRole("button", {
      name: new RegExp(`^${chord}$`, "i"),
    });
    fireEvent.click(button);
  }

  function selectKey(key: KeyVariant) {
    const button = within(toggleButtonKeys).getByRole("button", {
      name: new RegExp(key, "i"),
    });
    fireEvent.click(button);
  }

  return {
    toggleButtonChords,
    toggleButtonKeys,
    leftHandActiveKeys,
    rightHandActiveKeys,
    selectChord,
    selectKey,
    keyboard,
  };
}

it("should have all toggle button chords", () => {
  const { toggleButtonChords } = renderKeyboardController();
  let buttons = within(toggleButtonChords).getAllByRole("button");
  buttons.map((button, index) => {
    const chord = Object.keys(chords)[index] as ChordVariant;
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

it("should render chords with custom interval labels ", () => {
  const { selectChord, selectKey, rightHandActiveKeys } =
    renderKeyboardController();
  selectChord("maj9Closed");
  selectKey("C");
  expect(rightHandActiveKeys.getByText("B3")).toBeInTheDocument();
  expect(rightHandActiveKeys.getByText("M7")).toBeInTheDocument();

  expect(rightHandActiveKeys.getByText("D4")).toBeInTheDocument();
  expect(rightHandActiveKeys.getByText("M9")).toBeInTheDocument();

  expect(rightHandActiveKeys.getByText("E4")).toBeInTheDocument();
  expect(rightHandActiveKeys.getByText("M3")).toBeInTheDocument();

  expect(rightHandActiveKeys.getByText("G4")).toBeInTheDocument();
  expect(rightHandActiveKeys.getByText("P5")).toBeInTheDocument();
});

it("should toggle between chords", () => {
  const { selectChord, selectKey, leftHandActiveKeys, rightHandActiveKeys } =
    renderKeyboardController();

  selectChord("maj9");
  selectKey("C");

  expect(leftHandActiveKeys.getByText("C3")).toBeInTheDocument();
  expect(leftHandActiveKeys.getByText("P1")).toBeInTheDocument();

  expect(rightHandActiveKeys.getByText("E3")).toBeInTheDocument();
  expect(rightHandActiveKeys.getByText("M3")).toBeInTheDocument();

  expect(rightHandActiveKeys.getByText("G3")).toBeInTheDocument();
  expect(rightHandActiveKeys.getByText("P5")).toBeInTheDocument();

  expect(rightHandActiveKeys.getByText("B3")).toBeInTheDocument();
  expect(rightHandActiveKeys.getByText("M7")).toBeInTheDocument();

  expect(rightHandActiveKeys.getByText("D4")).toBeInTheDocument();
  expect(rightHandActiveKeys.getByText("M9")).toBeInTheDocument();

  selectChord("min9");

  expect(leftHandActiveKeys.getByText("C3")).toBeInTheDocument();
  expect(leftHandActiveKeys.getByText("P1")).toBeInTheDocument();

  expect(rightHandActiveKeys.getByText("Eb3")).toBeInTheDocument();
  expect(rightHandActiveKeys.getByText("m3")).toBeInTheDocument();

  expect(rightHandActiveKeys.getByText("G3")).toBeInTheDocument();
  expect(rightHandActiveKeys.getByText("P5")).toBeInTheDocument();

  expect(rightHandActiveKeys.getByText("Bb3")).toBeInTheDocument();
  expect(rightHandActiveKeys.getByText("m7")).toBeInTheDocument();

  expect(rightHandActiveKeys.getByText("D4")).toBeInTheDocument();
  expect(rightHandActiveKeys.getByText("M9")).toBeInTheDocument();
});
