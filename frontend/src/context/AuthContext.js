import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // new
  const [error, setError] = useState(null);

  // Keep user logged in on refresh
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch (err) {
      console.error("Failed to load user from localStorage", err);
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false); // done loading
    }
  }, []);

  const login = (userData, jwtToken) => {
    try {
      setUser(userData);
      setToken(jwtToken);

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", jwtToken);

      setError(null);
    } catch (err) {
      setError("Failed to save login data.");
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, error, clearError, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
