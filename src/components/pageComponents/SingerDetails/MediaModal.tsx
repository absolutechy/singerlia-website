import React, { useEffect, useMemo, useState } from "react";
import Modal from "@/components/common/Modal";
import "swiper/css";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/common";

type Props = {
  open: boolean;
  onClose: () => void;
  photos: string[];
  youtubeLinks: string[];
};

const MediaModal: React.FC<Props> = ({ open, onClose, photos, youtubeLinks }) => {
  const [mediaTab, setMediaTab] = useState<"videos" | "photos">("videos");
  const [activeSlide, setActiveSlide] = useState(0);

    const mediaData = useMemo(() => {
    return {
      videos: youtubeLinks,
      photos: photos,
    } as const;
  }, [photos, youtubeLinks]);

  const currentMedia = mediaData[mediaTab];
  const totalSlides = currentMedia.length;

  // Reset to first slide when switching tabs
  useEffect(() => {
    setActiveSlide(0);
  }, [mediaTab]);

  // Determine if we should show multiple slides
  const showMultipleSlides = totalSlides >= 3;

  const handlePrev = () => {
    setActiveSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const getSlideStyle = (index: number) => {
    if (!showMultipleSlides) {
      // Single slide view for < 3 items
      return index === activeSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute';
    }

    // Multiple slides view (3+)
    const diff = index - activeSlide;
    const normalizedDiff = diff < -Math.floor(totalSlides / 2) 
      ? diff + totalSlides 
      : diff > Math.floor(totalSlides / 2) 
      ? diff - totalSlides 
      : diff;

    if (normalizedDiff === 0) {
      return 'opacity-100 scale-100 z-20';
    } else if (Math.abs(normalizedDiff) === 1) {
      return 'opacity-50 scale-75 z-10';
    } else {
      return 'opacity-0 scale-50 z-0';
    }
  };

  const getSlidePosition = (index: number) => {
    if (!showMultipleSlides) {
      return 'left-1/2 -translate-x-1/2';
    }

    const diff = index - activeSlide;
    const normalizedDiff = diff < -Math.floor(totalSlides / 2) 
      ? diff + totalSlides 
      : diff > Math.floor(totalSlides / 2) 
      ? diff - totalSlides 
      : diff;

    if (normalizedDiff === 0) {
      return 'left-1/2 -translate-x-1/2';
    } else if (normalizedDiff === -1) {
      return 'left-[15%] -translate-x-1/2';
    } else if (normalizedDiff === 1) {
      return 'left-[85%] -translate-x-1/2';
    } else {
      return 'left-1/2 -translate-x-1/2';
    }
  };

  return (
    <Modal open={open} onClose={onClose} panelClassName="max-w-[1100px] h-[90vh] overflow-y-scroll w-full p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-[#1C1C1C]">
          My portfolio events videos & photos
        </h2>
        <button
          onClick={onClose}
          aria-label="Close"
          className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
        >
          <X size={16} />
        </button>
      </div>

      {/* Tabs */}
      <div className="mt-5 flex items-center justify-center">
        <div className="inline-flex items-center rounded-full bg-[#F7F7F7] px-1 py-1">
          {(["videos", "photos"] as const).map((tab) => (
            <Button
              variant="default"
              key={tab}
              onClick={() => {
                setMediaTab(tab);
                setActiveSlide(0);
              }}
              className={`px-12 py-2 !rounded-full text-sm font-semibold transition-colors ${
                mediaTab === tab ? "!text-white !bg-primary" : "!text-black"
              }`}
            >
              {tab === "videos" ? "Videos" : "Photos"}
            </Button>
          ))}
        </div>
      </div>

      {/* Slider with arrows */}
      <div className="relative mt-6 h-[500px]">
        {totalSlides > 1 && (
          <>
            {/* Left arrow */}
            <button
              onClick={handlePrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-30 h-9 w-9 rounded-full border border-purple-200 bg-white shadow-lg flex items-center justify-center hover:bg-gray-50"
              aria-label="Previous"
            >
              <ChevronLeft size={18} className="text-purple-900" />
            </button>
            {/* Right arrow */}
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-30 h-9 w-9 rounded-full border border-purple-200 bg-white shadow-lg flex items-center justify-center hover:bg-gray-50"
              aria-label="Next"
            >
              <ChevronRight size={18} className="text-purple-900" />
            </button>
          </>
        )}

        {/* Slides container */}
        <div className="relative w-full h-full">
          {currentMedia.map((item, i) => (
            <div
              key={`${mediaTab}-${i}`}
              className={`absolute top-1/2 -translate-y-1/2 transition-all duration-500 ease-out ${getSlidePosition(i)} ${getSlideStyle(i)}`}
              style={{
                width: showMultipleSlides && i === activeSlide ? '368px' : '224px',
              }}
            >
              <div className="relative rounded-3xl overflow-hidden">
                {mediaTab === "photos" ? (
                  <img
                    src={item}
                    alt={`Photo ${i + 1}`}
                    className="w-full object-cover"
                    style={{ height: i === activeSlide ? '464px' : '288px' }}
                  />
                ) : (
                  <div
                    className="w-full overflow-hidden"
                    style={{ height: i === activeSlide ? '464px' : '288px' }}
                  >
                    <iframe
                      src={`https://www.youtube.com/embed/${extractYoutubeId(item)}`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={`Video ${i + 1}`}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Meta under slide */}
      <div className="mt-5 text-center">
        <p className="text-2xl font-extrabold text-[#1C1C1C]">
          {mediaTab === "videos" ? "Video" : "Photo"} {activeSlide + 1}
        </p>
      </div>

      {/* Counter */}
      <div className="mt-2 flex justify-end text-xs text-[#6F5D9E]">
        {String(activeSlide + 1).padStart(2, "0")} of{" "}
        {String(mediaData[mediaTab].length).padStart(2, "0")}
      </div>
    </Modal>
  );
};

// Helper function to extract YouTube video ID
const extractYoutubeId = (url: string): string => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
  return match?.[1] || "";
};

export default MediaModal;

