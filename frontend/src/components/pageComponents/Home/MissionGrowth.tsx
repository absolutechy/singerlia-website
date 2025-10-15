import React from "react";

type Highlight = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

type Stat = {
  label: string;
  subLabel: string;
  icon: React.ReactNode;
};

const highlightCards: Highlight[] = [
  {
    title: "Customer",
    description:
      "Book top-rated singers near you, explore real portfolios, and pay securely with confidence.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 7.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 19.5a7.5 7.5 0 0 1 15 0"
        />
      </svg>
    ),
  },
  {
    title: "Singer's",
    description:
      "Showcase your work, accept bookings, and manage your calendar from any device.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m9 18 6-6-4-4-6 6v4h4Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m13 6 2-2 3 3-2 2M16 9l1.5 1.5"
        />
      </svg>
    ),
  },
];

const growthStats: Stat[] = [
  {
    label: "10K+ Reviews",
    subLabel: "4.9 Rating",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4.5 14.09 9l4.91.36-3.72 3.12 1.17 4.77-4.45-2.68-4.45 2.68 1.17-4.77-3.72-3.12L9.91 9 12 4.5Z"
        />
      </svg>
    ),
  },
  {
    label: "50K+ Monthly",
    subLabel: "Active Customers",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 3.75h16.5M3.75 9h16.5M3.75 14.25h16.5M3.75 19.5h16.5"
        />
      </svg>
    ),
  },
  {
    label: "4.9 / 5",
    subLabel: "Average Rating",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v12m0 0 3.75-3.75M12 18 8.25 14.25"
        />
      </svg>
    ),
  },
  {
    label: "500+ Locations",
    subLabel: "Partner Singer's",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 2.25c-3.589 0-6.5 2.91-6.5 6.5 0 4.875 6.5 12.5 6.5 12.5s6.5-7.625 6.5-12.5c0-3.59-2.911-6.5-6.5-6.5Z"
        />
        <circle cx="12" cy="9" r="2.25" />
      </svg>
    ),
  },
  {
    label: "25,000+",
    subLabel: "Events Completed",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.75 4.5h10.5V19.5H6.75V4.5Z"
        />
        <path d="M9 3.75h6v1.5H9zM9 18.75h6v1.5H9z" />
      </svg>
    ),
  },
  {
    label: "12,000+",
    subLabel: "Verified Artists",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m9.75 12 2.25 2.25 4.5-4.5"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.5 4.5h9l1.5 4.5h-12l1.5-4.5Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 9h12v10.5H6V9Z"
        />
      </svg>
    ),
  },
];

const MissionGrowth: React.FC = () => {
  return (
    <div className="w-full bg-white">
      <div className="custom-container px-6 py-24 lg:px-24 space-y-20">
        <section className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
          <div className="space-y-6">
            <h2 className="heading-1 text-primary">About Our Mission</h2>
            <div className="space-y-6 text-lg text-gray-700">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">
                  For Customers
                </h3>
                <p>
                  Our mission is to make finding the perfect singer effortless.
                  We connect you with performers who match your event&apos;s
                  style so you can listen, compare, and book all in one place.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">
                  For Singer&apos;s
                </h3>
                <p>
                  We empower singers with visibility, opportunities, and direct
                  access to clients who appreciate their craft. Grow your
                  audience and build lasting relationships.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            {highlightCards.map((card) => (
              <div
                key={card.title}
                className="flex items-start gap-4 rounded-2xl bg-[#3C1E66] p-6 text-white shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-#B8860B33 text-white">
                  {card.icon}
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-semibold">{card.title}</p>
                  <p className="text-sm text-white/80">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="space-y-12">
          <div className="text-center">
            <h2 className="heading-1 text-primary">Today Growth Singerlia</h2>
          </div>
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
  {growthStats.map((stat, index) => (
    <React.Fragment key={stat.label}>
      {/* Insert empty cell at the start of 2nd row (after 4th item) */}
      {index === 4 && <div></div>}
      <div className="rounded-2xl p-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#B8860B33] text-[#B8860B] shadow">
          {stat.icon}
        </div>
        <p className="text-lg font-semibold text-gray-900">
          {stat.label}
        </p>
        <p className="text-sm text-gray-600">{stat.subLabel}</p>
      </div>
    </React.Fragment>
  ))}
</div>

          <div className="border-t border-dashed border-gray-300 pt-10">
            <p className="mx-auto max-w-3xl text-center text-base text-gray-700">
              Our mission is to bridge the gap between customers and singers by
              creating a seamless, trustworthy, and enjoyable experience. We aim
              to celebrate music, uplift artists, and make every event
              unforgettable through the power of live performance.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MissionGrowth;
