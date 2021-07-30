import React from "react";
import { Login } from "./Login";
import { renderWithRouter, wait } from "../test-utils";
import { screen, fireEvent } from "@testing-library/react";
import { useIdentityContext } from "react-netlify-identity-gotrue";

function renderLogin() {
  const { history } = renderWithRouter(<Login />, { route: "/login" });
  const loginButton = screen.getByRole("button", { name: /^Log In/i });
  const emailTextField = screen.getByRole("textbox", { name: /^Email/i });
  const passwordTextField = screen.getByLabelText(/^Password/i);
  return { loginButton, emailTextField, passwordTextField, history };
}

it("renders Login component", () => {
  renderWithRouter(<Login />, { route: "login" });
});

it("should show errors on button click", async () => {
  const { loginButton } = renderLogin();
  expect(loginButton).toBeInTheDocument();
  fireEvent.click(loginButton);
  await wait(10);
  const emailError = screen.getByText(/Email required/i);
  const passwordError = screen.getByText(/Password required/i);
  expect(emailError).toBeInTheDocument();
  expect(passwordError).toBeInTheDocument();
});

// it("should show loading spinner on button click", async () => {
//   const { loginButton, emailTextField, passwordTextField } = renderLogin();
//   const { login } = useIdentityContext();
//   const email = "nathanvale73@gmail.com";
//   const password = "password";
//   (login as jest.Mock<any, any>).mockReturnValue(
//     new Promise((response) => setTimeout(response, 200)).then(() =>
//       Promise.resolve("fuck")
//     )
//   );
//   fireEvent.change(emailTextField, { target: { value: email } });
//   fireEvent.change(passwordTextField, { target: { value: password } });
//   fireEvent.click(loginButton);
//   await wait(100);
//   expect(loginButton).toBeDisabled();
//   await wait(100);
//   expect(login).toBeCalledWith({ email, password });
//   await wait(100);
// });

it("should show loading spinner on button click when logging in", async () => {
  const { loginButton, emailTextField, passwordTextField } = renderLogin();
  const { login } = useIdentityContext();
  const email = "nathanvale73@gmail.com";
  const password = "password";
  (login as jest.Mock<any, any>).mockReturnValue(
    new Promise((response) => setTimeout(response, 150))
  );
  fireEvent.change(emailTextField, { target: { value: email } });
  fireEvent.change(passwordTextField, { target: { value: password } });
  fireEvent.click(loginButton);
  await wait(100);
  const spinner = screen.getByRole("progressbar");
  expect(spinner).toBeInTheDocument();
  expect(loginButton).toBeDisabled();
  expect(login).toBeCalledWith({ email, password });
});

it.only("should redirect to previous route on successful login", async () => {
  const { loginButton, emailTextField, passwordTextField, history } =
    renderLogin();
  const state = { from: { pathname: "/previous-route" } };
  history.replace("/login", state);
  expect(history.location.pathname).toEqual("/login");
  const { login } = useIdentityContext();
  const email = "nathanvale73@gmail.com";
  const password = "password";
  (login as jest.Mock<any, any>).mockResolvedValue(undefined);
  fireEvent.change(emailTextField, { target: { value: email } });
  fireEvent.change(passwordTextField, { target: { value: password } });
  fireEvent.click(loginButton);
  await wait(200);
  expect(loginButton).toBeEnabled();
  expect(login).toBeCalledWith({ email, password });
  expect(history.location.pathname).toEqual(state.from.pathname);
});
