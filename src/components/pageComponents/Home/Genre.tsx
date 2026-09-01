import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Music,
  Music2,
  Music3,
  Music4,
  Mic,
  Mic2,
  Guitar,
  Radio,
  Disc,
  Disc2,
  Disc3,
  Headphones,
  Drum,
  PartyPopper,
  type LucideIcon,
} from "lucide-react";
import GenreCard from "@/components/common/GenreCard";
import genreService, { type Genre as GenreType } from "@/api/services/genreService";
import singerService from "@/api/services/singerService";

// A distinct icon per genre card. Cycles by position rather than being keyed to specific genre
// names/ids, so a new genre added later from the admin panel (no deploy) automatically gets a
// sensible icon with no code change needed.
const GENRE_ICONS: LucideIcon[] = [
  Music,
  Mic,
  Guitar,
  Disc,
  Headphones,
  Radio,
  Drum,
  Music2,
  Mic2,
  Disc2,
  PartyPopper,
  Music3,
  Disc3,
  Music4,
];

// The homepage section only ever shows a handful of genres, however many are configured.
const MAX_DISPLAYED_GENRES = 7;

const Genre: React.FC = () => {
  const navigate = useNavigate();
  const [genres, setGenres] = useState<GenreType[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    genreService
      .getAllGenres()
      .then((res) => setGenres((res.genres || []).slice(0, MAX_DISPLAYED_GENRES)))
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
      <div className="flex flex-wrap justify-center gap-y-20 gap-x-12 mt-14">
        {genres.map((genre, index) => (
          <div key={genre.genreId} className="w-[calc(50%-1.5rem)] sm:w-[calc(33.333%-2rem)] lg:w-[150px]">
            <GenreCard
              label={genre.label}
              count={counts[genre.genreId]}
              icon={GENRE_ICONS[index % GENRE_ICONS.length]}
              onClick={() => navigate(`/search?genre=${genre.genreId}`)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Genre;
