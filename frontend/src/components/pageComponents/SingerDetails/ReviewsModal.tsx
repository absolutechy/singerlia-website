import React from "react";
import Modal from "@/components/common/Modal";
import ReviewCard from "@/components/common/ReviewCard";
import { X } from "lucide-react";

type Review = {
  id: number;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  timeAgo: string;
  text: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  reviews: Review[];
};

const ReviewsModal: React.FC<Props> = ({ open, onClose, reviews }) => {
  return (
    <Modal open={open} onClose={onClose} panelClassName="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <div className="flex items-center gap-2 text-[#1C1C1C] font-semibold">
          <span className="text-xl">4.97</span>
          <span className="inline-block w-1 h-1 rounded-full bg-gray-300"></span>
          <span className="text-xl">29 reviews</span>
        </div>
        <button onClick={onClose} aria-label="Close" className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200">
          <X size={16} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-2 divide-y">
        {[...reviews, ...reviews, ...reviews].map((r, idx) => (
          <ReviewCard
            key={idx}
            avatar={r.avatar}
            name={r.name}
            location={r.location}
            rating={r.rating}
            timeAgo={r.timeAgo}
            text={r.text}
          />
        ))}
      </div>
    </Modal>
  );
};

export default ReviewsModal;

