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
  IdentityContextProvider,
  useIdentityContext,
} from "react-netlify-identity";
import { Login } from "./Login";

function App() {
  const url = "https://www.nathanvale.com/";
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

function PrivateRoute({ component: Component, ...rest }) {
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

// import { KeyboardController } from "./KeyboardController/KeyboardController";

// export default function App() {
//   return (
//     <>
//       <CssBaseline />
//       <KeyboardController></KeyboardController>
//     </>
//   );
// }

// api: e {apiURL: "http://www.nathanvale.com/.netlify/identity", _sameOrigin: true, defaultHeaders: {…}}
// app_metadata: {provider: "email"}
// aud: ""
// audience: undefined
// confirmation_sent_at: "2021-07-27T04:58:54Z"
// confirmed_at: "2021-07-27T05:01:18Z"
// created_at: "2021-07-23T03:13:36Z"
// email: "nathanvale73@gmail.com"
// id: "976950b3-6728-43b9-9d31-0c3c23c1273a"
// role: ""
// token: {access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2M…UifX0.ok_2IUYwsliUGebuEIq8wkDWUOFutvbG962FvgQewOc", token_type: "bearer", expires_in: 3600, refresh_token: "PE__Ou-TMp_Beg7i19YCDA", expires_at: 1627368296000}
// updated_at: "2021-07-23T03:13:36Z"
// url: "http://www.nathanvale.com/.netlify/identity"
// user_metadata: {full_name: "Nathan Vale"}
// admin: (...)
// _details: (...)
// __proto__: Object
