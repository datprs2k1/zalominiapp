/**
 * Advanced Responsive Typography System
 * Optimized for medical content accessibility and mobile readability
 */

// Types
export interface TypographyPreferences {
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  lineHeight: 'tight' | 'normal' | 'relaxed';
  contrast: 'normal' | 'high';
  dyslexiaFriendly: boolean;
  reducedMotion: boolean;
}

export interface TypographyScale {
  caption: string;
  body: string;
  subtitle: string;
  title: string;
  headline: string;
  display: string;
}

export interface TypographyConfig {
  fontFamily: {
    primary: string;
    secondary: string;
    monospace: string;
    dyslexiaFriendly: string;
  };
  fontWeight: {
    light: number;
    regular: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
  letterSpacing: {
    tight: string;
    normal: string;
    wide: string;
  };
}

// Default typography configuration
const DEFAULT_TYPOGRAPHY_CONFIG: TypographyConfig = {
  fontFamily: {
    primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif',
    secondary: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    monospace: '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", "Source Code Pro", monospace',
    dyslexiaFriendly: '"OpenDyslexic", "Comic Sans MS", cursive, sans-serif',
  },
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.8,
  },
  letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
  },
};

// Typography scales for different font sizes
const TYPOGRAPHY_SCALES: Record<TypographyPreferences['fontSize'], TypographyScale> = {
  small: {
    caption: '11px',
    body: '14px',
    subtitle: '16px',
    title: '18px',
    headline: '22px',
    display: '28px',
  },
  medium: {
    caption: '12px',
    body: '16px',
    subtitle: '18px',
    title: '20px',
    headline: '24px',
    display: '32px',
  },
  large: {
    caption: '14px',
    body: '18px',
    subtitle: '20px',
    title: '24px',
    headline: '28px',
    display: '36px',
  },
  'extra-large': {
    caption: '16px',
    body: '20px',
    subtitle: '24px',
    title: '28px',
    headline: '32px',
    display: '40px',
  },
};

// Medical content specific typography
export const MEDICAL_TYPOGRAPHY = {
  dosage: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#D32F2F',
    letterSpacing: '0.025em',
  },
  warning: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#F57C00',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  emergency: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#D32F2F',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
  },
  instruction: {
    fontSize: '16px',
    fontWeight: 500,
    lineHeight: 1.6,
    letterSpacing: '0.01em',
  },
  result: {
    fontSize: '18px',
    fontWeight: 600,
    letterSpacing: '0.025em',
  },
};

// Advanced Typography Manager
export class AdvancedTypographyManager {
  private preferences: TypographyPreferences;
  private config: TypographyConfig;
  private scale: TypographyScale;

  constructor(preferences?: Partial<TypographyPreferences>) {
    this.preferences = {
      fontSize: 'medium',
      lineHeight: 'normal',
      contrast: 'normal',
      dyslexiaFriendly: false,
      reducedMotion: false,
      ...preferences,
    };
    
    this.config = DEFAULT_TYPOGRAPHY_CONFIG;
    this.scale = TYPOGRAPHY_SCALES[this.preferences.fontSize];
    
    this.detectSystemPreferences();
    this.applyGlobalStyles();
  }

  // Detect system preferences
  private detectSystemPreferences() {
    // Detect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.preferences.reducedMotion = true;
    }

