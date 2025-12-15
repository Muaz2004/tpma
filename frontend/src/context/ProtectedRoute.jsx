import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);

  // Wait until auth state is restored
  if (loading) return <p>Loading...</p>;

  if (!user) return <Navigate to="/login" />;

  if (role && user.role.toLowerCase() !== role.toLowerCase())
    return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;
