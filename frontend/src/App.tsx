import { Header, SearchBar } from './components/common'
import type { SearchData } from './components/common/SearchBar'
import landingBgImage from '@/assets/images/landingtopbg.png'

const App = () => {
  const handleSearch = (data: SearchData) => {
    console.log('Search submitted:', data);
    // Handle search logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 ">
      <div 
        className="w-full space-y-8 bg-cover bg-center p-5 "
        style={{ backgroundImage: `url(${landingBgImage})`, backgroundSize: 'cover', backgroundPosition: 'top' }}
      >
        <Header />
        
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
    </div>
  )
}

export default App
