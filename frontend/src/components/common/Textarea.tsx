import React from "react";
import { Textarea as ShadcnTextarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  className?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label className="heading-6 text-sm !font-normal text-start text-gray-900">
            {label}
          </label>
        )}
        <ShadcnTextarea
          ref={ref}
          className={cn(
            "rounded-xl border border-[#E7DEFF] bg-[#F9F7FF] px-4 py-3 text-sm text-[#2F1C4E] shadow-inner focus:border-[#B8860B] focus:outline-none focus-visible:ring-0 focus-visible:border-[#B8860B] min-h-24 resize-none",
            error && "border-red-500",
            className
          )}
          {...props}
        />
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
