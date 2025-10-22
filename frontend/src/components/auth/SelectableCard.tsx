import React from "react";
import { Check } from "lucide-react";

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
      className={`group relative flex h-40 w-full flex-col items-center justify-center gap-3 rounded-3xl border bg-white px-6 text-center transition shadow-sm hover:-translate-y-1 hover:shadow-lg ${
        selected
          ? "border-[#FFD700] shadow-[0_20px_40px_-20px_rgba(184,134,11,0.6)]"
          : "border-[#EFE7FF]"
      }`}
    >
      {selected && (
        <span className="absolute right-5 top-5 flex h-6 w-6 items-center justify-center rounded-full bg-[#FFD700] text-primary">
          <Check className="h-4 w-4" strokeWidth={2.5} />
        </span>
      )}
      <div
        className={`flex h-16 w-16 items-center justify-center rounded-2xl ${
          selected ? "bg-[#FFD700] text-primary" : "bg-[#F5F0FF] text-primary"
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
