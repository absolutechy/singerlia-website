import React from "react";

interface SocialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  iconWrapperClassName?: string;
}

const SocialButton: React.FC<SocialButtonProps> = ({
  icon,
  label,
  iconWrapperClassName = "",
  ...props
}) => {
  return (
    <button
      {...props}
      className="flex w-full items-center justify-center gap-3 rounded-full border border-[#E5E0FF] bg-white py-3 text-sm font-semibold text-[#2C174B] shadow-[0_12px_30px_-20px_rgba(44,23,75,0.4)] transition hover:-translate-y-0.5 hover:border-[#C3B4FF]"
    >
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-inner ${iconWrapperClassName}`}
      >
        {icon}
      </span>
      {label}
    </button>
  );
};

export default SocialButton;
