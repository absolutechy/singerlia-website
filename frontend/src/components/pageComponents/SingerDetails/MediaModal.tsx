import React, { useEffect, useMemo, useRef, useState } from "react";
import Modal from "@/components/common/Modal";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper/types";
import "swiper/css";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import singer1 from "@/assets/images/singer/singer-detail-1.png";
import singer2 from "@/assets/images/singer/singer-detail-2.png";
import singer3 from "@/assets/images/singer/singer-detail-3.png";
import { Button } from "@/components/common";

type Props = {
  open: boolean;
  onClose: () => void;
};

const MediaModal: React.FC<Props> = ({ open, onClose }) => {
  const [mediaTab, setMediaTab] = useState<"videos" | "photos">("videos");
  const [activeSlide, setActiveSlide] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  const mediaData = useMemo(() => {
    const base = [
      { id: 1, src: singer1, title: "portfolio title show here" },
      { id: 2, src: singer2, title: "portfolio title show here" },
      { id: 3, src: singer3, title: "portfolio title show here" },
      { id: 4, src: singer2, title: "portfolio title show here" },
      { id: 5, src: singer1, title: "portfolio title show here" },
    ];
    return {
      videos: base,
      photos: [...base].reverse(),
    } as const;
  }, []);

  // Ensure Swiper recalculates when modal opens and on resize
  useEffect(() => {
    if (!open) return;
    // slight delay to allow modal layout to settle
    const id = window.setTimeout(() => {
      swiperRef.current?.update?.();
    }, 60);
    const onResize = () => swiperRef.current?.update?.();
    window.addEventListener("resize", onResize);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

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
                swiperRef.current?.slideTo(0);
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
      <div className="relative mt-6">
        {/* Left arrow */}
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full border border-[#E7DEFF] bg-white/90 shadow flex items-center justify-center"
          aria-label="Previous"
        >
          <ChevronLeft size={18} className="text-[#2E1B4D]" />
        </button>
        {/* Right arrow */}
        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full border border-[#E7DEFF] bg-white/90 shadow flex items-center justify-center"
          aria-label="Next"
        >
          <ChevronRight size={18} className="text-[#2E1B4D]" />
        </button>

        <Swiper
          onSwiper={(s) => (swiperRef.current = s)}
          onSlideChange={(s) => setActiveSlide(s.realIndex)}
          loop={true}
          centeredSlides={true}
          // rely on breakpoints only for clarity
          breakpoints={{
            0: { slidesPerView: 1 },
            640: { slidesPerView: 1 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 3 },
          }}
          spaceBetween={0}
          observer={true}
          observeParents={true}
          observeSlideChildren={true}
          className="px-4 lg:h-[31rem]"
        >
          {mediaData[mediaTab].map((item, i) => (
            <SwiperSlide key={`${mediaTab}-${item.id}`} className="!flex !items-center !justify-center">
              <div
                className={`relative flex items-center justify-center mx-auto rounded-3xl overflow-hidden p-1 transition-all duration-300 ${
                  i === activeSlide ? "opacity-100 sm:max-w-[23rem] w-full" : "opacity-50 max-w-[14rem]"
                }`}
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className={`w-full rounded-3xl ${i === activeSlide ? "sm:h-[29rem]" : "sm:h-[18rem]"} object-cover`}
                />
                {mediaTab === "videos" && (
                  <button
                    className="absolute inset-0 m-auto h-14 w-14 rounded-full bg-[#FFCD00] flex items-center justify-center shadow"
                    aria-label="Play video"
                  >
                    <Play className="text-[#1C1C1C]" />
                  </button>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Meta under slide */}
      <div className="mt-5 text-center">
        <p className="text-2xl font-extrabold text-[#1C1C1C]">portfolio title show here</p>
        <p className="mt-1 text-sm text-[#6F5D9E] max-w-xl mx-auto">
          Learn How to Quickly Generate Placeholder Text Using a Lorem Ipsum Tool. Explore How Lorem Ipsum Generators
          Can Liven up Your...
        </p>
      </div>

      {/* Counter */}
      <div className="mt-2 flex justify-end text-xs text-[#6F5D9E]">
        {String((activeSlide % mediaData[mediaTab].length) + 1).padStart(2, "0")}of
        {String(mediaData[mediaTab].length).padStart(2, "0")}
      </div>
    </Modal>
  );
};

export default MediaModal;

