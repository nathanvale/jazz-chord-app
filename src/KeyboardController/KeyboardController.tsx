import React, { useState } from "react";
import ToggleButton from "@material-ui/core/ToggleButton";
import Stack from "@material-ui/core/Stack";
import ToggleButtonGroup from "@material-ui/core/ToggleButtonGroup";
import { useTheme } from "@material-ui/core";
import { Keyboard } from "../Keyboard/Keyboard";
import { chord } from "../Keyboard/chord";
import { KeyboardOptions } from "../SVGKeyboard/KeyboardModel";
import { getKeyboardLabels } from "./utils";
import { Chord, chords, keys, Key } from "../Keyboard/chords";

export interface KeyboardControllerProps {}

export const KeyboardController = () => {
  const theme = useTheme();

  const defaultOptions = {
    range: ["C3", "C6"],
    scaleX: 2,
    scaleY: 2,
    strokeWidth: 1,
    fontFamily: theme.typography.fontFamily || "",
    rightHandKeysColor: theme.palette.info.light,
    leftHandKeysColor: theme.palette.error.light,
  };
  const [options] = useState<Partial<KeyboardOptions>>(defaultOptions);

  const [selectedKey, setKey] = React.useState<Key | undefined>();

  const [selectedChord, setSelectedChord] = useState<Chord | undefined>();

  const [lhk, setLeftHandKeys] = useState<Partial<KeyboardOptions>>();

  const [rhk, setRightHandKeys] = useState<Partial<KeyboardOptions>>();

  function handleKeyChange(
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    value: Key
  ) {
    if (!value || !selectedChord) return;
    setKey(value);
    setLeftHandKeys(getKeyboardLabels(chord(value, 3, ["P1"])));
    setRightHandKeys(getKeyboardLabels(chord(value, 3, chords[selectedChord])));
  }

  function handleChordChange(
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    value: Chord
  ) {
    if (!value) return;
    setSelectedChord(value);
    if (selectedKey) {
      setLeftHandKeys(getKeyboardLabels(chord(selectedKey, 3, ["P1"])));
      setRightHandKeys(getKeyboardLabels(chord(selectedKey, 3, chords[value])));
    }
  }

  return (
    <Stack spacing={2}>
      <Keyboard leftHandKeys={lhk} rightHandKeys={rhk} options={options} />
      <ToggleButtonGroup
        value={selectedChord}
        color="primary"
        exclusive
        onChange={handleChordChange}
        aria-label="Toggle button chords"
      >
        {Object.keys(chords).map((chord) => {
          return (
            <ToggleButton key={chord} value={chord}>
              {chord}
            </ToggleButton>
          );
        })}
      </ToggleButtonGroup>
      <ToggleButtonGroup
        value={selectedKey}
        color="primary"
        exclusive
        onChange={handleKeyChange}
        aria-label="Toggle button keys"
      >
        {keys.map((note) => {
          return (
            <ToggleButton key={note} value={note} disabled={!selectedChord}>
              {note}
            </ToggleButton>
          );
        })}
      </ToggleButtonGroup>
    </Stack>
  );
};

KeyboardController.displayName = "Keyboard";

KeyboardController.defaultProps = {};
