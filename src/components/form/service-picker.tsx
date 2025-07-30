import { servicesState } from '@/state';
import { Service } from '@/types';
import { useAtomValue } from 'jotai';
import EnhancedSelect, { SelectOption } from './enhanced-select';
import React from 'react';

interface ServicePickerProps {
  value?: Service;
  onChange?: (value: Service) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

function ServicePicker({
  value,
  onChange,
  label,
  placeholder = 'Chọn dịch vụ khám',
  error,
  disabled = false,
  className,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
}: ServicePickerProps) {
  const services = useAtomValue(servicesState);

  // Convert services to select options
  const options: SelectOption[] = services.map((service: Service) => ({
    id: service.id,
    label: service.name,
    description: `Dịch vụ ${service.name}`,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  }));

  // Find current selected option
  const selectedOption = value ? options.find((opt) => opt.id === value.id) : undefined;

  const handleChange = (option: SelectOption) => {
    const service = services.find((service: Service) => service.id === option.id);
    if (service && onChange) {
      onChange(service);
    }
  };

  return (
    <EnhancedSelect
      options={options}
      value={selectedOption}
      onChange={handleChange}
      label={label}
      placeholder={placeholder}
      error={error}
      disabled={disabled}
      searchable={true}
      clearable={true}
      className={className}
      aria-label={ariaLabel || 'Chọn dịch vụ khám'}
      aria-describedby={ariaDescribedBy}
    />
  );
}

export default ServicePicker;
