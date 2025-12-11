import React, { useEffect, useMemo, useState } from "react";
import { Filter } from "lucide-react";
import singerService from "@/api/services/singerService";
import Button from "@/components/common/Button";
import SingerCard from "@/components/common/SingerCard";
import { SearchBar } from "@/components/common";
import { useLocation, useNavigate } from "react-router";
import type { SearchData } from "@/components/common/SearchBar";
import FilterSidebar, {
  type FilterState,
} from "@/components/pageComponents/SearchResults/FIlterSidebar";

import type { Singer } from "@/api/services/singerService";

const SearchResults: React.FC = () => {
  // Applied filters
  const [filters, setFilters] = useState<FilterState>({
    priceRange: { min: 0, max: 75000 },
    eventTypes: [],
    artistTypes: [],
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
  
  const [apiSingers, setApiSingers] = useState<Singer[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch singers from API
  useEffect(() => {
    fetchSingers();
  }, [query.singerName, filters.cities]);

  const fetchSingers = async () => {
    try {
      setLoading(true);
      const response = await singerService.searchSingers({
        name: query.singerName || undefined,
        city: filters.cities.length > 0 ? filters.cities[0] : undefined,
        limit: 50, // Fetch more results since we're doing client-side filtering
      });
      setApiSingers(response.singers || []);
    } catch (error) {
      console.error("Failed to fetch singers:", error);
      setApiSingers([]);
    } finally {
      setLoading(false);
    }
  };

  // Use only API results
  const allSingers = apiSingers;

  const filteredItems = useMemo(() => {
    return allSingers.filter((it) => {
      const price = it.pricing?.base_price || 0;
      const inPrice =
        price >= filters.priceRange.min &&
        price <= filters.priceRange.max;
      
      const city = it.city || "";
      const inCity = filters.cities.length
        ? filters.cities.includes(city.toLowerCase())
        : true;
      
      // Calculate average rating from reviews
      const avgRating = it.reviews?.length > 0
        ? it.reviews.reduce((sum, r) => sum + parseFloat(r.rating), 0) / it.reviews.length
        : 0;
      const meetsRating = avgRating >= filters.minRating;
      
      const name = it.name || "";
      const genre = it.genre || "";
      const matchesSearch = query.singerName
        ? (name + " " + genre)
            .toLowerCase()
            .includes(query.singerName.toLowerCase())
        : true;
      
      // For now, accept all dates since API doesn't have availability field
      const matchesDate = true;
      
      return (
        inPrice &&
        inCity &&
        meetsRating &&
        matchesSearch &&
        matchesDate
      );
    });
  }, [allSingers, filters, query]);

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
    if (filters.eventTypes.length > 0) count++;
    if (filters.artistTypes.length > 0) count++;
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
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}
        
        {!loading && (
          <>
            {/* Results grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.slice(0, visibleCount).map((it) => {
                const name = it.name || "Artist";
                const genre = it.genre || "Artist";
                // For now, use placeholder images since API doesn't return profile images yet
                const images: string[] = [];
                
                return (
                  <SingerCard
                    key={it.userId}
                    images={images}
                    name={name}
                    serviceTitle={genre}
                    onViewDetails={() => navigate(`/singers/${it.userId}`)}
                  />
                );
              })}
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
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
