import { Navigate } from "react-router";
import useChatContext from "../context/ChatContext";

const ProtectedRoute = ({ children }) => {
  const { token } = useChatContext();
  if (!token) return <Navigate to="/" replace />;
  return children;
};

export default ProtectedRoute;
