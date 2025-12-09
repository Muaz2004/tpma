import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Topbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: "Projects", path: "/projects" },
    { label: "Tasks", path: "/tasks" },
    { label: "Dashboard", path: "/user-dashboard" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link
            to="/Dashboard"
            className="flex items-center gap-2 font-bold text-xl text-white hover:opacity-90 transition-opacity flex-shrink-0"
          >
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-green-600 font-bold">TP</span>
            </div>
            <span>TPMA</span>
          </Link>

          {/* Nav container styled as elliptical bar */}
<div className="flex-1 mx-6">
  <div className="relative rounded-full px-6 py-3 bg-white/20 backdrop-blur-sm flex justify-center">
    <nav className="flex items-center gap-8">
      {navLinks.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          className={`text-sm font-medium transition-all duration-200 whitespace-nowrap ${
            isActive(link.path)
              ? "text-white"
              : "text-white/80 hover:text-white"
          } relative group flex items-center`}
        >
          {link.label}
          <span className="ml-1 text-xs rotate-45">▾</span>
          <span
            className={`absolute bottom-0 left-0 h-0.5 bg-white transition-all duration-200 ${
              isActive(link.path) ? "w-full" : "w-0 group-hover:w-full"
            }`}
          />
        </Link>
      ))}
    </nav>
  </div>
</div>


          {/* Profile & Logout */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/20 rounded-full transition-all duration-200 hover:scale-105 transform"
              >
                <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center text-sm font-semibold border border-white/40">
                  TP
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <Link
                    to="/profile"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 transition-colors duration-150"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/logout"
                    className="block px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 border-t border-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Logout
                  </Link>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Topbar;

// second to last
