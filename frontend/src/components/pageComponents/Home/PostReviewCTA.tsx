import { Button } from "@/components/common";
import React from "react";

const backgroundImages = [
  {
    src: "https://images.unsplash.com/photo-1521336575822-6da63fb45455?auto=format&fit=crop&w=220&q=80",
    className:
      "absolute left-6 top-10 w-28 rounded-2xl opacity-60 shadow-xl md:left-14 md:top-14 md:w-32",
  },
  {
    src: "https://images.unsplash.com/photo-1545239351-ef35f43d514b?auto=format&fit=crop&w=220&q=80",
    className:
      "absolute right-8 top-0 w-24 rounded-2xl opacity-70 shadow-xl md:right-16 md:top-6 md:w-32",
  },
  {
    src: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=220&q=80",
    className:
      "absolute left-1/4 -bottom-10 w-24 rounded-2xl opacity-60 shadow-xl md:left-1/3 md:-bottom-12 md:w-28",
  },
  {
    src: "https://images.unsplash.com/photo-1437419764061-2473afe69fc2?auto=format&fit=crop&w=220&q=80",
    className:
      "absolute right-1/3 -bottom-16 hidden w-24 rounded-2xl opacity-50 shadow-xl lg:block",
  },
  {
    src: "https://images.unsplash.com/photo-1497032205916-ac775f0649ae?auto=format&fit=crop&w=220&q=80",
    className:
      "absolute left-0 bottom-4 hidden w-24 rounded-2xl opacity-60 shadow-xl md:block",
  },
  {
    src: "https://images.unsplash.com/photo-1529158062015-cad636e69505?auto=format&fit=crop&w=220&q=80",
    className:
      "absolute right-4 top-1/2 w-24 -translate-y-1/2 rounded-2xl opacity-70 shadow-xl md:right-12 md:w-28",
  },
];

const PostReviewCTA: React.FC = () => {
  return (
    <div className="w-full bg-white py-14">
      <div className="custom-container px-6 lg:px-24">
        <div className="relative overflow-hidden rounded-[48px] border border-[#F2E6FF] bg-gradient-to-b from-primary via-[#51255F] to-[#B8860B99] px-6 py-16 text-center text-white shadow-[0_30px_60px_-25px_rgba(55,21,82,0.45)] md:px-20 mx-auto md:max-w-10/12">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 mix-blend-overlay" />
            {backgroundImages.map((image) => (
              <img
                key={image.src}
                src={image.src}
                alt=""
                className={`${image.className} object-cover`}
              />
            ))}
          </div>

          <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-6">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Ready to Experience the Future of Live Music?
            </h2>
            <p className="text-sm font-medium text-[#FBEEDD] md:text-base">
              Join thousands of event organizers who trust Singerlia for their
              most important moments.
            </p>
            <Button
              variant="primary"
              size="large"
              type="button"
              className="flex items-center gap-2 col-span-2 bg-gradient-to-r from-[#FFD700] to-[#B8860B99] text-primary hover:opacity-90"
            >
              <p className="font-medium">Send Message</p>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostReviewCTA;
