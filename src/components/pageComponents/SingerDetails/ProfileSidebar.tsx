import React, { useState } from "react";
import { Heart, Share2, Calendar, Clock } from "lucide-react";
import singer1 from "@/assets/images/singer/singer-detail-1.png";
import singer2 from "@/assets/images/singer/singer-detail-2.png";
import ShareModal from "@/components/pageComponents/SingerDetails/ShareModal";
import { Button } from "@/components/common";
import { useNavigate } from "react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Button as UIButton } from "@/components/ui/button";

type Props = { name: string; id: number };

const ProfileSidebar: React.FC<Props> = ({ name, id }) => {
  const [shareOpen, setShareOpen] = useState(false);
  const [eventDate, setEventDate] = useState<Date | undefined>();
  const [timeSlot, setTimeSlot] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const navigate = useNavigate();

  const timeSlotOptions = [
    { value: "morning", label: "Morning (8:00 AM onwards)" },
    { value: "afternoon", label: "Afternoon (12:00 PM onwards)" },
    { value: "evening", label: "Evening (6:00 PM onwards)" },
  ];

  const nav = () => {
    // Pass selected date and time to booking page via state or query params
    const dateString = eventDate ? eventDate.toISOString().split('T')[0] : "";
    navigate(`/booking/singer/${id}`, {
      state: {
        preFilledEventDate: dateString,
        preFilledTimeSlot: timeSlot,
        singerId: id,
      },
    });
  };

  return (
    <aside className="self-start lg:sticky top-20 space-y-2">
      {/* Main card */}
      <div className="rounded-3xl bg-white p-2 sm:p-4">
        <div className="relative">
          <img
            src={singer2}
            alt="cover"
            className="w-full rounded-2xl h-52 object-cover overflow-hidden"
          />
          {/* small avatar */}
          <img
            src={singer1}
            alt="avatar"
            className="h-14 w-14 z-10 rounded-full object-cover absolute -bottom-7 left-4 border-4 border-white"
          />
        </div>
        <div className="pt-6 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#1C1C1C]">{name}</h2>
              <p className="text-sm text-[#6F5D9E]">Responds within 1/hr</p>
            </div>

          <div className="mt-2 flex gap-2">
            <button
              onClick={() => setShareOpen(true)}
              className="h-10 w-10 rounded-full border border-[#E7DEFF] bg-white flex items-center justify-center"
            >
              <Share2 size={18} className="text-[#6F5D9E]" />
            </button>
            <button className="h-10 w-10 rounded-full border border-[#E7DEFF] bg-white flex items-center justify-center">
              <Heart size={18} className="text-[#6F5D9E]" />
            </button>
          </div>
          </div>

        </div>
      </div>

      {/* Booking card */}
      <div className="rounded-2xl bg-white px-2.5 sm:px-5 py-6 shadow border border-[#EBE4FF] space-y-2">
        {/* Event Date Selector */}
        <div>
          <label className="text-sm font-semibold text-[#1C1C1C] flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-primary" />
            Event Date
          </label>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <UIButton
                variant="outline"
                className="w-full justify-start text-left font-normal border border-[#E7DEFF] rounded-lg text-[#2E1B4D]"
              >
                {eventDate ? eventDate.toLocaleDateString() : "Pick a date"}
              </UIButton>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white!" align="start">
              <CalendarComponent
                mode="single"
                selected={eventDate}
                onSelect={(date) => {
                  setEventDate(date);
                  setCalendarOpen(false);
                }}
                disabled={(date) =>
                  date < new Date(new Date().setHours(0, 0, 0, 0))
                }
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Time Slot Selector */}
        <div>
          <label className="text-sm font-semibold text-[#1C1C1C] flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-primary" />
            Time Slot
          </label>
          <Select value={timeSlot}  onValueChange={setTimeSlot}>
            <SelectTrigger className="w-full border border-[#E7DEFF] rounded-lg text-[#2E1B4D]">
              <SelectValue placeholder="Select time slot" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {timeSlotOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Book Artist Button */}
        <Button
          variant="primary"
          onClick={nav}
          className="w-full h-10 rounded-lg bg-gradient-to-b from-secondary to-secondary-dark text-[#1C1C1C] font-semibold shadow text-sm"
        >
          Book Artist
        </Button>
      </div>
      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        name={name}
      />
    </aside>
  );
};

export default ProfileSidebar;
