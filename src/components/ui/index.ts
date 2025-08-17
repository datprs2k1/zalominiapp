/**
 * Medical UI Component Library
 * Centralized exports for all UI components
 */

// Core components
export { default as Button } from './Button';
export { default as Card } from './Card';
export { default as Input } from './Input';

// Form components
export { default as Select } from './Select';
export { default as Textarea } from './Textarea';
export { default as Checkbox } from './Checkbox';
export { default as RadioGroup } from './RadioGroup';

// Specialized components
export { default as DoctorCard } from './DoctorCard';
export { default as AppointmentCard } from './AppointmentCard';
export { default as ServiceCard } from './ServiceCard';
export { default as StatusBadge } from './StatusBadge';

// Loading components
export { default as Loading } from './Loading';
export {
  default as Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonCard,
  SkeletonDoctorCard,
  SkeletonAppointmentCard,
  SkeletonServiceCard,
  SkeletonList,
} from './Skeleton';
export { default as LoadingOverlay } from './LoadingOverlay';

// Layout components
export { default as Container } from './Container';
export { default as Grid } from './Grid';
export { default as Section } from './Section';

// Navigation components
export { default as BottomNavigation } from './BottomNavigation';
export { default as Breadcrumbs } from './Breadcrumbs';
export { default as TabNavigation, TabPanel } from './TabNavigation';

// Types
export * from './types';

// Re-export commonly used types
export type {
  ButtonProps,
  CardProps,
  InputProps,
  DoctorCardProps,
  AppointmentCardProps,
  ServiceCardProps,
  StatusBadgeProps,
  Doctor,
  Appointment,
  MedicalService,
  Department,
} from './types';
