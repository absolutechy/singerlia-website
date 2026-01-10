import React from "react";

type Props = {
  photos: string[];
};

const MediaGrid: React.FC<Props> = ({ photos }) => {
  // Show up to 5 photos: 1 large (2x2) + 4 small
  const displayPhotos = photos.slice(0, 5);
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4" style={{ gridAutoRows: "160px" }}>
      {displayPhotos.length > 0 && (
        <div className="col-span-2 row-span-2 rounded-2xl overflow-hidden bg-gray-100">
          <img src={displayPhotos[0]} alt="main" className="w-full h-full object-cover" />
        </div>
      )}
      {displayPhotos.slice(1).map((photo, index) => (
        <div key={index} className="rounded-2xl overflow-hidden bg-gray-100">
          <img src={photo} alt={`media ${index + 2}`} className="w-full h-full object-cover" />
        </div>
      ))}
    </div>
  );
};

export default MediaGrid;

