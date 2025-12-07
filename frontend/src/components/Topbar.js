import React from "react";
import { Link } from "react-router-dom";

const Topbar = () => {
  return (
    <div className="w-full fixed top-0 left-0 z-50 bg-gray-100/60 backdrop-blur-sm border-b border-gray-200/40">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <h1 className="text-2xl font-extrabold tracking-wide text-green-600">
          TPMA
        </h1>

        {/* Navigation Center */}
        <nav className="flex items-center space-x-10 text-green-700 font-medium text-sm">
          <Link
            to="/projects"
            className="flex items-center hover:text-green-500 transition-colors"
          >
            Projects
            <span className="ml-1 -mt-0.5 text-xs text-green-400">▾</span>
          </Link>
          <Link
            to="/tasks"
            className="flex items-center hover:text-green-500 transition-colors"
          >
            Tasks
            <span className="ml-1 -mt-0.5 text-xs text-green-400">▾</span>
          </Link>
          <Link
            to="/profile"
            className="flex items-center hover:text-green-500 transition-colors"
          >
            Profile
            <span className="ml-1 -mt-0.5 text-xs text-green-400">▾</span>
          </Link>
        </nav>

        {/* Profile / small icon on right */}
        <Link
          to="/profile"
          className="w-8 h-8 bg-white rounded-full border flex items-center justify-center text-gray-600 hover:ring-2 hover:ring-green-400 transition"
        >
          👤
        </Link>
      </div>
    </div>
  );
};

export default Topbar;
