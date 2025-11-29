// src/pages/ManagerDashboard.js
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ManagerDashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Hi Manager, welcome!</h1>
      <p>{user && `Logged in as: ${user.name}`}</p>
    </div>
  );
};

export default ManagerDashboard;
