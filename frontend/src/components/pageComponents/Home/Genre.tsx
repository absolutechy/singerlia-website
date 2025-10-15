import GenreCard from "@/components/common/GenreCard";
import React from "react";

const Genre: React.FC = () => {
  return (
    <div className="pt-10 pb-20 px-5 custom-container">
      <h1 className="heading-2 text-primary text-center">Browse by Genre</h1>
      <p className="text-[#666666] text-center">
        Find the perfect sound for your event across all musical styles.
      </p>
      <div className="grid grid-cols-7 gap-12 mt-14">
        <GenreCard />
        <GenreCard />
        <GenreCard />
        <GenreCard />
        <GenreCard />
        <GenreCard />
        <GenreCard />
      </div>
    </div>
  );
};

export default Genre;
