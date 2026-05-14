import React, { useState } from "react";
import toast from "react-hot-toast";
import { createRoomApi, joinChatApi } from "../services/RoomService";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";

const JoinCreateChat = () => {
  const [detail, setDetail] = useState({
    roomId: "",
    userName: "",
  });

  const navigate = useNavigate();

  const {
    roomId,
    setRoomId,
    currentUser,
    setCurrentUser,
    connected,
    SetConnected,
  } = useChatContext();

  const handleFormInputChange = (event) => {
    setDetail({
      ...detail,
      [event.target.name]: event.target.value,
    });
  };

  const validateForm = () => {
    if (detail.roomId === "" || detail.userName === "") {
      toast.error("Invalid Input!!");
      return false;
    }
    return true;
  };

  const joinRoom = async () => {
    if (validateForm()) {
      // Join chat
      try { 
        const room = await joinChatApi(detail.roomId);
        toast.success("Joined...");
        setCurrentUser(detail.userName);
        setRoomId(room.roomId);
        SetConnected(true);
        navigate("/chat");
      } catch (error) {
        if (error.response?.status === 404) {
          toast.error("Room not found");
        } else {
          toast.error("Something went wrong");
        }
      }
    }
  };

  const createRoom = async () => {
    if (validateForm()) {
      // Create Room
      try {
        const response = await createRoomApi(detail);
        toast.success("Room created successfully");
        setCurrentUser(detail.userName);
        setRoomId(detail.roomId);
        SetConnected(true);
        navigate("/chat");
      } catch (error) {
        if (error.status == 400) {
          toast.error("Room already exist!!");
        } else {
          toast.error("Something went wrong");
        }
      }
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-50 p-8"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div
        className="relative w-full max-w-md rounded-2xl p-10 overflow-hidden"
        style={{
          background: "#0d1117",
          border: "0.5px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Ambient glows */}
        <div
          className="absolute -top-16 -right-16 w-52 h-52 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(99,102,241,0.13) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(249,115,22,0.09) 0%, transparent 70%)",
          }}
        />

        {/* Header */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
          style={{
            background: "rgba(99,102,241,0.15)",
            border: "0.5px solid rgba(99,102,241,0.3)",
          }}
        >
          <span style={{ fontSize: 21, color: "#818cf8" }}>💬</span>
        </div>
        <h1
          className="text-2xl font-bold text-slate-100 mb-1"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Chat Rooms
        </h1>
        <p className="text-sm text-slate-500 font-light mb-8">
          Join an existing room or spin up a new one
        </p>

        {/* Name field */}
        <div className="mb-4">
          <label className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-slate-500 mb-2">
            Your name
          </label>
          <input
            type="text"
            onChange={handleFormInputChange}
            value={detail.userName}
            name="userName"
            placeholder="e.g. Alex Chen"
            autoComplete="off"
            className="w-full px-4 py-3 rounded-xl text-sm text-slate-300 placeholder-slate-800 outline-none transition-all"
            style={{
              background: "#080d16",
              border: "1px solid rgba(255,255,255,0.07)",
              fontSize: "14.5px",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "rgba(99,102,241,0.55)";
              e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.09)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(255,255,255,0.07)";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        {/* Room ID field */}
        <div className="mb-6">
          <label className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-slate-500 mb-2">
            Room ID
          </label>
          <input
            type="text"
            onChange={handleFormInputChange}
            value={detail.roomId}
            name="roomId"
            placeholder="e.g. room-7x9k2"
            autoComplete="off"
            className="w-full px-4 py-3 rounded-xl text-sm text-slate-300 placeholder-slate-800 outline-none transition-all"
            style={{
              background: "#080d16",
              border: "1px solid rgba(255,255,255,0.07)",
              fontSize: "14.5px",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "rgba(99,102,241,0.55)";
              e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.09)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(255,255,255,0.07)";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div
            className="flex-1 h-px"
            style={{ background: "rgba(255,255,255,0.07)" }}
          />
          <span className="text-xs tracking-wider" style={{ color: "#2d3f55" }}>
            choose an action
          </span>
          <div
            className="flex-1 h-px"
            style={{ background: "rgba(255,255,255,0.07)" }}
          />
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={joinRoom}
            className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-sm font-medium text-white transition-all hover:-translate-y-0.5 active:scale-97 cursor-pointer"
            style={{ background: "#4f46e5" }}
          >
            Join Room
          </button>
          <button
            onClick={createRoom}
            className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-sm font-medium transition-all hover:-translate-y-0.5 active:scale-97 cursor-pointer"
            style={{
              background: "rgba(249,115,22,0.13)",
              color: "#fb923c",
              border: "0.5px solid rgba(249,115,22,0.28)",
            }}
          >
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinCreateChat;
