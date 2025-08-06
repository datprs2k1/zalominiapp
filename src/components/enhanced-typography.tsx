/**
 * Enhanced Typography Component
 * Provides accessible, responsive typography for medical content
 */

import React, { forwardRef } from 'react';
import { useAdvancedTypography, MEDICAL_TYPOGRAPHY } from '@/utils/advanced-typography';
import { useEnhancedMobile } from '@/hooks/use-enhanced-mobile';

// Types
interface TypographyProps {
  children: React.ReactNode;
  variant?: 'caption' | 'body' | 'subtitle' | 'title' | 'headline' | 'display';
  weight?: 'light' | 'regular' | 'medium' | 'semibold' | 'bold';
  lineHeight?: 'tight' | 'normal' | 'relaxed';
  letterSpacing?: 'tight' | 'normal' | 'wide';
  medical?: 'dosage' | 'warning' | 'emergency' | 'instruction' | 'result';
  color?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
  responsive?: boolean;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  'aria-label'?: string;
  'aria-describedby'?: string;
  role?: string;
}

// Enhanced Typography Component
export const EnhancedTypography = forwardRef<HTMLElement, TypographyProps>(
  (
    {
      children,
      variant = 'body',
      weight = 'regular',
      lineHeight = 'normal',
      letterSpacing = 'normal',
      medical,
      color,
      align = 'left',
      responsive = false,
      className = '',
      as = 'p',
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      role,
      ...props
    },
    ref
  ) => {
    const { getElementStyles, getPreferences, checkContrastRatio } = useAdvancedTypography();
    const { deviceInfo, platformStyles, getPlatformClasses } = useEnhancedMobile();

    // Get typography styles
    const typographyStyles = getElementStyles(variant, {
      weight,
      lineHeight,
      letterSpacing,
      medical,
    });

    // Get responsive font size if needed
    const getResponsiveFontSize = () => {
      if (!responsive) return typographyStyles.fontSize;
      
      const { screenSize } = deviceInfo;
      const baseSizeNum = parseFloat(typographyStyles.fontSize);
      const unit = typographyStyles.fontSize.replace(baseSizeNum.toString(), '');
      
      const scaleFactor = {
        small: 0.9,
        medium: 1.0,
        large: 1.1,
      };
      
      return `${baseSizeNum * scaleFactor[screenSize]}${unit}`;
    };

    // Get platform-specific color
    const getPlatformColor = () => {
      if (color) return color;
      
      const { platform } = deviceInfo;
      const colors = platformStyles.colors;
      
      if (medical) {
        return MEDICAL_TYPOGRAPHY[medical].color;
      }
      
      if (platform === 'ios') {
        switch (variant) {
          case 'caption':
            return colors.tertiaryLabel;
          case 'body':
            return colors.label;
          case 'subtitle':
            return colors.secondaryLabel;
          case 'title':
          case 'headline':
          case 'display':
            return colors.label;
          default:
            return colors.label;
        }
      } else {
        // Android Material Design
        switch (variant) {
          case 'caption':
            return colors.onSurfaceVariant;
          case 'body':
            return colors.onSurface;
          case 'subtitle':
            return colors.onSurfaceVariant;
          case 'title':
          case 'headline':
          case 'display':
            return colors.onSurface;
          default:
            return colors.onSurface;
        }
      }
    };

    // Combine all styles
    const combinedStyles = {
      ...typographyStyles,
      fontSize: getResponsiveFontSize(),
      color: getPlatformColor(),
      textAlign: align,
      margin: 0,
      padding: 0,
      // Medical-specific styles
      ...(medical && {
        textTransform: MEDICAL_TYPOGRAPHY[medical].textTransform,
      }),
    };

    // Get semantic HTML element based on variant
    const getSemanticElement = (): keyof JSX.IntrinsicElements => {
      if (as !== 'p') return as;
      
      switch (variant) {
        case 'display':
          return 'h1';
        case 'headline':
          return 'h2';
        case 'title':
          return 'h3';
        case 'subtitle':
          return 'h4';
        case 'caption':
          return 'span';
        default:
          return 'p';
      }
    };

    // Get ARIA attributes for medical content
    const getMedicalAriaAttributes = () => {
      if (!medical) return {};
      
      const medicalAriaAttributes: Record<string, any> = {
        dosage: {
          'aria-label': `Dosage information: ${children}`,
          role: 'alert',
        },
        warning: {
          'aria-label': `Warning: ${children}`,
          role: 'alert',
        },
        emergency: {
          'aria-label': `Emergency information: ${children}`,
          role: 'alert',
          'aria-live': 'assertive',
        },
        instruction: {
          'aria-label': `Medical instruction: ${children}`,
        },
        result: {
          'aria-label': `Medical result: ${children}`,
        },
      };
      
      return medicalAriaAttributes[medical] || {};
    };

    // Create the component
    const Component = getSemanticElement();
    const medicalAriaAttributes = getMedicalAriaAttributes();

    return (
      <Component
        ref={ref as any}
        className={getPlatformClasses(`enhanced-typography typography-${variant} ${medical ? `medical-${medical}` : ''} ${className}`)}
        style={combinedStyles}
        aria-label={ariaLabel || medicalAriaAttributes['aria-label']}
        aria-describedby={ariaDescribedBy}
        aria-live={medicalAriaAttributes['aria-live']}
        role={role || medicalAriaAttributes.role}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

EnhancedTypography.displayName = 'EnhancedTypography';

// Convenience components for common use cases
export const MedicalDosage = (props: Omit<TypographyProps, 'medical'>) => (
  <EnhancedTypography medical="dosage" variant="body" weight="semibold" {...props} />
);

export const MedicalWarning = (props: Omit<TypographyProps, 'medical'>) => (
  <EnhancedTypography medical="warning" variant="body" weight="semibold" {...props} />
);

export const MedicalEmergency = (props: Omit<TypographyProps, 'medical'>) => (
  <EnhancedTypography medical="emergency" variant="title" weight="bold" {...props} />
);

export const MedicalInstruction = (props: Omit<TypographyProps, 'medical'>) => (
  <EnhancedTypography medical="instruction" variant="body" lineHeight="relaxed" {...props} />
);

export const MedicalResult = (props: Omit<TypographyProps, 'medical'>) => (
  <EnhancedTypography medical="result" variant="subtitle" weight="semibold" {...props} />
);

export const ResponsiveHeading = (props: Omit<TypographyProps, 'responsive'>) => (
  <EnhancedTypography responsive variant="headline" weight="bold" {...props} />
);

export const ResponsiveBody = (props: Omit<TypographyProps, 'responsive'>) => (
  <EnhancedTypography responsive variant="body" {...props} />
);

export default EnhancedTypography;
