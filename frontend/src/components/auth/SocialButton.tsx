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
      className="flex flex-col md:flex-row w-full outfit items-center justify-center gap-3 rounded-xl border border-[#E5E0FF] bg-white py-2 text-sm text-[#2C174B] transition hover:border-[#C3B4FF]"
    >
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-xl bg-white ${iconWrapperClassName}`}
      >
        {icon}
      </span>
      <p className="">
      {label}
      </p>
    </button>
  );
};

export default SocialButton;
