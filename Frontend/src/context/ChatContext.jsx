import { createContext, useContext, useEffect, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [roomId, setRoomId] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [connected, SetConnected] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem("jwt") || null);

  useEffect(() => {
    if (token) {
      localStorage.setItem("jwt", token);
    } else {
      localStorage.removeItem("jwt");
    }
  }, [token]);

  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    setRoomId("");
    SetConnected(false);
  };

  return (
    <ChatContext.Provider
      value={{
        roomId,
        setRoomId,
        currentUser,
        setCurrentUser,
        token,
        setToken,
        connected,
        setConnected,
        logout,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

const useChatContext = () => useContext(ChatContext);

export default useChatContext;
