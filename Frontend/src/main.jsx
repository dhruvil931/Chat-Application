import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router";
import AppRoutes from "./config/AppRoutes.jsx";
import toast, { Toaster } from "react-hot-toast";
import { ChatProvider } from "./context/ChatContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1f2937",
            color: "#f9fafb",
            border: "1px solid #374151",
            fontSize: "14px",
          },
        }}
      />
      <ChatProvider>
        <AppRoutes />
      </ChatProvider>
    </BrowserRouter>
  </StrictMode>,
);
