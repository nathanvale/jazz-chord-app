import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import { useTheme } from "@material-ui/core";
import { Keyboard } from "../Keyboard/Keyboard";
import { chord } from "../Keyboard/chord";
import { KeyboardOptions } from "../SVGKeyboard/KeyboardModel";
import { getKeyboardLabels } from "./utils";

export interface KeyboardControllerProps {}

export const KeyboardController = () => {
  const theme = useTheme();

  console.log(theme);

  const defaultOptions = {
    range: ["C3", "C6"],
    scaleX: 2,
    scaleY: 2,
    strokeWidth: 1,
    fontFamily: theme.typography.fontFamily || "",
    rightHandKeysColor: theme.palette.info.light,
    leftHandKeysColor: theme.palette.error.light,
  };
  const [options, setOptions] =
    useState<Partial<KeyboardOptions>>(defaultOptions);

  const [lhk, setLeftHandKeys] = useState<Partial<KeyboardOptions>>(
    getKeyboardLabels(chord("B", 3, ["P1"]))
  );

  const [rhk, setRightHandKeys] = useState<Partial<KeyboardOptions>>(
    getKeyboardLabels(chord("B", 3, ["M3", "P5", "M7", "M9"]))
  );

  function changeOptions() {
    setOptions({ ...defaultOptions, scaleX: 1 });
  }

  function changeOptions2() {
    setLeftHandKeys(getKeyboardLabels(chord("C", 4, ["P1"])));
  }

  function changeOptions3() {
    setRightHandKeys(
      getKeyboardLabels(chord("C", 4, ["M3", "P5", "M7", "M9"]))
    );
  }
  function changeOptions4() {
    setLeftHandKeys(getKeyboardLabels(chord("B", 3, ["P1"])));
    setRightHandKeys(
      getKeyboardLabels(chord("B", 3, ["M3", "P5", "M7", "M9"]))
    );
  }

  return (
    <>
      <Keyboard leftHandKeys={lhk} rightHandKeys={rhk} options={options} />
      <Button onClick={changeOptions}>Change</Button>
      <Button onClick={changeOptions2}>Change</Button>
      <Button onClick={changeOptions3}>Change</Button>
      <Button onClick={changeOptions4}>Change</Button>
    </>
  );
};

KeyboardController.displayName = "Keyboard";

KeyboardController.defaultProps = {};
