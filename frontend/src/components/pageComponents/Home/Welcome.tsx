import { Button } from "@/components/common";
import React from "react";

const Welcome: React.FC = () => {
  return (
    <div className="w-full bg-primary text-white">
      <div className="custom-container py-28 px-24 flex justify-between">
        <div className="w-fit space-y-6">
          <h1 className="heading-1 leading-none max-w-xl">
            Welcome Singerlia Earn Income as a Signer
          </h1>
          <p className="text-lg">Put your Portfolio to work.</p>
          <p className="text-lg max-w-md">
            Earn extra income by opening your doors to personal and professional
            gatherings in your area.
          </p>
          <Button
            variant="primary"
            size="large"
            className="flex items-center gap-2 col-span-2"
          >
            <p className="font-medium">List your space</p>
          </Button>
        </div>
        <div className="bg-white text-black rounded-2xl max-w-md p-5">
          <div className="w-full h-64 rounded-xl bg-primary" />
          <p className="font-semibold text-2xl my-10 max-w-sm">
            “I can't tell how easy it was to Create your account as a Singer”
          </p>
          <p className="font-semibold">John Alex</p>
          <p>Co-founder at Singerlia</p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
