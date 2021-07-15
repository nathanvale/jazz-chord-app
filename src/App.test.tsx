import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

it("renders app with a keyboard", () => {
  render(<App />);
  const keyboard = screen.getByLabelText("Keyboard");
  expect(keyboard).toBeTruthy();
});
