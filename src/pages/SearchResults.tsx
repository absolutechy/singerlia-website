import React, { useEffect, useMemo, useState } from "react";
import { Filter } from "lucide-react";
import singer1 from "@/assets/images/common/Singer1.png";
import singer2 from "@/assets/images/common/Singer2.png";
import singer3 from "@/assets/images/common/Singer3.png";
import Button from "@/components/common/Button";
import SingerCard from "@/components/common/SingerCard";
import { SearchBar } from "@/components/common";
import { useLocation, useNavigate } from "react-router";
import type { SearchData } from "@/components/common/SearchBar";
import FilterSidebar, {
  type FilterState,
} from "@/components/pageComponents/SearchResults/FIlterSidebar";

type Singer = {
  id: number;
  image: string;
  name: string;
  service: string;
  price: number;
  genre: string;
  ratings: number;
  city: string;
  tags: string[];
  availability: string;
};

const singers: Singer[] = [
  {
    id: 1,
    image: singer1,
    name: "Layla Al Noor",
    service: "Acoustic Lounge Set",
    price: 2500,
    tags: ["Concerts", "Things to do"],
    availability: "Today",
    genre: "Acoustic Folk",
    ratings: 4.8,
    city: "Riyadh",
  },
  {
    id: 2,
    image: singer2,
    name: "Omar Khalid",
    service: "Modern Pop & Khaliji Hits",
    price: 4000,
    tags: ["Weddings", "Private Parties"],
    availability: "This Weekend",
    genre: "Khaliji Pop",
    ratings: 4.9,
    city: "Jeddah",
  },
  {
    id: 3,
    image: singer3,
    name: "Fatima Al-Ghamdi",
    service: "Classical Arabic Ensemble",
    price: 6000,
    tags: ["Corporate Events", "Traditional Music"],
    availability: "Book Now",
    genre: "Classical Arabic",
    ratings: 4.7,
    city: "Dammam",
  },
  {
    id: 4,
    image: singer1,
    name: "DJ Sami",
    service: "Electronic & House DJ Set",
    price: 3500,
    tags: ["DJ", "Private Parties", "Things to do"],
    availability: "Tonight",
    genre: "Electronic",
    ratings: 4.6,
    city: "Riyadh",
  },
  {
    id: 5,
    image: singer2,
    name: "Ziyad the Oudist",
    service: "Solo Oud Performance",
    price: 2000,
    tags: ["Oud", "Lounge", "Traditional Music"],
    availability: "Available Next Week",
    genre: "Folk",
    ratings: 4.9,
    city: "Khobar",
  },
  {
    id: 6,
    image: singer3,
    name: "Yara Ibrahim",
    service: "Jazz & Soul Quartet",
    price: 5500,
    tags: ["Live Music", "Lounge", "Corporate Events"],
    availability: "This Weekend",
    genre: "Jazz",
    ratings: 4.8,
    city: "Jeddah",
  },
  {
    id: 7,
    image: singer1,
    name: "Amir Al-Harbi",
    service: "Indie Rock Band",
    price: 7000,
    tags: ["Concerts", "Live Music", "Band"],
    availability: "Book Now",
    genre: "Indie Rock",
    ratings: 4.5,
    city: "Riyadh",
  },
  {
    id: 8,
    image: singer2,
    name: "Rasha Asiri",
    service: "Southern Folk Songs",
    price: 3000,
    tags: ["Traditional Music", "Festivals"],
    availability: "Today",
    genre: "Folk",
    ratings: 4.7,
    city: "Abha",
  },
  {
    id: 9,
    image: singer3,
    name: "MC Faisal",
    service: "Live Hip Hop & Rap",
    price: 2800,
    tags: ["Hip Hop", "Things to do", "Concerts"],
    availability: "Tonight",
    genre: "Hip Hop",
    ratings: 4.4,
    city: "Dammam",
  },
  {
    id: 10,
    image: singer1,
    name: "Dana Kareem",
    service: "Top 40 & Pop Hits",
    price: 4500,
    tags: ["Weddings", "Private Parties", "DJ"],
    availability: "Available Next Week",
    genre: "Pop",
    ratings: 4.8,
    city: "Jeddah",
  },
  {
    id: 11,
    image: singer2,
    name: "Tariq Abdul",
    service: "Traditional Qanun Player",
    price: 3200,
    tags: ["Traditional Music", "Weddings", "Lounge"],
    availability: "This Weekend",
    genre: "Classical Arabic",
    ratings: 4.9,
    city: "Riyadh",
  },
  {
    id: 12,
    image: singer3,
    name: "Salma Zahrani",
    service: "Acoustic Pop & Covers",
    price: 2200,
    tags: ["Live Music", "Lounge"],
    availability: "Book Now",
    genre: "Acoustic",
    ratings: 4.6,
    city: "Taif",
  },
];

