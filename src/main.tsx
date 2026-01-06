import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { UserProvider } from "./context/user-provider.js";

import App from "./App.js";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </StrictMode>
);
