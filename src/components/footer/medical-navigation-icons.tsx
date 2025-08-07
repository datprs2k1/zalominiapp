/**
 * Enhanced Medical Navigation Icons
 * iOS Hospital App-inspired iconography with medical context and status overlays
 *
 * @version 1.0.0
 * @author Medical Development Team
 * @since 2024-08-06
 *
 * @features
 * - Hospital-themed medical icons with iOS design patterns
 * - Medical status overlays (emergency, urgent, routine, consultation)
 * - Trust certification indicators and security badges
 * - Emergency access styling with haptic feedback
 * - Enhanced accessibility with medical context
 */

import React, { memo } from 'react';
import { NavigationItem } from './types';
import { MEDICAL_FOOTER_THEME } from './medical-theme';

// Medical Status Overlay Component
interface MedicalStatusOverlayProps {
  status: 'emergency' | 'urgent' | 'routine' | 'consultation';
  count?: number;
  size?: 'sm' | 'md' | 'lg';
}

const MedicalStatusOverlay: React.FC<MedicalStatusOverlayProps> = memo(({ status, count, size = 'md' }) => {
  const statusColors = MEDICAL_FOOTER_THEME.colors.status;
  const badgeColors = MEDICAL_FOOTER_THEME.colors.badges;

  const sizeMap = {
    sm: { width: 12, height: 12, fontSize: '8px' },
    md: { width: 16, height: 16, fontSize: '10px' },
    lg: { width: 20, height: 20, fontSize: '12px' },
  };

  const overlaySize = sizeMap[size];

  return (
    <div
      className="absolute -top-1 -right-1 rounded-full flex items-center justify-center text-white font-semibold"
      style={{
        width: overlaySize.width,
        height: overlaySize.height,
        fontSize: overlaySize.fontSize,
        backgroundColor:
          status === 'emergency'
            ? statusColors.emergency
            : status === 'urgent'
              ? statusColors.urgent
              : status === 'consultation'
                ? statusColors.consultation
                : statusColors.routine,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
        zIndex: 10,
      }}
    >
      {count && count > 0 ? (count > 99 ? '99+' : count) : ''}
    </div>
  );
});

MedicalStatusOverlay.displayName = 'MedicalStatusOverlay';

// Trust Certification Indicator
interface TrustIndicatorProps {
  type: 'verified' | 'secure' | 'certified';
  size?: 'sm' | 'md';
}

