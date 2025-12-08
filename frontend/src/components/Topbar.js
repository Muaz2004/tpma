import React from "react";
import { Link } from "react-router-dom";

const Topbar = () => {
  return (
    <div className="w-full fixed top-0 left-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo - TPMA */}
        <h1 className="text-2xl font-extrabold tracking-wide text-green-700">
          TP<span className="text-green-400">MA</span>
        </h1>

        {/* Center “Frame” Navigation */}
        <div className="px-6 py-2 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-full shadow-sm flex items-center space-x-6">

          <Link 
            to="/projects"
            className="flex items-center gap-1 text-gray-800 hover:text-green-600 transition-all"
          >
            Projects
            <span className="text-base opacity-80">⌄</span>
          </Link>

          <Link 
            to="/tasks"
            className="flex items-center gap-1 text-gray-800 hover:text-green-600 transition-all"
          >
            Tasks
            <span className="text-base opacity-80">⌄</span>
          </Link>

          <Link 
            to="/profile"
            className="flex items-center gap-1 text-gray-800 hover:text-green-600 transition-all"
          >
            Profile
            <span className="text-base opacity-80">⌄</span>
          </Link>

        </div>

        {/* Right Profile Avatar */}
        <Link
          to="/profile"
          className="w-9 h-9 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-600 hover:scale-105 transition"
        >
          👤
        </Link>

      </div>
    </div>
  );
};

export default Topbar;
