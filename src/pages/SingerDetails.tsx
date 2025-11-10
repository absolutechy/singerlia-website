import React, { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import MediaModal from "@/components/pageComponents/SingerDetails/MediaModal";
import MessageModal from "@/components/pageComponents/SingerDetails/MessageModal";
import ReviewsModal from "@/components/pageComponents/SingerDetails/ReviewsModal";
import ProfileSidebar from "@/components/pageComponents/SingerDetails/ProfileSidebar";
import MediaGrid from "@/components/pageComponents/SingerDetails/MediaGrid";
import IconBubble from "@/components/pageComponents/SingerDetails/IconBubble";
import ReviewsPreview from "@/components/pageComponents/SingerDetails/ReviewsPreview";
import FAQSection from "@/components/pageComponents/SingerDetails/FAQSection";

const paragraph =
  "We are committed to supporting singers by providing them with greater visibility, valuable opportunities, and direct connections with clients who truly appreciate their art. From solo acts to bands, classical to contemporary, we give singers the tools to showcase their talent, grow their audience, and build lasting relationships with customers.";

// FAQ data with dummy answers (UI shows questions only to match design)
const faqs = [
  {
    question: "add singer faq's about event safety and terms policy.",
    answer:
      "Dummy answer explaining safety protocols, performance timings, and cancellation terms for events.",
  },
  {
    question: "add singer faq's about event safety and terms policy.",
    answer:
      "Dummy answer covering on-site precautions, equipment handling, and client responsibilities.",
  },
  {
    question: "add singer faq's about event safety and terms policy.",
    answer:
      "Dummy answer with details on deposits, refunds, and weather considerations.",
  },
  {
    question: "add singer faq's about event safety and terms policy.",
    answer:
      "Dummy answer about performance length, breaks, and communication guidelines.",
  },
];

const allReviews = [
    {
      id: 1,
      name: "Liam",
      location: "Yellowknife, Canada",
      avatar:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=96&q=60",
      rating: 5.0,
      timeAgo: "1 week ago",
      text: "Jhon was awesome singer, knew exactly where to go for the best singer experience !",
    },
    {
      id: 2,
      name: "Liam",
      location: "Yellowknife, Canada",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=96&q=60",
      rating: 5.0,
      timeAgo: "1 week ago",
      text: "Jhon was awesome singer, knew exactly where to go for the best singer experience !",
    },
    {
      id: 3,
      name: "Liam",
      location: "Yellowknife, Canada",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=96&q=60",
      rating: 5.0,
      timeAgo: "1 week ago",
      text: "Jhon was awesome singer, knew exactly where to go for the best singer experience !",
    },
    {
      id: 4,
      name: "Liam",
      location: "Yellowknife, Canada",
      avatar:
        "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=96&q=60",
      rating: 5.0,
      timeAgo: "1 week ago",
      text: "Jhon was awesome singer, knew exactly where to go for the best singer experience !",
    },
  ];

const SingerDetails: React.FC = () => {
  const name = "John Doberman";
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);

  // Floating "View all" cursor setup
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const targetPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const [cursorVisible, setCursorVisible] = useState(false);

  // Smooth follow animation
  useEffect(() => {
    if (!cursorVisible) return;
    const animate = () => {
      const lerp = 0.18; // smoothing factor
      currentPosRef.current.x += (targetPosRef.current.x - currentPosRef.current.x) * lerp;
      currentPosRef.current.y += (targetPosRef.current.y - currentPosRef.current.y) * lerp;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentPosRef.current.x}px, ${currentPosRef.current.y}px, 0)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [cursorVisible]);

  const handleGridMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Position cursor centered on pointer
    const size = 80; // approximate visual size of the circle
    targetPosRef.current = { x: e.clientX - size / 2, y: e.clientY - size / 2 };
    if (!cursorVisible) setCursorVisible(true);
    // Initialize current position if first move
    if (currentPosRef.current.x === 0 && currentPosRef.current.y === 0) {
      currentPosRef.current = { ...targetPosRef.current };
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentPosRef.current.x}px, ${currentPosRef.current.y}px, 0)`;
      }
    }
  };

  const handleGridMouseEnter = () => setCursorVisible(true);
  const handleGridMouseLeave = () => {
    setCursorVisible(false);
  };

  return (
    <div className="custom-container pb-16">
      {/* Floating cursor element (hidden until hovering media grid) */}
      {cursorVisible && (
        <div
          ref={cursorRef}
          className="fixed z-50 pointer-events-none"
          style={{ left: 0, top: 0 }}
          aria-hidden
        >
          <div className="relative inline-flex h-20 w-20 items-center justify-center rounded-full text-sm font-medium text-gray-900 select-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="120"
              height="120"
              viewBox="0 0 120 120"
              fill="none"
              className="absolute -inset-[20px]"
            >
              <circle cx="60" cy="60" r="59.5" fill="white" stroke="url(#paint0_linear_46_486)" />
              <defs>
                <linearGradient id="paint0_linear_46_486" x1="-52.8" y1="120" x2="145.2" y2="20.4" gradientUnits="userSpaceOnUse">
                  <stop stopColor="white" stopOpacity="0" />
                  <stop offset="1" stopColor="#4D4D4D" />
                </linearGradient>
              </defs>
            </svg>
            <ArrowUp className="absolute bottom-8 left-8 rotate-45" size={30} />
            <span className="absolute rotate-45 bottom-4 right-6 outfit">View all</span>
          </div>
        </div>
      )}
      <div className="grid gap-8 lg:grid-cols-[0.4fr_1fr] ">
        {/* Left fixed column */}
        <ProfileSidebar id={1} name={name} />

        {/* Right content */}
        <section className="space-y-8">

          {/* Media gallery - matches layout: big left (2x2), four small on right */}
          <div
            onMouseEnter={handleGridMouseEnter}
            onMouseMove={handleGridMouseMove}
            onMouseLeave={handleGridMouseLeave}
            onClick={() => setMediaOpen(true)}
            className="cursor-none"
          >
            <MediaGrid />
          </div>

          {/* My Experience header aligned with social icons */}
          <div className="flex items-center justify-between pt-2">
            <h3 className="text-lg lg:text-2xl font-bold text-[#1C1C1C]">
              My Experience
            </h3>
            <div className="flex gap-3">
              <IconBubble type="instagram" />
              <IconBubble type="music" />
              <IconBubble type="youtube" />
              <IconBubble type="disc" />
              <IconBubble type="linkedin" />
            </div>
          </div>

          {/* My Experience content */}
          <div>
            <div className="h-px bg-[#E7DEFF] my-4" />
            <ul className="space-y-6 text-[#2F1C4E]">
              <li>
                <p className="font-semibold">14 years of experience</p>
                <p className="text-[#6F5D9E]">{paragraph}</p>
              </li>
              <li>
                <p className="font-semibold">Career highlight</p>
                <p className="text-[#6F5D9E]">
                  Over 10 years singing customers around UK and Europe!
                </p>
              </li>
              <li>
                <p className="font-semibold">Education and training</p>
                <p className="text-[#6F5D9E]">
                  Singing Diploma of ETIC and earned an MBA in Marketing at
                  University of Sunderland.
                </p>
              </li>
            </ul>
          </div>
          {/* Message button */}
          <div className="pt-4">
            <button
              onClick={() => setMessageOpen(true)}
              className="w-full h-12 rounded-xl border border-[#E7DEFF] bg-white text-[#2E1B4D] font-semibold"
            >
              Message {name.split(" ")[0]}
            </button>
          </div>

          {/* Reviews preview */}
          <ReviewsPreview
            items={[
              {
                id: 1,
                name: "Liam",
                location: "Yellowknife, Canada",
                avatar:
                  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=96&q=60",
                rating: 5.0,
                timeAgo: "1 week ago",
              },
              {
                id: 2,
                name: "Liam",
                location: "Yellowknife, Canada",
                avatar:
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=96&q=60",
                rating: 5.0,
                timeAgo: "1 week ago",
              },
              {
                id: 3,
                name: "Liam",
                location: "Yellowknife, Canada",
                avatar:
                  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=96&q=60",
                rating: 5.0,
                timeAgo: "1 week ago",
              },
            ]}
            onShowAll={() => setReviewsOpen(true)}
          />
        </section>
        {/* Media Modal */}
        <MediaModal open={mediaOpen} onClose={() => setMediaOpen(false)} />
        {/* Message Modal */}
        <MessageModal
          open={messageOpen}
          onClose={() => setMessageOpen(false)}
          name={name}
        />
        {/* Reviews Modal */}
        <ReviewsModal
          open={reviewsOpen}
          onClose={() => setReviewsOpen(false)}
          reviews={allReviews}
        />
      </div>
      {/* FAQ Section */}
      <FAQSection faqs={faqs} />
    </div>
  );
};

export default SingerDetails;
