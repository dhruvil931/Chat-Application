import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import useChatContext from "../context/ChatContext";

/**
 * Backend should redirect to: http://localhost:5173/oauth2/callback?token=<JWT>
 * after a successful OAuth2 login (configure this in OAuth2SuccessHandler.java).
 *
 * In OAuth2SuccessHandler.java, instead of writing JSON to the response, do:
 *   String redirectUrl = "http://localhost:5173/oauth2/callback?token=" + jwt;
 *   response.sendRedirect(redirectUrl);
 */
const OAuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const { setToken } = useChatContext();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      setToken(token);
      navigate("/join", { replace: true });
    } else {
      setError("Authentication failed. No token received.");
    }
  }, [searchParams, setToken, navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="bg-gray-900 border border-red-900/50 rounded-2xl p-8 max-w-sm w-full text-center">
          <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-xl">⚠️</span>
          </div>
          <h2 className="text-white font-semibold mb-2">Login Failed</h2>
          <p className="text-gray-500 text-sm mb-6">{error}</p>
          <button
            onClick={() => navigate("/", { replace: true })}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="w-10 h-10 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Signing you in…</p>
      </div>
    </div>
  );
};

export default OAuthCallbackPage;