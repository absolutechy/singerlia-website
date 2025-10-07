import React from 'react';
import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  placeholder = 'Select an option',
  className = '',
  value,
  onChange,
  disabled,
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="heading-6 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <ShadcnSelect value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger 
          className={`w-full p-0 pr-10 h-full border-0 outline-none focus:ring-0 focus:ring-offset-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none shadow-none bg-transparent ${
            error ? 'text-red-500' : ''
          } ${className}`}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </ShadcnSelect>
      {error && (
        <span className="text-xs text-red-500">{error}</span>
      )}
    </div>
  );
};

export default Select;
