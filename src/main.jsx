import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { BrowserRouter } from "react-router-dom";
import { TeacherProvider } from "./context/TeacherContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <TeacherProvider>
        <App />
      </TeacherProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
