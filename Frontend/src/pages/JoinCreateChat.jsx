import React, { useState } from "react";
import toast from "react-hot-toast";
import { createRoomApi, joinChatApi } from "../services/RoomService";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";

const JoinCreateChat = () => {
  const [roomIdInput, setRoomIdInput] = useState("");
  const [loading, setLoading] = useState(null); // Join | Create | null

  const navigate = useNavigate();

  const { setRoomId, currentUser, setConnected, logout } = useChatContext();

  const validate = () => {
    if (!roomIdInput.trim()) {
      toast.error("Please enter a Room ID");
      return false;
    }
    return true;
  };

  const joinRoom = async () => {
    if (!validate()) return;
    setLoading("join");

    try {
      const room = await joinChatApi(roomIdInput.trim());
      toast.success("Joined Room!");
      setRoomId(room.roomId);
      setConnected(true);
      navigate("/chat");
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("Room not found");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(null);
    }
  };

  const createRoom = async () => {
    if (!validate()) return;
    setLoading("create");

    try {
      await createRoomApi({
        roomId: roomIdInput.trim(),
      });
      toast.success("Room created");
      setRoomId(roomIdInput.trim());
      setConnected(true);
      navigate("/chat");
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error("Room already exists");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      {/* Grid background */}
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

        <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
          {/* Top bar with user info */}
          <div className="flex items-center justify-between mb-7">
            <div className="flex items-center gap-3">
              {currentUser?.profilePhoto ? (
                <img
                  src={currentUser.profilePhoto}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/30"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-sm font-bold">
                  {currentUser?.name?.[0]?.toUpperCase() ?? "?"}
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-white leading-none">
                  {currentUser?.name ?? "User"}
                </p>
                <p className="text-xs text-gray-600 mt-0.5">
                  {currentUser?.email ?? ""}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors cursor-pointer"
            >
              Sign out
            </button>
          </div>

          {/* Header */}
          <div className="mb-6">
            <div className="w-11 h-11 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center mb-3">
              <span className="text-xl">💬</span>
            </div>
            <h1 className="text-xl font-bold text-white">Chat Rooms</h1>
            <p className="text-sm text-gray-500 mt-1">
              Join an existing room or create a new one
            </p>
          </div>

          {/* Room ID input */}
          <div className="mb-6">
            <label className="block text-xs font-medium uppercase tracking-widest text-gray-600 mb-2">
              Room ID
            </label>
            <input
              type="text"
              value={roomIdInput}
              onChange={(e) => setRoomIdInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && joinRoom()}
              placeholder="e.g. room-7x9k2"
              autoComplete="off"
              className="w-full px-4 py-3 rounded-xl text-sm text-gray-300 placeholder-gray-700 bg-gray-950 border border-gray-800 outline-none transition-all focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10"
            />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-800" />
            <span className="text-xs text-gray-700 tracking-wider">
              choose an action
            </span>
            <div className="flex-1 h-px bg-gray-800" />
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={joinRoom}
              disabled={!!loading}
              className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 cursor-pointer"
            >
              {loading === "join" ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : null}
              Join Room
            </button>
            <button
              onClick={createRoom}
              disabled={!!loading}
              className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-sm font-medium text-orange-400 bg-orange-500/10 border border-orange-500/25 hover:bg-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 cursor-pointer"
            >
              {loading === "create" ? (
                <span className="w-4 h-4 border-2 border-orange-400/30 border-t-orange-400 rounded-full animate-spin" />
              ) : null}
              Create Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinCreateChat;
