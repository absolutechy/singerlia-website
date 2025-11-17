import React, { useState } from "react";
import { Heart, Share2, Calendar, Clock } from "lucide-react";
import singer1 from "@/assets/images/singer/singer-detail-1.png";
import singer2 from "@/assets/images/singer/singer-detail-2.png";
import ShareModal from "@/components/pageComponents/SingerDetails/ShareModal";
import { Button, Input, Select } from "@/components/common";
import { useNavigate } from "react-router";

type Props = { name: string, id: number };

const ProfileSidebar: React.FC<Props> = ({ name, id }) => {
  const [shareOpen, setShareOpen] = useState(false);
  const [eventDate, setEventDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const navigate = useNavigate();

  const timeSlotOptions = [
    { value: "morning", label: "Morning (8:00 AM onwards)" },
    { value: "afternoon", label: "Afternoon (12:00 PM onwards)" },
    { value: "evening", label: "Evening (6:00 PM onwards)" },
  ];

  const nav = () => {
    // Pass selected date and time to booking page via state or query params
    navigate(`/booking/singer/${id}`, {
      state: {
        preFilledEventDate: eventDate,
        preFilledTimeSlot: timeSlot,
      },
    });
  }

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
            className="h-14 w-14 z-10 rounded-full object-cover absolute -bottom-7 left-4 border-4 border-white"
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
      <div className="rounded-2xl bg-white px-2.5 sm:px-5 py-6 shadow border border-[#EBE4FF] space-y-4">
        {/* Event Date Selector */}
        <div>
          <label className="text-sm font-semibold text-[#1C1C1C] flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-primary" />
            Event Date
          </label>
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="w-full px-3 py-2 border border-[#E7DEFF] rounded-lg text-[#2E1B4D] text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Time Slot Selector */}
        <div>
          <label className="text-sm font-semibold text-[#1C1C1C] flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-primary" />
            Time Slot
          </label>
          <select
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            className="w-full px-3 py-2 border border-[#E7DEFF] rounded-lg text-[#2E1B4D] text-sm focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
          >
            <option value="">Select time slot</option>
            {timeSlotOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Book Artist Button */}
        <Button
          variant="primary"
          size="large"
          onClick={nav}
          className="w-full h-12 rounded-full bg-gradient-to-b from-secondary to-secondary-dark text-[#1C1C1C] !font-semibold shadow">
          Book Artist
        </Button>
      </div>
      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} name={name} />
    </aside>
  );
};

export default ProfileSidebar;
