import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export interface DatePickerProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  error?: string;
  showTime?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({
  label,
  placeholder = 'Pick a date',
  value,
  onChange,
  className = '',
  error,
  showTime = false,
}) => {
  const [date, setDate] = useState<Date | undefined>(
    value ? new Date(value) : undefined
  );

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate && onChange) {
      onChange(format(selectedDate, 'yyyy-MM-dd'));
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="heading-6 text-gray-900">
          {label}
        </label>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              'w-full h-9 rounded-lg pr-10 !bg-white text-left border-0 outline-none focus:outline-none focus:border-0 focus:ring-0 transition-all flex items-center justify-start',
              !date && 'text-gray-400',
              date && 'text-gray-900',
              error && 'border-red-500',
              className
            )}
          >
            {showTime ? (
              <Clock className="mr-2 h-4 w-4" />
            ) : (
              <CalendarIcon className="mr-2 h-4 w-4" />
            )}
            {date ? (
              format(date, showTime ? 'PPP p' : 'PPP')
            ) : (
              <span>{placeholder}</span>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {error && (
        <span className="text-xs text-red-500">{error}</span>
      )}
    </div>
  );
};

export default DatePicker;
