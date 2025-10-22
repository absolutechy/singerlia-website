import { Button } from "@/components/common";
import React from "react";
import logo from "@/assets/images/common/grid.png";

const Why: React.FC = () => {
  return (
    <div className="w-full">
      <div className="custom-container py-28 px-24 flex flex-col lg:flex-row justify-between">
        <div className="w-fit space-y-6">
          <h1 className="font-bold text-4xl lg:text-7xl">Why Singerlia</h1>
          <p className="text-lg text-[#B8860B]">
            Discover talented singers right at your fingertips:
          </p>
          <p className="text-lg max-w-xl">
            Get access to professional singers specializing in live
            performances, weddings, corporate events, parties, and more—all
            conveniently available on a single platform!
          </p>
          <Button
            variant="primary"
            size="large"
            className="flex items-center gap-2 col-span-2 mb-10 lg:mb-0"
          >
            <p className="font-medium">Get Started With Singerlia</p>
          </Button>
        </div>
        <img
          src={logo}
          alt="Why Singerlia"
          className="w-full max-w-xl object-contain object-center"
        />
      </div>
    </div>
  );
};

export default Why;
