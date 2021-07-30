"use strict";

export const loginUser = jest.fn();
export const IdentityContextProvider = ({ children }) => <div>{children}</div>;

export const useIdentityContext = () => ({
  loginUser,
});
