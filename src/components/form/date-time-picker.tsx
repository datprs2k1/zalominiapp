import { useMemo, useState } from 'react';
import ChevronDownIcon from '../icons/chevron-down';
import { AvailableTimeSlots } from '@/types';
import { formatDayName, formatShortDate } from '@/utils/format';

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
      <div className="flex items-center gap-1.5 px-4 overflow-x-auto">
        {slots.map(({ date }, index) => {
          const dayName = formatDayName(date);
          const shortDate = formatShortDate(date);
          const isSelected = selectedDate?.toDateString() === date.toDateString();

          return (
            <button
              type="button"
              key={index}
              onClick={() => handleDateSelect(date)}
              className={`flex flex-none basis-16 flex-col justify-center items-center gap-2 px-1 py-2.5 font-medium relative rounded-lg ${
                isSelected ? 'text-primary-gradient bg-highlight' : ''
              }`}
            >
              <span className="text-center text-xs whitespace-nowrap opacity-50">{dayName}</span>
              <span className="text-center text-base">{shortDate}</span>
            </button>
          );
        })}
      </div>

      <button type="button" onClick={toggleExpand} className="flex justify-center items-center h-12">
        <ChevronDownIcon className={`transition-transform duration-300 ${isExpanded ? '' : 'rotate-180'}`} />
      </button>
    </div>
  );
}

export default DateTimePicker;
