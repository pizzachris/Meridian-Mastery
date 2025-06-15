import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// SERVICE WORKER COMPLETELY DISABLED FOR DEVELOPMENT
// Will be re-enabled for production builds only

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
