import { createContext, useContext, useEffect, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [roomId, setRoomId] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [connected, setConnected] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem("jwt") || null);

  useEffect(() => {
    if (token) {
      localStorage.setItem("jwt", token);
      fetchCurrentUser(token);
    } else {
      localStorage.removeItem("jwt");
      setCurrentUser(null);
    }
  }, [token]);

  const fetchCurrentUser = async (jwt) => {
    try {
      const res = await httpClient.get("/api/v1/users/me", {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      setCurrentUser(res.data); // { id, name, email, profilePhoto }
    } catch {
      // Token invalid or expired — clear it
      setToken(null);
    }
  };

  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    setRoomId("");
    setConnected(false);
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
