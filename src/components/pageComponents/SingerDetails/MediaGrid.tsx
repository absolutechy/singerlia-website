import React from "react";
import singer1 from "@/assets/images/singer/singer-detail-1.png";
import singer2 from "@/assets/images/singer/singer-detail-2.png";
import singer3 from "@/assets/images/singer/singer-detail-3.png";

const MediaGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4" style={{ gridAutoRows: "160px" }}>
      <div className="col-span-2 row-span-2 rounded-2xl overflow-hidden">
        <img src={singer1} alt="main" className="w-full h-full object-cover" />
      </div>
      <div className="rounded-2xl overflow-hidden">
        <img src={singer1} alt="m2" className="w-full h-full object-cover" />
      </div>
      <div className="rounded-2xl overflow-hidden">
        <img src={singer1} alt="m3" className="w-full h-full object-cover" />
      </div>
      <div className="rounded-2xl overflow-hidden">
        <img src={singer2} alt="m4" className="w-full h-full object-cover" />
      </div>
      <div className="rounded-2xl overflow-hidden">
        <img src={singer3} alt="m5" className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

export default MediaGrid;

