import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const RoleRedirect = () => {
  const { user, loading } = useContext(AuthContext);

  // Wait for auth state to be restored
  if (loading) {
    return <p>Loading...</p>; // or a spinner
  }

  // Not logged in → login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in → role-based dashboard
  if (user.role?.toLowerCase() === "manager") {
    return <Navigate to="/manager-dashboard" replace />;
  }

  return <Navigate to="/user-dashboard" replace />;
};

export default RoleRedirect;
