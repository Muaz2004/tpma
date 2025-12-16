import React, { useContext } from "react";
import { AuthContext } from '../../context/AuthContext';
import { User, AtSign, Briefcase, Shield } from "lucide-react";

const ProfilePage = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex justify-center items-center bg-green-50 p-6">
      
      {/* Small green info card */}
      <div className="bg-green-50 rounded-2xl shadow-lg p-8 w-full max-w-md border border-green-100">
        
        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-500 rounded-full w-24 h-24 flex items-center justify-center text-white text-4xl font-bold animate-pulse">
            {user?.username?.[0]?.toUpperCase() || "U"}
          </div>
        </div>

        {/* Intro text */}
        <p className="text-center text-green-600 font-semibold text-lg mb-6">
          Your profile information
        </p>

        {/* User info */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-green-600"/>
            <div>
              <p className="text-green-600/80 text-sm">Full Name</p>
              <p className="text-green-900 font-semibold">{user?.first_name} {user?.last_name || ""}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <AtSign className="w-5 h-5 text-green-600"/>
            <div>
              <p className="text-green-600/80 text-sm">Username</p>
              <p className="text-green-900 font-semibold">{user?.username}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-green-600"/>
            <div>
              <p className="text-green-600/80 text-sm">Email</p>
              <p className="text-green-900 font-semibold">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-green-600"/>
            <div>
              <p className="text-green-600/80 text-sm">Role</p>
              <p className="text-green-900 font-semibold">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Logout button */}
        {logout && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={logout}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-all shadow hover:shadow-lg"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
