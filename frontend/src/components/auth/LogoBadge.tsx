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
      className={`mx-auto flex items-center w-28 h-24 justify-center rounded-2xl bg-primary shadow-sm ${sizeClass[size]}`}
    >
      <img
        src="/logo.png"
        alt="Singerlia logo"
        className="w-40 object-contain"
      />
    </div>
  );
};

export default LogoBadge;
