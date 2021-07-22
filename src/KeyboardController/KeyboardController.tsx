import React, { useState } from "react";
import ToggleButton from "@material-ui/core/ToggleButton";
import Stack from "@material-ui/core/Stack";
import ToggleButtonGroup from "@material-ui/core/ToggleButtonGroup";
import { useTheme } from "@material-ui/core";
import { Keyboard } from "../Keyboard/Keyboard";
import { Chord, chord } from "../Keyboard/chord";
import { KeyboardOptions } from "../SVGKeyboard/KeyboardModel";
import { getKeyboardLabels } from "./utils";
import {
  ChordVariant,
  chords,
  keys,
  KeyVariant,
  ChordAttributes,
} from "../Keyboard/chords";

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

  const [selectedKey, setKey] = React.useState<KeyVariant | undefined>();
  const [selectedChord, setSelectedChord] = useState<
    ChordAttributes | undefined
  >();

  const [lhk, setLeftHandKeys] = useState<Chord>();

  const [rhk, setRightHandKeys] = useState<Chord>();

  function playKeys(k: KeyVariant, c: ChordAttributes) {
    const leftChord = chord(k, 3, c.leftHand.intervals);
    setLeftHandKeys(leftChord);
    const rightChord = chord(k, 3, c.rightHand.intervals);
    setRightHandKeys(rightChord);
  }

  function handleKeyChange(
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    value: KeyVariant
  ) {
    if (!value || !selectedChord) return;
    setKey(value);
    playKeys(value, chords[selectedChord.name]);
  }

  function handleChordChange(
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    value: ChordVariant
  ) {
    if (!value) return;
    const chordAttributes = chords[value];

    setSelectedChord(chordAttributes);

    if (selectedKey) {
      playKeys(selectedKey, chordAttributes);
    }
  }

  return (
    <Stack spacing={2}>
      <Keyboard
        leftHandKeys={
          lhk
            ? getKeyboardLabels(lhk, selectedChord?.leftHand.intervalLabels)
            : undefined
        }
        rightHandKeys={
          rhk
            ? getKeyboardLabels(rhk, selectedChord?.rightHand.intervalLabels)
            : undefined
        }
        options={options}
      />
      <ToggleButtonGroup
        value={selectedChord?.name}
        color="primary"
        exclusive
        onChange={handleChordChange}
        aria-label="Toggle button chords"
      >
        {Object.keys(chords).map((chord) => {
          return (
            <ToggleButton
              aria-label={chord}
              role="button"
              key={chord}
              value={chord}
            >
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
            <ToggleButton
              role="button"
              aria-label={note}
              key={note}
              value={note}
              disabled={!selectedChord}
            >
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
