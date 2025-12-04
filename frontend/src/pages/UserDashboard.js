// src/pages/UserDashboard.js
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const UserDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();          // remove user & token from context and localStorage
    navigate("/login"); // redirect to login page
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Hi User, welcome! Here is your dashboard</h1>
      <p>{user && `Logged in as: ${user.name}`}</p>

      <button
        onClick={handleLogout}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#ff4d4f",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default UserDashboard;
