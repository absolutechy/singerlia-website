import React, { useMemo, useState } from "react";
import { Filter, Search, ChevronDown } from "lucide-react";
import SearchResultCard from "@/components/common/SearchResultCard";
import singer1 from "@/assets/images/common/Singer1.png";
import singer2 from "@/assets/images/common/Singer2.png";
import singer3 from "@/assets/images/common/Singer3.png";
import Button from "@/components/common/Button";
import PriceRange from "@/components/common/PriceRange";
import { useNavigate } from "react-router";

const SearchResults: React.FC = () => {
  const [priceRange, setPriceRange] = useState({ min: 0, max: 75000 });
  const [zone, setZone] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [active, setActive] = useState("Today");

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
  const navigate = useNavigate();

  return (
    <div className="custom-container pb-16">
      {/* Top search controls */}
      <div className="w-full flex justify-between items-center gap-4">
        {/* Combined search box */}
        <div className="flex-1 max-w-4xl flex items-center bg-white rounded-2xl shadow-md pl-4 pr-2 py-2">
          {/* Search input */}
          <div className="flex items-center gap-2 flex-1">
            <Search className="h-4 w-4 text-[#6F5D9E]" />
            <input
              className="w-full h-10 bg-transparent text-sm text-[#2F1C4E] placeholder:text-[#9AA0B4] focus:outline-none"
              placeholder="Search..."
            />
          </div>
          {/* Divider */}
          <span className="h-8 w-px bg-[#E7DEFF] mx-3" />
          {/* Date display with chevron */}
          <button className="flex items-center gap-8 pl-1 pr-2">
            <div className="text-left leading-tight">
              <p className="text-xs font-semibold text-[#2E1B4D]">
                Select Date
              </p>
              <p className="text-xs text-[#6F5D9E]">Add Dates & Time</p>
            </div>
            <ChevronDown className="h-4 w-4 text-[#2E1B4D]" />
          </button>
          {/* Action button */}
          <div className="ml-2">
            <Button
              variant="primary"
              size="medium"
              className="rounded-xl px-6 h-11"
            >
              Change Search
            </Button>
          </div>
        </div>

        {/* Filters pill */}
        <button className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 shadow border border-[#EBE4FF] mr-0 lg:mr-12">
          <Filter className="h-4 w-4 text-[#2E1B4D]" />
          <span className="text-sm font-semibold text-[#2E1B4D]">Filters</span>
        </button>
      </div>

      {/* Heading */}
      <h2 className="mt-8 heading-5 text-[#1C1C1C]">
        45+ Singer’s spaces near city name here, country name here
      </h2>

      <div className="mt-6 grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* Sidebar Filters */}
        <aside className="space-y-8">
          {/* Select dates quick actions */}
          <div className="space-y-3">
            <p className="text-2xl font-bold text-[#1C1C1C]">Select dates</p>
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
            <p className="text-2xl font-bold text-[#1C1C1C]">Price range</p>
            <PriceRange value={priceRange} onChange={setPriceRange} />
          </div>

          {/* Category */}
          <div className="space-y-3">
            <p className="text-2xl font-bold text-[#1C1C1C]">Category</p>
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
            <p className="text-2xl font-bold text-[#1C1C1C]">Zone</p>
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
            <p className="text-2xl font-bold text-[#1C1C1C]">Tags</p>
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
                    className={`px-4 py-2 rounded-full text-sm border transition-colors ${
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
        </aside>

        {/* Results grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.slice(0, visibleCount).map((it) => (
            <SearchResultCard
              key={it.id}
              image={it.image}
              name={it.name}
              serviceTitle={it.service}
              onViewDetails={() => navigate(`/singers/${it.id}`)}
            />
          ))}
          <div className="col-span-2 flex justify-center mt-6">
            {visibleCount < items.length && (
              <button
                type="button"
                onClick={() =>
                  setVisibleCount((c) => Math.min(items.length, c + 4))
                }
                className="px-6 py-3 rounded-full bg-primary text-white text-lg font-semibold shadow-[0_8px_24px_rgba(55,21,82,0.25)] hover:shadow-[0_10px_28px_rgba(55,21,82,0.35)] transition-shadow"
              >
                Show more
              </button>
            )}
          </div>
        </section>

        {/* Show more button */}
      </div>
    </div>
  );
};

export default SearchResults;
