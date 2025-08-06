import React from 'react';
import { NavigationItem } from './types';
import { MedicalIcons } from '../icons/medical-icons';

// iOS-style medical icons - Clean and simple design
export const HomeIcon = React.memo(() => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    {/* iOS-style house icon with medical cross */}
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    {/* Simple medical cross overlay */}
    <circle cx="12" cy="10" r="3" fill="white" />
    <rect x="11.2" y="8.5" width="1.6" height="3" fill="currentColor" />
    <rect x="10.5" y="9.2" width="3" height="1.6" fill="currentColor" />
  </svg>
));

export const ServicesIcon = React.memo(() => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    {/* iOS-style heart with pulse icon for health services */}
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    {/* Pulse line overlay */}
    <path
      d="M6 12h2l1-3 2 6 2-3 1 1h2"
      stroke="white"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
));

export const BookingIcon = React.memo(() => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    {/* iOS-style calendar with medical appointment */}
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
    <path d="M19 7H5v12h14V7z" fill="white" opacity="0.9" />
    {/* Clean appointment indicator */}
    <circle cx="12" cy="13" r="3" fill="currentColor" />
    <rect x="11.2" y="11.5" width="1.6" height="3" fill="white" />
    <rect x="10.5" y="12.2" width="3" height="1.6" fill="white" />
    {/* Date indicators */}
    <circle cx="8" cy="10" r="1" fill="currentColor" opacity="0.3" />
    <circle cx="16" cy="10" r="1" fill="currentColor" opacity="0.3" />
  </svg>
));

export const DoctorIcon = React.memo(() => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    {/* iOS-style person with medical badge */}
    <circle cx="12" cy="6" r="3" fill="currentColor" />
    <path d="M12 10c-4 0-7 2-7 5v7h14v-7c0-3-3-5-7-5z" />
    {/* Clean medical badge */}
    <circle cx="12" cy="16" r="2.5" fill="white" />
    <rect x="11.3" y="14.8" width="1.4" height="2.4" fill="currentColor" />
    <rect x="10.8" y="15.3" width="2.4" height="1.4" fill="currentColor" />
    {/* Professional indicator */}
    <circle cx="15" cy="12" r="1" fill="white" opacity="0.8" />
  </svg>
));

export const InfoIcon = React.memo(() => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    {/* iOS-style info circle with medical support */}
    <circle cx="12" cy="12" r="10" fill="currentColor" />
    <circle cx="12" cy="12" r="8" fill="white" opacity="0.95" />
    {/* Clean info symbol */}
    <circle cx="12" cy="8" r="1.5" fill="currentColor" />
    <rect x="11" y="11" width="2" height="6" rx="1" fill="currentColor" />
    {/* Medical support indicator */}
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.2" />
  </svg>
));

// Set display names for debugging - iOS-style medical icons
HomeIcon.displayName = 'iOSMedicalHomeIcon';
ServicesIcon.displayName = 'iOSHealthServicesIcon';
BookingIcon.displayName = 'iOSAppointmentIcon';
DoctorIcon.displayName = 'iOSMedicalProfessionalIcon';
InfoIcon.displayName = 'iOSMedicalInfoIcon';

// Hospital-themed navigation items - Medical-focused design
export const DEFAULT_NAV_ITEMS: NavigationItem[] = [
  {
    id: 'home',
    label: 'Bệnh viện', // Hospital-themed label
    path: '/',
    ariaLabel: 'Trang chủ bệnh viện - Trung tâm y tế và dịch vụ chăm sóc sức khỏe',
    icon: <HomeIcon />,
  },
  {
    id: 'services',
    label: 'Khám bệnh', // Medical examination services
    path: '/service-prices',
    ariaLabel: 'Dịch vụ khám bệnh và điều trị - Xem các chuyên khoa và bảng giá',
    icon: <ServicesIcon />,
  },
  {
    id: 'booking',
    label: 'Đặt khám', // Medical appointment booking
    path: '/booking',
    ariaLabel: 'Đặt lịch khám bệnh - Đặt hẹn với bác sĩ chuyên khoa',
    icon: <BookingIcon />,
  },
  {
    id: 'doctor',
    label: 'Bác sĩ', // Medical doctors
    path: '/doctor',
    ariaLabel: 'Đội ngũ bác sĩ - Thông tin các bác sĩ chuyên khoa',
    icon: <DoctorIcon />,
  },
  {
    id: 'about',
    label: 'Hỗ trợ', // Medical support/help
    path: '/about',
    ariaLabel: 'Hỗ trợ y tế - Thông tin liên hệ và hướng dẫn sử dụng',
    icon: <InfoIcon />,
  },
];

// Navigation item factory for different platforms
export const createNavigationItems = (platform: 'ios' | 'android' | 'web'): NavigationItem[] => {
  // Platform-specific customizations can be added here
  switch (platform) {
    case 'ios':
      return DEFAULT_NAV_ITEMS.map((item) => ({
        ...item,
        // iOS-specific modifications if needed
      }));

    case 'android':
      return DEFAULT_NAV_ITEMS.map((item) => ({
        ...item,
        // Android-specific modifications if needed
      }));

    default:
      return DEFAULT_NAV_ITEMS;
  }
};
