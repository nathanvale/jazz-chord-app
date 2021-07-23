import { StrictMode } from "react";
import ReactDOM from "react-dom";
import netlifyIdentity from "netlify-identity-widget";

import App from "./App";

(window as any).netlifyIdentity = netlifyIdentity;
// You must run this once before trying to interact with the widget
netlifyIdentity.init();

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  rootElement
);
