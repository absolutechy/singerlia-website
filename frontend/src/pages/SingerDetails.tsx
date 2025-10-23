import React, { useState } from "react";
import {
  Share2,
  Heart,
  Image as ImageIcon,
  Star,
  ChevronRight,
  X,
} from "lucide-react";
import ReviewCard from "@/components/common/ReviewCard";
import Modal from "@/components/common/Modal";
import singer1 from "@/assets/images/singer/singer-detail-1.png";
import singer2 from "@/assets/images/singer/singer-detail-2.png";
import singer3 from "@/assets/images/singer/singer-detail-3.png";

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

const SingerDetails: React.FC = () => {
  const name = "John Doberman";
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [reviewsOpen, setReviewsOpen] = useState(false);

  const allReviews = [
    {
      id: 1,
      name: "Liam",
      location: "Yellowknife, Canada",
      avatar:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=96&q=60",
      rating: 5.0,
      timeAgo: "1 week ago",
      text:
        "Jhon was awesome singer, knew exactly where to go for the best singer experience !",
    },
    {
      id: 2,
      name: "Liam",
      location: "Yellowknife, Canada",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=96&q=60",
      rating: 5.0,
      timeAgo: "1 week ago",
      text:
        "Jhon was awesome singer, knew exactly where to go for the best singer experience !",
    },
    {
      id: 3,
      name: "Liam",
      location: "Yellowknife, Canada",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=96&q=60",
      rating: 5.0,
      timeAgo: "1 week ago",
      text:
        "Jhon was awesome singer, knew exactly where to go for the best singer experience !",
    },
    {
      id: 4,
      name: "Liam",
      location: "Yellowknife, Canada",
      avatar:
        "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=96&q=60",
      rating: 5.0,
      timeAgo: "1 week ago",
      text:
        "Jhon was awesome singer, knew exactly where to go for the best singer experience !",
    },
  ];

  return (
    <div className="custom-container pb-16">
      <div className="grid gap-8 lg:grid-cols-[0.4fr_1fr] ">
        {/* Left fixed column */}
        <aside className="self-start lg:sticky top-28 space-y-5">
          {/* Main card */}
          <div className="rounded-3xl bg-white p-2 sm:p-4">
            <div className="relative">
              <img
                src={singer2}
                alt="cover"
                className="w-full rounded-2xl h-52 object-cover overflow-hidden"
              />
              {/* small avatar */}
              <img
                src={singer1}
                alt="avatar"
                className="h-14 z-50 rounded-full object-cover absolute -bottom-7 left-4 border-4 border-white"
              />
            </div>
            <div className="pt-10 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-[#1C1C1C]">{name}</h2>
                  <p className="text-sm text-[#6F5D9E]">Responds within 1/hr</p>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button className="h-10 w-10 rounded-full border border-[#E7DEFF] bg-white flex items-center justify-center">
                  <Share2 size={18} className="text-[#6F5D9E]" />
                </button>
                <button className="h-10 w-10 rounded-full border border-[#E7DEFF] bg-white flex items-center justify-center">
                  <Heart size={18} className="text-[#6F5D9E]" />
                </button>
              </div>
            </div>
          </div>

          {/* Booking card */}
          <div className="relative rounded-2xl bg-white px-2.5 sm:px-5 py-10 shadow border border-[#EBE4FF]">
            <span className="absolute -top-3 right-6 text-xs bg-white shadow px-3 py-1 rounded-full border border-[#EBE4FF]">
              Free cancellation
            </span> 
            <button className="w-full h-12 rounded-full bg-gradient-to-b from-secondary to-secondary-dark text-[#1C1C1C] font-semibold shadow">
              Book Singer
            </button>
          </div>
        </aside>

        {/* Right content */}
        <section className="space-y-8">
          {/* Title + show all media */}
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <h1 className="heading-6 sm:heading-4 text-[#2E1B4D]">
              Signer Service title here
            </h1>
            <button className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 shadow border border-[#E7DEFF] text-sm font-semibold text-[#2E1B4D]">
              <ImageIcon size={16} /> Show all media
            </button>
          </div>

          {/* Media gallery - matches layout: big left (2x2), four small on right */}
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            style={{ gridAutoRows: "160px" }}
          >
            <div className="col-span-2 row-span-2 rounded-2xl overflow-hidden">
              <img
                src={singer1}
                alt="main"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-2xl overflow-hidden">
              <img
                src={singer1}
                alt="m2"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-2xl overflow-hidden">
              <img
                src={singer1}
                alt="m3"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-2xl overflow-hidden">
              <img
                src={singer2}
                alt="m4"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-2xl overflow-hidden">
              <img
                src={singer3}
                alt="m5"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* My Experience header aligned with social icons */}
          <div className="flex items-center justify-between pt-2">
            <h3 className="text-lg lg:text-2xl font-bold text-[#1C1C1C]">My Experience</h3>
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
            <button className="w-full h-12 rounded-xl border border-[#E7DEFF] bg-white text-[#2E1B4D] font-semibold">
              Message {name.split(" ")[0]}
            </button>
          </div>

          {/* Reviews preview */}
          <div className="pt-2">
            <div className="h-px bg-[#E7DEFF] my-4" />
            <div className="flex items-center gap-2 text-[#2E1B4D] font-medium">
              <Star size={18} className="text-yellow-500 fill-yellow-500" />
              <span className="text-base">4.97</span>
              <span className="inline-block w-1 h-1 rounded-full bg-gray-300"></span>
              <span className="text-base">29 reviews</span>
            </div>

            <div className="mt-3 divide-y divide-[#E7DEFF]">
              {[
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
              ].map((r) => (
                <div key={r.id} className="py-5">
                  <div className="flex items-start gap-3">
                    {/* Image */}
                    <img
                      src={r.avatar}
                      alt={r.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />

                    {/* Name and Location Column */}
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold text-[#1C1C1C]">
                        {r.name}
                      </p>
                      <p className="text-xs text-[#6F5D9E]">{r.location}</p>
                    </div>
                  </div>

                  {/* Second Row - Rating and Time */}
                  <div className="flex items-center gap-2 mt-2 text-sm">
                    <Star
                      size={16}
                      className="text-yellow-500 fill-yellow-500"
                    />
                    <span className="font-semibold text-[#1C1C1C]">
                      {r.rating.toFixed(1)}
                    </span>
                    <span className="inline-block w-1 h-1 rounded-full bg-gray-300"></span>
                    <span className="text-[#6F5D9E]">{r.timeAgo}</span>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => setReviewsOpen(true)} className="mt-2 w-full h-11 rounded-xl border border-[#E7DEFF] bg-white text-[#2E1B4D] font-medium">
              Show all reviews
            </button>
          </div>
        </section>
        {/* Reviews Modal */}
        <Modal
          open={reviewsOpen}
          onClose={() => setReviewsOpen(false)}
          panelClassName="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <div className="flex items-center gap-2 text-[#1C1C1C] font-semibold">
              <span className="text-xl">4.97</span>
              <span className="inline-block w-1 h-1 rounded-full bg-gray-300"></span>
              <span className="text-xl">29 reviews</span>
            </div>
            <button
              onClick={() => setReviewsOpen(false)}
              aria-label="Close"
              className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
            >
              <X size={16} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-2 divide-y">
            {([...allReviews, ...allReviews, ...allReviews].map((r, idx) => (
              <ReviewCard
                key={idx}
                avatar={r.avatar}
                name={r.name}
                location={r.location}
                rating={r.rating}
                timeAgo={r.timeAgo}
                text={r.text}
              />
            )))}
          </div>
        </Modal>
      </div>
      {/* FAQ Section */}
      <div className="my-[8rem] rounded-3xl bg-[#F7F7F7] p-6 sm:p-8">
        <div className="text-center">
          <h3 className="text-2xl sm:text-4xl font-bold text-[#000]">
            Frequently asked questions
          </h3>
          <p className="mt-1 texl-lg sm:text-2xl font-semibold text-[#121212]">
            About This Singer
          </p>
        </div>

        <div className="mt-6 space-y-4 flex flex-col items-center">
          {faqs.map((faq, i) => {
            const active = openIndex === i;
            const highlighted = i === 1;
            return (
              <div
                key={i}
                className={
                  "w-full group hover:bg-[#2E1B4D] hover:border-transparent max-w-4xl rounded-xl shadow border overflow-hidden " +
                  (active
                    ? "bg-[#2E1B4D] border-transparent"
                    : "bg-white border-[#EBE4FF]")
                }
              >
                <button
                  onClick={() => setOpenIndex(active ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-8"
                >
                  <span
                    className={
                      "text-lg font-medium group-hover:text-white text-left " +
                      (active ? "text-white" : "text-[#1C1C1C]")
                    }
                  >
                    {faq.question}
                  </span>
                  <ChevronRight
                    size={18}
                    className={`group-hover:text-white   ${
                      active ? "text-white" : " text-[#2E1B4D] "
                    }
                    `}
                  />
                </button>
                {active && (
                  <div
                    className={
                      "px-5 pb-5 text-sm " +
                      (active ? "text-white/90" : "text-[#6F5D9E]")
                    }
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SingerDetails;

// Local small icon bubble component using lucide icons to mirror the screenshot look
import { Instagram, Music2, Youtube, Disc3, Linkedin } from "lucide-react";

type BubbleType = "instagram" | "music" | "youtube" | "disc" | "linkedin";

const IconBubble: React.FC<{ type: BubbleType }> = ({ type }) => {
  const base =
    "h-9 w-9 rounded-full border border-[#E7DEFF] bg-white flex items-center justify-center text-[#2E1B4D]";
  const map: Record<BubbleType, React.ReactNode> = {
    instagram: <Instagram size={16} />,
    music: <Music2 size={16} />,
    youtube: <Youtube size={16} />,
    disc: <Disc3 size={16} />,
    linkedin: <Linkedin size={16} />,
  };
  return <button className={base}>{map[type]}</button>;
};
