import { SearchBar } from '@/components/common'
import type { SearchData } from '@/components/common/SearchBar'

const Home = () => {
  const handleSearch = (data: SearchData) => {
    console.log('Search submitted:', data);
    // Handle search logic here
  };

  return (
    <div className="">
      
        
        <div className="w-full mt-12">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-3">
              Find Your Perfect Singer
            </h1>
            <p className="text-lg text-gray-600">
              Search and book talented singers for your special events
            </p>
          </div>
          
          <SearchBar onSearch={handleSearch} />
        </div>
    </div>
  )
}

export default Home
