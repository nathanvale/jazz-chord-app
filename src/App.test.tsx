import React from "react";
import { render } from "@testing-library/react";
import App from "./App";
global.ResizeObserver = require("resize-observer-polyfill");

it("renders app with a keyboard", () => {
  render(<App />);
});
