import React, { useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";

type ReviewCategory = "All" | "Customers" | "Singer's";

type Review = {
  id: number;
  name: string;
  role: ReviewCategory;
  title: string;
  message: string;
  avatar: string;
};

const reviews: Review[] = [
  {
    id: 1,
    name: "Guin W.",
    role: "Singer's",
    title: "Singers",
    message:
      "I love how easy it is to showcase my portfolio and connect with clients. My bookings have increased significantly!",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: 2,
    name: "Joshua N.",
    role: "Customers",
    title: "Customer",
    message:
      "With staff scheduling and customer bookings in one place, I save hours every week. My events run smoother than ever.",
    avatar:
      "https://images.unsplash.com/photo-1524635962361-d7f8ae9c79b1?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: 3,
    name: "Devin M.",
    role: "Customers",
    title: "Customer",
    message:
      "The analytics and management features are incredible. This app transformed how we run our celebrations.",
    avatar:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: 4,
    name: "Daniel H.",
    role: "Singer's",
    title: "Singers",
    message:
      "Singerlia keeps me booked with the right gigs. I can focus on my performances while everything else stays organized.",
    avatar:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: 5,
    name: "Laiba M.",
    role: "Customers",
    title: "Customer",
    message:
      "Booking live performances has never been this easy. I found a singer nearby and had my event confirmed in minutes!",
    avatar:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: 6,
    name: "Sophie R.",
    role: "Singer's",
    title: "Singers",
    message:
      "The platform helps me present my skills professionally. I love receiving curated opportunities tailored to my style.",
    avatar:
      "https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: 7,
    name: "Marcus A.",
    role: "Customers",
    title: "Customer",
    message:
      "Amazing experience! It’s so simple to find and book talented singers with top-rated reviews in my city.",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: 8,
    name: "Emily T.",
    role: "Singer's",
    title: "Singers",
    message:
      "Singerlia gives me the exposure I need. The booking tools and messaging keep everything in one place.",
    avatar:
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=120&q=80",
  },
];

const filters: ReviewCategory[] = ["All", "Customers", "Singer's"];

const sliderSettings = {
  modules: [Autoplay, FreeMode],
  freeMode: true,
  loop: true,
  speed: 6000,
  autoplay: {
    delay: 0,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  },
  slidesPerView: 1.1,
  spaceBetween: 24,
  breakpoints: {
    768: {
      slidesPerView: 2.5,
    },
    1024: {
      slidesPerView: 3.2,
    },
    1440: {
      slidesPerView: 3.8,
    },
  },
};

const createMarqueeSlides = (items: Review[]) => {
  if (items.length === 0) return [];
  const repeats = Math.max(3, Math.ceil(12 / items.length));
  return Array.from({ length: repeats * items.length }, (_, index) => ({
    review: items[index % items.length],
    key: `${items[index % items.length].id}-${index}`,
  }));
};

const Reviews: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<ReviewCategory>("All");

  const filteredReviews = useMemo(() => {
    if (activeFilter === "All") return reviews;
    return reviews.filter((review) => review.role === activeFilter);
  }, [activeFilter]);

  const half = Math.ceil(filteredReviews.length / 2);
  const topRow = filteredReviews.slice(0, half);
  const bottomRow = filteredReviews.slice(half);

  const topSlides = useMemo(() => createMarqueeSlides(topRow), [topRow]);
  const bottomSlides = useMemo(
    () => createMarqueeSlides(bottomRow),
    [bottomRow],
  );

  const renderCard = (review: Review) => (
    <div className="h-full rounded-3xl border border-[#EBE4FF] bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <img
          src={review.avatar}
          alt={review.name}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div>
          <p className="text-lg font-semibold text-[#3C1E66]">{review.name}</p>
          <p className="text-sm text-gray-500">Desertion here</p>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm font-semibold text-[#2357C5]">{review.title}</p>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          {review.message}
        </p>
      </div>
    </div>
  );

  return (
    <div className="w-full bg-white">
      <div className="custom-container px-6 py-24 lg:px-24">
        <div className="mb-12 flex flex-col items-center gap-6 text-center lg:flex-row lg:items-end lg:justify-between lg:text-left">
          <div>
            <h2 className="font-bold text-4xl lg:text-6xl text-primary">
              Trusted by Customers, and Singer&apos;s
            </h2>
            <p className="mt-3 text-sm font-medium text-[#2357C5]">
              Real people sharing their experiences with our platform
            </p>
          </div>
        </div>

        <div className="space-y-10">
          <Swiper
            {...sliderSettings}
            className="swiper-marquee"
            dir="ltr"
            allowTouchMove={false}
          >
            {topSlides.map(({ review, key }) => (
              <SwiperSlide key={key} className="max-w-[420px]">
                {renderCard(review)}
              </SwiperSlide>
            ))}
          </Swiper>
          {bottomSlides.length > 0 && (
            <Swiper
              {...sliderSettings}
              className="swiper-marquee"
              dir="ltr"
              allowTouchMove={false}
              autoplay={{
                delay: 0,
                disableOnInteraction: false,
                reverseDirection: true,
                pauseOnMouseEnter: true,
              }}
            >
              {bottomSlides.map(({ review, key }) => (
                <SwiperSlide key={key} className="max-w-[420px]">
                  {renderCard(review)}
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
