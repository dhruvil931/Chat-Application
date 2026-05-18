import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useChatContext from "../context/ChatContext";
import { baseURL } from "../config/axios";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none">
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
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="#fff">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const ArrowIcon = ({ color = "currentColor" }) => (
  <svg
    viewBox="0 0 16 16"
    className="w-4 h-4 opacity-40 group-hover:opacity-70 transition-opacity"
    fill="none"
    stroke={color}
    strokeWidth="2"
  >
    <path
      d="M3 8h10M9 4l4 4-4 4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function LoginPage() {
  const { token } = useChatContext();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (token) navigate("/join", { replace: true });
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, [token, navigate]);

  const [waking, setWaking] = useState(null);
  const [loginError, setLoginError] = useState(null);

  const handleLogin = async (provider) => {
    setWaking(provider);
    setLoginError(null);
    try {
      await fetch(`${baseURL}/health`, {
        signal: AbortSignal.timeout(60000),
      });
    } catch (e) {
      // backend didn't respond, try OAuth anyway
      setWaking(false);
      setLoginError("Server is unavailable. Please try again in a moment.");
      return;
    }
    window.location.href = `${baseURL}/oauth2/authorization/${provider}`;
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 overflow-hidden relative"
      style={{ background: "#07090f" }}
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #6366f1 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />
      {/* Radial vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 10%, #07090f 100%)",
        }}
      />
      {/* Top indigo bloom */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[400px] blur-[100px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(99,102,241,0.18) 0%, transparent 70%)",
        }}
      />
      {/* Bottom blue accent */}
      <div
        className="absolute -bottom-20 -left-20 w-80 h-80 blur-[80px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 70%)",
        }}
      />

      {/* Card */}
      <div
        className="relative w-full max-w-[390px] transition-all duration-700"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(18px)",
        }}
      >
        {/* Gradient border ring */}
        <div
          className="absolute -inset-px rounded-[26px]"
          style={{
            background:
              "linear-gradient(135deg, rgba(99,102,241,0.55), rgba(99,102,241,0.05) 50%, rgba(59,130,246,0.3))",
          }}
        />

        <div
          className="relative rounded-[25px] overflow-hidden"
          style={{
            background: "linear-gradient(160deg, #0e1521 0%, #0a0f1b 100%)",
          }}
        >
          {/* Top edge shine */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent 5%, rgba(129,140,248,0.55) 50%, transparent 95%)",
            }}
          />

          <div className="px-8 pt-9 pb-8">
            {/* Icon + heading */}
            <div className="flex flex-col items-center mb-9">
              {/* App icon */}
              <div className="relative mb-6">
                <div
                  className="w-[68px] h-[68px] rounded-[20px] flex items-center justify-center"
                  style={{
                    background: "linear-gradient(145deg, #1a2540, #111827)",
                    boxShadow:
                      "0 0 0 1px rgba(99,102,241,0.3), 0 12px 40px rgba(99,102,241,0.18)",
                  }}
                >
                  <svg viewBox="0 0 44 44" className="w-8 h-8" fill="none">
                    <path
                      d="M22 4C12.611 4 5 11.163 5 20c0 3.75 1.322 7.2 3.52 9.93L5 39l9.8-3.24A17.7 17.7 0 0022 36c9.389 0 17-7.163 17-16S31.389 4 22 4z"
                      fill="url(#iconGrad)"
                    />
                    <path
                      d="M14 18.5h16M14 24h10"
                      stroke="white"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient
                        id="iconGrad"
                        x1="5"
                        y1="4"
                        x2="39"
                        y2="39"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#a5b4fc" />
                        <stop offset="1" stopColor="#6366f1" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                {/* Sparkle dot */}
                <div
                  className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                  style={{
                    background: "#818cf8",
                    boxShadow: "0 0 10px 3px rgba(129,140,248,0.7)",
                  }}
                />
              </div>

              <h1
                className="text-2xl font-bold tracking-tight text-center leading-tight"
                style={{
                  color: "#eef2ff",
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  letterSpacing: "-0.025em",
                }}
              >
                Welcome to{" "}
                <span
                  style={{
                    background: "linear-gradient(90deg, #818cf8, #6366f1)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  ChatRooms
                </span>
              </h1>
              <p className="text-sm mt-2" style={{ color: "#374562" }}>
                Sign in to join or create rooms
              </p>
            </div>

            {/* Section label */}
            <div className="flex items-center gap-3 mb-5">
              <div
                className="flex-1 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(99,102,241,0.18))",
                }}
              />
              <span
                className="text-[10.5px] uppercase tracking-[0.14em] font-medium"
                style={{ color: "#253047" }}
              >
                choose provider
              </span>
              <div
                className="flex-1 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(99,102,241,0.18), transparent)",
                }}
              />
            </div>

            {/* Error message */}
            {loginError && (
              <div
                className="mb-4 px-4 py-3 rounded-xl text-center text-sm"
                style={{
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  color: "#f87171",
                }}
              >
                ⚠️ {loginError}
              </div>
            )}

            {/* ── Google Button ── */}
            <button
              onClick={() => handleLogin("google")}
              disabled={waking !== null}
              onMouseEnter={() => setHovered("google")}
              onMouseLeave={() => setHovered(null)}
              className="w-full flex items-center gap-4 px-5 py-[14px] rounded-2xl mb-3 transition-all duration-200 cursor-pointer group"
              style={{
                background: "#ffffff",
                boxShadow:
                  hovered === "google"
                    ? "0 0 0 2.5px rgba(66,133,244,0.45), 0 8px 28px rgba(66,133,244,0.14)"
                    : "0 0 0 1px rgba(0,0,0,0.07), 0 2px 10px rgba(0,0,0,0.07)",
                transform:
                  hovered === "google" ? "translateY(-2px)" : "translateY(0)",
              }}
            >
              {/* Google logo pill — white bg so all 4 colors are vivid */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: "#f8f9fa",
                  border: "1px solid rgba(0,0,0,0.07)",
                }}
              >
                <GoogleIcon />
              </div>
              <span
                className="flex-1 text-left font-semibold text-[14.5px]"
                style={{
                  color: "#1f2937",
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                }}
              >
                {waking === "google" ? "Connecting..." : "Continue with Google"}
              </span>
              <ArrowIcon color="#374151" />
            </button>

            {/* ── Facebook Button ── */}
            <button
              onClick={() => handleLogin("facebook")}
              disabled={waking !== null}
              onMouseEnter={() => setHovered("facebook")}
              onMouseLeave={() => setHovered(null)}
              className="w-full flex items-center gap-4 px-5 py-[14px] rounded-2xl transition-all duration-200 cursor-pointer group"
              style={{
                background:
                  hovered === "facebook"
                    ? "linear-gradient(135deg, #1a7af0 0%, #1460c8 100%)"
                    : "linear-gradient(135deg, #1877F2 0%, #1562d4 100%)",
                boxShadow:
                  hovered === "facebook"
                    ? "0 0 0 2.5px rgba(24,119,242,0.5), 0 8px 28px rgba(24,119,242,0.30)"
                    : "0 2px 10px rgba(24,119,242,0.22)",
                transform:
                  hovered === "facebook" ? "translateY(-2px)" : "translateY(0)",
              }}
            >
              {/* Facebook logo pill — semi-transparent so white 'f' is clear on blue */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: "rgba(255,255,255,0.18)",
                  border: "1px solid rgba(255,255,255,0.22)",
                }}
              >
                <FacebookIcon />
              </div>
              <span
                className="flex-1 text-left font-semibold text-[14.5px] text-white"
                style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
              >
                {waking === "facebook" ? "Connecting..." : "Continue with Facebook"}
              </span>
              <ArrowIcon color="white" />
            </button>

            {/* Footer */}
            <p
              className="text-[11.5px] text-center mt-7 leading-relaxed"
              style={{ color: "#253047" }}
            >
              By signing in you agree to our{" "}
              <span
                className="cursor-pointer transition-colors underline underline-offset-2 hover:text-indigo-400"
                style={{ color: "#344869" }}
                onClick={() => navigate("/privacy-policy")}
              >
                Terms
              </span>{" "}
              and{" "}
              <span
                className="cursor-pointer transition-colors underline underline-offset-2 hover:text-indigo-400"
                style={{ color: "#344869" }}
                onClick={() => navigate("/privacy-policy")}
              >
                Privacy Policy
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
