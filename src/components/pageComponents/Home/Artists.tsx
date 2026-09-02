import SingerCard from "@/components/common/SingerCard";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import singerService, { type Singer } from "@/api/services/singerService";
import genreService, { type Genre } from "@/api/services/genreService";

const Artists: React.FC = () => {
  const navigate = useNavigate();
  const [singers, setSingers] = useState<Singer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [visibleCount, setVisibleCount] = useState(9);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    fetchFeaturedSingers();
    fetchWishlist();
    genreService
      .getAllGenres()
      .then((res) => setGenres(res.genres || []))
      .catch((err) => console.error("Failed to fetch genres:", err));
  }, []);

  const getGenreLabels = (singer: Singer) =>
    (singer.genreIds || []).map((id) => genres.find((g) => g.genreId === id)?.label || id).join(", ");

  const fetchWishlist = async () => {
    try {
      const wishlistData = await singerService.getWishlist();
      setWishlist(wishlistData);
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
      // Silently fail - user might not be logged in
    }
  };

  const fetchFeaturedSingers = async () => {
    try {
      setLoading(true);
      const response = await singerService.getFeaturedSingers(50);
      setSingers(response.singers || []);
      setError("");
    } catch (err: any) {
      console.error("Failed to fetch featured singers:", err);
      setError("Failed to load featured artists");
    } finally {
      setLoading(false);
    }
  };

  const displayedSingers = singers.slice(0, visibleCount);

  if (!loading && !error && singers.length === 0) return null;

  return (
    <div className="py-10 !px-4 w-full custom-container">
      <h1 className="font-bold text-4xl lg:text-6xl text-primary text-center">Featured Artists</h1>
      <p className="text-[#666666] text-center">
        Discover top-rated musicians ready to make your event unforgettable
      </p>
      
      {loading && (
        <div className="flex justify-center items-center my-14">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {error && (
        <div className="text-center text-red-600 my-14">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && singers.length > 0 && (
        <>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-14">
            {displayedSingers.map((singer) => {
              const name = singer.name || "Artist";
              const genre = getGenreLabels(singer) || "Artist";

              return (
                <SingerCard
                  key={singer.userId}
                  singerId={singer.userId}
                  name={name}
                  serviceTitle={genre}
                  images={singer.photoUrls?.length > 0 ? singer.photoUrls : undefined}
                  isInWishlist={wishlist.includes(singer.userId)}
                  responseTimeHours={singer.responseTimeHours}
                  onViewDetails={() => navigate(`/singers/${singer.userId}`)}
                />
              );
            })}
          </div>
          {visibleCount < singers.length && (
            <div className="w-full flex justify-center">
              <button 
                onClick={() => setVisibleCount(prev => Math.min(singers.length, prev + 6))}
                className="text-lg font-medium text-white bg-primary px-5 py-3 rounded-full cursor-pointer shadow-2xl hover:bg-primary/90 transition-colors"
              >
                Show more
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Artists;
