import React from "react";
import Protected from "./Protected";
import Public from "./Public";
import CssBaseline from "@material-ui/core/CssBaseline";

import {
  BrowserRouter as Router,
  Route,
  Link,
  useNavigate,
  Routes,
  Navigate,
} from "react-router-dom";

import {
  useIdentityContext,
  IdentityContextProvider,
} from "react-netlify-identity";
import { Login } from "./Login/Login";

export type PrivateRouteProps = {
  isAuthenticated: boolean;
  authenticationPath: string;
  outlet: JSX.Element;
};

const defaultProtectedRouteProps: Omit<PrivateRouteProps, "outlet"> = {
  isAuthenticated: false,
  authenticationPath: "/login",
};

function PrivateRoute({
  isAuthenticated,
  authenticationPath,
  outlet,
}: PrivateRouteProps) {
  if (isAuthenticated) {
    return outlet;
  } else {
    return <Navigate to={{ pathname: authenticationPath }} />;
  }
}

function App() {
  const url = "https://www.nathanvale.com";
  return (
    <IdentityContextProvider url={url}>
      <Router>
        <CssBaseline />
        <div>
          <AuthButton />
          <ul>
            <li>
              <Link to="/">Home Page</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </div>
        <Routes>
          <Route path="/" element={<Public />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/protected"
            element={
              <PrivateRoute
                {...defaultProtectedRouteProps}
                outlet={<Protected />}
              ></PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </IdentityContextProvider>
  );
}

const AuthButton = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logoutUser } = useIdentityContext();
  return isLoggedIn ? (
    <p>
      Welcome!{" "}
      <button
        onClick={() => {
          logoutUser().then((value) => navigate("/"));
        }}
      >
        Sign out
      </button>
    </p>
  ) : (
    <p>You are not logged in.</p>
  );
};

export default App;
