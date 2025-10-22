import React from "react";

interface PriceRangeProps {
  min?: number;
  max?: number;
  value: { min: number; max: number };
  onChange: (next: { min: number; max: number }) => void;
}

const PriceRange: React.FC<PriceRangeProps> = ({
  min = 0,
  max = 75000,
  value,
  onChange,
}) => {
  const clamp = (val: number, lo: number, hi: number) => Math.min(Math.max(val, lo), hi);

  const handleMin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    const nextMin = Math.min(v, value.max);
    onChange({ min: nextMin, max: value.max });
  };

  const handleMax = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    const nextMax = Math.max(v, value.min);
    onChange({ min: value.min, max: nextMax });
  };

  // Positions as percentage for optional visual fills (not strictly needed)
  const minPct = ((clamp(value.min, min, max) - min) / (max - min)) * 100;
  const maxPct = ((clamp(value.max, min, max) - min) / (max - min)) * 100;

  return (
    <div className="w-full">
      {/* Label text handled by parent */}
      <div className="text-xs text-[#6F5D9E] mb-2">{min.toLocaleString()} SAR - {max.toLocaleString()} SAR</div>
      <div className="relative h-8">
        {/* Base purple track */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[6px] bg-[#371552] rounded-full" />
        {/* Optional range highlight */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-[6px] bg-[#371552]/90 rounded-full"
          style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
        />

        {/* Dual range inputs with hidden tracks; thumbs visible */}
        <input
          type="range"
          min={min}
          max={max}
          value={value.min}
          onChange={handleMin}
          className="range-dual-thumb absolute inset-0 appearance-none bg-transparent range-min"
          style={{ zIndex: 3 }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value.max}
          onChange={handleMax}
          className="range-dual-thumb absolute inset-0 appearance-none bg-transparent range-max"
          style={{ zIndex: 2 }}
        />
      </div>
    </div>
  );
};

export default PriceRange;
