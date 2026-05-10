import React, { useEffect, useRef, useState } from "react";
import { MdAttachFile, MdSend } from "react-icons/md";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";
import SockJS from "sockjs-client";
import { baseURL } from "../config/axios";
import { Stomp } from "@stomp/stompjs";
import toast from "react-hot-toast";

const ChatPage = () => {
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const {
    roomId,
    setRoomId,
    currentUser,
    setCurrentUser,
    connected,
    SetConnected,
  } = useChatContext();

  useEffect(() => {
    if (!connected) {
      navigate("/");
    }
  }, [connected, currentUser, roomId]);

  const [messages, setMessages] = useState([
    {
      content: "Hello ?",
      sender: "Dhruvil",
    },
    {
      content: "Hello ?",
      sender: "Rahul",
    },
    {
      content: "Hello ?",
      sender: "Kin",
    },
    {
      content: "Hello ?",
      sender: "Dhruvil",
    },
  ]);
  const inputRef = useRef(null);
  const chatBoxRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    const connectWebSocket = () => {
      // SockJS
      const socket = new SockJS(`${baseURL}/chat`);

      // Make Client
      const client = Stomp.over(socket);

      client.connect({}, () => {
        setStompClient(client);

        toast.success("Connected");

        client.subscribe(`/topic/room/${roomId}`, (message) => {
          console.log(message);

          const newMessage = JSON.parse(message.body);

          setMessages([...prev, newMessage]);
        });
      });
    };

    connectWebSocket();
  }, [roomId]);

  const timeAgo = (timestamp) => {
    if (!timestamp) {
      return "now";
    }

    const diff = Math.floor((Date.now() - new Date(timestamp)) / 1000);

    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;

    return `${Math.floor(diff / 86400)}d ago`;
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage = {
      content: input,
      sender: currentUser,
      timeStamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-[#030712] text-gray-50 flex flex-col">
      {/* ── Header ── */}
      <header className="fixed top-0 w-full z-20 bg-[#0d1117] border-b border-white/[0.07] shadow-[0_1px_24px_rgba(0,0,0,0.4)]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Room */}
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.7)] animate-pulse" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              Room
            </span>
            <span className="text-sm font-bold text-slate-100 bg-indigo-500/10 border border-indigo-500/25 rounded-lg px-2.5 py-0.5">
              Family Room
            </span>
          </div>

          {/* User */}
          <div className="flex items-center gap-2.5">
            <img
              src="https://i.pravatar.cc/150"
              alt="avatar"
              className="w-7 h-7 rounded-lg object-cover ring-1 ring-indigo-500/30"
            />
            <span className="text-[13px] font-medium text-slate-400">
              Dhruvil Kapadiya
            </span>
          </div>

          {/* Leave */}
          <button className="text-red-400 text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 hover:border-red-500/40 transition-all duration-150 hover:-translate-y-px active:scale-95 px-4 py-2 rounded-xl cursor-pointer tracking-wide">
            Leave Room
          </button>
        </div>
      </header>

      {/* ── Messages ── */}
      <main
        ref={chatBoxRef}
        className="flex-1 pt-20 pb-24 px-4 overflow-y-auto max-w-4xl w-full mx-auto
          [&::-webkit-scrollbar]:w-[3px]
          [&::-webkit-scrollbar-thumb]:bg-white/[0.08]
          [&::-webkit-scrollbar-thumb]:rounded-full"
      >
        {/* Date chip */}
        <div className="flex justify-center mb-6">
          <span className="text-[10px] font-medium tracking-widest text-slate-700 bg-white/[0.03] border border-white/[0.06] rounded-full px-3.5 py-1 uppercase">
            Today
          </span>
        </div>

        {messages.map((message, index) => {
          const isSelf = message.sender === currentUser;
          const prevSender = index > 0 ? messages[index - 1].sender : null;
          const showMeta = prevSender !== message.sender;

          return (
            <div
              key={index}
              className={`flex items-end gap-2.5 mb-1 ${showMeta ? "mt-3" : "mt-0.5"} ${isSelf ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div className="w-8 min-w-[32px]">
                {showMeta && (
                  <img
                    src="https://avatar.iran.liara.run/public/43"
                    alt={message.sender}
                    className={`w-8 h-8 rounded-[9px] object-cover ring-1 ${
                      isSelf ? "ring-indigo-500/35" : "ring-orange-500/30"
                    }`}
                  />
                )}
              </div>

              {/* Bubble group */}
              <div
                className={`flex flex-col gap-1 max-w-sm ${isSelf ? "items-end" : "items-start"}`}
              >
                {showMeta && (
                  <span
                    className={`text-[10px] font-semibold tracking-wide px-1 ${isSelf ? "text-indigo-400" : "text-slate-500"}`}
                  >
                    {message.sender}
                  </span>
                )}

                <div
                  className={`px-4 py-2.5 text-[13.5px] leading-relaxed break-words
                    ${
                      isSelf
                        ? "bg-indigo-500/20 border border-indigo-500/30 text-indigo-100 rounded-[14px_14px_4px_14px]"
                        : "bg-gray-900 border border-white/[0.07] text-slate-300 rounded-[14px_14px_14px_4px]"
                    }`}
                >
                  {message.content}
                </div>

                <span className="text-[10px] text-slate-700 px-1">
                  {timeAgo(message.timeStamp)}
                </span>
              </div>
            </div>
          );
        })}
      </main>

      {/* ── Input bar ── */}
      <div className="fixed bottom-0 w-full bg-[#0d1117] border-t border-white/[0.07] py-3 px-4">
        <div className="max-w-4xl mx-auto flex items-center gap-2 bg-[#080d16] border border-white/[0.09] focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/[0.08] rounded-2xl px-4 py-1.5 transition-all duration-200">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-none outline-none text-slate-300 text-[13.5px] placeholder-slate-800 py-2"
          />

          {/* Attach */}
          <button
            aria-label="Attach file"
            className="text-slate-700 hover:text-indigo-400 transition-colors duration-150 p-2 rounded-xl hover:bg-indigo-500/10 cursor-pointer"
          >
            <MdAttachFile size={18} />
          </button>

          {/* Send */}
          <button
            aria-label="Send message"
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all duration-150 text-white text-[13px] font-semibold px-4 py-2.5 rounded-xl cursor-pointer shadow-[0_2px_12px_rgba(99,102,241,0.25)] hover:shadow-[0_4px_18px_rgba(99,102,241,0.4)]"
          >
            Send
            <MdSend size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
