import { departmentsAtom, getDepartments, getPosts, postsAtomFamily } from '@/services/post';
import { Department } from '@/types';
import { decodeHTML } from '@/utils/decodeHTML';
import { useAtomValue } from 'jotai';
import EnhancedSelect, { SelectOption } from './enhanced-select';
import React from 'react';

interface DepartmentPickerProps {
  value?: Department;
  onChange?: (value: Department) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

const POST_ATOM_PARAMS = { per_page: 100 };

function DepartmentPicker({
  value,
  onChange,
  label,
  placeholder = 'Chọn khoa khám',
  error,
  disabled = false,
  className,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
}: DepartmentPickerProps) {
  const departmentsData: any = useAtomValue(departmentsAtom(POST_ATOM_PARAMS));
  const departments = departmentsData || [];

  // Convert departments to select options
  const options: SelectOption[] = departments.map((dep: Department) => ({
    id: dep.id,
    label: decodeHTML(dep.title.rendered),
    description: `Khoa ${decodeHTML(dep.title.rendered)}`,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),
  }));

  // Find current selected option
  const selectedOption = value ? options.find((opt) => opt.id === value.id) : undefined;

  const handleChange = (option: SelectOption) => {
    const department = departments.find((dep: Department) => dep.id === option.id);
    if (department && onChange) {
      onChange(department);
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
      aria-label={ariaLabel || 'Chọn khoa khám'}
      aria-describedby={ariaDescribedBy}
    />
  );
}

export default DepartmentPicker;
