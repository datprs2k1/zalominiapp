/**
 * Enhanced Medical Iconography System
 * Comprehensive icon system for premium hospital-grade medical interfaces
 * Includes medical symbols, healthcare services, and accessibility icons
 */

// Core Medical Icons - Essential Healthcare Symbols
export const MEDICAL_ICONS = {
  // Primary Medical Symbols
  core: {
    stethoscope: 'medical-stethoscope',
    heartRate: 'medical-heart-rate',
    medicalCross: 'medical-cross',
    hospital: 'medical-hospital',
    ambulance: 'medical-ambulance',
    prescription: 'medical-prescription',
    syringe: 'medical-syringe',
    pill: 'medical-pill',
    thermometer: 'medical-thermometer',
    bloodPressure: 'medical-blood-pressure',
    xray: 'medical-xray',
    microscope: 'medical-microscope',
    dna: 'medical-dna',
    virus: 'medical-virus',
    bacteria: 'medical-bacteria',
  },

  // Healthcare Professionals
  professionals: {
    doctor: 'professional-doctor',
    nurse: 'professional-nurse',
    surgeon: 'professional-surgeon',
    dentist: 'professional-dentist',
    pharmacist: 'professional-pharmacist',
    therapist: 'professional-therapist',
    radiologist: 'professional-radiologist',
    cardiologist: 'professional-cardiologist',
    neurologist: 'professional-neurologist',
    pediatrician: 'professional-pediatrician',
  },

  // Medical Departments & Specialties
  departments: {
    cardiology: 'dept-cardiology',
    neurology: 'dept-neurology',
    orthopedics: 'dept-orthopedics',
    pediatrics: 'dept-pediatrics',
    oncology: 'dept-oncology',
    dermatology: 'dept-dermatology',
    ophthalmology: 'dept-ophthalmology',
    psychiatry: 'dept-psychiatry',
    radiology: 'dept-radiology',
    surgery: 'dept-surgery',
    emergency: 'dept-emergency',
    icu: 'dept-icu',
    maternity: 'dept-maternity',
    pharmacy: 'dept-pharmacy',
    laboratory: 'dept-laboratory',
  },

  // Healthcare Services
  services: {
    appointment: 'service-appointment',
    consultation: 'service-consultation',
    emergency: 'service-emergency',
    telemedicine: 'service-telemedicine',
    homecare: 'service-homecare',
    vaccination: 'service-vaccination',
    checkup: 'service-checkup',
    surgery: 'service-surgery',
    rehabilitation: 'service-rehabilitation',
    mentalHealth: 'service-mental-health',
    nutrition: 'service-nutrition',
    fitness: 'service-fitness',
  },

  // Medical Equipment & Tools
  equipment: {
    mri: 'equipment-mri',
    ctScan: 'equipment-ct-scan',
    ultrasound: 'equipment-ultrasound',
    ecg: 'equipment-ecg',
    defibrillator: 'equipment-defibrillator',
    ventilator: 'equipment-ventilator',
    wheelchair: 'equipment-wheelchair',
    crutches: 'equipment-crutches',
    hearing_aid: 'equipment-hearing-aid',
    pacemaker: 'equipment-pacemaker',
  },

  // Body Systems & Anatomy
  anatomy: {
    heart: 'anatomy-heart',
    brain: 'anatomy-brain',
    lungs: 'anatomy-lungs',
    liver: 'anatomy-liver',
    kidney: 'anatomy-kidney',
    stomach: 'anatomy-stomach',
    bones: 'anatomy-bones',
    muscles: 'anatomy-muscles',
    eyes: 'anatomy-eyes',
    ears: 'anatomy-ears',
    teeth: 'anatomy-teeth',
    skin: 'anatomy-skin',
  },

  // Medical Status & Indicators
  status: {
    healthy: 'status-healthy',
    critical: 'status-critical',
    stable: 'status-stable',
    improving: 'status-improving',
    monitoring: 'status-monitoring',
    alert: 'status-alert',
    warning: 'status-warning',
    success: 'status-success',
    pending: 'status-pending',
    completed: 'status-completed',
  },

  // Emergency & Urgency
  emergency: {
    ambulance: 'emergency-ambulance',
    siren: 'emergency-siren',
    firstAid: 'emergency-first-aid',
    trauma: 'emergency-trauma',
    code_blue: 'emergency-code-blue',
    code_red: 'emergency-code-red',
    evacuation: 'emergency-evacuation',
    fire: 'emergency-fire',
    hazmat: 'emergency-hazmat',
  },
} as const;

// Icon Sizes - Medical Interface Standards
export const MEDICAL_ICON_SIZES = {
  // Standard sizes
  xs: '12px', // 12px - Micro icons, indicators
  sm: '16px', // 16px - Small icons, inline text
  md: '20px', // 20px - Standard icons, buttons
  lg: '24px', // 24px - Large icons, headers
  xl: '32px', // 32px - Extra large icons, features
  '2xl': '40px', // 40px - Hero icons, main features
  '3xl': '48px', // 48px - Large feature icons
  '4xl': '64px', // 64px - Department icons, major features

  // Medical specific sizes
  vital: '28px', // Vital signs display
  emergency: '36px', // Emergency indicators
  department: '48px', // Department icons
  hero: '64px', // Hero section icons

  // Touch targets (minimum 44px for accessibility)
  touch: '44px', // Touch-friendly icon buttons
  'touch-large': '56px', // Large touch targets
} as const;

