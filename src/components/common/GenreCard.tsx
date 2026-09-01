import React from "react";
import logo from "@/assets/images/common/quil.png";

interface GenreCardProps {
  label: string;
  count?: number;
  onClick?: () => void;
}

const GenreCard: React.FC<GenreCardProps> = ({ label, count, onClick }) => {
  return (
    <button type="button" onClick={onClick} className="relative w-full text-left cursor-pointer">
      <div className="border border-[#CDCDCD] bg-white w-16 h-16 rounded-xl flex items-center justify-center shadow mx-auto -mb-5 relative">
        <img
          src={logo}
          alt="Genre Logo"
          className="h-10 w-10 object-contain object-center"
        />
      </div>
      <div className="border border-[#CDCDCD] bg-white w-full h-full rounded-xl flex flex-col items-center justify-center gap-5 shadow pt-3">
        <p className="font-medium text-primary">{label}</p>
        <p className="text-[#6E6E6E] text-sm">
          {count === undefined ? " " : `${count} artist${count === 1 ? "" : "s"}`}
        </p>
      </div>
    </button>
  );
};

export default GenreCard;
