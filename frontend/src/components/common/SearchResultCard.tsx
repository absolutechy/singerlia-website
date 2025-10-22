import React from "react";
import { Heart } from "lucide-react";
import badge from "@/assets/images/common/singercircleborder.png";

export interface SearchResultCardProps {
  image: string;
  name: string;
  serviceTitle: string;
  responseTime?: string;
}

const SearchResultCard: React.FC<SearchResultCardProps> = ({
  image,
  name,
  serviceTitle,
  responseTime = "Responds within 1hr",
}) => {
  return (
    <div className="bg-white w-full rounded-3xl p-4 border-[0.5px] border-[#CDCDCD] group transition-all duration-300 hover:bg-[#F9F7FF]">
      <div className="w-full h-56 md:h-60 relative rounded-2xl overflow-hidden">
        <img src={image} alt={name} className="w-full h-full object-cover" />

        {/* Top-left circular badge */}
        <img
          src={badge}
          alt="badge"
          className="w-10 h-10 object-contain absolute top-3 left-3"
        />

        {/* Favorite */}
        <button
          type="button"
          className="bg-white/95 w-10 h-10 flex items-center justify-center rounded-full absolute top-3 right-3 shadow-md cursor-pointer"
        >
          <Heart className="text-[#2E1B4D]" size={18} />
        </button>

        {/* Bottom overlay */}
        <div className="w-full blur-effect text-white absolute bottom-0 left-0 px-5 py-3">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-base font-semibold leading-tight">{name}</p>
              <p className="text-xs opacity-90">{responseTime}</p>
            </div>
            <div className="flex items-center gap-1 pb-1">
              <span className="inline-block w-2 h-2 rounded-full bg-[#D9D9D9]" />
              <span className="inline-block w-2 h-2 rounded-full bg-[#F0C84B]" />
              <span className="inline-block w-2 h-2 rounded-full bg-[#D9D9D9]" />
            </div>
          </div>
        </div>
      </div>

      <p className="text-[17px] font-medium text-primary py-3">{serviceTitle}</p>
      <button
        type="button"
        className="text-base font-medium border-[0.5px] border-[#CDCDCD] group-hover:border-primary group-hover:bg-primary group-hover:text-white w-full rounded-xl p-3 cursor-pointer transition-all duration-300"
      >
        View details
      </button>
    </div>
  );
};

export default SearchResultCard;

