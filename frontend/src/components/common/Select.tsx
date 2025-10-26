import React from "react";
import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  label?: string;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  placeholder = "Select an option",
  className = "",
  value,
  onChange,
  disabled,
}) => {
  return (
    <div className="flex flex-col gap-1 w-full z-0">
      {label && (
        <label className="heading-6 text-sm !font-normal text-start">
          {label}
        </label>
      )}
      <ShadcnSelect value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger
          className={cn(
            // Match text/email input styles
            "w-full rounded-xl border border-[#E7DEFF] bg-[#F9F7FF] z-50 px-4 py-3 pr-10 text-sm text-[#2F1C4E] shadow-inner focus:border-[#B8860B] focus:outline-none",
            error && "border-red-500",
            className
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="z-50 bg-white">
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </ShadcnSelect>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default Select;
