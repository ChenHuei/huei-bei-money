import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
// eslint-disable-next-line import/no-unresolved
import { registerSW } from "virtual:pwa-register";
import App from "./App";

// eslint-disable-next-line no-unused-vars
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
