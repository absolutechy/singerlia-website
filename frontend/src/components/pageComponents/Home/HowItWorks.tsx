import SimpleCard from "@/components/common/SimpleCard";
import React from "react";

const data = [
  {
    title: "Discover Signer Artist",
    des: "Browse verified musicians, filter by genre, location, and budget. View portfolios, reviews, and sample performances.",
  },
  {
    title: "Booking easy & Connect",
    des: "Send booking requests with event details. Communicate directly with artists to customize your experience.",
  },
  {
    title: "Enjoy the Performance",
    des: "Secure payment protection, live event support, and post-event reviews ensure a perfect experience.",
  },
];

const HowItWorks: React.FC = () => {
  return (
    <div className="py-10 px-5 custom-container">
      <h1 className="font-bold text-4xl lg:text-6xl text-primary text-center">How It Works</h1>
      <p className="text-[#666666] text-center">
        Simple, secure, and seamless booking in three steps.
      </p>
      <div className="w-full flex flex-col lg:flex-row items-end gap-5 mt-14">
        {data.map((item, idx) => (
          <SimpleCard
            key={idx}
            num={"0" + (idx + 1)}
            title={item.title}
            des={item.des}
          />
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;
