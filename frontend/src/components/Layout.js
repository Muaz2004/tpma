import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";


const Layout=({ children })=>{
    return(
        <div  className="flex">
             <Sidebar /> 

        <div className="flex-1 flex flex-col">  

         <Topbar />
         
        <main className="flex-1 bg-[#FCFFE7] text-[#1C1C1C] p-4"> {children} </main>

            </div>
        </div>

        
    );

}; export default Layout;