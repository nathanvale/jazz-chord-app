import React, { useState } from "react";
import ToggleButton from "@material-ui/core/ToggleButton";
import ToggleButtonGroup from "@material-ui/core/ToggleButtonGroup";
import { useTheme } from "@material-ui/core";
import { Keyboard } from "../Keyboard/Keyboard";
import { chord } from "../Keyboard/chord";
import { KeyboardOptions } from "../SVGKeyboard/KeyboardModel";
import { getKeyboardLabels } from "./utils";
import { circleOfFifths, Keys, maj7Open } from "../Keyboard/chords";

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

  const [key, setKey] = React.useState<Keys | undefined>();

  const [lhk, setLeftHandKeys] = useState<Partial<KeyboardOptions>>();

  const [rhk, setRightHandKeys] = useState<Partial<KeyboardOptions>>();

  function handleChange(
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    value: Keys
  ) {
    if (!value) return;
    setKey(value);
    setLeftHandKeys(getKeyboardLabels(chord(value, 3, ["P1"])));
    setRightHandKeys(getKeyboardLabels(chord(value, 3, maj7Open)));
  }

  return (
    <>
      <Keyboard leftHandKeys={lhk} rightHandKeys={rhk} options={options} />

      <ToggleButtonGroup
        value={key}
        color="primary"
        exclusive
        onChange={handleChange}
      >
        {circleOfFifths.map((note) => {
          return (
            <ToggleButton key={note} value={note}>
              {note}
            </ToggleButton>
          );
        })}
      </ToggleButtonGroup>
    </>
  );
};

KeyboardController.displayName = "Keyboard";

KeyboardController.defaultProps = {};
