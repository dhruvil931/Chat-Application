import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import toast from "react-hot-toast";
import useChatContext from "../context/ChatContext";
import { getMessagesApi } from "../services/RoomService";
import { baseURL } from "../config/axios";

const ChatPage = () => {
  const { roomId, currentUser, connected, setConnected, logout, token } =
    useChatContext();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const stompClientRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Redirect if not connected
  useEffect(() => {
    if (!connected || !roomId) {
      navigate("/join", { replace: true });
    }
  }, [connected, roomId, navigate]);

  // Load initial messages
  useEffect(() => {
    if (!roomId) return;
    loadMessages(0);
  }, [roomId]);

  // Connect WebSocket
  useEffect(() => {
    if (!roomId || !token) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(`${baseURL}/chat`),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/topic/room/${roomId}`, (message) => {
          const received = JSON.parse(message.body);
          setMessages((prev) => [...prev, received]);
        });
      },
      onStompError: (frame) => {
        toast.error("Connection error");
        console.error("STOMP error", frame);
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => client.deactivate();
  }, [roomId, token]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadMessages = async (pageNum) => {
    if (loadingHistory) return;
    setLoadingHistory(true);
    try {
      const data = await getMessagesApi(roomId, 20, pageNum);
      if (data.length < 20) setHasMore(false);
      if (pageNum === 0) {
        setMessages(data);
      } else {
        setMessages((prev) => [...data, ...prev]);
      }
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
    if (!text) return;

    if (!stompClientRef.current?.connected) {
      toast.error("Not connected to room");
      return;
    }

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

  const isMine = (msg) => msg.sender === (currentUser?.email ?? "anonymous");

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

  return (
    <div className="h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-3.5 bg-gray-900 border-b border-gray-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex items-center justify-center">
            <span className="text-sm">💬</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-white leading-none">
              Room: <span className="text-indigo-400 font-mono">{roomId}</span>
            </p>
            <p className="text-xs text-gray-600 mt-0.5">
              {stompClientRef.current?.connected ? (
                <span className="text-emerald-500">● Connected</span>
              ) : (
                <span className="text-gray-600">● Connecting…</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* User avatar */}
          {currentUser?.profilePhoto ? (
            <img
              src={currentUser.profilePhoto}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/30"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-xs font-bold">
              {currentUser?.name?.[0]?.toUpperCase() ?? "?"}
            </div>
          )}
          <button
            onClick={handleLeave}
            className="text-xs text-gray-600 hover:text-gray-400 px-3 py-1.5 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer"
          >
            Leave
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {/* Load more */}
        {hasMore && (
          <div className="flex justify-center">
            <button
              onClick={loadMore}
              disabled={loadingHistory}
              className="text-xs text-gray-600 hover:text-gray-400 px-4 py-1.5 rounded-full border border-gray-800 hover:border-gray-700 transition-colors disabled:opacity-40 cursor-pointer"
            >
              {loadingHistory ? "Loading…" : "Load earlier messages"}
            </button>
          </div>
        )}

        {messages.length === 0 && !loadingHistory && (
          <div className="flex flex-col items-center justify-center h-48 gap-2">
            <span className="text-3xl">👋</span>
            <p className="text-sm text-gray-600">
              No messages yet. Say something!
            </p>
          </div>
        )}

        {messages.map((msg, i) => {
          const mine = isMine(msg);
          return (
            <div
              key={i}
              className={`flex ${mine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[72%] ${
                  mine ? "items-end" : "items-start"
                } flex flex-col gap-1`}
              >
                {/* Sender name (only for others) */}
                {!mine && (
                  <span className="text-xs text-gray-600 px-1">
                    {msg.sender}
                  </span>
                )}
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed wrap-break-word ${
                    mine
                      ? "bg-indigo-600 text-white rounded-br-sm"
                      : "bg-gray-800 text-gray-200 rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                </div>
                <span className="text-[10px] text-gray-700 px-1">
                  {formatTime(msg.time)}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 px-4 py-3 bg-gray-900 border-t border-gray-800">
        <div className="flex items-end gap-3 bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 focus-within:border-indigo-500/40 focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all">
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message…"
            rows={1}
            className="flex-1 bg-transparent text-sm text-gray-300 placeholder-gray-700 outline-none resize-none max-h-32 overflow-y-auto"
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim()}
            className="shrink-0 w-8 h-8 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-800 disabled:text-gray-600 text-white rounded-lg transition-colors cursor-pointer disabled:cursor-default"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 rotate-45"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                d="M12 19V5M5 12l7-7 7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-gray-800 mt-1.5 text-center">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default ChatPage;
