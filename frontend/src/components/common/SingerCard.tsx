import { Heart } from "lucide-react";
import React from "react";
import logo from "@/assets/images/common/artise-card.png";

const SingerCard: React.FC = () => {
  return (
    <div className=" hover:bg-[#F7F7F7] w-full rounded-2xl shadow-xl p-4 border border-[#CDCDCD] group transition-all duration-500">
      <div className="w-full h-64 relative bg-primary rounded-xl overflow-hidden">
        <img
          src={logo}
          alt="Artist"
          className="w-12 h-12 object-cover absolute top-3 left-3"
        />
        <button className="bg-white w-10 h-10 flex items-center justify-center rounded-full absolute top-3 right-3 cursor-pointer">
          <Heart />
        </button>
        <div className="w-full blur-effect text-white absolute bottom-0 left-0 px-5 py-2">
          <div>
            <p className="text-base font-medium">Signer Name here</p>
            <p className="text-xs">Responds within 1/hr</p>
          </div>
        </div>
      </div>
      <p className="text-lg font-medium text-primary py-3">
        Signer Service title here
      </p>
      <button className="text-lg font-medium border border-[#CDCDCD] group-hover:border-primary group-hover:bg-primary group-hover:text-white w-full rounded-lg p-2 cursor-pointer transition-all duration-500">
        View details
      </button>
    </div>
  );
};

export default SingerCard;
