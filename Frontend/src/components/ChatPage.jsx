import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import toast from "react-hot-toast";
import useChatContext from "../context/ChatContext";
import { getMessagesApi } from "../services/RoomService";
import { baseURL } from "../config/axios";

// Cache of sender email → { name, profilePhoto } fetched from API
const senderCache = {};

// Avatar component — shows photo if available, else initials
const Avatar = ({ name, photoUrl, size = "sm" }) => {
  const dim = size === "sm" ? "w-7 h-7 text-xs" : "w-9 h-9 text-sm";
  const initial = name ? name[0].toUpperCase() : "?";

  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={name}
        className={`${dim} rounded-full object-cover shrink-0 ring-1 ring-white/10`}
        onError={(e) => {
          e.target.style.display = "none";
        }}
      />
    );
  }

  return (
    <div
      className={`${dim} rounded-full shrink-0 flex items-center justify-center font-bold`}
      style={{
        background: "linear-gradient(135deg, #6366f1, #4f46e5)",
        color: "#fff",
      }}
    >
      {initial}
    </div>
  );
};

const formatTime = (isoTime) => {
  if (!isoTime) return "";
  try {
    return new Date(isoTime).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
};

const ChatPage = () => {
  const { roomId, currentUser, connected, setConnected, logout, token } =
    useChatContext();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [senderProfiles, setSenderProfiles] = useState({});
  const [inputMessage, setInputMessage] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const stompClientRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!connected || !roomId) navigate("/join", { replace: true });
  }, [connected, roomId, navigate]);

  useEffect(() => {
    if (!roomId) return;
    loadMessages(0);
  }, [roomId]);

  useEffect(() => {
    if (!roomId || !token) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(`${baseURL}/chat`),
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      onConnect: () => {
        setIsConnected(true);
        client.subscribe(`/topic/room/${roomId}`, (msg) => {
          const received = JSON.parse(msg.body);
          setMessages((prev) => [...prev, received]);
          if (received.sender && !senderCache[received.sender]) {
            fetchSenderProfile(received.sender);
          }
        });
      },
      onDisconnect: () => setIsConnected(false),
      onStompError: () => {
        toast.error("Connection error");
        setIsConnected(false);
      },
    });

    client.activate();
    stompClientRef.current = client;
    return () => client.deactivate();
  }, [roomId, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchSenderProfile = useCallback(
    async (email) => {
      if (senderCache[email]) {
        setSenderProfiles((p) => ({ ...p, [email]: senderCache[email] }));
        return;
      }
      try {
        const res = await fetch(
          `${baseURL}/api/v1/users/by-email?email=${encodeURIComponent(email)}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (res.ok) {
          const data = await res.json();
          const profile = { name: data.name, profilePhoto: data.profilePhoto };
          senderCache[email] = profile;
          setSenderProfiles((p) => ({ ...p, [email]: profile }));
        }
      } catch {
        /* silently fail */
      }
    },
    [token],
  );

  const loadMessages = async (pageNum) => {
    if (loadingHistory) return;
    setLoadingHistory(true);
    try {
      const data = await getMessagesApi(roomId, 20, pageNum);
      if (data.length < 20) setHasMore(false);
      const uniqueSenders = [
        ...new Set(data.map((m) => m.sender).filter(Boolean)),
      ];
      uniqueSenders.forEach(fetchSenderProfile);
      setMessages((prev) => (pageNum === 0 ? data : [...data, ...prev]));
    } catch {
      toast.error("Failed to load messages");
    } finally {
      setLoadingHistory(false);
    }
  };

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    loadMessages(next);
  };

  const sendMessage = () => {
    const text = inputMessage.trim();
    if (!text || !stompClientRef.current?.connected) return;

    stompClientRef.current.publish({
      destination: `/app/sendMessage/${roomId}`,
      body: JSON.stringify({
        content: text,
        sender: currentUser?.email ?? "anonymous",
        roomId,
      }),
    });
    setInputMessage("");
    inputRef.current?.focus();
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setInputMessage(value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 128)}px`;
  };

  const focusInputBar = (e) => {
    if (e.target.closest("button")) return;
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleLeave = () => {
    stompClientRef.current?.deactivate();
    setConnected(false);
    navigate("/join");
  };

  const isMine = (msg) => msg.sender === (currentUser?.email ?? "");

  const getSenderProfile = (email) => {
    if (email === currentUser?.email) return currentUser;
    return senderProfiles[email] || null;
  };

  return (
    /*
     * Full-screen flex column.
     * On mobile browsers the viewport height can shift when the virtual
     * keyboard opens; using 100dvh (dynamic viewport height) keeps the
     * layout correct.  We fall back to 100vh for older browsers.
     */
    <div
      className="flex flex-col"
      style={{
        background: "#07090f",
        height: "100dvh" /* dynamic viewport — shrinks when keyboard opens */,
        /* iOS safe-area support */
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {/* ── Header — sticky to top ── */}
      <header
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{
          background: "#0e1521",
          borderBottom: "1px solid rgba(99,102,241,0.12)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* Chat bubble icon */}
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: "rgba(99,102,241,0.12)",
              border: "1px solid rgba(99,102,241,0.2)",
            }}
          >
            <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none">
              <path
                d="M10 2C5.59 2 2 5.13 2 9c0 1.8.7 3.45 1.85 4.71L2 18l4.58-1.5C7.6 16.82 8.78 17 10 17c4.41 0 8-3.13 8-7s-3.59-8-8-8z"
                fill="#818cf8"
              />
            </svg>
          </div>

          {/* Room info — truncate on small screens */}
          <div className="min-w-0">
            <p
              className="text-sm font-semibold leading-none truncate"
              style={{ color: "#c7d2fe" }}
            >
              Room:{" "}
              <span className="font-mono text-indigo-400 truncate">
                {roomId}
              </span>
            </p>
            <p className="text-xs mt-0.5">
              {isConnected ? (
                <span style={{ color: "#34d399" }}>● Live</span>
              ) : (
                <span style={{ color: "#6b7280" }}>● Connecting…</span>
              )}
            </p>
          </div>
        </div>

        {/* Right side — avatar + leave button */}
        <div className="flex items-center gap-2 shrink-0 ml-2">
          <Avatar
            name={currentUser?.name}
            photoUrl={currentUser?.profilePhoto}
            size="md"
          />
          <button
            onClick={handleLeave}
            className="text-xs px-3 py-2 rounded-lg transition-colors cursor-pointer"
            style={{
              color: "#4a5568",
              border: "1px solid #1e2a3a",
              /* slightly larger tap target on mobile */
              minWidth: "52px",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#9ca3af")}
            onMouseLeave={(e) => (e.target.style.color = "#4a5568")}
          >
            Leave
          </button>
        </div>
      </header>

      {/* ── Messages — scrollable middle section ── */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        {hasMore && (
          <div className="flex justify-center">
            <button
              onClick={loadMore}
              disabled={loadingHistory}
              className="text-xs px-4 py-2 rounded-full transition-colors disabled:opacity-40 cursor-pointer"
              style={{ color: "#4a5568", border: "1px solid #1e2a3a" }}
            >
              {loadingHistory ? "Loading…" : "Load earlier messages"}
            </button>
          </div>
        )}

        {messages.length === 0 && !loadingHistory && (
          <div className="flex flex-col items-center justify-center h-48 gap-2">
            <span className="text-3xl">👋</span>
            <p className="text-sm" style={{ color: "#2d3a52" }}>
              No messages yet. Say something!
            </p>
          </div>
        )}

        {messages.map((msg, i) => {
          const mine = isMine(msg);
          const profile = getSenderProfile(msg.sender);
          const displayName = profile?.name ?? msg.sender ?? "Unknown";
          const photoUrl = profile?.profilePhoto ?? null;

          const prevMsg = messages[i - 1];
          const showAvatar = !prevMsg || prevMsg.sender !== msg.sender;

          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${mine ? "justify-end" : "justify-start"}`}
            >
              {/* Other's avatar — left */}
              {!mine && (
                <div className="shrink-0 w-7">
                  {showAvatar ? (
                    <Avatar name={displayName} photoUrl={photoUrl} size="sm" />
                  ) : (
                    <div className="w-7" />
                  )}
                </div>
              )}

              {/*
               * Bubble column.
               * max-w-[80%] on mobile, 68% on sm+ so bubbles don't crowd
               * the screen on narrow devices.
               */}
              <div
                className={`flex flex-col max-w-[80%] sm:max-w-[68%] ${
                  mine ? "items-end" : "items-start"
                }`}
              >
                {!mine && showAvatar && (
                  <span
                    className="text-[11px] mb-1 px-1 font-medium"
                    style={{ color: "#4a5a75" }}
                  >
                    {displayName}
                  </span>
                )}

                <div
                  className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words"
                  style={
                    mine
                      ? {
                          background:
                            "linear-gradient(135deg, #6366f1, #4f46e5)",
                          color: "#fff",
                          borderBottomRightRadius: "4px",
                          boxShadow: "0 2px 12px rgba(99,102,241,0.2)",
                        }
                      : {
                          background: "#131c2e",
                          color: "#c7d2fe",
                          borderBottomLeftRadius: "4px",
                          border: "1px solid rgba(99,102,241,0.1)",
                        }
                  }
                >
                  {msg.content}
                </div>

                <span
                  className="text-[10px] mt-1 px-1"
                  style={{ color: "#253047" }}
                >
                  {formatTime(msg.time)}
                </span>
              </div>

              {/* My avatar — right */}
              {mine && (
                <div className="shrink-0 w-7">
                  {showAvatar ? (
                    <Avatar
                      name={currentUser?.name}
                      photoUrl={currentUser?.profilePhoto}
                      size="sm"
                    />
                  ) : (
                    <div className="w-7" />
                  )}
                </div>
              )}
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input bar — sticky to bottom ── */}
      <div
        className="shrink-0 px-3 py-3"
        style={{
          background: "#0e1521",
          borderTop: "1px solid rgba(99,102,241,0.10)",
          position: "sticky",
          bottom: 0,
          zIndex: 10,
        }}
      >
        <div
          className="flex items-end gap-2 px-3 py-2 rounded-2xl transition-all cursor-text"
          onClick={focusInputBar}
          style={{
            background: "#0a0f1b",
            border: "1px solid rgba(99,102,241,0.15)",
            minHeight: "48px",
          }}
        >
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message…"
            rows={1}
            className="flex-1 bg-transparent text-sm outline-none resize-none max-h-32 overflow-y-auto leading-5 py-1"
            style={{ color: "#c7d2fe", caretColor: "#6366f1" }}
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim()}
            className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl transition-all cursor-pointer disabled:cursor-default"
            style={{
              background: inputMessage.trim()
                ? "linear-gradient(135deg, #6366f1, #4f46e5)"
                : "#1a2540",
              boxShadow: inputMessage.trim()
                ? "0 2px 10px rgba(99,102,241,0.3)"
                : "none",
            }}
          >
            <svg
              viewBox="0 0 20 20"
              className="w-4 h-4"
              fill="none"
              stroke="white"
              strokeWidth="2"
            >
              <path
                d="M3 10h14M10 3l7 7-7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Hint — hidden on very small screens to save space */}
        <p
          className="hidden sm:block text-[10px] text-center mt-1.5"
          style={{ color: "#1a2540" }}
        >
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default ChatPage;
