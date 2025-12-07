import React from "react";

const Topbar = () => {
  return (
    <div className="h-16 w-full flex items-center justify-between px-6 bg-transparent">

      <h1 className="text-2xl font-extrabold bg-gradient-to-r from-[#3A506B] to-[#5BC0BE] bg-clip-text text-transparent">
        TPMA
      </h1>

      <div className="w-9 h-9 rounded-full border border-[#3A506B] opacity-70"></div>

    </div>
  );
};

export default Topbar;
