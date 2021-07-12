import * as React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { KeyboardController } from "./KeyboardController/KeyboardController";

export default function App() {
  return (
    <>
      <CssBaseline />
      <KeyboardController></KeyboardController>
    </>
  );
}
