import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Folder, ClipboardList, PlusCircle } from "lucide-react";

const ManagerDashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-emerald-600 mb-2">
            Welcome, {user?.name} 👋
          </h1>
          <p className="text-emerald-600/70">
            Manage projects, oversee tasks, and track progress efficiently.
          </p>
        </div>

        {/* Manager Info Card */}
        <div className="bg-white/70 backdrop-blur rounded-2xl p-6 shadow mb-10 border border-emerald-100">
          <p className="text-emerald-700 font-medium">
            Manager Account
          </p>
          <p className="text-lg text-emerald-600">
            {user?.email || user?.name}
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

          {/* All Projects */}
          <Link to="/projects">
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow hover:shadow-xl transition transform hover:scale-105 cursor-pointer border border-emerald-100">
              <div className="flex items-center gap-3 mb-4 text-emerald-600">
                <Folder className="w-6 h-6" />
                <h2 className="text-lg font-semibold">Manage Projects</h2>
              </div>
              <p className="text-emerald-600/80 text-sm">
                Create, update, and track all your projects.
              </p>
            </div>
          </Link>

          {/* Tasks for Manager Projects */}
          <Link to="/manager-tasks">
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow hover:shadow-xl transition transform hover:scale-105 cursor-pointer border border-emerald-100">
              <div className="flex items-center gap-3 mb-4 text-emerald-600">
                <ClipboardList className="w-6 h-6" />
                <h2 className="text-lg font-semibold">Project Tasks</h2>
              </div>
              <p className="text-emerald-600/80 text-sm">
                View and manage tasks under your projects.
              </p>
            </div>
          </Link>

          {/* Create Project */}
          <Link to="/projects/add">
            <div className="bg-emerald-500 text-white rounded-2xl p-6 shadow hover:shadow-xl transition transform hover:scale-105 cursor-pointer">
              <div className="flex items-center gap-3 mb-4">
                <PlusCircle className="w-6 h-6" />
                <h2 className="text-lg font-semibold">Create Project</h2>
              </div>
              <p className="text-white/90 text-sm">
                Start a new project and assign tasks to your team.
              </p>
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
