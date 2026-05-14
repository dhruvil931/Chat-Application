import React from "react";
import { useNavigate } from "react-router";
import useChatContext from "../context/ChatContext";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const { token } = useChatContext();

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#818cf8 1px, transparent 1px), linear-gradient(90deg, #818cf8 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative text-center">
        <p className="text-8xl font-black text-indigo-500/20 leading-none select-none">
          404
        </p>
        <h1 className="text-2xl font-bold text-white mt-2 mb-2">
          Page not found
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          The page you're looking for doesn't exist.
        </p>
        <button
          onClick={() => navigate(token ? "/join" : "/", { replace: true })}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer"
        >
          {token ? "Back to Rooms" : "Back to Login"}
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
