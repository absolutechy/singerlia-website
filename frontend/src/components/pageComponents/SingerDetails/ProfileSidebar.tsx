import React, { useState } from "react";
import { Heart, Share2 } from "lucide-react";
import singer1 from "@/assets/images/singer/singer-detail-1.png";
import singer2 from "@/assets/images/singer/singer-detail-2.png";
import ShareModal from "@/components/pageComponents/SingerDetails/ShareModal";

type Props = { name: string };

const ProfileSidebar: React.FC<Props> = ({ name }) => {
  const [shareOpen, setShareOpen] = useState(false);
  return (
    <aside className="self-start lg:sticky top-28 space-y-5">
      {/* Main card */}
      <div className="rounded-3xl bg-white p-2 sm:p-4">
        <div className="relative">
          <img src={singer2} alt="cover" className="w-full rounded-2xl h-52 object-cover overflow-hidden" />
          {/* small avatar */}
          <img
            src={singer1}
            alt="avatar"
            className="h-14 z-50 rounded-full object-cover absolute -bottom-7 left-4 border-4 border-white"
          />
        </div>
        <div className="pt-10 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#1C1C1C]">{name}</h2>
              <p className="text-sm text-[#6F5D9E]">Responds within 1/hr</p>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button onClick={() => setShareOpen(true)} className="h-10 w-10 rounded-full border border-[#E7DEFF] bg-white flex items-center justify-center">
              <Share2 size={18} className="text-[#6F5D9E]" />
            </button>
            <button className="h-10 w-10 rounded-full border border-[#E7DEFF] bg-white flex items-center justify-center">
              <Heart size={18} className="text-[#6F5D9E]" />
            </button>
          </div>
        </div>
      </div>

      {/* Booking card */}
      <div className="relative rounded-2xl bg-white px-2.5 sm:px-5 py-10 shadow border border-[#EBE4FF]">
        <span className="absolute -top-3 right-6 text-xs bg-white shadow px-3 py-1 rounded-full border border-[#EBE4FF]">
          Free cancellation
        </span>
        <button className="w-full h-12 rounded-full bg-gradient-to-b from-secondary to-secondary-dark text-[#1C1C1C] font-semibold shadow">
          Book Singer
        </button>
      </div>
      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} name={name} />
    </aside>
  );
};

export default ProfileSidebar;
