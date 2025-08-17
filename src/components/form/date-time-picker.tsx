import { useMemo, useState } from 'react';
import ChevronDownIcon from '../icons/chevron-down';
import { AvailableTimeSlots } from '@/types';
import { formatDayName, formatShortDate } from '@/utils/format';
import { cn } from '@/utils/cn';

export interface DateTimePickerProps {
  value?: { date?: Date };
  onChange: (value: { date?: Date }) => void;
  slots: AvailableTimeSlots[];
}

function DateTimePicker({ value, onChange, slots }: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = useState(value?.date);
  const [isExpanded, setIsExpanded] = useState(!!value?.date);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setIsExpanded(true);
    onChange({ date });
  };

  const toggleExpand = () => {
    if (!isExpanded && !selectedDate && slots.length > 0) {
      handleDateSelect(slots[0].date);
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 px-2 overflow-x-auto date-picker-mobile">
        {slots.map(({ date }, index) => {
          const dayName = formatDayName(date);
          const shortDate = formatShortDate(date);
          const isSelected = selectedDate?.toDateString() === date.toDateString();

          return (
            <button
              type="button"
              key={index}
              onClick={() => handleDateSelect(date)}
              className={cn(
                'flex flex-none basis-16 sm:basis-20 flex-col justify-center items-center gap-1 sm:gap-2 px-2 py-2.5 font-medium relative rounded-medical transition-all duration-200 comfortable-touch-target mobile-focus-visible',
                isSelected
                  ? 'text-medical-700 bg-medical-100 border-2 border-medical-500 shadow-sm'
                  : 'text-neutral-600 hover:text-medical-600 hover:bg-medical-50 border-2 border-transparent'
              )}
            >
              <span className="text-center text-xs whitespace-nowrap opacity-70">{dayName}</span>
              <span className="text-center text-sm sm:text-base font-semibold">{shortDate}</span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={toggleExpand}
        className="flex justify-center items-center h-10 sm:h-12 w-full rounded-medical hover:bg-medical-50 transition-colors duration-200 comfortable-touch-target mobile-focus-visible mt-2"
        aria-label={isExpanded ? 'Thu gọn lịch' : 'Mở rộng lịch'}
      >
        <ChevronDownIcon
          className={cn('transition-transform duration-300 text-medical-500', isExpanded ? '' : 'rotate-180')}
        />
      </button>
    </div>
  );
}

export default DateTimePicker;
