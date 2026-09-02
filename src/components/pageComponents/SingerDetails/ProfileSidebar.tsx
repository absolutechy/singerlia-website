import React, { useState, useMemo, useEffect } from "react";
import { Heart, Share2, Calendar, Clock } from "lucide-react";
import singer2 from "@/assets/images/singer/singer-detail-3.png";
import singeravatar from "@/assets/images/singer/singer_avatar.jpg"
import ShareModal from "@/components/pageComponents/SingerDetails/ShareModal";
import { Button } from "@/components/common";
import { useNavigate } from "react-router";
import type { UnavailabilityRecord } from "@/api/services/unavailabilityService";
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
import type { CategoryPricing } from "@/api/services/singerService";
import eventCategoryService, { type EventCategory } from "@/api/services/eventCategoryService";

type Props = {
  name: string;
  id: string;
  categoryPricing?: CategoryPricing;
  city?: string;
  isVerified?: boolean;
  unavailability?: UnavailabilityRecord[];
  averageRating?: number;
  reviewCount?: number;
};

// Backend endpoint that serves Open Graph/Twitter Card meta tags to link-preview crawlers
// (WhatsApp, Facebook, iMessage, Slack, etc.) for this artist, then 302-redirects real visitors
// straight to the SPA profile page. Sharing the raw SPA route instead would only ever show a
// bare link, since crawlers don't execute JS and the SPA's index.html has no per-artist tags.
const buildShareUrl = (singerId: string) => {
  const apiOrigin = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
  return `${apiOrigin}/singer/share/${singerId}`;
};

const ProfileSidebar: React.FC<Props> = ({ name, id, categoryPricing, city, isVerified, unavailability = [], averageRating = 0, reviewCount = 0 }) => {
  const [shareOpen, setShareOpen] = useState(false);
  const [eventDate, setEventDate] = useState<Date | undefined>();
  const [timeSlot, setTimeSlot] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [eventCategories, setEventCategories] = useState<EventCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    eventCategoryService
      .getAllEventCategories()
      .then((res) => setEventCategories(res.categories || []))
      .catch((err) => console.error("Failed to fetch event categories:", err));
  }, []);

  // Only the categories this singer has actually priced — a category they don't offer can't be
  // selected here at all (matches the search-side exclusion rule).
  const offeredCategories = eventCategories.filter(
    (category) => categoryPricing?.[category.categoryId]?.price
  );
  const selectedPrice = selectedCategory ? categoryPricing?.[selectedCategory]?.price : undefined;

  const timeSlotOptions = [
    { value: "morning", label: "Morning (8:00 AM onwards)" },
    { value: "afternoon", label: "Afternoon (12:00 PM onwards)" },
    { value: "evening", label: "Evening (6:00 PM onwards)" },
  ];

  // Helper to format date to YYYY-MM-DD
  const formatDateToYYYYMMDD = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Check if a date is fully unavailable (all 3 slots booked)
  const isDateFullyUnavailable = (date: Date): boolean => {
    const dateStr = formatDateToYYYYMMDD(date);
    const unavailableSlotsForDate = unavailability.filter(record => record.date === dateStr);
    return unavailableSlotsForDate.length === 3;
  };

  // Get unavailable time slots for selected date
  const unavailableSlots = useMemo(() => {
    if (!eventDate) return [];
    const dateStr = formatDateToYYYYMMDD(eventDate);
    return unavailability
      .filter(record => record.date === dateStr)
      .map(record => record.timeSlot);
  }, [eventDate, unavailability]);

  // Filter available time slots
  const availableTimeSlots = timeSlotOptions.filter(
    option => !unavailableSlots.includes(option.value as 'morning' | 'afternoon' | 'evening')
  );

  const nav = () => {
    // Pass selected date and time to booking page via state or query params
    let dateString = "";
    if (eventDate) {
      dateString = formatDateToYYYYMMDD(eventDate);
    }
    navigate(`/booking/singer/${id}`, {
      state: {
        preFilledEventDate: dateString,
        preFilledTimeSlot: timeSlot,
        preFilledEventCategory: selectedCategory,
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
            src={singeravatar}
            alt="avatar"
            className="h-14 w-14 z-10 rounded-full object-cover absolute -bottom-7 left-4 border-4 border-white"
          />
        </div>
        <div className="pt-6 z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-[#1C1C1C]">{name}</h2>
                {isVerified && (
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white text-xs">
                    ✓
                  </span>
                )}
              </div>
              <p className="text-sm text-[#6F5D9E]">
                {city || "Saudi Arabia"} • Responds within 1/hr
              </p>
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

      {/* Pricing & Booking card */}
      <div className="rounded-2xl bg-white px-2.5 sm:px-5 py-6 shadow border border-[#EBE4FF] space-y-4">
        {/* Event Category Selector — price is category-specific, so nothing is shown until one is picked */}
        {offeredCategories.length > 0 && (
          <div className="pb-4 border-b border-[#E7DEFF]">
            <label className="text-sm font-semibold text-[#1C1C1C] mb-2 block">Event Type</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full border border-[#E7DEFF] rounded-lg text-[#2E1B4D]">
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {offeredCategories.map((category) => (
                  <SelectItem key={category.categoryId} value={category.categoryId}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedPrice !== undefined && (
              <div className="flex justify-between items-center mt-3">
                <span className="text-sm text-[#6F5D9E]">Price</span>
                <span className="text-lg font-bold text-[#2E1B4D]">SAR {selectedPrice}</span>
              </div>
            )}
          </div>
        )}

        {/* Event Date + Time Slot Selectors — side by side on desktop, stacked on mobile */}
        <div className="lg:flex lg:gap-3">
          <div className="lg:flex-1 lg:min-w-0">
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
                    setTimeSlot(""); // Reset time slot when date changes
                    setCalendarOpen(false);
                  }}
                  disabled={(date) => {
                    // Disable past dates
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    if (date < today) return true;

                    // Disable dates where all time slots are unavailable
                    return isDateFullyUnavailable(date);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="mt-4 lg:mt-0 lg:flex-1 lg:min-w-0">
            <label className="text-sm font-semibold text-[#1C1C1C] flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-primary" />
              Time Slot
            </label>
            <Select
              value={timeSlot}
              onValueChange={setTimeSlot}
              disabled={!eventDate || availableTimeSlots.length === 0}
            >
              <SelectTrigger className="w-full border border-[#E7DEFF] rounded-lg text-[#2E1B4D]">
                <SelectValue placeholder={!eventDate ? "Select a date first" : "Select time slot"} />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {availableTimeSlots.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {eventDate && unavailableSlots.length > 0 && (
              <p className="text-xs text-orange-600 mt-1">
                {unavailableSlots.length === 3
                  ? "No time slots available for this date"
                  : `${availableTimeSlots.length} slot(s) available`}
              </p>
            )}
          </div>
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
        profileUrl={buildShareUrl(id)}
        averageRating={averageRating}
        reviewCount={reviewCount}
      />
    </aside>
  );
};

export default ProfileSidebar;
