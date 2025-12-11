import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import singerService, { type Singer } from "@/api/services/singerService";
import MediaModal from "@/components/pageComponents/SingerDetails/MediaModal";
import MessageModal from "@/components/pageComponents/SingerDetails/MessageModal";
import ReviewsModal from "@/components/pageComponents/SingerDetails/ReviewsModal";
import ProfileSidebar from "@/components/pageComponents/SingerDetails/ProfileSidebar";
import MediaGrid from "@/components/pageComponents/SingerDetails/MediaGrid";
import IconBubble from "@/components/pageComponents/SingerDetails/IconBubble";
import ReviewsPreview from "@/components/pageComponents/SingerDetails/ReviewsPreview";
import FAQSection from "@/components/pageComponents/SingerDetails/FAQSection";

// FAQ data with dummy answers (UI shows questions only to match design)
const faqs = [
  {
    question: "add singer faq's about event safety and terms policy.",
    answer:
      "Dummy answer explaining safety protocols, performance timings, and cancellation terms for events.",
  },
  {
    question: "add artist faq's about event safety and terms policy.",
    answer:
      "Dummy answer covering on-site precautions, equipment handling, and client responsibilities.",
  },
  {
    question: "add artist faq's about event safety and terms policy.",
    answer:
      "Dummy answer with details on deposits, refunds, and weather considerations.",
  },
  {
    question: "add artist faq's about event safety and terms policy.",
    answer:
      "Dummy answer about performance length, breaks, and communication guidelines.",
  },
];

const SingerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [singer, setSinger] = useState<Singer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchSingerDetails(id);
    }
  }, [id]);

  const fetchSingerDetails = async (userId: string) => {
    try {
      setLoading(true);
      const data = await singerService.getSingerById(userId);
      setSinger(data);
      setError("");
    } catch (err: any) {
      console.error("Failed to fetch singer details:", err);
      setError("Failed to load singer details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="custom-container pb-16 flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !singer) {
    return (
      <div className="custom-container pb-16 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error || "Singer not found"}</p>
        </div>
      </div>
    );
  }

  const name = singer.name || "Artist";
  
  // Transform API reviews to match ReviewsPreview component format
  const reviewsPreviewData = singer.reviews?.slice(0, 3).map((review, index) => ({
    id: index + 1,
    name: review.userName,
    location: "Saudi Arabia", // API doesn't provide location
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(review.userName)}&background=random`,
    rating: parseFloat(review.rating) || 0,
    timeAgo: new Date(review.createdAt).toLocaleDateString(),
  })) || [];

  // Transform reviews for modal
  const allReviews = singer.reviews?.map((review, index) => ({
    id: index + 1,
    name: review.userName,
    location: "Saudi Arabia",
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(review.userName)}&background=random`,
    rating: parseFloat(review.rating) || 0,
    timeAgo: new Date(review.createdAt).toLocaleDateString(),
    text: review.comment,
  })) || [];

  return (
    <div className="custom-container pb-16">
      <div className="grid gap-8 lg:grid-cols-[0.4fr_1fr] ">
        {/* Left fixed column */}
        <ProfileSidebar 
          id={singer.userId} 
          name={name}
          pricing={singer.pricing}
          city={singer.city}
          isVerified={singer.isVerified}
        />

        {/* Right content */}
        <section className="space-y-8">
          {/* Media gallery - matches layout: big left (2x2), four small on right */}
          <div onClick={() => setMediaOpen(true)} className="cursor-pointer">
            <MediaGrid />
          </div>

          {/* My Experience header aligned with social icons */}
          <div className="flex items-center justify-between pt-2">
            <h3 className="text-lg lg:text-2xl font-bold text-[#1C1C1C]">
              About {name.split(" ")[0]}
            </h3>
            <div className="flex gap-3">
              <IconBubble type="instagram" />
              <IconBubble type="music" />
              <IconBubble type="youtube" />
              <IconBubble type="disc" />
              <IconBubble type="linkedin" />
            </div>
          </div>

          {/* Artist Info */}
          <div>
            <div className="h-px bg-[#E7DEFF] my-4" />
            <ul className="space-y-6 text-[#2F1C4E]">
              <li>
                <p className="font-semibold">Genre</p>
                <p className="text-[#6F5D9E]">{singer.genre || "Various genres"}</p>
              </li>
              <li>
                <p className="font-semibold">Location</p>
                <p className="text-[#6F5D9E]">{singer.city}{singer.address ? `, ${singer.address}` : ""}</p>
              </li>
              <li>
                <p className="font-semibold">Contact</p>
                <p className="text-[#6F5D9E]">{singer.email}</p>
                <p className="text-[#6F5D9E]">{singer.phonenumber}</p>
              </li>
              <li>
                <p className="font-semibold">Member since</p>
                <p className="text-[#6F5D9E]">
                  {new Date(singer.joinedAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long' 
                  })}
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
          {reviewsPreviewData.length > 0 && (
            <ReviewsPreview
              items={reviewsPreviewData}
              onShowAll={() => setReviewsOpen(true)}
            />
          )}
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
