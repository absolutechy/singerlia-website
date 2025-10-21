import React from "react";

interface LogoBadgeProps {
  size?: "sm" | "md" | "lg";
}

const sizeClass: Record<NonNullable<LogoBadgeProps["size"]>, string> = {
  sm: "h-14 w-14",
  md: "h-20 w-20",
  lg: "h-24 w-24",
};

const LogoBadge: React.FC<LogoBadgeProps> = ({ size = "md" }) => {
  return (
    <div
      className={`mx-auto flex items-center justify-center rounded-3xl bg-[#371552] shadow-[0_20px_40px_-20px_rgba(55,21,82,0.6)] ${sizeClass[size]}`}
    >
      <img
        src="/logo.png"
        alt="Singerlia logo"
        className="h-3/4 w-3/4 object-contain"
      />
    </div>
  );
};

export default LogoBadge;
