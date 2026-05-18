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
  const { roomId, currentUser, connected, setConnected, token } =
    useChatContext();
  const navigate = useNavigate();

  const [messages, setMessages]             = useState([]);
  const [senderProfiles, setSenderProfiles] = useState({});
  const [inputMessage, setInputMessage]     = useState("");
  const [page, setPage]                     = useState(0);
  const [hasMore, setHasMore]               = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [isConnected, setIsConnected]       = useState(false);

  const stompClientRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesBoxRef = useRef(null);
  const inputRef       = useRef(null);

  // ── Guard ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!connected || !roomId) navigate("/join", { replace: true });
  }, [connected, roomId, navigate]);

  useEffect(() => {
    if (!roomId) return;
    loadMessages(0);
  }, [roomId]);

  // ── WebSocket ────────────────────────────────────────────────────────────
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

  // ── Scroll helpers ────────────────────────────────────────────────────────
  const scrollToBottom = useCallback((behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  // Scroll when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Re-scroll when the virtual keyboard opens / closes (VisualViewport API)
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const onResize = () => {
      // Small delay lets the browser finish repainting before we scroll
      setTimeout(() => scrollToBottom("instant"), 80);
    };

    vv.addEventListener("resize", onResize);
    return () => vv.removeEventListener("resize", onResize);
  }, [scrollToBottom]);

  // ── Fetch sender profile ─────────────────────────────────────────────────
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
          const data    = await res.json();
          const profile = { name: data.name, profilePhoto: data.profilePhoto };
          senderCache[email] = profile;
          setSenderProfiles((p) => ({ ...p, [email]: profile }));
        }
      } catch { /* silently fail */ }
    },
    [token],
  );

  // ── Load messages ────────────────────────────────────────────────────────
  const loadMessages = async (pageNum) => {
    if (loadingHistory) return;
    setLoadingHistory(true);
    try {
      const data = await getMessagesApi(roomId, 20, pageNum);
      if (data.length < 20) setHasMore(false);
      const uniqueSenders = [...new Set(data.map((m) => m.sender).filter(Boolean))];
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

  // ── Send ─────────────────────────────────────────────────────────────────
  const sendMessage = () => {
    const text = inputMessage.trim();
    if (!text || !stompClientRef.current?.connected) return;

    stompClientRef.current.publish({
      destination: `/app/sendMessage/${roomId}`,
      body: JSON.stringify({
        content: text,
        sender:  currentUser?.email ?? "anonymous",
        roomId,
      }),
    });
    setInputMessage("");
    inputRef.current?.focus();
    if (inputRef.current) inputRef.current.style.height = "auto";
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
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

  const isMine           = (msg)   => msg.sender === (currentUser?.email ?? "");
  const getSenderProfile = (email) => {
    if (email === currentUser?.email) return currentUser;
    return senderProfiles[email] || null;
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    /*
     * position:fixed + inset:0  →  always exactly the visible screen area.
     * This is the most reliable approach for mobile browsers because it is
     * unaffected by the browser chrome (address bar) showing / hiding, which
     * is what causes the "gap below the input" bug with height-based layouts.
     */
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        background: "#07090f",
        overflow: "hidden",
      }}
    >
      {/* ── Header ── */}
      <header
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
          paddingTop: "max(10px, env(safe-area-inset-top))",
          background: "#0e1521",
          borderBottom: "1px solid rgba(99,102,241,0.12)",
          zIndex: 10,
        }}
      >
        {/* Left: icon + room info */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          <div
            style={{
              width: 32, height: 32, borderRadius: 12, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(99,102,241,0.12)",
              border: "1px solid rgba(99,102,241,0.2)",
            }}
          >
            <svg viewBox="0 0 20 20" style={{ width: 16, height: 16 }} fill="none">
              <path
                d="M10 2C5.59 2 2 5.13 2 9c0 1.8.7 3.45 1.85 4.71L2 18l4.58-1.5C7.6 16.82 8.78 17 10 17c4.41 0 8-3.13 8-7s-3.59-8-8-8z"
                fill="#818cf8"
              />
            </svg>
          </div>

          <div style={{ minWidth: 0 }}>
            <p
              style={{
                fontSize: 13, fontWeight: 600, color: "#c7d2fe", margin: 0,
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}
            >
              Room:{" "}
              <span style={{ fontFamily: "monospace", color: "#818cf8" }}>{roomId}</span>
            </p>
            <p style={{ fontSize: 11, margin: "2px 0 0" }}>
              {isConnected
                ? <span style={{ color: "#34d399" }}>● Live</span>
                : <span style={{ color: "#6b7280" }}>● Connecting…</span>}
            </p>
          </div>
        </div>

        {/* Right: avatar + leave */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, marginLeft: 8 }}>
          <Avatar name={currentUser?.name} photoUrl={currentUser?.profilePhoto} size="md" />
          <button
            onClick={handleLeave}
            style={{
              fontSize: 12, padding: "6px 12px", borderRadius: 8,
              cursor: "pointer", color: "#4a5568",
              border: "1px solid #1e2a3a", background: "transparent",
            }}
          >
            Leave
          </button>
        </div>
      </header>

      {/* ── Messages — only this div scrolls ── */}
      <div
        ref={messagesBoxRef}
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: "16px 12px",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* Load earlier */}
        {hasMore && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <button
              onClick={loadMore}
              disabled={loadingHistory}
              style={{
                fontSize: 12, padding: "6px 16px", borderRadius: 999,
                cursor: "pointer", color: "#4a5568",
                border: "1px solid #1e2a3a", background: "transparent",
                opacity: loadingHistory ? 0.4 : 1,
              }}
            >
              {loadingHistory ? "Loading…" : "Load earlier messages"}
            </button>
          </div>
        )}

        {/* Empty state */}
        {messages.length === 0 && !loadingHistory && (
          <div
            style={{
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              height: 192, gap: 8,
            }}
          >
            <span style={{ fontSize: 32 }}>👋</span>
            <p style={{ fontSize: 14, color: "#2d3a52", margin: 0 }}>
              No messages yet. Say something!
            </p>
          </div>
        )}

        {/* Bubbles */}
        {messages.map((msg, i) => {
          const mine        = isMine(msg);
          const profile     = getSenderProfile(msg.sender);
          const displayName = profile?.name ?? msg.sender ?? "Unknown";
          const photoUrl    = profile?.profilePhoto ?? null;
          const prevMsg     = messages[i - 1];
          const showAvatar  = !prevMsg || prevMsg.sender !== msg.sender;

          return (
            <div
              key={msg.id}
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 8,
                justifyContent: mine ? "flex-end" : "flex-start",
                marginBottom: 12,
              }}
            >
              {/* Other avatar */}
              {!mine && (
                <div style={{ flexShrink: 0, width: 28 }}>
                  {showAvatar
                    ? <Avatar name={displayName} photoUrl={photoUrl} size="sm" />
                    : <div style={{ width: 28 }} />}
                </div>
              )}

              {/* Bubble column */}
              <div
                style={{
                  display: "flex", flexDirection: "column",
                  maxWidth: "78%",
                  alignItems: mine ? "flex-end" : "flex-start",
                }}
              >
                {!mine && showAvatar && (
                  <span
                    style={{
                      fontSize: 11, marginBottom: 3, paddingLeft: 4,
                      fontWeight: 500, color: "#4a5a75",
                    }}
                  >
                    {displayName}
                  </span>
                )}

                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: 18,
                    fontSize: 14,
                    lineHeight: 1.5,
                    wordBreak: "break-word",
                    ...(mine
                      ? {
                          background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                          color: "#fff",
                          borderBottomRightRadius: 4,
                          boxShadow: "0 2px 12px rgba(99,102,241,0.2)",
                        }
                      : {
                          background: "#131c2e",
                          color: "#c7d2fe",
                          borderBottomLeftRadius: 4,
                          border: "1px solid rgba(99,102,241,0.1)",
                        }),
                  }}
                >
                  {msg.content}
                </div>

                <span style={{ fontSize: 10, marginTop: 3, paddingLeft: 4, color: "#253047" }}>
                  {formatTime(msg.time)}
                </span>
              </div>

              {/* My avatar */}
              {mine && (
                <div style={{ flexShrink: 0, width: 28 }}>
                  {showAvatar
                    ? <Avatar name={currentUser?.name} photoUrl={currentUser?.profilePhoto} size="sm" />
                    : <div style={{ width: 28 }} />}
                </div>
              )}
            </div>
          );
        })}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input bar ── */}
      <div
        style={{
          flexShrink: 0,
          padding: "10px 12px",
          paddingBottom: "max(10px, env(safe-area-inset-bottom))",
          background: "#0e1521",
          borderTop: "1px solid rgba(99,102,241,0.10)",
          zIndex: 10,
        }}
      >
        <div
          onClick={focusInputBar}
          style={{
            display: "flex", alignItems: "flex-end", gap: 8,
            padding: "8px 12px", borderRadius: 20,
            background: "#0a0f1b",
            border: "1px solid rgba(99,102,241,0.15)",
            minHeight: 44,
            cursor: "text",
          }}
        >
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message…"
            rows={1}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              resize: "none",
              // 16px prevents iOS auto-zoom when textarea is focused
              fontSize: 16,
              lineHeight: "20px",
              maxHeight: 128,
              overflowY: "auto",
              padding: "2px 0",
              color: "#c7d2fe",
              caretColor: "#6366f1",
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim()}
            style={{
              flexShrink: 0, width: 36, height: 36,
              display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: 12, border: "none", cursor: "pointer",
              background: inputMessage.trim()
                ? "linear-gradient(135deg, #6366f1, #4f46e5)"
                : "#1a2540",
              boxShadow: inputMessage.trim()
                ? "0 2px 10px rgba(99,102,241,0.3)"
                : "none",
              transition: "all 0.15s",
            }}
          >
            <svg
              viewBox="0 0 20 20"
              style={{ width: 16, height: 16 }}
              fill="none"
              stroke="white"
              strokeWidth="2"
            >
              <path d="M3 10h14M10 3l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;