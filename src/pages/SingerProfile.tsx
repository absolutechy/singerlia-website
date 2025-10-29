import React from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, BadgeCheck, Bell, CircleDot, Edit2, Globe, MapPin, Pencil, Play, Search, Settings, Star, Video,Trash } from "lucide-react";

const profile = {
  name: "John Doberman",
  role: "Singer",
  avatar:
    "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=300&q=80",
  languages: ["English", "Mandarin"],
  location: "100 Smart Street, LA, UK",
  price: 200,
  rating: 5.0,
  reviews: 3,
  available: true,
};

const paragraph =
  "We are committed to supporting singers by providing them with greater visibility, valuable opportunities, and direct connections with clients who truly appreciate their art. From solo acts to bands, classical to contemporary, we give singers the tools to showcase their talent, grow their audience, and build lasting relationships with customers.";

const SingerProfile: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full bg-white">
      <div className="custom-container px-6 py-10 lg:px-24">
        {/* Top bar */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          {/* Back */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-sm text-[#6F5D9E] hover:text-primary"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E7DEFF] text-primary bg-white">
                <ArrowLeft className="h-4 w-4" />
              </span>
              Back
            </button>
          </div>

          {/* Center logo */}
          <img
            src={"/favicon.ico"}
            alt="Logo"
            className="h-12 w-12 rounded-xl object-contain justify-self-center"
          />

          {/* Search + actions */}
          <div className="ml-auto flex items-center gap-3 justify-self-end">
            <div className="flex h-11 w-full max-w-md items-center gap-2 rounded-full border border-[#E7DEFF] bg-white px-4">
              <Search className="h-4 w-4 text-primary" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-transparent text-sm text-[#2F1C4E] placeholder:text-[#9AA0B4] focus:outline-none"
              />
            </div>

            <button className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[#E7DEFF] bg-white text-[#7264A4] transition hover:bg-[#F7F4FF]">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 inline-block h-2 w-2 rounded-full bg-[#F59E0B]" />
            </button>
            <button className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E7DEFF] bg-white text-[#7264A4] transition hover:bg-[#F7F4FF]">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[360px_1fr]">
          {/* Left column */}
          <aside className="space-y-6">
            <h2 className="heading-2 text-[#2E1B4D]">Profile</h2>
            <div className="bg-white p-6">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="h-44 w-full rounded-2xl object-cover"
              />
              <div className="mt-4 space-y-3">
                <div>
                  <p className="text-xl font-semibold text-[#2E1B4D]">{profile.name}</p>
                  <p className="text-sm text-[#6F5D9E]">{profile.role}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.languages.map((lang) => (
                    <span
                      key={lang}
                      className="rounded-full bg-[#F5F0FF] px-3 py-1 text-xs font-medium text-[#6F5D9E]"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
                <div className="flex items-start gap-2 text-sm text-[#6F5D9E]">
                  <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                  <span>{profile.location}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[#2E1B4D]">Per Event ${profile.price}</p>
                <button className="text-[#6F5D9E] hover:text-primary">
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="bg-white p-6 ">
              <p className="mb-4 text-sm font-semibold text-[#2E1B4D]">On The Web</p>
              <ul className="space-y-4 text-sm text-[#6F5D9E]">
                {[
                  { label: "Instagram", color: "#E1306C" },
                  { label: "TikTok", color: "#000000" },
                  { label: "YouTube", color: "#FF0000" },
                  { label: "Not Attached", color: "#C0B6E8" },
                  { label: "Not Attached", color: "#C0B6E8" },
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center justify-between">
                    <span className="flex items-center gap-3">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      {item.label}
                    </span>
                    <Globe className="h-4 w-4" />
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Right column */}
          <main className="space-y-8">
            {/* Header row */}
            <div className="flex flex-wrap items-center gap-4 bg-white p-6">
              <div className="flex items-center gap-2 text-sm ml-auto text-[#B8860B]">
                <Star className="h-4 w-4 fill-[#FFD700] text-[#FFD700]" />
                <span className="font-semibold text-[#2E1B4D]">{profile.rating.toFixed(1)}</span>
                <span className="text-[#6F5D9E]">· {profile.reviews} reviews</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#EAF8EE] px-3 py-1.5 text-sm font-medium text-[#137A2E]">
                  <BadgeCheck className="h-4 w-4" />
                  {profile.available ? "Available" : "Unavailable"}
                </span>
                <button className="rounded-full border border-[#E7DEFF] px-4 py-2 text-sm font-semibold text-primary hover:bg-[#F7F4FF]">
                  <Edit2 className="mr-2 inline h-4 w-4" />Edit
                </button>
              </div>
            </div>

            {/* My Bio */}
            <section className="space-y-3 bg-white p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#2E1B4D]">My Bio</h3>
                <button className="text-[#6F5D9E] hover:text-primary">
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
              <ul className="space-y-4 text-sm text-[#2F1C4E]">
                <li className="flex gap-3">
                  <Video className="mt-0.5 h-4 w-4 text-primary" />
                  <div>
                    <p className="font-semibold">14 years of experience</p>
                    <p className="text-[#6F5D9E]">{paragraph}</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <CircleDot className="mt-0.5 h-4 w-4 text-primary" />
                  <div>
                    <p className="font-semibold">Career highlight</p>
                    <p className="text-[#6F5D9E]">Over 10 years singing customers around UK and Europe!</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <CircleDot className="mt-0.5 h-4 w-4 text-primary" />
                  <div>
                    <p className="font-semibold">Education and training</p>
                    <p className="text-[#6F5D9E]">Singing Diploma of ETIC and earned an MBA in Marketing at University of Sunderland.</p>
                  </div>
                </li>
              </ul>
            </section>

            {/* About me */}
            <section className="space-y-3 rounded-3xl bg-white p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#2E1B4D]">About me</h3>
                <button className="text-[#6F5D9E] hover:text-primary">
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-2 text-sm text-[#6F5D9E]">
                <p>{paragraph}</p>
                <p>{paragraph}</p>
                <p>{paragraph}</p>
              </div>
            </section>

            {/* Portfolio */}
            <section className="space-y-4 border-b border-[#EBE4FF] pb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#2E1B4D]">Portfolio Media Gallery</h3>
                <button className="rounded-full bg-[#F0C84B] px-4 py-2 text-sm font-semibold text-black hover:bg-[#E0B63F]">
                  Upload portfolio
                </button>
              </div>
              <div className="inline-flex rounded-full bg-[#F2ECFF] p-1">
                <button className="rounded-full bg-primary px-5 py-1.5 text-sm font-semibold text-white">Videos</button>
                <button className="rounded-full px-5 py-1.5 text-sm font-semibold text-[#6F5D9E]">Photos</button>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-3xl border border-[#EBE4FF] bg-white p-3 shadow-sm">
                    <div className="relative">
                      <img
                        src={profile.avatar}
                        alt="video thumb"
                        className="h-48 w-full rounded-2xl object-cover"
                      />
                      <button className="absolute left-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-primary shadow">
                        <Play className="h-5 w-5" />
                      </button>
                    </div>
                    <p className="mt-3 line-clamp-2 text-sm text-[#6F5D9E]">
                      Video title show here. Video title show here. Video title show here.
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <button className="rounded-md flex items-center justify-center gap-1 bg-[#F7F7F7] border border-[#CDCDCD] px-4 py-2 text-xs font-semibold hover:text-white hover:bg-primary">
                        <Edit2 className="h-3 w-3"/>
                        Edit</button>
                      <button className="rounded-md flex items-center justify-center gap-1 bg-[#F7F7F7] border border-[#CDCDCD] px-4 py-2 text-xs font-semibold hover:text-white hover:bg-[#e04a4a]">
                        <Trash className="h-3 w-3"/>
                        Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Users Reviews */}
            <section className="space-y-4 bg-white p-6">
              <h3 className="text-lg font-semibold text-[#2E1B4D]">Users Reviews</h3>

              <div className="flex items-center gap-3 text-sm">
                <Star className="h-5 w-5 fill-[#FFD700] text-[#FFD700]" />
                <span className="text-base font-semibold text-[#2E1B4D]">4.97</span>
                <span className="text-[#6F5D9E]">·</span>
                <span className="text-base font-semibold text-[#2E1B4D]">29 reviews</span>
              </div>

              <div className="divide-y divide-[#EBE4FF]">
                {[
                  { id: 1, name: "Liam", location: "Yellowknife, Canada", rating: 5.0, ago: "1 week ago", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=60" },
                  { id: 2, name: "Liam", location: "Yellowknife, Canada", rating: 5.0, ago: "1 week ago", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=60" },
                  { id: 3, name: "Liam", location: "Yellowknife, Canada", rating: 5.0, ago: "1 week ago", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=60" },
                ].map((r) => (
                  <div key={r.id} className="py-4">
                    <div className="flex items-start gap-3">
                      <img src={r.avatar} alt={r.name} className="h-10 w-10 rounded-full object-cover" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-[#2E1B4D]">{r.name}</p>
                        <p className="text-xs text-[#6F5D9E]">{r.location}</p>
                        <div className="mt-2 flex items-center gap-3 text-sm text-[#6F5D9E]">
                          <span className="inline-flex items-center gap-1 text-[#2E1B4D]">
                            <Star className="h-4 w-4 fill-[#FFD700] text-[#FFD700]" />
                            {r.rating.toFixed(1)}
                          </span>
                          <span>·</span>
                          <span>{r.ago}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button className="mx-auto block w-full rounded-xl border border-[#E7DEFF] bg-white px-5 py-2.5 text-sm font-semibold text-[#2E1B4D] hover:bg-[#F7F4FF]">
                  Show all reviews
                </button>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default SingerProfile;
