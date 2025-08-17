/**
 * Medical Select Component
 * Accessible select dropdown for hospital forms
 */

import React, { useState, useRef, useEffect } from 'react';
import { SelectProps } from './types';
import { cn } from '@/utils/cn';

const Select: React.FC<SelectProps> = ({
  options,
  value,
  placeholder = 'Chọn một tùy chọn',
  onSelect,
  searchable = false,
  label,
  required = false,
  error,
  helperText,
  className,
  testId,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectId = `select-${Math.random().toString(36).substr(2, 9)}`;

  // Filter options based on search term
  const filteredOptions = searchable
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  // Get selected option
  const selectedOption = options.find(option => option.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (isOpen && focusedIndex >= 0) {
          handleSelect(filteredOptions[focusedIndex]);
        } else {
          setIsOpen(!isOpen);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setFocusedIndex(prev => 
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setFocusedIndex(prev => 
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
        }
        break;
    }
  };

  const handleSelect = (option: typeof options[0]) => {
    if (option.disabled) return;
    
    if (onSelect) {
      onSelect(option.value);
    }
    setIsOpen(false);
    setSearchTerm('');
    setFocusedIndex(-1);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen && searchable) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  // Base classes
  const baseClasses = [
    'relative w-full',
  ];

  const triggerClasses = [
    'w-full px-4 py-3 border rounded-medical bg-white',
    'text-medical-body text-left cursor-pointer',
    'focus:outline-none focus:ring-2 focus:ring-offset-0',
    'transition-all duration-200 min-h-[44px]',
    'disabled:bg-neutral-50 disabled:cursor-not-allowed',
    'flex items-center justify-between',
  ];

  const triggerVariantClasses = error
    ? ['border-danger-500 focus:ring-danger-500 focus:border-danger-500']
    : ['border-neutral-300 focus:ring-medical-500 focus:border-medical-500'];

  const dropdownClasses = [
    'absolute z-50 w-full mt-1 bg-white border border-neutral-200',
    'rounded-medical shadow-card-hover max-h-60 overflow-auto',
  ];

  return (
    <div className="form-group-medical">
      {label && (
        <label htmlFor={selectId} className="label-medical">
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}

      <div
        ref={selectRef}
        className={cn(baseClasses, className)}
        {...props}
      >
        {/* Trigger */}
        <div
          id={selectId}
          className={cn(triggerClasses, triggerVariantClasses)}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-invalid={error ? 'true' : 'false'}
          data-testid={testId}
        >
          <span className={cn(
            'flex-1 truncate',
            !selectedOption && 'text-neutral-400'
          )}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          
          <svg
            className={cn(
              'w-5 h-5 text-neutral-400 transition-transform duration-200',
              isOpen && 'transform rotate-180'
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div className={cn(dropdownClasses)}>
            {searchable && (
              <div className="p-2 border-b border-neutral-100">
                <input
                  ref={inputRef}
                  type="text"
                  className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-medical focus:outline-none focus:ring-1 focus:ring-medical-500"
                  placeholder="Tìm kiếm..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setFocusedIndex(-1);
                  }}
                />
              </div>
            )}

            <ul
              ref={listRef}
              role="listbox"
              className="py-1"
            >
              {filteredOptions.length === 0 ? (
                <li className="px-4 py-2 text-sm text-neutral-500">
                  Không tìm thấy kết quả
                </li>
              ) : (
                filteredOptions.map((option, index) => (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={option.value === value}
                    className={cn(
                      'px-4 py-2 text-sm cursor-pointer transition-colors duration-150',
                      'hover:bg-medical-50 focus:bg-medical-50',
                      option.disabled && 'opacity-50 cursor-not-allowed',
                      option.value === value && 'bg-medical-100 text-medical-700 font-medium',
                      index === focusedIndex && 'bg-medical-50'
                    )}
                    onClick={() => handleSelect(option)}
                  >
                    {option.label}
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-danger-600" role="alert">
          {error}
        </p>
      )}

      {helperText && !error && (
        <p className="mt-1 text-sm text-neutral-500">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Select;
