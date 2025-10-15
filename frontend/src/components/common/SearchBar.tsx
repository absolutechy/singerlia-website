import React, { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import DatePicker from "./DatePicker";

interface SearchBarProps {
  onSearch?: (data: SearchData) => void;
}

export interface SearchData {
  singerName: string;
  city: string;
  date: string;
  duration: string;
  pricing: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchData, setSearchData] = useState<SearchData>({
    singerName: "",
    city: "",
    date: "",
    duration: "",
    pricing: "",
  });

  const handleInputChange = (field: keyof SearchData, value: string) => {
    setSearchData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchData);
    }
    console.log("Search data:", searchData);
  };

  return (
    <div className="bg-white custom-container rounded-2xl !p-6 shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Search Favorites Signer */}
        {/* Search Your Favourite Singer */}
        <div className="border-r-2 col-span-8 border-[#CDCDCD]">
          <Input
            type="text"
            label="Search Favorite Singer"
            placeholder="Select your active singers"
            value={searchData.singerName}
            onChange={(e) => handleInputChange("singerName", e.target.value)}
            className=""
          />
        </div>

        {/* Select Date */}
        <div className="col-span-2">
          <DatePicker
            label="Select Date"
            placeholder="Select Date"
            value={searchData.date}
            onChange={(value) => handleInputChange("date", value)}
            className=""
          />
        </div>
        <Button
          variant="primary"
          onClick={handleSearch}
          size="large"
          className="flex items-center gap-2 col-span-2"
        >
          Search
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
