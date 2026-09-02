import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import singerService, { type Singer } from "@/api/services/singerService";
import genreService, { type Genre } from "@/api/services/genreService";
import authService from "@/api/services/authService";
import { getViewFile } from "@/api/services/getViewFile";
import unavailabilityService, { type UnavailabilityRecord } from "@/api/services/unavailabilityService";
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
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [photosLoading, setPhotosLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    genreService
      .getAllGenres()
      .then((res) => setGenres(res.genres || []))
      .catch((err) => console.error("Failed to fetch genres:", err));
  }, []);

  const genreLabels = (singer?.genreIds || [])
    .map((id) => genres.find((g) => g.genreId === id)?.label || id)
    .join(", ");
  const [unavailability, setUnavailability] = useState<UnavailabilityRecord[]>([]);

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
      console.log("Fetched singer details:", data);
      setError("");
      
      // Check if user is authenticated
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      // Fetch photos only if user is authenticated
      if (authenticated && data?.singerProfile?.photos && data.singerProfile.photos.length > 0) {
        fetchPhotos(data.singerProfile.photos);
      }
      
      // Fetch singer unavailability (public endpoint)
      try {
        const unavailabilityData = await unavailabilityService.getSingerUnavailability(userId);
        setUnavailability(unavailabilityData.unavailability);
      } catch (err) {
        console.error("Failed to fetch unavailability:", err);
        // Don't fail the whole page if unavailability fetch fails
      }
    } catch (err: any) {
      console.error("Failed to fetch singer details:", err);
      setError("Failed to load singer details");
    } finally {
      setLoading(false);
    }
  };

  const fetchPhotos = async (photos: { s3Path: string; fileType: string }[]) => {
    try {
      setPhotosLoading(true);
      const urls = await Promise.all(
        photos.map(async (photo) => {
          const response = await getViewFile(photo.s3Path, photo.fileType);
          return response.isError ? null : response.data;
        })
      );
      setPhotoUrls(urls.filter((url): url is string => url !== null));
    } catch (err) {
      console.error("Failed to fetch photos:", err);
    } finally {
      setPhotosLoading(false);
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

  // Single source of truth for the rating badge shown in the Share modal, the reviews preview,
  // and the "all reviews" modal — they must not each compute/hardcode their own number.
  const reviewCount = singer.reviews?.length || 0;
  const averageRating =
    reviewCount > 0
      ? singer.reviews!.reduce((sum, r) => sum + (parseFloat(r.rating) || 0), 0) / reviewCount
      : 0;

  // Get social links
  const socialLinks = singer.singerProfile?.social_links || {};
  
  // Get YouTube links
  const youtubeLinks = singer.singerProfile?.youtube_links || [];
  
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
          categoryPricing={singer.categoryPricing}
          city={singer.city}
          isVerified={singer.isVerified}
          unavailability={unavailability}
          averageRating={averageRating}
          reviewCount={reviewCount}
          responseTimeHours={singer.responseTimeHours}
        />

        {/* Right content */}
        <section className="space-y-8">
          {/* Media gallery - matches layout: big left (2x2), four small on right */}
          <div 
            onClick={() => isAuthenticated && setMediaOpen(true)} 
            className={isAuthenticated ? "cursor-pointer" : "cursor-not-allowed relative"}
          >
            {photosLoading ? (
              <div className="flex justify-center items-center h-[328px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                <div className={!isAuthenticated ? "blur-sm" : ""}>
                  <MediaGrid photos={photoUrls} />
                </div>
                {!isAuthenticated && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-2xl">
                    <div className="bg-white px-6 py-3 rounded-lg shadow-lg">
                      <p className="text-[#2E1B4D] font-semibold">Please log in to view photos</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* My Experience header aligned with social icons */}
          <div className="flex items-center justify-between pt-2">
            <h3 className="text-lg lg:text-2xl font-bold text-[#1C1C1C]">
              About {name.split(" ")[0]}
            </h3>
            <div className="flex gap-3">
              {socialLinks.instagram && <IconBubble type="instagram" url={socialLinks.instagram} />}
              {socialLinks.facebook && <IconBubble type="facebook" url={socialLinks.facebook} />}
              {socialLinks.twitter && <IconBubble type="twitter" url={socialLinks.twitter} />}
              {socialLinks.tiktok && <IconBubble type="tiktok" url={socialLinks.tiktok} />}
            </div>
          </div>

          {/* Artist Info */}
          <div>
            {singer.singerProfile?.bio && (
              <div className="mb-4">
                <p className="font-semibold text-[#2F1C4E]">Bio</p>
                <p className="text-[#6F5D9E] mt-2">{singer.singerProfile.bio}</p>
              </div>
            )}
            {singer.singerProfile?.experience && (
              <div className="mb-4">
                <p className="font-semibold text-[#2F1C4E]">Experience</p>
                <p className="text-[#6F5D9E] mt-2">{singer.singerProfile.experience}</p>
              </div>
            )}
            <div className="h-px bg-[#E7DEFF] my-4" />
            <ul className="space-y-6 text-[#2F1C4E]">
              <li>
                <p className="font-semibold">Genre</p>
                <p className="text-[#6F5D9E]">
                  {genreLabels || "Various genres"}
                </p>
              </li>
              <li>
                <p className="font-semibold">Location</p>
                <p className="text-[#6F5D9E]">{singer.city}{singer.address ? `, ${singer.address}` : ""}</p>
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
              averageRating={averageRating}
              reviewCount={reviewCount}
              onShowAll={() => setReviewsOpen(true)}
            />
          )}
        </section>
        
        {/* Media Modal */}
        <MediaModal 
          open={mediaOpen} 
          onClose={() => setMediaOpen(false)}
          photos={photoUrls}
          youtubeLinks={youtubeLinks}
        />
        
        {/* Message Modal */}
        <MessageModal
          open={messageOpen}
          onClose={() => setMessageOpen(false)}
          name={name}
          singerId={singer.userId}
        />
        
        {/* Reviews Modal */}
        <ReviewsModal
          open={reviewsOpen}
          onClose={() => setReviewsOpen(false)}
          reviews={allReviews}
          averageRating={averageRating}
          reviewCount={reviewCount}
        />
      </div>
      
      {/* FAQ Section */}
      <FAQSection faqs={faqs} />
    </div>
  );
};

export default SingerDetails;
