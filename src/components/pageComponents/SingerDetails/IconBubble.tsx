import React from "react";
import { Instagram, Music2, Youtube, Disc3, Linkedin, Facebook } from "lucide-react";

export type BubbleType = "instagram" | "facebook" | "twitter" | "tiktok" | "youtube" | "linkedin";

const IconBubble: React.FC<{ type: BubbleType; url?: string }> = ({ type, url }) => {
  const base =
    "h-9 w-9 rounded-full border border-[#E7DEFF] bg-white flex items-center justify-center text-[#2E1B4D] hover:bg-gray-50 transition-colors";
  const map: Record<BubbleType, React.ReactNode> = {
    instagram: <Instagram size={16} />,
    facebook: <Facebook size={16} />,
    twitter: <Music2 size={16} />,
    tiktok: <Disc3 size={16} />,
    youtube: <Youtube size={16} />,
    linkedin: <Linkedin size={16} />,
  };
  
  const handleClick = () => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };
  
  return (
    <button 
      className={base} 
      onClick={handleClick}
      disabled={!url}
      style={{ opacity: url ? 1 : 0.3, cursor: url ? 'pointer' : 'not-allowed' }}
    >
      {map[type]}
    </button>
  );
};

export default IconBubble;

