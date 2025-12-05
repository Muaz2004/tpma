import React from "react";
import ReactDOM from "react-dom/client"; // updated import
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { ApolloProvider } from "@apollo/client";
import client from "./apollo/client";
import "./index.css";

// Create a root for React 18+
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </AuthProvider>
  </React.StrictMode>
);
