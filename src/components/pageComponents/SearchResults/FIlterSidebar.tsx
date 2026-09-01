import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import Button from '@/components/common/Button';
import PriceRange from '@/components/common/PriceRange';
import { SAUDI_CITIES } from '@/constants/cities';
import eventCategoryService, { type EventCategory } from '@/api/services/eventCategoryService';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterState) => void;
  currentFilters: FilterState;
}

export interface FilterState {
  priceRange: { min: number; max: number };
  // Holds at most one categoryId — a singer's price (and their appearance in results at all) is
  // category-specific, so unlike the other filters below this one is effectively single-select.
  eventTypes: string[];
  artistTypes: string[];
  cities: string[];
  minRating: number;
  active: string;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  currentFilters,
}) => {
  // Draft filters (sidebar-only until Apply)
  const [tPriceRange, setTPriceRange] = useState({ min: 0, max: 75000 });
  const [tEventTypes, setTEventTypes] = useState<string[]>([]);
  const [tArtistTypes, setTArtistTypes] = useState<string[]>([]);
  const [tCities, setTCities] = useState<string[]>([]);
  const [tMinRating, setTMinRating] = useState<number>(0);
  const [tActive, setTActive] = useState("Custom Dates");

  const buttons = ["Today", "Tomorrow", "This Week", "Custom Dates"];

  const [eventCategories, setEventCategories] = useState<EventCategory[]>([]);

  useEffect(() => {
    eventCategoryService
      .getAllEventCategories()
      .then((res) => setEventCategories(res.categories || []))
      .catch((err) => console.error("Failed to fetch event categories:", err));
  }, []);

  const artistTypeOptions = [
    "Singers",
    "DJs",
    "Instrumentalists",
    "Bands",
    "Music Producers",
    "Sound Engineers",
    "Traditional Performances",
  ];

  const cityOptions = SAUDI_CITIES;

  const ratingOptions = [
    { label: "4.5+ Stars", value: 4.5 },
    { label: "4.0+ Stars", value: 4.0 },
    { label: "3.5+ Stars", value: 3.5 },
    { label: "All Ratings", value: 0 },
  ];

  const getButtonClasses = (label: string) =>
    label === tActive
      ? "px-4 py-2 text-sm rounded-xl bg-gradient-to-b from-secondary to-secondary-dark border border-primary text-white font-semibold"
      : "px-4 py-2 text-sm rounded-xl border border-[#E3D8FF] text-[#2E1B4D] hover:border-primary hover:text-primary transition";

  // Sync draft filters when opening
  useEffect(() => {
    if (isOpen) {
      setTPriceRange(currentFilters.priceRange);
      setTEventTypes(currentFilters.eventTypes);
      setTArtistTypes(currentFilters.artistTypes);
      setTCities(currentFilters.cities);
      setTMinRating(currentFilters.minRating);
      setTActive(currentFilters.active);
    }
  }, [isOpen, currentFilters]);

  const handleApply = () => {
    onApplyFilters({
      priceRange: tPriceRange,
      eventTypes: tEventTypes,
      artistTypes: tArtistTypes,
      cities: tCities,
      minRating: tMinRating,
      active: tActive,
    });
    onClose();
  };

  const handleClearAll = () => {
    const clearedFilters = {
      priceRange: { min: 0, max: 75000 },
      eventTypes: [],
      artistTypes: [],
      cities: [],
      minRating: 0,
      active: "Custom Dates",
    };

    // Update local state
    setTPriceRange(clearedFilters.priceRange);
    setTEventTypes(clearedFilters.eventTypes);
    setTArtistTypes(clearedFilters.artistTypes);
    setTCities(clearedFilters.cities);
    setTMinRating(clearedFilters.minRating);
    setTActive(clearedFilters.active);

    // Immediately apply the cleared filters
    onApplyFilters(clearedFilters);
  };

  const hasActiveFilters =
    tPriceRange.min !== 0 ||
    tPriceRange.max !== 75000 ||
    tEventTypes.length > 0 ||
    tArtistTypes.length > 0 ||
    tCities.length > 0 ||
    tMinRating > 0 ||
    tActive !== "Custom Dates";

  return (
    <>
      {/* Offcanvas Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity no-doc-scroll"
          onClick={onClose}
        />
      )}

      {/* Offcanvas Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <h3 className="text-2xl font-bold text-[#1C1C1C]">Filters</h3>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <button 
                  onClick={handleClearAll}
                  className="text-sm text-primary font-semibold hover:underline"
                >
                  Clear All
                </button>
              )}
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X className="h-5 w-5 text-[#2E1B4D]" />
              </button>
            </div>
          </div>

          {/* Filter Content */}
          {/* Select dates quick actions */}
          <div className="space-y-3">
            <p className="text-lg font-bold text-[#1C1C1C]">Select dates</p>
            <div className="flex flex-wrap gap-2">
              {buttons.map((label) => (
                <button
                  key={label}
                  onClick={() => setTActive(label)}
                  className={getButtonClasses(label)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Price range */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-[#1C1C1C]">Price range</p>
              {(tPriceRange.min !== 0 || tPriceRange.max !== 75000) && (
                <button
                  onClick={() => setTPriceRange({ min: 0, max: 75000 })}
                  className="text-xs text-primary hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
            <PriceRange value={tPriceRange} onChange={setTPriceRange} />
          </div>

          {/* Event Type */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-[#1C1C1C]">Event Type</p>
              {tEventTypes.length > 0 && (
                <button
                  onClick={() => setTEventTypes([])}
                  className="text-xs text-primary hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {eventCategories.map((category) => {
                const selected = tEventTypes.includes(category.categoryId);
                return (
                  <button
                    key={category.categoryId}
                    type="button"
                    // Single-select: a singer's price (and whether they show up at all) is
                    // category-specific, so only one category can be filtered on at a time.
                    onClick={() =>
                      setTEventTypes((prev) =>
                        prev.includes(category.categoryId) ? [] : [category.categoryId]
                      )
                    }
                    className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                      selected
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-[#2E1B4D] border-[#E3D8FF]"
                    }`}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Artist Type */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-[#1C1C1C]">Artist Type</p>
              {tArtistTypes.length > 0 && (
                <button
                  onClick={() => setTArtistTypes([])}
                  className="text-xs text-primary hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {artistTypeOptions.map((artistType) => {
                const selected = tArtistTypes.includes(artistType);
                return (
                  <button
                    key={artistType}
                    type="button"
                    onClick={() =>
                      setTArtistTypes((prev) =>
                        prev.includes(artistType)
                          ? prev.filter((x) => x !== artistType)
                          : [...prev, artistType]
                      )
                    }
                    className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                      selected
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-[#2E1B4D] border-[#E3D8FF]"
                    }`}
                  >
                    {artistType}
                  </button>
                );
              })}
            </div>
          </div>

          {/* City */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-[#1C1C1C]">City</p>
              {tCities.length > 0 && (
                <button
                  onClick={() => setTCities([])}
                  className="text-xs text-primary hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {cityOptions.map((city) => {
                // Stored/compared by the lowercase slug (matches how a singer's city is
                // actually saved at signup, see SingerSignup.tsx) — not the display label —
                // so this filter actually matches singers instead of silently matching nothing.
                const selected = tCities.includes(city.value);
                return (
                  <button
                    key={city.value}
                    type="button"
                    onClick={() =>
                      setTCities((prev) =>
                        prev.includes(city.value)
                          ? prev.filter((x) => x !== city.value)
                          : [...prev, city.value]
                      )
                    }
                    className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                      selected
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-[#2E1B4D] border-[#E3D8FF]"
                    }`}
                  >
                    {city.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-[#1C1C1C]">Minimum Rating</p>
              {tMinRating > 0 && (
                <button
                  onClick={() => setTMinRating(0)}
                  className="text-xs text-primary hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
            {ratingOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 text-sm text-[#2F1C4E] cursor-pointer"
              >
                <input
                  type="radio"
                  name="rating"
                  checked={tMinRating === option.value}
                  onChange={() => setTMinRating(option.value)}
                  className="cursor-pointer"
                />
                {option.label}
              </label>
            ))}
          </div>

          {/* Apply Button */}
          <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t border-gray-200">
            <Button
              variant="primary"
              size="large"
              className="w-full rounded-xl"
              onClick={handleApply}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;