const TrustIndicator: React.FC<TrustIndicatorProps> = memo(({ type, size = 'sm' }) => {
  const trustColors = MEDICAL_FOOTER_THEME.colors.trust;
  const iconSize = size === 'sm' ? 8 : 12;

  return (
    <div
      className="absolute -bottom-1 -right-1 rounded-full flex items-center justify-center"
      style={{
        width: iconSize + 4,
        height: iconSize + 4,
        backgroundColor:
          type === 'verified' ? trustColors.verified : type === 'secure' ? trustColors.secure : trustColors.certified,
        zIndex: 5,
      }}
    >
      <svg width={iconSize} height={iconSize} viewBox="0 0 12 12" fill="white">
        {type === 'verified' && (
          <path
            d="M10 3L4.5 8.5L2 6"
            stroke="white"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        {type === 'secure' && (
          <path
            d="M3 5V4a3 3 0 0 1 6 0v1m-5 0h4a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"
            stroke="white"
            strokeWidth="1"
            fill="none"
          />
        )}
        {type === 'certified' && <path d="M6 1l1.5 3h3l-2.5 2 1 3L6 7.5 3 9l1-3L1.5 4h3L6 1z" fill="white" />}
      </svg>
    </div>
  );
});

TrustIndicator.displayName = 'TrustIndicator';

// Enhanced Medical Home Icon
export const EnhancedHomeIcon = memo<{
  status?: 'emergency' | 'urgent' | 'routine' | 'consultation';
  count?: number;
  trusted?: boolean;
}>(({ status, count, trusted = true }) => (
  <div className="relative">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
    >
      {/* Hospital building with medical cross */}
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      {/* Enhanced medical cross overlay */}
      <circle cx="12" cy="10" r="4" fill="white" stroke="currentColor" strokeWidth="0.5" />
      <rect x="11" y="8" width="2" height="4" fill="currentColor" />
      <rect x="10" y="9" width="4" height="2" fill="currentColor" />
      {/* Trust indicator dot */}
      {trusted && <circle cx="18" cy="6" r="2" fill="#34C759" />}
    </svg>
    {status && <MedicalStatusOverlay status={status} count={count} />}
    {trusted && <TrustIndicator type="verified" />}
  </div>
));

// Enhanced Medical Services Icon
export const EnhancedServicesIcon = memo<{
  status?: 'emergency' | 'urgent' | 'routine' | 'consultation';
  count?: number;
  certified?: boolean;
}>(({ status, count, certified = true }) => (
  <div className="relative">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      {/* Stethoscope with enhanced medical styling */}
      <path d="M11 2a2 2 0 0 1 2 0" />
      <path d="M11 2v8.5a1 1 0 0 0 1 1v0a1 1 0 0 0 1-1V2" />
      <circle cx="12" cy="13" r="2" />
      <path d="M12 15v3a3 3 0 0 1-3 3h-1" />
      <path d="M9 21a3 3 0 0 1-3-3v-1" />
      <circle cx="5" cy="17" r="2" />
      {/* Medical certification mark */}
      {certified && <circle cx="19" cy="5" r="3" fill="#007AFF" />}
      {certified && <path d="M17.5 5L18.5 6L20.5 4" stroke="white" strokeWidth="1" fill="none" />}
    </svg>
    {status && <MedicalStatusOverlay status={status} count={count} />}
    {certified && <TrustIndicator type="certified" />}
  </div>
));

// Enhanced Medical Booking Icon
export const EnhancedBookingIcon = memo<{
  status?: 'emergency' | 'urgent' | 'routine' | 'consultation';
  count?: number;
  urgent?: boolean;
}>(({ status, count, urgent = false }) => (
  <div className="relative">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      {/* Calendar with medical appointment styling */}
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      {/* Medical cross in calendar */}
      <rect x="11" y="13" width="2" height="6" fill="currentColor" />
      <rect x="9" y="15" width="6" height="2" fill="currentColor" />
      {/* Urgent indicator */}
      {urgent && <circle cx="19" cy="5" r="2" fill="#FF3B30" />}
      {urgent && (
        <text x="19" y="7" textAnchor="middle" fontSize="8" fill="white">
          !
        </text>
      )}
    </svg>
    {status && <MedicalStatusOverlay status={status} count={count} />}
    {urgent && <TrustIndicator type="verified" />}
  </div>
));

// Enhanced Medical Doctor Icon
export const EnhancedDoctorIcon = memo<{
  status?: 'emergency' | 'urgent' | 'routine' | 'consultation';
  count?: number;
  available?: boolean;
}>(({ status, count, available = true }) => (
  <div className="relative">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      {/* Doctor figure with medical styling */}
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
      {/* Medical badge/ID */}
      <rect x="9" y="12" width="6" height="3" rx="1" fill="currentColor" opacity="0.3" />
      <line x1="10" y1="13.5" x2="14" y2="13.5" stroke="white" strokeWidth="1" />
      {/* Availability indicator */}
      {available && <circle cx="18" cy="6" r="2" fill="#34C759" />}
      {!available && <circle cx="18" cy="6" r="2" fill="#8E8E93" />}
    </svg>
    {status && <MedicalStatusOverlay status={status} count={count} />}
    <TrustIndicator type="verified" />
  </div>
));

// Enhanced Medical Support Icon
export const EnhancedSupportIcon = memo<{
  status?: 'emergency' | 'urgent' | 'routine' | 'consultation';
  count?: number;
  emergency?: boolean;
}>(({ status, count, emergency = false }) => (
  <div className="relative">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      {/* Support/Help with medical context */}
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
      {/* Emergency access indicator */}
      {emergency && (
        <>
          <circle cx="18" cy="6" r="3" fill="#FF3B30" />
          <text x="18" y="8" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">
            SOS
          </text>
        </>
      )}
    </svg>
    {status && <MedicalStatusOverlay status={status} count={count} />}
    {emergency && <TrustIndicator type="secure" />}
  </div>
));

// Set display names for debugging
EnhancedHomeIcon.displayName = 'EnhancedMedicalHomeIcon';
EnhancedServicesIcon.displayName = 'EnhancedMedicalServicesIcon';
EnhancedBookingIcon.displayName = 'EnhancedMedicalBookingIcon';
EnhancedDoctorIcon.displayName = 'EnhancedMedicalDoctorIcon';
EnhancedSupportIcon.displayName = 'EnhancedMedicalSupportIcon';

// Enhanced Medical Navigation Items with Hospital Context
export const ENHANCED_MEDICAL_NAV_ITEMS: NavigationItem[] = [
  {
    id: 'home',
    label: 'Bệnh viện',
    path: '/',
    ariaLabel: 'Trang chủ bệnh viện - Trung tâm y tế và dịch vụ chăm sóc sức khỏe với chứng nhận y tế',
    icon: <EnhancedHomeIcon trusted={true} />,
  },
  {
    id: 'services',
    label: 'Khám bệnh',
    path: '/service-prices',
    ariaLabel: 'Dịch vụ khám bệnh và điều trị - Xem các chuyên khoa và bảng giá với chứng nhận y tế',
    icon: <EnhancedServicesIcon certified={true} />,
  },
  {
    id: 'booking',
    label: 'Đặt khám',
    path: '/booking',
    ariaLabel: 'Đặt lịch khám bệnh - Đặt hẹn với bác sĩ chuyên khoa, có thông báo khẩn cấp',
    icon: <EnhancedBookingIcon urgent={false} />,
  },
  {
    id: 'doctor',
    label: 'Bác sĩ',
    path: '/doctor',
    ariaLabel: 'Đội ngũ bác sĩ - Thông tin các bác sĩ chuyên khoa đã được xác minh',
    icon: <EnhancedDoctorIcon available={true} />,
  },
  {
    id: 'support',
    label: 'Hỗ trợ',
    path: '/about',
    ariaLabel: 'Hỗ trợ y tế - Thông tin liên hệ, hướng dẫn sử dụng và truy cập khẩn cấp',
    icon: <EnhancedSupportIcon emergency={true} />,
  },
];

// Enhanced Navigation Item Factory with Medical Context
export const createEnhancedMedicalNavigationItems = (
  platform: 'ios' | 'android' | 'web',
  medicalContext?: {
    emergencyMode?: boolean;
    appointmentCount?: number;
    urgentNotifications?: number;
    trustLevel?: 'verified' | 'certified' | 'secure';
  }
): NavigationItem[] => {
  const context = medicalContext || {};

  return ENHANCED_MEDICAL_NAV_ITEMS.map((item) => {
    // Add medical context to icons
    let enhancedIcon = item.icon;

    if (item.id === 'home') {
      enhancedIcon = (
        <EnhancedHomeIcon
          trusted={context.trustLevel === 'verified'}
          status={context.emergencyMode ? 'emergency' : 'routine'}
        />
      );
    } else if (item.id === 'services') {
      enhancedIcon = (
        <EnhancedServicesIcon
          certified={context.trustLevel === 'certified'}
          status={context.emergencyMode ? 'emergency' : 'routine'}
        />
      );
    } else if (item.id === 'booking') {
      enhancedIcon = (
        <EnhancedBookingIcon
          urgent={context.urgentNotifications ? context.urgentNotifications > 0 : false}
          count={context.appointmentCount}
          status={context.emergencyMode ? 'emergency' : 'routine'}
        />
      );
    } else if (item.id === 'doctor') {
      enhancedIcon = (
        <EnhancedDoctorIcon available={true} status={context.emergencyMode ? 'emergency' : 'consultation'} />
      );
    } else if (item.id === 'support') {
      enhancedIcon = (
        <EnhancedSupportIcon
          emergency={context.emergencyMode || false}
          count={context.urgentNotifications}
          status={context.emergencyMode ? 'emergency' : 'routine'}
        />
      );
    }

    return {
      ...item,
      icon: enhancedIcon,
      // Enhanced ARIA labels with medical context
      ariaLabel: context.emergencyMode ? `${item.ariaLabel} - Chế độ khẩn cấp đang hoạt động` : item.ariaLabel,
    };
  });
};

export default {
  EnhancedHomeIcon,
  EnhancedServicesIcon,
  EnhancedBookingIcon,
  EnhancedDoctorIcon,
  EnhancedSupportIcon,
  ENHANCED_MEDICAL_NAV_ITEMS,
  createEnhancedMedicalNavigationItems,
};
