import React from "react";
import { Share2, Heart, Image as ImageIcon } from "lucide-react";
import singer1 from "@/assets/images/singer-detail-1.png";
import singer2 from "@/assets/images/singer-detail-2.png";
import singer3 from "@/assets/images/singer-detail-3.png";

const paragraph =
  "We are committed to supporting singers by providing them with greater visibility, valuable opportunities, and direct connections with clients who truly appreciate their art. From solo acts to bands, classical to contemporary, we give singers the tools to showcase their talent, grow their audience, and build lasting relationships with customers.";

const SingerDetails: React.FC = () => {
  const name = "John Doberman";

  return (
    <div className="custom-container pb-16">
      <div className="grid gap-8 lg:grid-cols-[0.4fr_1fr] ">
        {/* Left fixed column */}
        <aside className="self-start sticky top-28 space-y-5">
          {/* Main card */}
          <div className="rounded-3xl bg-white p-4">
            <div className="relative">
              <img src={singer2} alt="cover" className="w-full rounded-2xl h-52 object-cover overflow-hidden" />
              {/* small avatar */}
              <img
                src={singer1}
                alt="avatar"
                className="w-14 h-14 z-50 rounded-full object-cover absolute -bottom-7 left-4 border-4 border-white"
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
                <button className="h-10 w-10 rounded-full border border-[#E7DEFF] bg-white flex items-center justify-center"><Share2 size={18} className="text-[#6F5D9E]"/></button>
                <button className="h-10 w-10 rounded-full border border-[#E7DEFF] bg-white flex items-center justify-center"><Heart size={18} className="text-[#6F5D9E]"/></button>
              </div>
            </div>
          </div>

          {/* Booking card */}
          <div className="relative rounded-2xl bg-white px-5 py-10 shadow border border-[#EBE4FF]">
            <span className="absolute -top-3 right-6 text-xs bg-white shadow px-3 py-1 rounded-full border border-[#EBE4FF]">Free cancellation</span>
            <button className="w-full h-12 rounded-full bg-gradient-to-b from-secondary to-secondary-dark text-[#1C1C1C] font-semibold shadow">
              Book Singer
            </button>
          </div>
        </aside>

        {/* Right content */}
        <section className="space-y-8">
          {/* Title + show all media */}
          <div className="flex items-center justify-between">
            <h1 className="heading-4 text-[#2E1B4D]">Signer Service title here</h1>
            <button className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 shadow border border-[#E7DEFF] text-sm font-semibold text-[#2E1B4D]">
              <ImageIcon size={16} /> Show all media
            </button>
          </div>

          {/* Media gallery - matches layout: big left (2x2), four small on right */}
          <div
            className="grid grid-cols-4 gap-4"
            style={{ gridAutoRows: "160px" }}
          >
            <div className="col-span-2 row-span-2 rounded-2xl overflow-hidden">
              <img src={singer1} alt="main" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-2xl overflow-hidden">
              <img src={singer1} alt="m2" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-2xl overflow-hidden">
              <img src={singer1} alt="m3" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-2xl overflow-hidden">
              <img src={singer2} alt="m4" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-2xl overflow-hidden">
              <img src={singer3} alt="m5" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* My Experience header aligned with social icons */}
          <div className="flex items-center justify-between pt-2">
            <h3 className="text-2xl font-bold text-[#1C1C1C]">My Experience</h3>
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
                <p className="text-[#6F5D9E]">Over 10 years singing customers around UK and Europe!</p>
              </li>
              <li>
                <p className="font-semibold">Education and training</p>
                <p className="text-[#6F5D9E]">Singing Diploma of ETIC and earned an MBA in Marketing at University of Sunderland.</p>
              </li>
            </ul>
          </div>

          {/* Message button */}
          <div className="pt-4">
            <button className="w-full h-12 rounded-xl border border-[#E7DEFF] bg-white text-[#2E1B4D] font-semibold">
              Message {name.split(" ")[0]}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SingerDetails;

// Local small icon bubble component using lucide icons to mirror the screenshot look
import { Instagram, Music2, Youtube, Disc3, Linkedin } from "lucide-react";

type BubbleType = "instagram" | "music" | "youtube" | "disc" | "linkedin";

const IconBubble: React.FC<{ type: BubbleType }> = ({ type }) => {
  const base = "h-9 w-9 rounded-full border border-[#E7DEFF] bg-white flex items-center justify-center text-[#2E1B4D]";
  const map: Record<BubbleType, React.ReactNode> = {
    instagram: <Instagram size={16} />,
    music: <Music2 size={16} />,
    youtube: <Youtube size={16} />,
    disc: <Disc3 size={16} />,
    linkedin: <Linkedin size={16} />,
  };
  return <button className={base}>{map[type]}</button>;
};
