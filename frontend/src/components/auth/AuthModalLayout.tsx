import React from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router";

type ModalSize = "md" | "lg";

interface AuthModalLayoutProps {
  title: string;
  children: React.ReactNode;
  size?: ModalSize;
  className?: string;
  footerNote?: string | React.ReactNode;
  onClose?: () => void;
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
  onClose,
}) => {
  const navigate = useNavigate();
  const handleClose = () => {
    if (onClose) return onClose();
    navigate("/");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />
      <div
        className={`relative w-full ${sizeMap[size]} rounded-[32px] border border-[#F0E6FF] bg-white/95 shadow-[0_40px_80px_-30px_rgba(55,21,82,0.35)] ${className}`}
      >
        <div className="flex pt-10 pb-4 px-6 border-b border-[#CDCDCD]">
          <h2 className="text-2xl font-semibold ms-auto font-chocolates text-primary-text md:text-3xl">
            {title}
          </h2>
          <button
            aria-label="Close"
            onClick={handleClose}
            className="ml-auto h-8 w-8 flex justify-center items-center rounded-full border border-[#E5DAFF] p-1 text-[#7264A4] transition bg-[#979797] hover:bg-[#F7F4FF] cursor-pointer"
          >
            <X className="h-4 w-4 text-white hover:text-black" />
          </button>
        </div>
        <div className="px-8 pt-6 text-center md:px-14">
          <div className="mt-4">{children}</div>
        </div>
        <div className="mt-10 rounded-b-[32px] border-t border-[#EFE5FF] bg-[#FBF9FF] text-primary-text py-4 text-center text-xs font-medium uppercase tracking-[0.18em]">
          {footerNote}
        </div>
      </div>
    </div>
  );
};

export default AuthModalLayout;
