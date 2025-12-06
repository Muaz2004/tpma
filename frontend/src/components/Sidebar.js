import React from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";


const  Sidebar= ()=>{
 const {  user } = useContext(AuthContext);
 const dashboard=user?.role.toLowerCase() === "manager" ? "/manager-dashboard" : "/user-dashboard";

    return (

  <div className="w-48 bg-[#3A506B] h-screen flex flex-col items-center py-4 space-y-6 text-white">
  <Link to={dashboard}  className="text-2xl">🏠</Link>
  <Link to="/projects" className="text-2xl">📁</Link>
  <Link to="/tasks" className="text-2xl">📝</Link>
  <Link to="/profile" className="text-2xl">👤</Link>
  <Link to="/logout" className="text-2xl">🚪</Link>
</div>


    );

}; export default Sidebar;