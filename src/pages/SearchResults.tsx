import React, { useEffect, useMemo, useState } from "react";
import { Filter, X } from "lucide-react";
import singer1 from "@/assets/images/common/Singer1.png";
import singer2 from "@/assets/images/common/Singer2.png";
import singer3 from "@/assets/images/common/Singer3.png";
import Button from "@/components/common/Button";
import PriceRange from "@/components/common/PriceRange";
import SearchResultCard from "@/components/common/SearchResultCard";
import { SearchBar } from "@/components/common";
import { useNavigate } from "react-router";
import type { SearchData } from "@/components/common/SearchBar";

const SearchResults: React.FC = () => {
  // Applied filters (affect results)
  const [priceRange, setPriceRange] = useState({ min: 0, max: 75000 });
  const [zone, setZone] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState<string>("");
  const [active, setActive] = useState("Custom Dates");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Draft filters (sidebar selections before apply)
  const [tPriceRange, setTPriceRange] = useState({ min: 0, max: 75000 });
  const [tZone, setTZone] = useState<string>("");
  const [tTags, setTTags] = useState<string[]>([]);
  const [tCategory, setTCategory] = useState<string>("");
  const [tActive, setTActive] = useState("Custom Dates");
  const [query, setQuery] = useState<Pick<SearchData, "singerName" | "date">>({
    singerName: "",
    date: "",
  });
  const navigate = useNavigate();

  const buttons = ["Today", "Tomorrow", "This Week", "Custom Dates"];

  const getButtonClasses = (label: any) =>
    label === tActive
      ? "px-4 py-2 text-sm rounded-xl bg-gradient-to-b from-secondary to-secondary-dark border border-primary text-white font-semibold"
      : "px-4 py-2 text-sm rounded-xl border border-[#E3D8FF] text-[#2E1B4D] hover:border-primary hover:text-primary transition";
  type Item = {
    id: number;
    image: string;
    name: string;
    service: string;
    price: number;
    category: string;
    zone: string;
    tags: string[];
    availability: "Today" | "Tomorrow" | "This Week";
  };

  const items: Item[] = useMemo(
    () => [
      {
        id: 1,
        image: singer1,
        name: "Layla Al Noor",
        service: "Acoustic Lounge Set",
        price: 2500,
        category: "Music Events",
        zone: "Boulevard City",
        tags: ["Concerts", "Things to do"],
        availability: "Today",
      },
      {
        id: 2,
        image: singer2,
        name: "Khalid Al Majd",
        service: "Wedding Performance",
        price: 5500,
        category: "Experience",
        zone: "VIA Riyadh",
        tags: ["Families", "Always Available"],
        availability: "Tomorrow",
      },
      {
        id: 3,
        image: singer3,
        name: "Sara Al Haneen",
        service: "Corporate Gala Set",
        price: 4200,
        category: "Theater and Performing Arts",
        zone: "Kingdom Arena",
        tags: ["Workshops", "Health and wellness"],
        availability: "This Week",
      },
      {
        id: 4,
        image: singer1,
        name: "Yousef Al Amal",
        service: "Private Birthday Gig",
        price: 1800,
        category: "Activities & Adventures",
        zone: "Riyadh Zoo",
        tags: ["Couples", "Families"],
        availability: "Today",
      },
      {
        id: 5,
        image: singer2,
        name: "Noor Ensemble",
        service: "String Quartet + Vocal",
        price: 7600,
        category: "Music Events",
        zone: "Boulevard World",
        tags: ["Concerts", "Desert"],
        availability: "This Week",
      },
      {
        id: 6,
        image: singer3,
        name: "Amal & Band",
        service: "Full Band Night",
        price: 9800,
        category: "Restaurants",
        zone: "The Groves",
        tags: ["Things to do", "Couples"],
        availability: "Tomorrow",
      },
      {
        id: 7,
        image: singer1,
        name: "Hassan Live",
        service: "Acoustic Duo",
        price: 3200,
        category: "Experience",
        zone: "BLVD Flowers",
        tags: ["Always Available", "Families"],
        availability: "This Week",
      },
      {
        id: 8,
        image: singer3,
        name: "Maya Voice",
        service: "Jazz Evening",
        price: 6100,
        category: "Theater and Performing Arts",
        zone: "anb arena",
        tags: ["Concerts", "Things to do"],
        availability: "Today",
      },
      {
        id: 9,
        image: singer1,
        name: "Rami Acoustic",
        service: "Coffeehouse Set",
        price: 1400,
        category: "Restaurants",
        zone: "VIA Riyadh",
        tags: ["Couples"],
        availability: "Tomorrow",
      },
      {
        id: 10,
        image: singer2,
        name: "Zeina Live",
        service: "Pop Covers Night",
        price: 3600,
        category: "Music Events",
        zone: "Kingdom Arena",
        tags: ["Concerts"],
        availability: "This Week",
      },
      {
        id: 11,
        image: singer3,
        name: "Omar & Keys",
        service: "Piano + Vocal",
        price: 2700,
        category: "Experience",
        zone: "Boulevard City",
        tags: ["Things to do", "Families"],
        availability: "Today",
      },
      {
        id: 12,
        image: singer1,
        name: "Noura Classic",
        service: "Classic Arabic Set",
        price: 4900,
        category: "Theater and Performing Arts",
        zone: "AROYA Cruises",
        tags: ["Always Available"],
        availability: "Tomorrow",
      },
    ],
    []
  );

  const filteredItems = useMemo(() => {
    return items.filter((it) => {
      const inPrice = it.price >= priceRange.min && it.price <= priceRange.max;
      const inCategory = category ? it.category === category : true;
      const inZone = zone ? it.zone === zone : true;
      const inTags = tags.length
        ? tags.some((t) => it.tags.includes(t))
        : true;
      const matchesSearch = query.singerName
        ? (it.name + " " + it.service).toLowerCase().includes(query.singerName.toLowerCase())
        : true;
      const matchesDate = active === "Custom Dates" ? true : it.availability === active;
      return inPrice && inCategory && inZone && inTags && matchesSearch && matchesDate;
    });
  }, [items, priceRange, category, zone, tags, query, active]);

  const [visibleCount, setVisibleCount] = useState(6);

  // Sync draft filters when opening sidebar
  useEffect(() => {
    if (isFilterOpen) {
      setTPriceRange(priceRange);
      setTZone(zone);
      setTTags(tags);
      setTCategory(category);
      setTActive(active);
    }
  }, [isFilterOpen]);

  // Reset pagination when applied filters/search change
  useEffect(() => {
    setVisibleCount(6);
  }, [priceRange, zone, tags, category, active, query]);

  return (
    <div className="custom-container pb-16">
      <div className="w-full flex justify-between items-center gap-4">
        <SearchBar
          onSearch={(data) => {
            setQuery({ singerName: data.singerName, date: data.date });
            if (data.date) setActive("Custom Dates");
          }}
        />
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
            <p className="text-lg font-bold text-[#1C1C1C]">Price range</p>
            <PriceRange value={tPriceRange} onChange={setTPriceRange} />
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
                  checked={tCategory === c}
                  onChange={() => setTCategory(c)}
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
                  checked={tZone === z}
                  onChange={() => setTZone(z)}
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
                const selected = tTags.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() =>
                      setTTags((prev) =>
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
              onClick={() => {
                setPriceRange(tPriceRange);
                setZone(tZone);
                setTags(tTags);
                setCategory(tCategory);
                setActive(tActive);
                setIsFilterOpen(false);
              }}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Heading */}
      <div className="mt-10 flex flex-col lg:flex-row justify-between items-center">
      <h2 className="heading-5 text-[#1C1C1C]">
        {filteredItems.length}+ Singer’s spaces near {query.singerName ? `"${query.singerName}"` : "you"}
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
          {filteredItems.slice(0, visibleCount).map((it) => (
            <SearchResultCard
              key={it.id}
              image={it.image}
              name={it.name}
              serviceTitle={it.service}
              onViewDetails={() => navigate(`/singers/${it.id}`)}
            />
          ))}
          <div className="col-span-full flex justify-center mt-6">
            {visibleCount < filteredItems.length && (
              <Button
                variant="secondary"
                size="large"
                onClick={() =>
                  setVisibleCount((c) => Math.min(filteredItems.length, c + 4))
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
