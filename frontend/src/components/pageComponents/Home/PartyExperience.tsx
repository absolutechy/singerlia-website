import React from "react";

const carouselImages = [
  "https://images.unsplash.com/photo-1561489413-8710d5b287b1?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1525182008055-f88b95ff7980?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1520013573795-38516d266c86?auto=format&fit=crop&w=500&q=80",
];

const PartyExperience: React.FC = () => {
  return (
    <div className="w-full bg-white">
      <div className="custom-container py-24 px-6 lg:px-24">
        <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
          <div className="space-y-6">
            <p className="text-4xl font-semibold leading-tight text-gray-900">
              Together, let&apos;s make your event unforgettable! with a{" "}
              <span className="text-primary">ultimate party experience!</span>
            </p>
            <button className="group relative inline-flex h-20 w-20 items-center justify-center rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-900 transition hover:shadow-lg">
              <span className="absolute inset-0 rounded-full border border-dashed border-gray-300" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 15.75 15.75 8.25"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 7.5h6v6"
                />
              </svg>
              <span className="sr-only">View all</span>
              <span className="absolute bottom-4 text-xs">View all</span>
            </button>
          </div>
          <div className="relative">
            <div className="absolute -top-10 right-10 hidden items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-medium text-gray-600 shadow-md md:flex">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              English
            </div>
            <div className="rounded-3xl bg-[#3C1E66] px-8 py-10 text-white shadow-2xl">
              <div className="mb-6 flex items-center justify-between text-sm text-white/70">
                <span>03/20</span>
                <div className="flex gap-1">
                  {[0, 1, 2, 3, 4].map((dot) => (
                    <span
                      key={dot}
                      className={`h-1.5 w-4 rounded-full ${
                        dot === 1 ? "bg-[#F4C64F]" : "bg-white/30"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {carouselImages.map((src, index) => (
                  <div
                    key={src}
                    className={`overflow-hidden rounded-2xl bg-white/10 ${
                      index === 2 ? "hidden md:block" : ""
                    } ${index === 3 ? "hidden lg:block" : ""}`}
                  >
                    <img
                      src={src}
                      alt={`Party moment ${index + 1}`}
                      className="h-40 w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartyExperience;
