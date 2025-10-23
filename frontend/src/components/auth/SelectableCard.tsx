import React from "react";

interface SelectableCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
}

const SelectableCard: React.FC<SelectableCardProps> = ({
  title,
  description,
  icon,
  selected = false,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex w-52 h-48 flex-col items-center justify-center gap-3 rounded-3xl border px-6 text-center transition shadow-sm hover:-translate-y-1 hover:shadow-lg ${
        selected
          ? "border-[#FFD700] shadow-[0_20px_40px_-20px_rgba(184,134,11,0.6)] bg-[#FFD700]"
          : "border-[#EFE7FF] bg-white"
      }`}
    >
      <div
        className={`flex items-center justify-center rounded-2xl ${
          selected ? " text-primary" : " text-primary"
        }`}
      >
        {icon}
      </div>
      <div>
        <p className="text-base font-semibold text-[#2C174B]">{title}</p>
        {description && (
          <p className="mt-1 text-sm text-[#6F5D9E]">{description}</p>
        )}
      </div>
    </button>
  );
};

export default SelectableCard;
