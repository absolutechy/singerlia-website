import React from "react";
import { RadioGroup as ShadcnRadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

export interface RadioOption {
  value: string;
  label: string;
}

export interface RadioGroupProps {
  label?: string;
  options: RadioOption[];
  error?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ label, options, error, className = "", value, onChange, disabled }, ref) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <label className="heading-6 text-sm !font-normal text-start text-gray-900">
            {label}
          </label>
        )}
        <ShadcnRadioGroup
          ref={ref}
          value={value}
          onValueChange={onChange}
          disabled={disabled}
          className={cn("flex flex-col gap-3", className)}
        >
          {options.map((option) => (
            <div key={option.value} className="flex items-center gap-3">
              <RadioGroupItem
                value={option.value}
                id={option.value}
                className="border-[#E7DEFF] text-primary data-[state=checked]:border-primary"
              />
              <label
                htmlFor={option.value}
                className="text-base text-[#2F1C4E] cursor-pointer"
              >
                {option.label}
              </label>
            </div>
          ))}
        </ShadcnRadioGroup>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);

RadioGroup.displayName = "RadioGroup";

export default RadioGroup;
