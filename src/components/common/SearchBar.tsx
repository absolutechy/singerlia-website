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
    <div className="bg-white w-full max-w-5xl lg:mx-auto rounded-2xl p-4 md:p-6 shadow-lg">
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
        {/* Search Favorite Artist */}
        <div className="flex-1 md:border-r-2 md:border-[#CDCDCD] md:pr-4">
          <Input
            type="text"
            placeholder="Select Artist, Event Type, and Artist Type"
            value={searchData.singerName}
            onChange={(e) => handleInputChange("singerName", e.target.value)}
          />
        </div>

        {/* Select Date */}
        <div className="w-full md:w-48">
          <DatePicker
            placeholder="Event Date"
            value={searchData.date}
            onChange={(value) => handleInputChange("date", value)}
            className=""
          />
        </div>

        {/* Search Button */}
        <Button
          variant="primary"
          onClick={handleSearch}
          size="large"
          className="flex items-center justify-center gap-2 w-full md:w-auto md:min-w-[140px]"
        >
          Search
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
