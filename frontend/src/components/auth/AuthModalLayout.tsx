import React from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router";

type ModalSize = "md" | "lg";

interface AuthModalLayoutProps {
  title: string;
  children: React.ReactNode;
  size?: ModalSize;
  className?: string;
  footerNote?: string;
}

const sizeMap: Record<ModalSize, string> = {
  md: "max-w-xl",
  lg: "max-w-3xl",
};

const AuthModalLayout: React.FC<AuthModalLayoutProps> = ({
  title,
  children,
  size = "md",
  className = "",
  footerNote = "Designed By Singerlia Booking",
}) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />
      <div
        className={`relative w-full ${sizeMap[size]} rounded-[32px] border border-[#F0E6FF] bg-white/95 shadow-[0_40px_80px_-30px_rgba(55,21,82,0.35)] ${className}`}
      >
        <button
          aria-label="Close"
          onClick={() => navigate(-1)}
          className="absolute right-6 top-6 rounded-full border border-[#E5DAFF] p-1 text-[#7264A4] transition hover:bg-[#F7F4FF]"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="px-8 pt-10 text-center md:px-14">
          <h2 className="text-2xl font-semibold text-[#2E1B4D] md:text-3xl">
            {title}
          </h2>
          <div className="mt-10">{children}</div>
        </div>
        <div className="mt-14 rounded-b-[32px] border-t border-[#EFE5FF] bg-[#FBF9FF] py-4 text-center text-xs font-medium uppercase tracking-[0.18em] text-[#9482BF]">
          {footerNote}
        </div>
      </div>
    </div>
  );
};

export default AuthModalLayout;
