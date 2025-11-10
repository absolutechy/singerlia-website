import React, { useState, type InputHTMLAttributes } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Input as ShadcnInput } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
  ref?: React.Ref<HTMLInputElement>;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  type = 'text',
  value,
  onChange,
  ref,
  ...props
}) => {
  const [date, setDate] = useState<Date | undefined>(
    value && type === 'date' ? new Date(value as string) : undefined
  );

  // Handle date picker for date and datetime-local types
  if (type === 'date' || type === 'datetime-local') {
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label className="heading-6 text-gray-900 text-start !font-normal">
            {label}
          </label>
        )}
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                'w-full h-full rounded-lg pr-10 bg-white text-gray-900 placeholder:text-gray-400 border-0 outline-none focus:outline-none focus:border-0 focus:ring-0 transition-all flex items-center justify-start text-left',
                !date && 'text-gray-400',
                error && 'border-red-500',
                'bg-[#F7FBFF] border border-[#D4D7E3] !pl-2 py-3 md:py-0'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? (
                format(date, type === 'datetime-local' ? 'PPP p' : 'PPP')
              ) : (
                <span>{props.placeholder || 'Pick a date'}</span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(selectedDate) => {
                setDate(selectedDate);
                if (selectedDate && onChange) {
                  // Create a synthetic event with id
                  const syntheticEvent = {
                    target: {
                      id: props.id,
                      value: format(selectedDate, 'yyyy-MM-dd'),
                    },
                  } as React.ChangeEvent<HTMLInputElement>;
                  onChange(syntheticEvent);
                }
              }}
              captionLayout="dropdown"
              fromYear={1940}
              toYear={new Date().getFullYear()}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {error && (
          <span className="text-xs text-red-500">{error}</span>
        )}
      </div>
    );
  }

  // Regular input for other types
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="heading-6 text-gray-900 text-start !font-normal">
          {label}
        </label>
      )}
      <ShadcnInput
        type={type}
        value={value}
        onChange={onChange}
        className={cn(
          'rounded-lg pr-10 !pl-0 font-chocolates !text-base !font-normal bg-white text-gray-900 placeholder:text-gray-400 border-0 outline-none  focus:border-0 focus:ring-0 focus-visible:ring-0 focus-visible:border-0 focus-visible:outline-none transition-all',
          error && 'border-red-500',
          className
        )}
        ref={ref}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-500">{error}</span>
      )}
    </div>
  );
};

export default Input;
