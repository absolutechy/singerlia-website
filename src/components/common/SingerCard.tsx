import { Heart, ArrowRight, ArrowLeft } from "lucide-react";
import React, { useId, useMemo, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import type { Swiper as SwiperInstance } from 'swiper';
import logo from "@/assets/images/common/artise-card.png";
import singerperson from "@/assets/images/singer/singerperson.png";
import Button from "./Button";

// Default images used when none are provided
const defaultSingerImages = [
  singerperson,
  singerperson,
  singerperson,
];

interface SingerCardProps {
  onViewDetails?: () => void;
  name?: string;
  serviceTitle?: string;
  images?: string[];
  responseTime?: string;
}

const SingerCard: React.FC<SingerCardProps> = ({ onViewDetails, name = "Artist Name here", serviceTitle, images, responseTime = "Responds within 1/hr" } ) => {
  const uniqueId = useId();
  const uniqueBase = useMemo(() => uniqueId.replace(/:/g, ""), [uniqueId]);
  const paginationClass = `swiper-pagination-${uniqueBase}`;
  const prevButtonClass = `swiper-button-prev-${uniqueBase}`;
  const nextButtonClass = `swiper-button-next-${uniqueBase}`;
  const imgs = images && images.length > 0 ? images : defaultSingerImages;
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(imgs.length <= 1);

  const updateNavState = (swiper: SwiperInstance) => {
    setIsAtStart(swiper.isBeginning);
    setIsAtEnd(swiper.isEnd);
  };

  return (
    <div className="w-full space-y-2 hover:bg-[#F7F7F7] rounded-2xl shadow-xl p-4 border border-[#CDCDCD] group transition-all duration-500">
      <div className="w-full relative rounded-xl overflow-hidden">
        <img
          src={logo}
          alt="Artist"
          className="w-12 h-12 object-cover absolute top-3 left-3 z-10"
        />
        <button className="bg-white w-10 h-10 flex items-center justify-center rounded-full absolute top-3 right-3 z-10 cursor-pointer">
          <Heart />
        </button>
        <div className="w-full blur-effect text-white absolute bottom-0 left-0 px-5 py-2 z-10">
          <div className="grid grid-cols-2 items-center justify-between gap-4">
            <div>
              <p className="text-base font-medium">{name}</p>
              <p className="text-xs">{responseTime}</p>
            </div>
            <div className={`${paginationClass} flex items-center justify-end gap-1.5`}></div>
          </div>
        </div>
        <Swiper
          modules={[Pagination, Navigation]}
          pagination={{ 
            clickable: true,
            el: `.${paginationClass}`,
          }}
          navigation={{
            prevEl: `.${prevButtonClass}`,
            nextEl: `.${nextButtonClass}`,
          }}
          loop={false}
          onSwiper={updateNavState}
          onSlideChange={updateNavState}
          className="w-full h-64 rounded-xl"
        >
          {imgs.map((_image, index) => (
            <SwiperSlide key={`singer-slide-${index}`}>
              <img 
                src={singerperson}
                alt={`Singer ${index + 1}`}
                className="w-full h-64 object-cover rounded-xl"
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <button
          type="button"
          disabled={isAtStart}
          className={`${prevButtonClass} absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white shadow-lg transition hover:bg-white hover:text-secondary  ${isAtStart ? "pointer-events-none opacity-30" : ""}`}
          aria-label="Previous singer image"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          disabled={isAtEnd}
          className={`${nextButtonClass} absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white shadow-lg transition hover:bg-white hover:text-secondary ${isAtEnd ? "pointer-events-none opacity-30" : ""}`}
          aria-label="Next singer image"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
      {serviceTitle && <p className="text-lg font-medium text-primary py-3">{serviceTitle}</p>}
      <Button
        onClick={onViewDetails}
        size="large"
        className="text-lg !text-primary font-medium !border !border-[#CDCDCD] !group-hover:border-primary group-hover:!bg-primary group-hover:!text-white w-full rounded-lg p-2 cursor-pointer transition-all duration-500">
        View details
      </Button>
    </div>
  );
};

export default SingerCard;
