import React, { useState } from "react";
import { Image as ImageIcon } from "lucide-react";
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

const SingerDetails: React.FC = () => {
  const navigate = useNavigate();
  const name = "John Doberman";
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);

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

  return (
    <div className="custom-container pb-16">
      <div className="grid gap-8 lg:grid-cols-[0.4fr_1fr] ">
        {/* Left fixed column */}
        <ProfileSidebar name={name} />

        {/* Right content */}
        <section className="space-y-8">
          {/* Title + show all media */}
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <h1 className="heading-6 sm:heading-4 text-[#2E1B4D]">
              Signer Service title here
            </h1>
            <button onClick={() => setMediaOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 shadow border border-[#E7DEFF] text-sm font-semibold text-[#2E1B4D]">
              <ImageIcon size={16} /> Show all media
            </button>
          </div>

          {/* Media gallery - matches layout: big left (2x2), four small on right */}
          <MediaGrid />

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
                avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=96&q=60",
                rating: 5.0,
                timeAgo: "1 week ago",
              },
              {
                id: 2,
                name: "Liam",
                location: "Yellowknife, Canada",
                avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=96&q=60",
                rating: 5.0,
                timeAgo: "1 week ago",
              },
              {
                id: 3,
                name: "Liam",
                location: "Yellowknife, Canada",
                avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=96&q=60",
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
        <MessageModal open={messageOpen} onClose={() => setMessageOpen(false)} name={name} />
        {/* Reviews Modal */}
        <ReviewsModal open={reviewsOpen} onClose={() => setReviewsOpen(false)} reviews={allReviews} />
      </div>
      {/* FAQ Section */}
      <FAQSection faqs={faqs} />
    </div>
  );
};

export default SingerDetails;
