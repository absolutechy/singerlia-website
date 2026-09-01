import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import GenreCard from "@/components/common/GenreCard";
import genreService, { type Genre as GenreType } from "@/api/services/genreService";
import singerService from "@/api/services/singerService";

const Genre: React.FC = () => {
  const navigate = useNavigate();
  const [genres, setGenres] = useState<GenreType[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    genreService
      .getAllGenres()
      .then((res) => setGenres(res.genres || []))
      .catch((err) => console.error("Failed to fetch genres:", err));
  }, []);

  // No dedicated counts endpoint exists — for this small, fixed set of homepage genre cards,
  // fire one lightweight search per genre in parallel and read back the result total.
  useEffect(() => {
    if (genres.length === 0) return;
    let cancelled = false;

    Promise.all(
      genres.map((genre) =>
        singerService
          .searchSingers({ genre: genre.genreId, limit: 1 })
          .then((res) => [genre.genreId, res.total || 0] as const)
          .catch(() => [genre.genreId, 0] as const)
      )
    ).then((entries) => {
      if (cancelled) return;
      setCounts(Object.fromEntries(entries));
    });

    return () => {
      cancelled = true;
    };
  }, [genres]);

  if (genres.length === 0) return null;

  return (
    <div className="pt-10 pb-20 px-5 custom-container">
      <h1 className="font-bold text-4xl lg:text-6xl text-primary text-center">Browse by Genre</h1>
      <p className="text-[#666666] text-center">
        Find the perfect sound for your event across all musical styles.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-y-20 gap-x-12 mt-14">
        {genres.map((genre) => (
          <GenreCard
            key={genre.genreId}
            label={genre.label}
            count={counts[genre.genreId]}
            onClick={() => navigate(`/search?genre=${genre.genreId}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default Genre;
