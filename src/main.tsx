import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
// eslint-disable-next-line import/no-unresolved
import { registerSW } from "virtual:pwa-register";
import App from "./App";

const updateSW = registerSW({
  onNeedRefresh() {},
  onOfflineReady() {},
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// eslint-disable-next-line import/prefer-default-export
export { updateSW };
