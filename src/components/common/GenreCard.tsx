import React from "react";
import type { LucideIcon } from "lucide-react";
import { Music } from "lucide-react";

interface GenreCardProps {
  label: string;
  count?: number;
  onClick?: () => void;
  icon?: LucideIcon;
}

const GenreCard: React.FC<GenreCardProps> = ({ label, count, onClick, icon: Icon = Music }) => {
  return (
    <button type="button" onClick={onClick} className="relative w-full text-left cursor-pointer">
      <div className="border border-[#CDCDCD] bg-white w-16 h-16 rounded-xl flex items-center justify-center shadow mx-auto -mb-5 relative">
        <Icon className="h-8 w-8 text-primary" strokeWidth={1.5} />
      </div>
      <div className="border border-[#CDCDCD] bg-white w-full h-full rounded-xl flex flex-col items-center justify-center shadow gap-[5px] pt-[30px] pr-0 pb-[10px] pl-0">
        <p className="font-medium text-primary">{label}</p>
        <p className="text-[#6E6E6E] text-sm">
          {count === undefined ? " " : `${count} artist${count === 1 ? "" : "s"}`}
        </p>
      </div>
    </button>
  );
};

export default GenreCard;
