import React from "react";
import logo from "@/assets/images/common/quil.png";

interface SimpleCardProps {
  num: string;
  title: string;
  des: string;
}

const SimpleCard: React.FC<SimpleCardProps> = ({ num, title, des }) => {
  return (
    <div className="bg-white w-full rounded-xl border border-[#CDCDCD] hover:shadow-lg group transition-all duration-500 transform hover:-translate-y-5">
      <div className="p-4">
        <div className="flex items-center gap-3">
          <img src={logo} alt="icon" className="w-8 h-8 object-cover" />
          <p className="font-medium text-primary">{num}</p>
        </div>
        <p className="text-primary font-medium my-3">{title}</p>
        <p className="text-sm text-[#6E6E6E]">{des}</p>
      </div>
      <div className="bg-primary w-full h-0 group-hover:h-7 transition-all duration-500 rounded-b-xl" />
    </div>
  );
};

export default SimpleCard;