// Icon Colors - Medical Context Colors
export const MEDICAL_ICON_COLORS = {
  // Primary medical colors
  primary: '#2563EB', // Medical blue
  secondary: '#10B981', // Healing green
  accent: '#0891B2', // Trust cyan

  // Status colors
  success: '#10B981', // Success green
  warning: '#F59E0B', // Warning amber
  error: '#DC2626', // Error red
  info: '#2563EB', // Info blue

  // Medical context colors
  emergency: '#DC2626', // Emergency red
  critical: '#B91C1C', // Critical dark red
  stable: '#10B981', // Stable green
  monitoring: '#F59E0B', // Monitoring amber

  // Neutral colors
  neutral: '#6B7280', // Neutral gray
  muted: '#9CA3AF', // Muted gray
  disabled: '#D1D5DB', // Disabled gray

  // Department colors
  cardiology: '#EF4444', // Heart red
  neurology: '#8B5CF6', // Brain purple
  orthopedics: '#F97316', // Bone orange
  pediatrics: '#06B6D4', // Child cyan
  oncology: '#EC4899', // Cancer pink
} as const;

// Icon Presets - Ready-to-use icon configurations
export const MEDICAL_ICON_PRESETS = {
  // Emergency icons
  emergency: {
    size: MEDICAL_ICON_SIZES.emergency,
    color: MEDICAL_ICON_COLORS.emergency,
    className: 'medical-icon-emergency animate-pulse',
  },

  // Department icons
  department: {
    size: MEDICAL_ICON_SIZES.department,
    color: MEDICAL_ICON_COLORS.primary,
    className: 'medical-icon-department',
  },

  // Status icons
  status: {
    size: MEDICAL_ICON_SIZES.md,
    color: MEDICAL_ICON_COLORS.neutral,
    className: 'medical-icon-status',
  },

  // Button icons
  button: {
    size: MEDICAL_ICON_SIZES.sm,
    color: 'currentColor',
    className: 'medical-icon-button',
  },

  // Hero icons
  hero: {
    size: MEDICAL_ICON_SIZES.hero,
    color: MEDICAL_ICON_COLORS.primary,
    className: 'medical-icon-hero',
  },

  // Touch icons (for mobile)
  touch: {
    size: MEDICAL_ICON_SIZES.touch,
    color: MEDICAL_ICON_COLORS.primary,
    className: 'medical-icon-touch',
  },
} as const;

// Icon Animation Classes
export const MEDICAL_ICON_ANIMATIONS = {
  // Subtle medical animations
  pulse: 'animate-pulse', // Gentle pulse for status indicators
  bounce: 'animate-bounce', // Bounce for notifications
  spin: 'animate-spin', // Spin for loading states
  ping: 'animate-ping', // Ping for alerts

  // Custom medical animations
  heartbeat: 'medical-heartbeat', // Heartbeat animation
  breathe: 'medical-breathe', // Breathing animation
  blink: 'medical-blink', // Blinking for alerts
  glow: 'medical-glow', // Glow effect for emergency

  // Hover animations
  'hover-scale': 'hover:scale-110 transition-transform duration-200',
  'hover-rotate': 'hover:rotate-12 transition-transform duration-200',
  'hover-bounce': 'hover:animate-bounce',
} as const;

// Accessibility Icon Labels (Vietnamese)
export const MEDICAL_ICON_LABELS = {
  // Core medical
  stethoscope: 'Ống nghe y tế',
  heartRate: 'Nhịp tim',
  medicalCross: 'Dấu thập đỏ y tế',
  hospital: 'Bệnh viện',
  ambulance: 'Xe cứu thương',
  prescription: 'Đơn thuốc',

  // Departments
  cardiology: 'Khoa tim mạch',
  neurology: 'Khoa thần kinh',
  orthopedics: 'Khoa chỉnh hình',
  pediatrics: 'Khoa nhi',
  emergency: 'Khoa cấp cứu',

  // Services
  appointment: 'Đặt lịch khám',
  consultation: 'Tư vấn y tế',
  telemedicine: 'Khám bệnh từ xa',
  vaccination: 'Tiêm chủng',

  // Status
  healthy: 'Khỏe mạnh',
  critical: 'Nguy kịch',
  stable: 'Ổn định',
  monitoring: 'Theo dõi',
} as const;

// Utility Functions
export function getMedicalIcon(category: keyof typeof MEDICAL_ICONS, icon: string): string {
  const categoryIcons = MEDICAL_ICONS[category] as Record<string, string>;
  return categoryIcons[icon] || '';
}

export function getMedicalIconPreset(preset: keyof typeof MEDICAL_ICON_PRESETS) {
  return MEDICAL_ICON_PRESETS[preset];
}

export function getMedicalIconLabel(icon: keyof typeof MEDICAL_ICON_LABELS): string {
  return MEDICAL_ICON_LABELS[icon] || '';
}

// CSS Custom Properties for Icons
export function generateIconVariables(): Record<string, string> {
  const variables: Record<string, string> = {};

  // Icon sizes
  Object.entries(MEDICAL_ICON_SIZES).forEach(([key, value]) => {
    variables[`--icon-size-${key}`] = value;
  });

  // Icon colors
  Object.entries(MEDICAL_ICON_COLORS).forEach(([key, value]) => {
    variables[`--icon-color-${key}`] = value;
  });

  return variables;
}

// Type definitions
export type MedicalIconCategory = keyof typeof MEDICAL_ICONS;
export type MedicalIconSize = keyof typeof MEDICAL_ICON_SIZES;
export type MedicalIconColor = keyof typeof MEDICAL_ICON_COLORS;
export type MedicalIconPreset = keyof typeof MEDICAL_ICON_PRESETS;
export type MedicalIconAnimation = keyof typeof MEDICAL_ICON_ANIMATIONS;
