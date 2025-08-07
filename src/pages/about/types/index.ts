// Type definitions for About page components and content

export type MedicalIconType = 'cross' | 'stethoscope' | 'heartbeat' | 'pill';
export type ColorVariant = 'primary' | 'secondary' | 'success' | 'warning';
export type ButtonVariant = 'primary' | 'secondary';
export type AnimationType = 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'fadeScale' | 'fadeSlide';

// Feature interface for medical services
export interface MedicalFeature {
  icon: MedicalIconType;
  title: string;
  description: string;
}

// Statistics item interface
export interface StatItem {
  value: string;
  label: string;
  icon: MedicalIconType;
  color: ColorVariant;
}

// About section content interface
export interface AboutContent {
  banner: string;
  title: string;
  brandName: string;
  slogan: string;
  subtitle: string;
  paragraphs: string[];
  buttonText: string;
  buttonLink: string;
  imageSrc: string;
  imageAlt: string;
  phoneNumber: string;
  emergencyNumber: string;
  features: MedicalFeature[];
}

// CTA section content interface
export interface CTAContent {
  title: string;
  description: string;
  phoneNumber: string;
  phoneText: string;
  contactText: string;
  contactLink: string;
  emergencyText: string;
  features: string[];
}

// Sections content interface
export interface SectionsContent {
  general: string;
  subtitle: string;
}

// Main content interface
export interface PageContent {
  about: AboutContent;
  stats: StatItem[];
  cta: CTAContent;
  sections: SectionsContent;
}

// Component props interfaces
export interface AnimatedElementProps {
  children: React.ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  className?: string;
}

export interface FloatingElementProps {
  className?: string;
  duration?: number;
  delay?: number;
}

export interface ProfessionalButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: ButtonVariant;
  className?: string;
  ariaLabel?: string;
  onClick?: () => void;
}

export interface StatItemProps {
  value: string;
  label: string;
  icon: MedicalIconType;
  color: ColorVariant;
  index: number;
}

export interface ClinicsSectionProps {
  clinics: Array<{
    id: string;
    name: string;
    description: string;
    icon?: string;
    [key: string]: any;
  }>;
}

// Animation configuration interfaces
export interface AnimationConfig {
  duration: number;
  delay?: number;
  ease?: string | number[];
  type?: 'spring' | 'tween';
  stiffness?: number;
  damping?: number;
}

export interface AccessibleAnimationHook {
  shouldReduceMotion: boolean;
  getAnimationProps: (
    normalProps: Record<string, any>,
    reducedProps: Record<string, any>
  ) => Record<string, any>;
}
