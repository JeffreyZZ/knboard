/* istanbul ignore file */
import React from "react";
import ReactDOM from "react-dom";
import "react-markdown-editor-lite/lib/index.css";
import "./index.css";
import App from "./App";
import "./i18n"; // Localization

ReactDOM.render(<App />, document.getElementById("root"));
