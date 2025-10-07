import React, { useState } from 'react';
import Input from './Input';
import Select from './Select';
import Button from './Button';
import DatePicker from './DatePicker';

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
    singerName: '',
    city: '',
    date: '',
    duration: '',
    pricing: '',
  });

  const cityOptions = [
    { value: 'karachi', label: 'Karachi' },
    { value: 'lahore', label: 'Lahore' },
    { value: 'islamabad', label: 'Islamabad' },
    { value: 'rawalpindi', label: 'Rawalpindi' },
    { value: 'faisalabad', label: 'Faisalabad' },
    { value: 'multan', label: 'Multan' },
    { value: 'peshawar', label: 'Peshawar' },
    { value: 'quetta', label: 'Quetta' },
  ];

  const durationOptions = [
    { value: '1-2', label: '1-2 hours' },
    { value: '2-4', label: '2-4 hours' },
    { value: '4-6', label: '4-6 hours' },
    { value: '6+', label: '6+ hours' },
    { value: 'full-day', label: 'Full Day' },
  ];

  const pricingOptions = [
    { value: '0-50000', label: 'Under Rs. 50,000' },
    { value: '50000-100000', label: 'Rs. 50,000 - 100,000' },
    { value: '100000-200000', label: 'Rs. 100,000 - 200,000' },
    { value: '200000-500000', label: 'Rs. 200,000 - 500,000' },
    { value: '500000+', label: 'Above Rs. 500,000' },
  ];

  const handleInputChange = (
    field: keyof SearchData,
    value: string
  ) => {
    setSearchData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchData);
    }
    console.log('Search data:', searchData);
  };

  return (
    <div className="bg-white rounded-[20px] shadow-lg p-6 w-full">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
        {/* Search Favorites Signer */}
        {/* Search Your Favourite Singer */}
        <div className="border-r-2 border-[#CDCDCD]">
          <Input
            type="text"
            label="Search Favorite Singer"
            placeholder="Select your active singers"
            value={searchData.singerName}
            onChange={(e) => handleInputChange('singerName', e.target.value)}
            className=""
          />
        </div>

        {/* Where? (City) */}
        <div className="border-r-2 border-[#CDCDCD]">
          <Select
            label="Where?"
            options={cityOptions}
            placeholder="Select a city or address"
            value={searchData.city}
            onChange={(value) => handleInputChange('city', value)}
            className=""
          />
        </div>

        {/* Select Date */}
        <div className="border-r-2 border-[#CDCDCD]">
          <DatePicker
            label="Select Date"
            placeholder="Select Date"
            value={searchData.date}
            onChange={(value) => handleInputChange('date', value)}
            className=""
          />
        </div>

        {/* Time Duration */}
        <div className="border-r-2 border-[#CDCDCD]">
          <Select
            label="Time Duration"
            options={durationOptions}
            placeholder="Add Dates & Time"
            value={searchData.duration}
            onChange={(value) => handleInputChange('duration', value)}
            className=""
          />
        </div>

        {/* Pricing */}
        <div>
          <Select
            label="Pricing"
            options={pricingOptions}
            placeholder="Select Pricing"
            value={searchData.pricing}
            onChange={(value) => handleInputChange('pricing', value)}
            className=""
          />
        </div>
        <Button
          variant="primary"
          onClick={handleSearch}
          size='large'
          className="flex items-center gap-2"
        >
          Search
        </Button>
      </div>

    </div>
  );
};

export default SearchBar;
