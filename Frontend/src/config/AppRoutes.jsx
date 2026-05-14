import React from "react";
import { Routes, Route } from "react-router";
import App from "../App";
import ChatPage from "../components/ChatPage";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/oauth2/callback" element={<ChatPage />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
