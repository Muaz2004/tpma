// src/pages/UserDashboard.js
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const UserDashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Hi User, welcome!</h1>
      <p>{user && `Logged in as: ${user.name}`}</p>
    </div>
  );
};

export default UserDashboard;
