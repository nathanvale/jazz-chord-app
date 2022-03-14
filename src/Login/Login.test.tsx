import React from "react";
import { alertTitle, Login } from "./Login";
import { renderWithRouter, wait } from "../test-utils";
import { screen, fireEvent, within } from "@testing-library/react";
import { useIdentityContext } from "react-netlify-identity";

import * as hooks from "../hooks/useLocalStorage";

let mockIsLoggedIn = false;
let mockLocalKey = "localKey";
const mockLoginUser = jest.fn();
jest.mock("react-netlify-identity", () => ({
  __esModule: true, // this property makes it work
  useIdentityContext: () => ({
    isLoggedIn: mockIsLoggedIn,
    loginUser: mockLoginUser,
  }),
}));

const setLocalKeyMock = jest.fn();
(hooks as any).useLocalStorage = () => [mockLocalKey, setLocalKeyMock];

function renderLogin(state?: { from: { pathname: string } }) {
  const { history } = renderWithRouter(<Login />, { state, route: "login" });
  const loginButton = screen.getByRole("button", { name: /^Log In/i });
  const emailTextField = screen.getByRole("textbox", { name: /^Email/i });
  const passwordTextField = screen.getByLabelText(/^Password/i);

  async function useLoginUser(loginUser: any) {
    const email = "nathanvale73@gmail.com";
    const password = "password";
    fireEvent.change(emailTextField, { target: { value: email } });
    fireEvent.change(passwordTextField, { target: { value: password } });
    fireEvent.click(loginButton);
    await wait(10);
    return { email, password };
  }

  return {
    loginButton,
    emailTextField,
    passwordTextField,
    history,
    useLoginUser,
    setLocalKeyMock,
  };
}

it("renders Login component", () => {
  renderWithRouter(<Login />, { route: "login" });
});

it("should show require field errors on button click", async () => {
  const { loginButton } = renderLogin();
  expect(loginButton).toBeInTheDocument();
  fireEvent.click(loginButton);
  await wait(10);
  const emailError = screen.getByText(/Email required/i);
  const passwordError = screen.getByText(/Password required/i);
  expect(emailError).toBeInTheDocument();
  expect(passwordError).toBeInTheDocument();
});

it("should show email invalid error message", async () => {
  const { emailTextField, loginButton } = renderLogin();
  fireEvent.change(emailTextField, { target: { value: "shit email address" } });
  fireEvent.click(loginButton);
  await wait(10);
  let emailError = screen.getByText(/Invalid email address/i);
  expect(emailError).toBeInTheDocument();
  fireEvent.change(emailTextField, {
    target: { value: "nathanvale73@gmail.com" },
  });
  fireEvent.click(loginButton);
  await wait(10);
  expect(emailError).not.toBeInTheDocument();
});

it("should show loading spinner on button click when logging in", async () => {
  mockLoginUser.mockReturnValue(
    new Promise((response) => setTimeout(response, 300))
  );
  const { loginButton, useLoginUser, emailTextField, passwordTextField } =
    renderLogin();
  const { email, password } = await useLoginUser(mockLoginUser);
  const spinner = screen.getByRole("progressbar");
  expect(spinner).toBeInTheDocument();
  expect(loginButton).toBeDisabled();
  expect(emailTextField).toBeDisabled();
  expect(passwordTextField).toBeDisabled();
  expect(mockLoginUser).toBeCalledWith(email, password);
});

it("should redirect to previous route on successful login", async () => {
  const state = { from: { pathname: "/previous-route" } };
  const { loginButton, useLoginUser, history } = renderLogin(state);
  const { loginUser } = useIdentityContext();
  (loginUser as jest.Mock<any, any>).mockResolvedValue(undefined);
  mockIsLoggedIn = true;
  mockLocalKey = state.from.pathname;
  const { email, password } = await useLoginUser(loginUser);
  expect(loginButton).toBeEnabled();
  expect(loginUser).toBeCalledWith(email, password);
  expect(history.location.pathname).toEqual(state.from.pathname);
  mockIsLoggedIn = false;
});

it("should redirect to default route if no previous route on successful login", async () => {
  const { loginButton, history, useLoginUser } = renderLogin();
  const { loginUser } = useIdentityContext();
  (loginUser as jest.Mock<any, any>).mockResolvedValue(undefined);
  mockLocalKey = "/";
  mockIsLoggedIn = true;
  const { email, password } = await useLoginUser(loginUser);
  expect(loginButton).toBeEnabled();
  expect(loginUser).toBeCalledWith(email, password);
  expect(history.location.pathname).toEqual("/");
  mockIsLoggedIn = false;
});

it("should throw an error on unsuccessful login", async () => {
  const { useLoginUser } = renderLogin();
  const { loginUser } = useIdentityContext();
  const error = { message: "Some nasty error" };
  (loginUser as jest.Mock<any, any>).mockReturnValue(Promise.reject(error));
  await useLoginUser(loginUser);
  const alert = screen.getByRole("alert");
  expect(within(alert).getByText(alertTitle)).toBeInTheDocument();
  expect(within(alert).getByText(error.message)).toBeInTheDocument();
});

it("should be able to toggle show password", async () => {
  const { passwordTextField } = renderLogin();
  const link = screen.getByLabelText("Toggle password visibility");
  expect(link).toHaveTextContent(/show/i);
  expect(passwordTextField).toHaveAttribute("type", "password");
  fireEvent.mouseDown(link);
  expect(link).toHaveTextContent(/hide/i);
  expect(passwordTextField).toHaveAttribute("type", "text");
});
