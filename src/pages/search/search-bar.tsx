import { useEffect, useRef, useState, RefObject } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchIcon } from '@/components/icons/medical-icons';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
  autoFocus?: boolean;
  formRef?: RefObject<HTMLFormElement>;
  defaultValue?: string;
  loading?: boolean;
  onChange?: () => void;
  variant?: string;
}

export default function SearchBar({
  placeholder = 'Tìm kiếm...',
  className = '',
  onSearch,
  autoFocus = false,
  formRef,
  defaultValue = '',
  loading = false,
  onChange,
  variant = 'default',
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const defaultFormRef = useRef<HTMLFormElement>(null);

  // Initialize with defaultValue
  useEffect(() => {
    setQuery(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
      setIsFocused(true);
    }
  }, [autoFocus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query);
      } else {
        navigate(`/search?keyword=${encodeURIComponent(query)}`);
      }
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onChange && onChange();
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <form
      ref={formRef || defaultFormRef}
      onSubmit={handleSubmit}
      className={`relative w-full ${className} ${isFocused ? 'z-10' : ''}`}
    >
      <div
        className={`relative flex items-center transition-all duration-300 
                      ${isFocused ? 'scale-102' : 'scale-100'}`}
      >
        <div
          className={`absolute left-4 flex items-center justify-center pointer-events-none 
                     transition-colors duration-300
                     ${loading ? 'text-blue-500 animate-pulse' : isFocused ? 'text-blue-500' : 'text-gray-400'}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`w-5 h-5 transition-transform duration-300 ${isFocused ? 'scale-110' : 'scale-100'}`}
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`w-full py-3.5 pl-12 pr-10 rounded-xl border outline-none 
                     transition-all duration-300 text-gray-800
                     ${
                       isFocused
                         ? 'border-blue-400 shadow-lg shadow-blue-100/50 bg-white'
                         : 'border-gray-200 shadow-sm bg-gray-50/50'
                     } 
                     placeholder-gray-400 text-base`}
          aria-label={placeholder}
          disabled={loading}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              onChange && onChange();
              onSearch && onSearch('');
              inputRef.current?.focus();
            }}
            className="absolute right-3 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 
                      active:bg-gray-300 transition-colors duration-150 transform hover:scale-105"
            aria-label="Clear search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-500"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}

        {loading && (
          <div className="absolute right-4 flex items-center justify-center pointer-events-none">
            <div className="w-5 h-5 border-2 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </form>
  );
}
