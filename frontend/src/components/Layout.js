import React from "react";
import Topbar from "./Topbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-green-50 flex flex-col">

      <Topbar />

      <main className="flex-1 w-full px-6 py-10">
        {children}
      </main>

      <footer className="text-center py-6 text-green-700 text-sm opacity-70">
        © 2025 TPMA. All rights reserved.
      </footer>

    </div>
  );
};

export default Layout;
