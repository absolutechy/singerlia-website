import React from "react";
import { Star } from "lucide-react";

export type ReviewCardProps = {
  avatar: string;
  name: string;
  location: string;
  rating: number;
  timeAgo: string;
  text?: string;
  className?: string;
};

const ReviewCard: React.FC<ReviewCardProps> = ({
  avatar,
  name,
  location,
  rating,
  timeAgo,
  text,
  className = "",
}) => {
  return (
    <div className={`py-5 ${className}`}>
      <div className="flex items-start gap-3">
        <img
          src={avatar}
          alt={name}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <p className="text-sm font-semibold text-[#1C1C1C]">{name}</p>
          <p className="text-xs text-[#6F5D9E]">{location}</p>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2 text-sm">
        <Star size={16} className="text-yellow-500 fill-yellow-500" />
        <span className="text-[#1C1C1C] font-medium">{rating.toFixed(1)}</span>
        <span className="text-gray-300">•</span>
        <span className="text-[#6F5D9E]">{timeAgo}</span>
      </div>

      {text && (
        <p className="mt-3 text-sm text-[#1C1C1C]">
          {text}
        </p>
      )}
    </div>
  );
};

export default ReviewCard;

