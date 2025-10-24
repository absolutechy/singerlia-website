import React from "react";
import { Instagram, Music2, Youtube, Disc3, Linkedin } from "lucide-react";

export type BubbleType = "instagram" | "music" | "youtube" | "disc" | "linkedin";

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

export default IconBubble;

