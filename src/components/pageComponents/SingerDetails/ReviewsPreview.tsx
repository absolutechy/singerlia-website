import React from "react";
import { Star } from "lucide-react";

type PreviewReview = {
  id: number;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  timeAgo: string;
};

type Props = {
  items: PreviewReview[];
  onShowAll: () => void;
};

const ReviewsPreview: React.FC<Props> = ({ items, onShowAll }) => {
  return (
    <div className="pt-2">
      <div className="h-px bg-[#E7DEFF] my-4" />
      <div className="flex items-center gap-2 text-[#2E1B4D] font-medium">
        <Star size={18} className="text-yellow-500 fill-yellow-500" />
        <span className="text-base">4.97</span>
        <span className="inline-block w-1 h-1 rounded-full bg-gray-300"></span>
        <span className="text-base">29 reviews</span>
      </div>

      <div className="mt-3 divide-y divide-[#E7DEFF]">
        {items.map((r) => (
          <div key={r.id} className="py-5">
            <div className="flex items-start gap-3">
              {/* Image */}
              <img src={r.avatar} alt={r.name} className="h-10 w-10 rounded-full object-cover" />

              {/* Name and Location Column */}
              <div className="flex flex-col">
                <p className="text-sm font-semibold text-[#1C1C1C]">{r.name}</p>
                <p className="text-xs text-[#6F5D9E]">{r.location}</p>
              </div>
            </div>

            {/* Second Row - Rating and Time */}
            <div className="flex items-center gap-2 mt-2 text-sm">
              <Star size={16} className="text-yellow-500 fill-yellow-500" />
              <span className="font-semibold text-[#1C1C1C]">{r.rating.toFixed(1)}</span>
              <span className="inline-block w-1 h-1 rounded-full bg-gray-300"></span>
              <span className="text-[#6F5D9E]">{r.timeAgo}</span>
            </div>
          </div>
        ))}
      </div>

      <button onClick={onShowAll} className="mt-2 w-full h-11 rounded-xl border border-[#E7DEFF] bg-white text-[#2E1B4D] font-medium">
        Show all reviews
      </button>
    </div>
  );
};

export default ReviewsPreview;

