import React, { useContext } from "react"; 

const Profile = () => { 
  return ( 
    <div style={{ 
        padding: "2rem", 
        fontFamily: "Arial, sans-serif", 
        maxWidth: "600px", 
        margin: "auto", 
        border: "1px solid #ddd", 
        borderRadius: "8px", 
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" 
    }}> 
      <h1 style={{ color: "#333", borderBottom: "2px solid #007bff", paddingBottom: "0.5rem" }}>
        Hello from profile page
      </h1>
      
      <p style={{ color: "#555", lineHeight: "1.5" }}>
        This is the first paragraph with some additional details about the user profile section.
        We are just adding some presentational styling and structure here.
      </p>

      <p style={{ color: "#555", lineHeight: "1.5" }}>
        This second paragraph demonstrates how you can add more content while keeping 
        the original React structure intact, using inline styles for a quick demonstration.
      </p>
    </div> 
  ); 
}; 

export default Profile;
