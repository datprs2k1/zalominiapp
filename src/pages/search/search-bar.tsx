import SearchIcon from '@/components/icons/search';
import { HTMLProps, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/utils/cn';

interface SearchBarProps extends HTMLProps<HTMLInputElement> {
  loading?: boolean;
  onVoiceSearch?: () => void;
  onFilterClick?: () => void;
}

export default function SearchBar({
  className,
  loading,
  onChange,
  onVoiceSearch,
  onFilterClick,
  ...props
}: SearchBarProps) {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [hasText, setHasText] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasText(e.target.value.length > 0);
    if (onChange) {
      onChange(e);
    }
  };

  const clearInput = () => {
    const input = document.querySelector('input[name="keyword"]') as HTMLInputElement;
    if (input) {
      input.value = '';
      setHasText(false);
      input.focus();
    }
  };

  const handleVoiceSearch = () => {
    if (onVoiceSearch) {
      onVoiceSearch();
    } else {
      // Default voice search behavior - could integrate with Web Speech API
      console.log('Voice search clicked');
    }
  };

  const handleFilterClick = () => {
    if (onFilterClick) {
      onFilterClick();
    } else {
      // Default filter behavior
      console.log('Filter clicked');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6">
      <form
        className={cn(
          'relative rounded-2xl bg-white transition-all duration-300',
          'shadow-lg border-2',
          isActive ? 'border-blue-500 shadow-xl ring-4 ring-blue-100' : 'border-gray-200 hover:border-gray-300',
          className
        )}
        onSubmit={(e) => {
          e.preventDefault();
          const keyword = new FormData(e.currentTarget).get('keyword') as string;
          if (keyword.trim()) {
            setIsSubmitting(true);
            navigate(`/search?keyword=${encodeURIComponent(keyword)}`, {
              viewTransition: true,
            });
            // Reset submitting state after navigation
            setTimeout(() => setIsSubmitting(false), 1000);
          }
        }}
      >
        <div className="relative flex items-center">
          {/* Search Icon */}
          <SearchIcon className="h-5 w-5 absolute left-4 text-gray-400 pointer-events-none z-10" />

          {/* Input Field */}
          <input
            placeholder="Tìm bệnh, bác sĩ, thuốc, dịch vụ y tế..."
            className={cn(
              'w-full h-14 pl-12 pr-24 py-4 rounded-2xl text-base',
              'placeholder:text-gray-400 text-gray-700',
              'outline-none border-none bg-transparent',
              'focus:ring-0 transition-all duration-200'
            )}
            required
            name="keyword"
            onFocus={() => setIsActive(true)}
            onBlur={() => setIsActive(false)}
            onChange={handleInputChange}
            {...props}
          />

          {/* Clear Button */}
          {hasText && (
            <button
              type="button"
              onClick={clearInput}
              className={cn(
                'absolute right-16 w-6 h-6 rounded-full',
                'flex items-center justify-center',
                'text-gray-400 hover:text-gray-600',
                'transition-all duration-200 hover:bg-gray-100',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1'
              )}
              aria-label="Xóa tìm kiếm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Voice Search Button */}
          <button
            type="button"
            onClick={handleVoiceSearch}
            className={cn(
              'absolute right-8 w-8 h-8 rounded-full',
              'flex items-center justify-center',
              'text-blue-500 hover:text-blue-600 hover:bg-blue-50',
              'transition-all duration-200 active:scale-95',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1'
            )}
            aria-label="Tìm kiếm bằng giọng nói"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
            </svg>
          </button>

          {/* Filter Button */}
          <button
            type="button"
            onClick={handleFilterClick}
            className={cn(
              'absolute right-1 w-8 h-8 rounded-full',
              'flex items-center justify-center',
              'text-gray-500 hover:text-gray-600 hover:bg-gray-50',
              'transition-all duration-200 active:scale-95',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1'
            )}
            aria-label="Bộ lọc tìm kiếm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
              />
            </svg>
          </button>

          {/* Loading Indicator */}
          {(loading || isSubmitting) && (
            <div className="absolute right-20 flex items-center">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
