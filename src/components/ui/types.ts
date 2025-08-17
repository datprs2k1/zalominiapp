/**
 * Medical UI Component Types and Interfaces
 * Comprehensive type definitions for the hospital mobile application
 */

import { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes } from 'react';

// Base component props
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
  testId?: string;
}

// Color variants for medical context
export type MedicalColorVariant = 'medical' | 'wellness' | 'accent' | 'success' | 'warning' | 'danger' | 'neutral';

// Size variants
export type SizeVariant = 'sm' | 'md' | 'lg' | 'xl';

// Button component types
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
  size?: SizeVariant;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

// Input component types
export interface InputProps extends InputHTMLAttributes<HTMLInputElement>, BaseComponentProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  variant?: 'default' | 'error';
}

// Card component types
export interface CardProps extends BaseComponentProps {
  variant?: 'default' | 'hover' | 'doctor' | 'appointment' | 'emergency';
  padding?: SizeVariant;
  shadow?: boolean;
}

// Doctor-specific types
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  avatar?: string;
  rating?: number;
  experience?: number;
  availability?: 'available' | 'busy' | 'unavailable';
  bio?: string;
  qualifications?: string[];
}

export interface DoctorCardProps extends BaseComponentProps {
  doctor: Doctor;
  onSelect?: (doctor: Doctor) => void;
  showAvailability?: boolean;
  compact?: boolean;
}

// Appointment types
export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  type: 'consultation' | 'follow-up' | 'emergency';
  notes?: string;
}

export interface AppointmentCardProps extends BaseComponentProps {
  appointment: Appointment;
  onReschedule?: (appointment: Appointment) => void;
  onCancel?: (appointment: Appointment) => void;
  onViewDetails?: (appointment: Appointment) => void;
}

// Service types
export interface MedicalService {
  id: string;
  name: string;
  description: string;
  icon?: string;
  price?: number;
  duration?: number;
  category: string;
  available: boolean;
}

export interface ServiceCardProps extends BaseComponentProps {
  service: MedicalService;
  onSelect?: (service: MedicalService) => void;
  showPrice?: boolean;
}

// Department types
export interface Department {
  id: string;
  name: string;
  description: string;
  icon?: string;
  doctorCount?: number;
  services?: MedicalService[];
}

export interface DepartmentCardProps extends BaseComponentProps {
  department: Department;
  onSelect?: (department: Department) => void;
  showDoctorCount?: boolean;
}

// Navigation types
export interface NavigationItem {
  id: string;
  label: string;
  icon: ReactNode;
  path: string;
  badge?: number;
  active?: boolean;
}

export interface BottomNavigationProps extends BaseComponentProps {
  items: NavigationItem[];
  activeItem?: string;
  onItemSelect?: (item: NavigationItem) => void;
}

// Status types
export type StatusVariant = 'available' | 'busy' | 'unavailable';

export interface StatusBadgeProps extends BaseComponentProps {
  status: StatusVariant;
  text?: string;
  size?: SizeVariant;
}

// Loading states
export interface LoadingProps extends BaseComponentProps {
  variant?: 'spinner' | 'dots' | 'skeleton';
  size?: SizeVariant;
  text?: string;
}

export interface SkeletonProps extends BaseComponentProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'rectangular' | 'circular';
  animation?: boolean;
}

// Form types
export interface FormFieldProps extends BaseComponentProps {
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends FormFieldProps {
  options: SelectOption[];
  value?: string;
  placeholder?: string;
  onSelect?: (value: string) => void;
  searchable?: boolean;
}

// Modal and overlay types
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: SizeVariant;
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
}

export interface BottomSheetProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  height?: string;
  snapPoints?: string[];
}

// Search types
export interface SearchProps extends BaseComponentProps {
  placeholder?: string;
  value?: string;
  onSearch?: (query: string) => void;
  onClear?: () => void;
  loading?: boolean;
  suggestions?: string[];
}

// Notification types
export interface NotificationProps extends BaseComponentProps {
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose?: () => void;
  actions?: Array<{
    label: string;
    action: () => void;
    variant?: 'primary' | 'secondary';
  }>;
}

// Layout types
export interface ContainerProps extends BaseComponentProps {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: SizeVariant;
  center?: boolean;
}

export interface GridProps extends BaseComponentProps {
  columns?: number | { sm?: number; md?: number; lg?: number };
  gap?: SizeVariant;
  responsive?: boolean;
}

// Animation types
export interface AnimationProps {
  duration?: number;
  delay?: number;
  easing?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export interface TransitionProps extends BaseComponentProps {
  show: boolean;
  animation?: AnimationProps;
  unmountOnExit?: boolean;
}
