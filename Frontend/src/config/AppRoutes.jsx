import React from "react";
import { Routes, Route } from "react-router";
import App from "../App";
import ChatPage from "../components/ChatPage";
import LoginPage from "../pages/LoginPage";
import OAuthCallbackPage from "../pages/OAuthCallbackPage";
import ProtectedRoute from "./ProtectedRoute";
import JoinCreateChat from "../pages/JoinCreateChat";
import NotFoundPage from "../pages/NotFoundPage";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/oauth2/callback" element={<OAuthCallbackPage />} />
        <Route
          path="/join"
          element={
            <ProtectedRoute>
              <JoinCreateChat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
