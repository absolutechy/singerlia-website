import SingerCard from "@/components/common/SingerCard";
import React from "react";

const Artists: React.FC = () => {
  return (
    <div className="py-10 px-5 w-full custom-container">
      <h1 className="font-bold text-4xl lg:text-6xl text-primary text-center">Featured Artists</h1>
      <p className="text-[#666666] text-center">
        Discover top-rated musicians ready to make your event unforgettable
      </p>
      <div className="w-full grid lg:grid-cols-3 gap-5 my-14">
        <SingerCard />
        <SingerCard />
        <SingerCard />
        <SingerCard />
        <SingerCard />
        <SingerCard />
        <SingerCard />
        <SingerCard />
        <SingerCard />
      </div>
      <div className="w-full flex justify-center">
        <button className="text-lg font-medium text-white bg-primary px-5 py-3 rounded-full cursor-pointer shadow-2xl">
          Show more
        </button>
      </div>
    </div>
  );
};

export default Artists;
