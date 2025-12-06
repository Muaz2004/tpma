
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import React, { useContext } from "react";


const Logout=()=>{

     const {  logout } = useContext(AuthContext);
      const navigate = useNavigate();
    
      const handleLogout = () => {
        logout();          // remove user & token from context and localStorage
        navigate("/login"); // redirect to login page
      };
    

 return (

     <div>  style={{ padding: "2rem" }}
        
      <button
        onClick={handleLogout}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#ff4d4f",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
     </div>
 );
}; export default Logout