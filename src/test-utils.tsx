import { render } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";

export function renderWithRouter(
  ui: any,
  {
    route = "/",
    history = createMemoryHistory({ initialEntries: [route] }),
    state,
  }: any = {}
) {
  if (state) history.push(route, state);
  return {
    ...render(<Router history={history}>{ui}</Router>),
    history,
  };
}

export const wait = (delay: number) =>
  new Promise((response) => setTimeout(response, delay));
