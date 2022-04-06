import React, { useState } from "react";
import Stack from "@material-ui/core/Stack";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  useTheme,
} from "@material-ui/core";
import { Keyboard } from "../Keyboard/Keyboard";
import { Chord, chord } from "../Keyboard/chord";
import { KeyboardOptions } from "../SVGKeyboard/KeyboardModel";
import { getKeyboardLabels } from "./utils";

import { styled } from "@material-ui/core/styles";
import { chords, keys, KeyVariant, ChordAttributes } from "../Keyboard/chords";

export interface KeyboardControllerProps {}

const Item = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  textAlign: "center",
  color: theme.palette.text.secondary,
  borderColor: theme.palette.text.secondary,
  borderStyle: "none",
}));

export const KeyboardController = () => {
  const theme = useTheme();

  const defaultOptions = {
    range: ["C3", "C7"],
    scaleX: 2,
    scaleY: 2,
    strokeWidth: 1,
    fontFamily: theme.typography.fontFamily || "",
    rightHandKeysColor: theme.palette.info.light,
    leftHandKeysColor: theme.palette.error.light,
  };
  const [options] = useState<Partial<KeyboardOptions>>(defaultOptions);

  const [selectedKey, setKey] = React.useState<KeyVariant | undefined>("C");
  const chordAttributes = chords["majTriad"];

  const [selectedChord, setSelectedChord] = useState<
    ChordAttributes | undefined
  >(chordAttributes);

  const [lhk, setLeftHandKeys] = useState<Chord>(
    chord("C", 3, chordAttributes.leftHand.intervals)
  );

  const [rhk, setRightHandKeys] = useState<Chord>(
    chord("C", 4, chordAttributes.rightHand.intervals)
  );

  function playKeys(k: KeyVariant, c: ChordAttributes) {
    const leftChord = chord(k, 3, c.leftHand.intervals);
    setLeftHandKeys(leftChord);
    const rightChord = chord(k, 4, c.rightHand.intervals);
    setRightHandKeys(rightChord);
  }

  function handleKeyChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = (event.target as HTMLInputElement).value;
    if (!value || !selectedChord) return;
    setKey(value as any);
    playKeys(value as any, chords[selectedChord.name]);
  }

  function handleChordChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = (event.target as HTMLInputElement).value;
    if (!value) return;
    const chordAttributes = (chords as any)[value];
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
      {/* <ToggleButtonGroup
        value={selectedChord?.name}
        color="primary"
        exclusive
        onChange={handleChordChange}
        aria-label="Toggle button chords"
      >
        {Object.keys(chords).map((chord) => {
          return (
            <CustomToggleButton
              aria-label={chord}
              role="button"
              key={chord}
              value={chord}
            >
              {chord}
            </CustomToggleButton>
          );
        })}
      </ToggleButtonGroup> */}

      <FormControl>
        <Stack spacing={2}>
          <FormLabel>Key</FormLabel>
          <RadioGroup
            aria-labelledby="Keys"
            name="keys"
            value={selectedKey}
            onChange={handleKeyChange}
          >
            <Grid container columns={{ xs: 6, md: 12 }} spacing="12">
              {keys.map((note, index) => {
                const key =
                  note + String(selectedChord ? selectedChord?.name : "");
                return (
                  <Grid item xs={1} md={1} key={index} textAlign="center">
                    <Item>
                      <FormControlLabel
                        value="male"
                        control={
                          <Radio
                            key={key}
                            value={note}
                            role="radio"
                            aria-label={note}
                            disabled={!selectedChord}
                          />
                        }
                        label={note}
                        labelPlacement="bottom"
                      />
                    </Item>
                  </Grid>
                );
              })}
            </Grid>
          </RadioGroup>
          <FormLabel>Chord</FormLabel>
          <RadioGroup
            aria-labelledby="Keys"
            name="keys"
            value={selectedChord?.name}
            onChange={handleChordChange}
          >
            <Grid container columns={{ xs: 3, md: 6 }} spacing="12">
              {Object.keys(chords).map((chord, index) => {
                return (
                  <Grid item xs={1} md={1} key={index} textAlign="center">
                    <Item>
                      <FormControlLabel
                        value="chord"
                        control={
                          <Radio
                            key={chord}
                            value={chord}
                            role="radio"
                            aria-label={chord}
                            disabled={!selectedChord}
                          />
                        }
                        label={chord}
                        labelPlacement="bottom"
                      />
                    </Item>
                  </Grid>
                );
              })}
            </Grid>
          </RadioGroup>
        </Stack>
      </FormControl>
    </Stack>
  );
};

KeyboardController.displayName = "Keyboard";

KeyboardController.defaultProps = {};
