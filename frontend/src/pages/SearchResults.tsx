import React, { useMemo, useState } from "react";
import { Filter, X } from "lucide-react";
import singer1 from "@/assets/images/common/Singer1.png";
import singer2 from "@/assets/images/common/Singer2.png";
import singer3 from "@/assets/images/common/Singer3.png";
import Button from "@/components/common/Button";
import PriceRange from "@/components/common/PriceRange";
import SingerCard from "@/components/common/SingerCard";
import { SearchBar } from "@/components/common";
import { useNavigate } from "react-router";

const SearchResults: React.FC = () => {
  const [priceRange, setPriceRange] = useState({ min: 0, max: 75000 });
  const [zone, setZone] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [active, setActive] = useState("Today");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const navigate = useNavigate();

  const buttons = ["Today", "Tomorrow", "This Week", "Custom Dates"];

  const getButtonClasses = (label: any) =>
    label === active
      ? "px-4 py-2 text-sm rounded-xl bg-gradient-to-b from-secondary to-secondary-dark border border-primary text-white font-semibold"
      : "px-4 py-2 text-sm rounded-xl border border-[#E3D8FF] text-[#2E1B4D] hover:border-primary hover:text-primary transition";
  const items = useMemo(
    () => [
      {
        id: 1,
        image: singer1,
        name: "Singer Name here",
        service: "Singer Service title here",
      },
      {
        id: 2,
        image: singer2,
        name: "Singer Name here",
        service: "Singer Service title here",
      },
      {
        id: 3,
        image: singer3,
        name: "Singer Name here",
        service: "Singer Service title here",
      },
      {
        id: 4,
        image: singer1,
        name: "Singer Name here",
        service: "Singer Service title here",
      },
      {
        id: 5,
        image: singer2,
        name: "Singer Name here",
        service: "Singer Service title here",
      },
      {
        id: 6,
        image: singer3,
        name: "Singer Name here",
        service: "Singer Service title here",
      },
      {
        id: 7,
        image: singer1,
        name: "Singer Name here",
        service: "Singer Service title here",
      },
      {
        id: 8,
        image: singer3,
        name: "Singer Name here",
        service: "Singer Service title here",
      },
      {
        id: 9,
        image: singer1,
        name: "Singer Name here",
        service: "Singer Service title here",
      },
      {
        id: 10,
        image: singer2,
        name: "Singer Name here",
        service: "Singer Service title here",
      },
      {
        id: 11,
        image: singer3,
        name: "Singer Name here",
        service: "Singer Service title here",
      },
      {
        id: 12,
        image: singer1,
        name: "Singer Name here",
        service: "Singer Service title here",
      },
    ],
    []
  );

  const [visibleCount, setVisibleCount] = useState(6);

  return (
    <div className="custom-container pb-16">
      <div className="w-full flex justify-between items-center gap-4">
        <SearchBar />
      </div>

      {/* Offcanvas Overlay */}
      {isFilterOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity no-doc-scroll"
          onClick={() => setIsFilterOpen(false)}
        />
      )}

      {/* Offcanvas Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 overflow-y-auto ${
          isFilterOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 space-y-6 ">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <h3 className="text-2xl font-bold text-[#1C1C1C]">Filters</h3>
            <button 
              onClick={() => setIsFilterOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <X className="h-5 w-5 text-[#2E1B4D]" />
            </button>
          </div>

          {/* Filter Content */}
          {/* Select dates quick actions */}
          <div className="space-y-3">
            <p className="text-lg font-bold text-[#1C1C1C]">Select dates</p>
            <div className="flex flex-wrap gap-2">
              {buttons.map((label) => (
                <button
                  key={label}
                  onClick={() => setActive(label)}
                  className={getButtonClasses(label)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Price range */}
          <div className="space-y-4">
            <p className="text-lg font-bold text-[#1C1C1C]">Price range</p>
            <PriceRange value={priceRange} onChange={setPriceRange} />
          </div>

          {/* Category */}
          <div className="space-y-3">
            <p className="text-lg font-bold text-[#1C1C1C]">Category</p>
            {[
              "Sports",
              "Theater and Performing Arts",
              "Experience",
              "Activities & Adventures",
              "Music Events",
              "Restaurants",
            ].map((c, idx) => (
              <label
                key={c}
                className="flex items-center gap-2 text-sm text-[#2F1C4E]"
              >
                <input
                  type="radio"
                  name="category"
                  defaultChecked={idx === 0}
                />{" "}
                {c}
              </label>
            ))}
          </div>

          {/* Zone */}
          <div className="space-y-3">
            <p className="text-lg font-bold text-[#1C1C1C]">Zone</p>
            {[
              "HORROR CON",
              "Boulevard City",
              "Boulevard World",
              "anb arena",
              "The Groves",
              "VIA Riyadh",
              "Kingdom Arena",
              "Riyadh Zoo",
              "AL SUWAIDI PARK",
              "BLVD Flowers",
              "AROYA Cruises",
              "Beast Land",
            ].map((z) => (
              <label
                key={z}
                className="flex items-center gap-2 text-sm text-[#2F1C4E]"
              >
                <input
                  type="radio"
                  name="zone"
                  checked={zone === z}
                  onChange={() => setZone(z)}
                />
                {z}
              </label>
            ))}
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <p className="text-lg font-bold text-[#1C1C1C]">Tags</p>
            <div className="flex flex-wrap gap-2">
              {[
                "Riyadh Combat Club",
                "Nofa Safari",
                "Concerts",
                "Saudi Esports League",
                "Football",
                "Burger",
                "Things to do",
                "Xclusive Yachts",
                "Air balloon",
                "Workshops",
                "Health and wellness",
                "Desert",
                "Always Available",
                "Yachts",
                "Couples",
                "Families",
              ].map((t) => {
                const selected = tags.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() =>
                      setTags((prev) =>
                        prev.includes(t)
                          ? prev.filter((x) => x !== t)
                          : [...prev, t]
                      )
                    }
                    className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                      selected
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-[#2E1B4D] border-[#E3D8FF]"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Apply Button */}
          <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t border-gray-200">
            <Button
              variant="primary"
              size="large"
              className="w-full rounded-xl"
              onClick={() => setIsFilterOpen(false)}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Heading */}
      <div className="mt-10 flex flex-col lg:flex-row justify-between items-center">
      <h2 className="heading-5 text-[#1C1C1C]">
        45+ Singer’s spaces near city name here, country name here
      </h2>
      {/* Filters pill */}
        <button 
          onClick={() => setIsFilterOpen(true)}
          className="cursor-pointer inline-flex items-center justify-end gap-2 rounded-xl bg-white px-4 py-3 shadow border border-[#EBE4FF]"
        >
          <Filter className="h-4 w-4 text-[#2E1B4D]" />
          <span className="text-sm font-semibold text-[#2E1B4D]">Filters</span>
        </button>
      </div>

      <div className="mt-6">
        {/* Results grid - Full width now */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.slice(0, visibleCount).map((it) => (
            <SingerCard
              key={it.id}
              // image={it.image}
              // name={it.name}
              // serviceTitle={it.service}
              onViewDetails={() => navigate(`/singers/${it.id}`)}
            />
          ))}
          <div className="col-span-full flex justify-center mt-6">
            {visibleCount < items.length && (
              <Button
                variant="secondary"
                size="large"
                onClick={() =>
                  setVisibleCount((c) => Math.min(items.length, c + 4))
                }
                className="px-6 py-3 rounded-full bg-primary text-white text-lg font-semibold shadow-[0_8px_24px_rgba(55,21,82,0.25)] hover:shadow-[0_10px_28px_rgba(55,21,82,0.35)] transition-shadow"
              >
                Show more
              </Button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default SearchResults;
