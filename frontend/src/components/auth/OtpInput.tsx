import React, { useRef } from "react";

interface OtpInputProps {
  length?: number;
  onChange?: (value: string) => void;
}

const OtpInput: React.FC<OtpInputProps> = ({ length = 6, onChange }) => {
  const inputs = Array.from({ length });
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (index: number, value: string) => {
    const normalized = value.replace(/\D/g, "");
    if (!refs.current[index]) return;
    refs.current[index]!.value = normalized.slice(-1);
    const currentValue = refs.current.map((input) => input?.value ?? "").join("");
    onChange?.(currentValue);
    if (normalized && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !refs.current[index]?.value && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="mx-auto flex items-center justify-center gap-2 md:gap-4">
      {inputs.map((_, index) => (
        <input
          key={`otp-${index}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          ref={(input) => {
            refs.current[index] = input;
          }}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          className="h-12 w-10 rounded-2xl border border-[#E6DCFF] bg-white text-center text-lg font-semibold text-[#371552] shadow-[0_12px_30px_-20px_rgba(55,21,82,0.45)] focus:border-[#B8860B] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/40 md:h-14 md:w-12"
        />
      ))}
    </div>
  );
};

export default OtpInput;
