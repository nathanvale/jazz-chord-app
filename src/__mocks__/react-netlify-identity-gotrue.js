"use strict";

export const login = jest.fn();

export const useIdentityContext = () => ({
  login,
});

const NetlifyIdentityContext = ({ children }) => <div>{children}</div>;

export default NetlifyIdentityContext;
