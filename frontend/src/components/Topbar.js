import React from "react";
import { Link } from "react-router-dom";

const Topbar = () => {
  return (
    <div className="w-full fixed top-0 left-0 z-50 bg-green-600/90 backdrop-blur-md shadow-lg">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <h1 className="text-2xl font-extrabold tracking-wider text-white drop-shadow-sm">
          TP<span className="text-green-200">MA</span>
        </h1>

        {/* Nav Center */}
        <nav className="flex items-center space-x-10 text-white font-medium text-sm">

          {/* Single Nav Item */}
          <Link 
            to="/projects"
            className="flex items-center gap-1 hover:text-green-200 transition-all"
          >
            Projects
            <span className="text-lg leading-none -mt-0.5 opacity-80">⌄</span>
          </Link>

          <Link 
            to="/tasks"
            className="flex items-center gap-1 hover:text-green-200 transition-all"
          >
            Tasks
            <span className="text-lg leading-none -mt-0.5 opacity-80">⌄</span>
          </Link>

          <Link 
            to="/profile"
            className="flex items-center gap-1 hover:text-green-200 transition-all"
          >
            Profile
            <span className="text-lg leading-none -mt-0.5 opacity-80">⌄</span>
          </Link>

        </nav>

        {/* Profile Icon */}
        <Link
          to="/profile"
          className="w-9 h-9 rounded-full bg-white border border-green-200 flex items-center justify-center text-green-700 shadow-sm hover:shadow-md hover:scale-105 transition"
        >
          👤
        </Link>

      </div>
    </div>
  );
};

export default Topbar;
