import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Folder, ClipboardList, CheckCircle } from "lucide-react";

const UserDashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-emerald-600 mb-2">
            Welcome back, {user?.name} 👋
          </h1>
          <p className="text-emerald-600/70">
            Manage your work, track tasks, and stay productive.
          </p>
        </div>

        {/* User Info Card */}
        <div className="bg-white/70 backdrop-blur rounded-2xl p-6 shadow mb-10 border border-emerald-100">
          <p className="text-emerald-700 font-medium">
            Logged in as:
          </p>
          <p className="text-lg text-emerald-600">
            {user?.email || user?.name}
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

          {/* Projects */}
          <Link to="/projects">
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow hover:shadow-xl transition transform hover:scale-105 cursor-pointer border border-emerald-100">
              <div className="flex items-center gap-3 mb-4 text-emerald-600">
                <Folder className="w-6 h-6" />
                <h2 className="text-lg font-semibold">All Projects</h2>
              </div>
              <p className="text-emerald-600/80 text-sm">
                Browse all projects and check their progress.
              </p>
            </div>
          </Link>

          {/* All Tasks */}
          <Link to="/tasks">
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow hover:shadow-xl transition transform hover:scale-105 cursor-pointer border border-emerald-100">
              <div className="flex items-center gap-3 mb-4 text-emerald-600">
                <ClipboardList className="w-6 h-6" />
                <h2 className="text-lg font-semibold">All Tasks</h2>
              </div>
              <p className="text-emerald-600/80 text-sm">
                View tasks across all projects.
              </p>
            </div>
          </Link>

          {/* My Tasks */}
          <Link to="/my-tasks">
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow hover:shadow-xl transition transform hover:scale-105 cursor-pointer border border-emerald-100">
              <div className="flex items-center gap-3 mb-4 text-emerald-600">
                <CheckCircle className="w-6 h-6" />
                <h2 className="text-lg font-semibold">My Tasks</h2>
              </div>
              <p className="text-emerald-600/80 text-sm">
                Track tasks assigned specifically to you.
              </p>
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
