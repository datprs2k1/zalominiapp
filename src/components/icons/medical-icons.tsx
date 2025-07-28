import { SVGProps } from 'react';

export interface MedicalIconProps extends SVGProps<SVGSVGElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

const sizeMap = {
  xs: 'w-3 h-3', // 12px
  sm: 'w-4 h-4', // 16px
  md: 'w-5 h-5', // 20px
  lg: 'w-6 h-6', // 24px
  xl: 'w-8 h-8', // 32px
  '2xl': 'w-12 h-12', // 48px
};

const MedicalIcon = ({
  size = 'md',
  className = '',
  children,
  ...props
}: MedicalIconProps & { children: React.ReactNode }) => (
  <svg
    className={`${sizeMap[size]} ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {children}
  </svg>
);

// Core Medical Icons
export const StethoscopeIcon = (props: MedicalIconProps) => (
  <MedicalIcon {...props}>
    <path d="M11 2a2 2 0 0 0-2 2v6.5a0.5 0.5 0 0 1-1 0V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v6.5a6.5 6.5 0 0 0 13 0V4a2 2 0 0 0-2-2h-2z" />
    <circle cx="16" cy="18" r="2" />
    <path d="m18 16 2-2" />
  </MedicalIcon>
);

export const HeartIcon = (props: MedicalIconProps) => (
  <MedicalIcon {...props}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
  </MedicalIcon>
);

export const HeartRateIcon = (props: MedicalIconProps) => (
  <MedicalIcon {...props}>
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </MedicalIcon>
);

export const MedicalCrossIcon = (props: MedicalIconProps) => (
  <MedicalIcon {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9 12h6" />
    <path d="M12 9v6" />
  </MedicalIcon>
);

export const PillIcon = (props: MedicalIconProps) => (
  <MedicalIcon {...props}>
    <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
    <path d="m8.5 8.5 7 7" />
  </MedicalIcon>
);

export const SyringeIcon = (props: MedicalIconProps) => (
  <MedicalIcon {...props}>
    <path d="m18 2 4 4" />
    <path d="m17 7 3-3" />
    <path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5" />
    <path d="m9 11 4 4" />
    <path d="m5 19-3 3" />
    <path d="m14 4 6 6" />
  </MedicalIcon>
);

export const ThermometerIcon = (props: MedicalIconProps) => (
  <MedicalIcon {...props}>
    <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
  </MedicalIcon>
);

export const BandageIcon = (props: MedicalIconProps) => (
  <MedicalIcon {...props}>
    <path d="M10 10.01h.01" />
    <path d="M10 14.01h.01" />
    <path d="M14 10.01h.01" />
    <path d="M14 14.01h.01" />
    <path d="M18 6v11.5c0 .28-.22.5-.5.5h-11c-.28 0-.5-.22-.5-.5V6c0-.28.22-.5.5-.5h11c.28 0 .5.22.5.5Z" />
    <path d="M6 6 18 18" />
  </MedicalIcon>
);

export const MicroscopeIcon = (props: MedicalIconProps) => (
  <MedicalIcon {...props}>
    <path d="M6 18h8" />
    <path d="M3 22h18" />
    <path d="M14 22a7 7 0 1 0 0-14h-1" />
    <path d="M9 14h.01" />
    <path d="M4 13a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4Z" />
    <path d="M9 5a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V5Z" />
  </MedicalIcon>
);

export const AmbulanceIcon = (props: MedicalIconProps) => (
  <MedicalIcon {...props}>
    <path d="M10 20h4" />
    <path d="M18 8v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8" />
    <path d="M22 8h-4V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2H2" />
    <circle cx="7" cy="20" r="2" />
    <circle cx="17" cy="20" r="2" />
    <path d="M12 8v4" />
    <path d="M10 10h4" />
  </MedicalIcon>
);

// Department Icons
export const BrainIcon = (props: MedicalIconProps) => (
  <MedicalIcon {...props}>
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
    <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
    <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
    <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
    <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
    <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
    <path d="M6 18a4 4 0 0 1-1.967-.516" />
    <path d="M19.967 17.484A4 4 0 0 1 18 18" />
  </MedicalIcon>
);

export const EyeIcon = (props: MedicalIconProps) => (
  <MedicalIcon {...props}>
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </MedicalIcon>
);

export const ToothIcon = (props: MedicalIconProps) => (
  <MedicalIcon {...props}>
    <path d="M8 2c1.664 0 3 1.336 3 3v1c0 .552.448 1 1 1s1-.448 1-1V5c0-1.664 1.336-3 3-3s3 1.336 3 3v8c0 3.314-2.686 6-6 6-1.657 0-3.157-.672-4.243-1.757C7.672 16.157 7 14.657 7 13V5c0-1.664 1.336-3 3-3Z" />
  </MedicalIcon>
);

export const BoneIcon = (props: MedicalIconProps) => (
  <MedicalIcon {...props}>
    <path d="M17 10c.7-.7 1.69 0 2.5 0a2.5 2.5 0 1 0 0-5 .5.5 0 0 1-.5-.5 2.5 2.5 0 1 0-5 0c0 .81.7 1.8 0 2.5l-7 7c-.7.7-1.69 0-2.5 0a2.5 2.5 0 0 0 0 5c.28 0 .5.22.5.5a2.5 2.5 0 1 0 5 0c0-.81-.7-1.8 0-2.5Z" />
  </MedicalIcon>
);

// Status and Action Icons
export const CalendarIcon = (props: MedicalIconProps) => (
  <MedicalIcon {...props}>
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
  </MedicalIcon>
);

export const ClockIcon = (props: MedicalIconProps) => (
  <MedicalIcon {...props}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </MedicalIcon>
);

export const UserIcon = (props: MedicalIconProps) => (
  <MedicalIcon {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </MedicalIcon>
);

export const PhoneIcon = (props: MedicalIconProps) => (
  <MedicalIcon {...props}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </MedicalIcon>
);

export const SearchIcon = (props: MedicalIconProps) => (
  <MedicalIcon {...props}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </MedicalIcon>
);

export const CheckIcon = (props: MedicalIconProps) => (
  <MedicalIcon {...props}>
    <path d="M20 6 9 17l-5-5" />
  </MedicalIcon>
);

export const XIcon = (props: MedicalIconProps) => (
  <MedicalIcon {...props}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </MedicalIcon>
);

export const AlertTriangleIcon = (props: MedicalIconProps) => (
  <MedicalIcon {...props}>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </MedicalIcon>
);

export const InfoIcon = (props: MedicalIconProps) => (
  <MedicalIcon {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </MedicalIcon>
);

// Additional Professional Healthcare Icons
export const HospitalIcon = (props: MedicalIconProps) => (
  <MedicalIcon {...props}>
    <path d="M12 6v4" />
    <path d="M14 8h-4" />
    <path d="M12 2L3 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7l-9-5Z" />
    <path d="M12 22v-6" />
  </MedicalIcon>
);

export const DoctorIcon = (props: MedicalIconProps) => (
  <MedicalIcon {...props}>
    <circle cx="12" cy="8" r="5" />
    <path d="M20 21a8 8 0 1 0-16 0" />
    <path d="M12 11v2" />
    <path d="M11 13h2" />
  </MedicalIcon>
);

export const NurseIcon = (props: MedicalIconProps) => (
  <MedicalIcon {...props}>
    <circle cx="12" cy="8" r="5" />
    <path d="M20 21a8 8 0 1 0-16 0" />
    <path d="M9 11h6" />
    <path d="M12 8v6" />
  </MedicalIcon>
);

export const MedicalBagIcon = (props: MedicalIconProps) => (
  <MedicalIcon {...props}>
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <rect x="4" y="7" width="16" height="12" rx="2" />
    <path d="M12 11v4" />
    <path d="M10 13h4" />
  </MedicalIcon>
);

export const VitalSignsIcon = (props: MedicalIconProps) => (
  <MedicalIcon {...props}>
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    <circle cx="12" cy="12" r="1" />
  </MedicalIcon>
);

export const PrescriptionIcon = (props: MedicalIconProps) => (
  <MedicalIcon {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M7 7h10" />
    <path d="M7 11h10" />
    <path d="M7 15h6" />
  </MedicalIcon>
);

export const AppointmentIcon = (props: MedicalIconProps) => (
  <MedicalIcon {...props}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <path d="M8 14h.01" />
    <path d="M12 14h.01" />
    <path d="M16 14h.01" />
    <path d="M8 18h.01" />
    <path d="M12 18h.01" />
  </MedicalIcon>
);

export const EmergencyIcon = (props: MedicalIconProps) => (
  <MedicalIcon {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v8" />
    <path d="M8 12h8" />
    <path d="M12 2l2 2-2 2-2-2z" />
  </MedicalIcon>
);

export const LabTestIcon = (props: MedicalIconProps) => (
  <MedicalIcon {...props}>
    <path d="M9 2v6l-3 3.5a1 1 0 0 0 .7 1.7h10.6a1 1 0 0 0 .7-1.7L15 8V2" />
    <path d="M12 16v6" />
    <path d="M13 2h-2" />
  </MedicalIcon>
);

export const RadiologyIcon = (props: MedicalIconProps) => (
  <MedicalIcon {...props}>
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
    <circle cx="12" cy="10" r="3" />
    <path d="M12 7v6" />
    <path d="M9 10h6" />
  </MedicalIcon>
);

export const PharmacyIcon = (props: MedicalIconProps) => (
  <MedicalIcon {...props}>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <path d="M9 9h6v6H9z" />
    <path d="M12 6v12" />
    <path d="M6 12h12" />
  </MedicalIcon>
);

// Export all icons as a collection
export const MedicalIcons = {
  // Core Medical Icons
  Stethoscope: StethoscopeIcon,
  Heart: HeartIcon,
  HeartRate: HeartRateIcon,
  MedicalCross: MedicalCrossIcon,
  Pill: PillIcon,
  Syringe: SyringeIcon,
  Thermometer: ThermometerIcon,
  Bandage: BandageIcon,
  Microscope: MicroscopeIcon,
  Ambulance: AmbulanceIcon,
  Brain: BrainIcon,
  Eye: EyeIcon,
  Tooth: ToothIcon,
  Bone: BoneIcon,

  // Professional Healthcare Icons
  Hospital: HospitalIcon,
  Doctor: DoctorIcon,
  Nurse: NurseIcon,
  MedicalBag: MedicalBagIcon,
  VitalSigns: VitalSignsIcon,
  Prescription: PrescriptionIcon,
  Appointment: AppointmentIcon,
  Emergency: EmergencyIcon,
  LabTest: LabTestIcon,
  Radiology: RadiologyIcon,
  Pharmacy: PharmacyIcon,

  // Utility Icons
  Calendar: CalendarIcon,
  Clock: ClockIcon,
  User: UserIcon,
  Phone: PhoneIcon,
  Search: SearchIcon,
  Check: CheckIcon,
  X: XIcon,
  AlertTriangle: AlertTriangleIcon,
  Info: InfoIcon,
};

export default MedicalIcons;
