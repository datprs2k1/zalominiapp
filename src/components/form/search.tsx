import SearchIcon from '@/components/icons/search';
import { HTMLProps } from 'react';
import { cn } from '@/utils/cn';

export default function SearchInput({ className, ...props }: HTMLProps<HTMLInputElement>) {
  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-medical bg-white relative space-x-1',
        'border border-neutral-200 shadow-sm hover:shadow-card-medical transition-all duration-200',
        'focus-within:ring-2 focus-within:ring-medical-500 focus-within:border-medical-500',
        className
      )}
    >
      <input
        placeholder="Tìm bệnh, bác sĩ, thuốc..."
        className="placeholder:text-neutral-400 text-medical-body pl-[44px] h-[44px] flex-1 rounded-medical outline-none bg-transparent"
        required
        name="keyword"
        {...props}
      />
      <SearchIcon className="h-5 w-5 absolute left-3 text-neutral-400" />
    </div>
  );
}
