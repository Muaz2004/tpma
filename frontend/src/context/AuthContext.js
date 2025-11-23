import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  // Keep user logged in on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  const login = (userData, jwtToken) => {
    try {
      setUser(userData);
      setToken(jwtToken);

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", jwtToken);

      setError(null); // clear previous errors
    } catch (err) {
      setError("Failed to save login data.");
    }
  };

  const logout = () => {
    try {
      setUser(null);
      setToken(null);

      localStorage.removeItem("user");
      localStorage.removeItem("token");

      setError(null);
    } catch (err) {
      setError("Logout failed.");
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, error, clearError }}
    >
      {children}
    </AuthContext.Provider>
  );
};
