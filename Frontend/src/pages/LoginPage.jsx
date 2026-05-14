import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import useChatContext from "../context/ChatContext";
import { baseURL } from "../config/axios";

const providers = [
  {
    id: "google",
    label: "Continue with Google",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
    ),
    bg: "bg-white hover:bg-gray-50",
    text: "text-gray-800",
    border: "border border-gray-200",
  },
  {
    id: "facebook",
    label: "Continue with Facebook",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#1877F2">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    bg: "bg-[#1877F2] hover:bg-[#166fe5]",
    text: "text-white",
    border: "",
  },
  {
    id: "microsoft",
    label: "Continue with Microsoft",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5">
        <rect x="1" y="1" width="10" height="10" fill="#F25022" />
        <rect x="13" y="1" width="10" height="10" fill="#7FBA00" />
        <rect x="1" y="13" width="10" height="10" fill="#00A4EF" />
        <rect x="13" y="13" width="10" height="10" fill="#FFB900" />
      </svg>
    ),
    bg: "bg-[#2f2f2f] hover:bg-[#3a3a3a]",
    text: "text-white",
    border: "border border-[#444]",
  },
  {
    id: "linkedin",
    label: "Continue with LinkedIn",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#0A66C2">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    bg: "bg-[#0A66C2] hover:bg-[#094fa3]",
    text: "text-white",
    border: "",
  },
];

const LoginPage = () => {
  const { token } = useChatContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) navigate("/join", { replace: true });
  }, [token, navigate]);

  const handleOAuthLogin = (providerId) => {
    window.location.href = `${baseURL}/oauth2/authorization/${providerId}`;
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#818cf8 1px, transparent 1px), linear-gradient(90deg, #818cf8 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative w-full max-w-sm">
        {/* Glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-600 opacity-10 rounded-full blur-3xl pointer-events-none" />

        {/* Card */}
        <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
          {/* Logo area */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-2xl">💬</span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Welcome to ChatRooms
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Sign in to join or create rooms
            </p>
          </div>

          {/* Provider buttons */}
          <div className="space-y-3">
            {providers.map((p) => (
              <button
                key={p.id}
                onClick={() => handleOAuthLogin(p.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 active:scale-[0.98] cursor-pointer ${p.bg} ${p.text} ${p.border}`}
              >
                <span className="shrink-0">{p.icon}</span>
                <span className="flex-1 text-left">{p.label}</span>
              </button>
            ))}
          </div>

          <p className="text-xs text-gray-600 text-center mt-6 leading-relaxed">
            By signing in you agree to our{" "}
            <span className="text-gray-500 cursor-pointer hover:text-gray-400 underline underline-offset-2">
              Terms
            </span>{" "}
            and{" "}
            <span className="text-gray-500 cursor-pointer hover:text-gray-400 underline underline-offset-2">
              Privacy Policy
            </span>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
