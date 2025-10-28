import React from "react";
import { Checkbox as ShadcnCheckbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export interface CheckboxProps {
  label?: string;
  error?: string;
  className?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof ShadcnCheckbox>,
  CheckboxProps
>(({ label, error, className = "", checked, onCheckedChange, disabled, id }, ref) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex items-center gap-3">
        <ShadcnCheckbox
          ref={ref}
          id={id}
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          className={cn(
            "border-[#E7DEFF] data-[state=checked]:bg-primary data-[state=checked]:border-primary",
            error && "border-red-500",
            className
          )}
        />
        {label && (
          <label
            htmlFor={id}
            className="text-sm text-[#2F1C4E] cursor-pointer"
          >
            {label}
          </label>
        )}
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;
