import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./components";
import { AuthContextProvider } from "./context/AuthContext";
import { ChatContextProvider } from "./context/ChatContext";
import "./styles/styles.css";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <AuthContextProvider>
    <ChatContextProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </ChatContextProvider>
  </AuthContextProvider>
);
