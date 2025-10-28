import React from "react";
import logo from "@/assets/images/common/quil.png";

const GenreCard: React.FC = () => {
  return (
    <div className="relative">
      <div className="border border-[#CDCDCD] bg-white w-16 h-16 rounded-xl flex items-center justify-center shadow mx-auto -mb-5 relative">
        <img
          src={logo}
          alt="Genre Logo"
          className="h-10 w-10 object-contain object-center"
        />
      </div>
      <div className="border border-[#CDCDCD] bg-white w-full h-full rounded-xl flex flex-col items-center justify-center gap-5 shadow pt-3">
        <p className="font-medium text-primary">Jazz</p>
        <p className="text-[#6E6E6E] text-sm">234 artists</p>
      </div>
    </div>
  );
};

export default GenreCard;