const SearchResults: React.FC = () => {
  // Applied filters
  const [filters, setFilters] = useState<FilterState>({
    priceRange: { min: 0, max: 75000 },
    genres: [],
    cities: [],
    minRating: 0,
    active: "Custom Dates",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [query, setQuery] = useState<Pick<SearchData, "singerName" | "date">>({
    singerName: "",
    date: "",
  });
  const navigate = useNavigate();
  const location = useLocation();

  const filteredItems = useMemo(() => {
    return singers.filter((it) => {
      const inPrice =
        it.price >= filters.priceRange.min &&
        it.price <= filters.priceRange.max;
      const inGenre = filters.genres.length
        ? filters.genres.includes(it.genre)
        : true;
      const inCity = filters.cities.length
        ? filters.cities.includes(it.city)
        : true;
      const meetsRating = it.ratings >= filters.minRating;
      const matchesSearch = query.singerName
        ? (it.name + " " + it.service)
            .toLowerCase()
            .includes(query.singerName.toLowerCase())
        : true;
      const matchesDate =
        filters.active === "Custom Dates"
          ? true
          : it.availability === filters.active;
      return (
        inPrice &&
        inGenre &&
        inCity &&
        meetsRating &&
        matchesSearch &&
        matchesDate
      );
    });
  }, [singers, filters, query]);

  const [visibleCount, setVisibleCount] = useState(6);

  // Reset pagination when applied filters/search change
  useEffect(() => {
    setVisibleCount(6);
  }, [filters, query]);

  // Apply initial query from URL params (e.g., coming from Home search)
  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    const s = sp.get("s") || "";
    const date = sp.get("date") || "";
    if (s || date) {
      setQuery({ singerName: s, date });
      if (date) {
        setFilters((prev) => ({ ...prev, active: "Custom Dates" }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  // Calculate number of active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.priceRange.min !== 0 || filters.priceRange.max !== 75000) count++;
    if (filters.genres.length > 0) count++;
    if (filters.cities.length > 0) count++;
    if (filters.minRating > 0) count++;
    if (filters.active !== "Custom Dates") count++;
    return count;
  }, [filters]);

  return (
    <div className="custom-container pb-16">
      <div className="w-full flex justify-between items-center gap-4">
        <SearchBar
          onSearch={(data) => {
            setQuery({ singerName: data.singerName, date: data.date });
            if (data.date) {
              setFilters((prev) => ({ ...prev, active: "Custom Dates" }));
            }
          }}
        />
      </div>

      {/* Filter Sidebar Component */}
      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={filters}
      />

      {/* Heading */}
      <div className="mt-10 flex flex-col lg:flex-row justify-between items-center">
        <h2 className="heading-5 text-[#1C1C1C]">
          {filteredItems.length}+ Singer’s spaces near{" "}
          {query.singerName ? `"${query.singerName}"` : "you"}
        </h2>
        {/* Filters pill */}
        <button
          onClick={() => setIsFilterOpen(true)}
          className="cursor-pointer inline-flex items-center justify-end gap-2 rounded-xl bg-white px-4 py-3 shadow border border-[#EBE4FF] relative"
        >
          <Filter className="h-4 w-4 text-[#2E1B4D]" />
          <span className="text-sm font-semibold text-[#2E1B4D]">Filters</span>
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      <div className="mt-6">
        {/* Results grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.slice(0, visibleCount).map((it) => (
            <SingerCard
              key={it.id}
              images={[it.image, it.image, it.image]}
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