    // Detect high contrast preference
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      this.preferences.contrast = 'high';
    }

    // Detect font size preference from browser settings
    const testElement = document.createElement('div');
    testElement.style.fontSize = '1rem';
    testElement.style.position = 'absolute';
    testElement.style.visibility = 'hidden';
    document.body.appendChild(testElement);
    
    const computedSize = window.getComputedStyle(testElement).fontSize;
    const baseFontSize = parseFloat(computedSize);
    
    document.body.removeChild(testElement);

    // Adjust scale based on browser font size
    if (baseFontSize > 18) {
      this.preferences.fontSize = 'large';
    } else if (baseFontSize > 20) {
      this.preferences.fontSize = 'extra-large';
    }

    this.scale = TYPOGRAPHY_SCALES[this.preferences.fontSize];
  }

  // Apply global typography styles
  private applyGlobalStyles() {
    const root = document.documentElement;
    
    // Set CSS custom properties
    root.style.setProperty('--font-family-primary', this.getFontFamily());
    root.style.setProperty('--font-family-secondary', this.config.fontFamily.secondary);
    root.style.setProperty('--font-family-monospace', this.config.fontFamily.monospace);
    
    // Set font sizes
    Object.entries(this.scale).forEach(([key, value]) => {
      root.style.setProperty(`--font-size-${key}`, value);
    });
    
    // Set line heights
    Object.entries(this.config.lineHeight).forEach(([key, value]) => {
      root.style.setProperty(`--line-height-${key}`, value.toString());
    });
    
    // Set letter spacing
    Object.entries(this.config.letterSpacing).forEach(([key, value]) => {
      root.style.setProperty(`--letter-spacing-${key}`, value);
    });

    // Apply contrast adjustments
    if (this.preferences.contrast === 'high') {
      root.style.setProperty('--text-contrast-ratio', '7:1');
      root.style.setProperty('--text-color-primary', '#000000');
      root.style.setProperty('--text-color-secondary', '#333333');
    } else {
      root.style.setProperty('--text-contrast-ratio', '4.5:1');
      root.style.setProperty('--text-color-primary', '#1F2937');
      root.style.setProperty('--text-color-secondary', '#6B7280');
    }
  }

  // Get appropriate font family
  private getFontFamily(): string {
    if (this.preferences.dyslexiaFriendly) {
      return this.config.fontFamily.dyslexiaFriendly;
    }
    return this.config.fontFamily.primary;
  }

  // Update preferences
  public updatePreferences(newPreferences: Partial<TypographyPreferences>) {
    this.preferences = { ...this.preferences, ...newPreferences };
    this.scale = TYPOGRAPHY_SCALES[this.preferences.fontSize];
    this.applyGlobalStyles();
  }

  // Get typography styles for a specific element
  public getElementStyles(element: keyof TypographyScale, options?: {
    weight?: keyof TypographyConfig['fontWeight'];
    lineHeight?: keyof TypographyConfig['lineHeight'];
    letterSpacing?: keyof TypographyConfig['letterSpacing'];
    medical?: keyof typeof MEDICAL_TYPOGRAPHY;
  }) {
    const baseStyles = {
      fontSize: this.scale[element],
      fontFamily: this.getFontFamily(),
      fontWeight: this.config.fontWeight[options?.weight || 'regular'],
      lineHeight: this.config.lineHeight[options?.lineHeight || this.preferences.lineHeight],
      letterSpacing: this.config.letterSpacing[options?.letterSpacing || 'normal'],
    };

    // Apply medical-specific styles if specified
    if (options?.medical) {
      const medicalStyles = MEDICAL_TYPOGRAPHY[options.medical];
      return { ...baseStyles, ...medicalStyles };
    }

    return baseStyles;
  }

  // Get responsive font size based on viewport
  public getResponsiveFontSize(baseSize: string, viewport: 'mobile' | 'tablet' | 'desktop'): string {
    const baseSizeNum = parseFloat(baseSize);
    const unit = baseSize.replace(baseSizeNum.toString(), '');

    const scaleFactor = {
      mobile: 0.9,
      tablet: 1.0,
      desktop: 1.1,
    };

    return `${baseSizeNum * scaleFactor[viewport]}${unit}`;
  }

  // Generate CSS classes for typography
  public generateCSSClasses(): string {
    const classes = Object.entries(this.scale).map(([key, value]) => {
      const styles = this.getElementStyles(key as keyof TypographyScale);
      return `
        .text-${key} {
          font-size: ${styles.fontSize};
          font-family: ${styles.fontFamily};
          font-weight: ${styles.fontWeight};
          line-height: ${styles.lineHeight};
          letter-spacing: ${styles.letterSpacing};
        }
      `;
    }).join('\n');

    // Add medical typography classes
    const medicalClasses = Object.entries(MEDICAL_TYPOGRAPHY).map(([key, styles]) => {
      return `
        .medical-${key} {
          font-size: ${styles.fontSize};
          font-weight: ${styles.fontWeight};
          color: ${styles.color};
          line-height: ${styles.lineHeight || this.config.lineHeight.normal};
          letter-spacing: ${styles.letterSpacing};
          ${styles.textTransform ? `text-transform: ${styles.textTransform};` : ''}
        }
      `;
    }).join('\n');

    // Add responsive classes
    const responsiveClasses = `
      @media (max-width: 640px) {
        .text-responsive { font-size: ${this.getResponsiveFontSize(this.scale.body, 'mobile')}; }
      }
      @media (min-width: 641px) and (max-width: 1024px) {
        .text-responsive { font-size: ${this.getResponsiveFontSize(this.scale.body, 'tablet')}; }
      }
      @media (min-width: 1025px) {
        .text-responsive { font-size: ${this.getResponsiveFontSize(this.scale.body, 'desktop')}; }
      }
    `;

    return classes + medicalClasses + responsiveClasses;
  }

  // Get current preferences
  public getPreferences(): TypographyPreferences {
    return { ...this.preferences };
  }

  // Get current scale
  public getScale(): TypographyScale {
    return { ...this.scale };
  }

  // Check if text meets accessibility contrast requirements
  public checkContrastRatio(textColor: string, backgroundColor: string): boolean {
    // This is a simplified contrast check
    // In a real implementation, you would use a proper contrast calculation library
    const textLuminance = this.getLuminance(textColor);
    const bgLuminance = this.getLuminance(backgroundColor);
    
    const contrastRatio = (Math.max(textLuminance, bgLuminance) + 0.05) / 
                         (Math.min(textLuminance, bgLuminance) + 0.05);
    
    return contrastRatio >= (this.preferences.contrast === 'high' ? 7 : 4.5);
  }

  // Calculate relative luminance (simplified)
  private getLuminance(color: string): number {
    // This is a simplified implementation
    // In production, use a proper color library
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
}

// Create a global instance
export const typographyManager = new AdvancedTypographyManager();

// React hook for typography
export const useAdvancedTypography = () => {
  return {
    manager: typographyManager,
    getElementStyles: typographyManager.getElementStyles.bind(typographyManager),
    updatePreferences: typographyManager.updatePreferences.bind(typographyManager),
    getPreferences: typographyManager.getPreferences.bind(typographyManager),
    getScale: typographyManager.getScale.bind(typographyManager),
    checkContrastRatio: typographyManager.checkContrastRatio.bind(typographyManager),
  };
};
