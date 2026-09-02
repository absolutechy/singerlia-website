import { Heart, ArrowRight, ArrowLeft } from "lucide-react";
import React, { useId, useMemo, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import type { Swiper as SwiperInstance } from 'swiper';
import logo from "@/assets/images/common/artise-card.png";
import singerperson from "@/assets/images/singer/singerperson.png";
import profileThumbnail01 from "@/assets/images/singer/profile_thumbnail01.png";
import profileThumbnail02 from "@/assets/images/singer/profile_thumbnail02.png";
import Button from "./Button";
import { toast } from "sonner";
import singerService from "@/api/services/singerService";

// Default images used when none are provided
const defaultSingerImages = [
  singerperson,
  profileThumbnail01,
  profileThumbnail02,
];

interface SingerCardProps {
  onViewDetails?: () => void;
  name?: string;
  serviceTitle?: string;
  images?: string[];
  responseTime?: string;
  singerId?: string;
  isInWishlist?: boolean;
  // The category-specific price when a category filter is active, else a "From X SAR" minimum
  // across the singer's offered categories. Omit when the singer has priced nothing yet.
  price?: number;
  isPriceForSelectedCategory?: boolean;
}

const SingerCard: React.FC<SingerCardProps> = ({ onViewDetails, name = "Artist Name here", serviceTitle, images, responseTime = "Responds within 1/hr", singerId, isInWishlist = false, price, isPriceForSelectedCategory = false } ) => {
  const uniqueId = useId();
  const uniqueBase = useMemo(() => uniqueId.replace(/:/g, ""), [uniqueId]);
  const paginationClass = `swiper-pagination-${uniqueBase}`;
  const prevButtonClass = `swiper-button-prev-${uniqueBase}`;
  const nextButtonClass = `swiper-button-next-${uniqueBase}`;
  const imgs = images && images.length > 0 ? images : defaultSingerImages;
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(imgs.length <= 1);
  const [isWishlisted, setIsWishlisted] = useState(isInWishlist);
  const [isAnimating, setIsAnimating] = useState(false);

  // Sync wishlist state with prop changes
  useEffect(() => {
    setIsWishlisted(isInWishlist);
  }, [isInWishlist]);

  const updateNavState = (swiper: SwiperInstance) => {
    setIsAtStart(swiper.isBeginning);
    setIsAtEnd(swiper.isEnd);
  };

  const handleWishlistClick = async () => {
    if (!singerId) {
      toast.error("Singer ID is missing");
      return;
    }

    if (isWishlisted) {
      return; // Already in wishlist, do nothing
    }

    try {
      setIsAnimating(true);
      await singerService.addToWishlist(singerId);
      setIsWishlisted(true);
      toast.success("Singer added to wishlist!");
      
      // Reset animation after it completes
      setTimeout(() => setIsAnimating(false), 600);
    } catch (error) {
      setIsAnimating(false);
      toast.error("Failed to add singer to wishlist");
      console.error("Wishlist error:", error);
    }
  };

  return (
    <div className="w-full space-y-2 hover:bg-[#F7F7F7] rounded-2xl shadow-xl p-4 border border-[#CDCDCD] group transition-all duration-500">
      <div className="w-full relative rounded-xl overflow-hidden">
        <img
          src={logo}
          alt="Artist"
          className="w-12 h-12 object-cover absolute top-3 left-3 z-10"
        />
        <button 
          onClick={handleWishlistClick}
          disabled={isWishlisted}
          className={`bg-white w-10 h-10 flex items-center justify-center rounded-full absolute top-3 right-3 z-10 transition-all duration-300 ${
            isAnimating ? 'scale-125' : 'scale-100'
          } ${
            isWishlisted ? 'cursor-default' : 'cursor-pointer hover:scale-110'
          }`}
        >
          <Heart 
            className={`transition-all duration-300 ${
              isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-700'
            }`}
          />
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
          {imgs.map((image, index) => (
            <SwiperSlide key={`singer-slide-${index}`}>
              <img
                src={image}
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
      <div className="flex items-center justify-between py-3">
        {serviceTitle && <p className="text-lg font-medium text-primary">{serviceTitle}</p>}
        {price != null && price > 0 && (
          <p className="text-sm font-semibold text-[#2E1B4D]">
            {isPriceForSelectedCategory ? `SAR ${price.toLocaleString()}` : `From SAR ${price.toLocaleString()}`}
          </p>
        )}
      </div>
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
