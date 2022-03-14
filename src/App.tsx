import React from "react";
import Protected from "./Protected";
import Public from "./Public";
import CssBaseline from "@material-ui/core/CssBaseline";

import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter,
} from "react-router-dom";

import {
  useIdentityContext,
  IdentityContextProvider,
} from "react-netlify-identity";
import { Login } from "./Login/Login";

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
              <Link to="/public">Public Page</Link>
            </li>
            <li>
              <Link to="/protected">Protected Page</Link>
            </li>
          </ul>
          <Route path="/public" component={Public} />
          <Route path="/login" component={Login} />
          <PrivateRoute path="/protected" component={Protected} />
        </div>
      </Router>
    </IdentityContextProvider>
  );
}

const AuthButton = withRouter(({ history }) => {
  const { isLoggedIn, logoutUser } = useIdentityContext();
  return isLoggedIn ? (
    <p>
      Welcome!{" "}
      <button
        onClick={() => {
          logoutUser().then((value) => history.push("/"));
        }}
      >
        Sign out
      </button>
    </p>
  ) : (
    <p>You are not logged in.</p>
  );
});

function PrivateRoute({ component: Component, ...rest }: any) {
  const { isLoggedIn } = useIdentityContext();
  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedIn ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
}

export default App;
