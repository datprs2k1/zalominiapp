import React from 'react';

interface IconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8'
};

// Medical Cross Icon
export function MedicalCrossIcon({ className = '', size = 'md' }: IconProps) {
  return (
    <svg 
      className={`${sizeClasses[size]} ${className}`} 
      fill="currentColor" 
      viewBox="0 0 20 20"
    >
      <path d="M8 2v6H2v4h6v6h4v-6h6V8h-6V2H8z" />
    </svg>
  );
}

// Stethoscope Icon
export function StethoscopeIcon({ className = '', size = 'md' }: IconProps) {
  return (
    <svg 
      className={`${sizeClasses[size]} ${className}`} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" 
      />
    </svg>
  );
}

// Heart Icon
export function HeartIcon({ className = '', size = 'md' }: IconProps) {
  return (
    <svg 
      className={`${sizeClasses[size]} ${className}`} 
      fill="currentColor" 
      viewBox="0 0 20 20"
    >
      <path 
        fillRule="evenodd" 
        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" 
        clipRule="evenodd" 
      />
    </svg>
  );
}

// Medical Certificate Icon
export function CertificateIcon({ className = '', size = 'md' }: IconProps) {
  return (
    <svg 
      className={`${sizeClasses[size]} ${className}`} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" 
      />
    </svg>
  );
}

// Medical Bag Icon
export function MedicalBagIcon({ className = '', size = 'md' }: IconProps) {
  return (
    <svg 
      className={`${sizeClasses[size]} ${className}`} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 1v6m6-6v6" 
      />
    </svg>
  );
}

// Prescription Icon
export function PrescriptionIcon({ className = '', size = 'md' }: IconProps) {
  return (
    <svg 
      className={`${sizeClasses[size]} ${className}`} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
      />
    </svg>
  );
}

// Hospital Icon
export function HospitalIcon({ className = '', size = 'md' }: IconProps) {
  return (
    <svg 
      className={`${sizeClasses[size]} ${className}`} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
      />
    </svg>
  );
}

// Medical Shield Icon (for trust/safety)
export function MedicalShieldIcon({ className = '', size = 'md' }: IconProps) {
  return (
    <svg 
      className={`${sizeClasses[size]} ${className}`} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
      />
    </svg>
  );
}

// Appointment Calendar Icon
export function AppointmentIcon({ className = '', size = 'md' }: IconProps) {
  return (
    <svg 
      className={`${sizeClasses[size]} ${className}`} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
      />
    </svg>
  );
}

// Medical Experience Icon
export function ExperienceIcon({ className = '', size = 'md' }: IconProps) {
  return (
    <svg 
      className={`${sizeClasses[size]} ${className}`} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v10m2 2v-6m0 0V8m0 0h-6m6 0H9" 
      />
    </svg>
  );
}

// Language Icon
export function LanguageIcon({ className = '', size = 'md' }: IconProps) {
  return (
    <svg 
      className={`${sizeClasses[size]} ${className}`} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" 
      />
    </svg>
  );
}

// Medical Fee Icon
export function MedicalFeeIcon({ className = '', size = 'md' }: IconProps) {
  return (
    <svg 
      className={`${sizeClasses[size]} ${className}`} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" 
      />
    </svg>
  );
}

// Online Status Icon
export function OnlineStatusIcon({ className = '', size = 'md' }: IconProps) {
  return (
    <svg 
      className={`${sizeClasses[size]} ${className}`} 
      fill="currentColor" 
      viewBox="0 0 20 20"
    >
      <path 
        fillRule="evenodd" 
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
        clipRule="evenodd" 
      />
    </svg>
  );
}

// Star Rating Icon
export function StarIcon({ className = '', size = 'md' }: IconProps) {
  return (
    <svg 
      className={`${sizeClasses[size]} ${className}`} 
      fill="currentColor" 
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

export default {
  MedicalCrossIcon,
  StethoscopeIcon,
  HeartIcon,
  CertificateIcon,
  MedicalBagIcon,
  PrescriptionIcon,
  HospitalIcon,
  MedicalShieldIcon,
  AppointmentIcon,
  ExperienceIcon,
  LanguageIcon,
  MedicalFeeIcon,
  OnlineStatusIcon,
  StarIcon
};
