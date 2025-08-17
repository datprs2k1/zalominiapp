/**
 * Design System Testing Utilities
 * Comprehensive testing tools for medical design system
 */

import { validateColorContrast, validateTouchTarget, auditAccessibility } from './accessibility';

// Design system validation interface
interface DesignSystemAudit {
  colorSystem: {
    score: number;
    issues: string[];
    recommendations: string[];
  };
  typography: {
    score: number;
    issues: string[];
    recommendations: string[];
  };
  spacing: {
    score: number;
    issues: string[];
    recommendations: string[];
  };
  components: {
    score: number;
    issues: string[];
    recommendations: string[];
  };
  accessibility: {
    score: number;
    issues: string[];
    recommendations: string[];
  };
  performance: {
    score: number;
    issues: string[];
    recommendations: string[];
  };
  overallScore: number;
}

// Color system validation
const auditColorSystem = (container: HTMLElement = document.body): DesignSystemAudit['colorSystem'] => {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let score = 100;

  // Check for consistent color usage
  const elements = container.querySelectorAll('*');
  const colorUsage = new Map<string, number>();

  elements.forEach(element => {
    const computedStyle = window.getComputedStyle(element);
    const color = computedStyle.color;
    const backgroundColor = computedStyle.backgroundColor;

    if (color && color !== 'rgba(0, 0, 0, 0)') {
      colorUsage.set(color, (colorUsage.get(color) || 0) + 1);
    }
    if (backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)') {
      colorUsage.set(backgroundColor, (colorUsage.get(backgroundColor) || 0) + 1);
    }
  });

  // Check for too many unique colors (indicates inconsistent design)
  const uniqueColors = colorUsage.size;
  if (uniqueColors > 20) {
    issues.push(`Too many unique colors used (${uniqueColors}). Consider using a more consistent color palette.`);
    recommendations.push('Consolidate colors using design tokens and CSS custom properties.');
    score -= 15;
  }

  // Check for medical color palette usage
  const medicalColors = ['medical-', 'success-', 'warning-', 'danger-', 'neutral-'];
  const hasMedicalColors = Array.from(container.querySelectorAll('[class*="medical-"], [class*="success-"], [class*="warning-"], [class*="danger-"], [class*="neutral-"]')).length > 0;

  if (!hasMedicalColors) {
    issues.push('Medical color palette not detected. Ensure design system colors are being used.');
    recommendations.push('Use medical design system color classes (medical-, success-, warning-, danger-, neutral-).');
    score -= 20;
  }

  return { score: Math.max(0, score), issues, recommendations };
};

// Typography validation
const auditTypography = (container: HTMLElement = document.body): DesignSystemAudit['typography'] => {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let score = 100;

  // Check for consistent font usage
  const textElements = container.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, a, button, label');
  const fontFamilies = new Set<string>();
  const fontSizes = new Set<string>();

  textElements.forEach(element => {
    const computedStyle = window.getComputedStyle(element);
    fontFamilies.add(computedStyle.fontFamily);
    fontSizes.add(computedStyle.fontSize);
  });

  // Check for too many font families
  if (fontFamilies.size > 3) {
    issues.push(`Too many font families used (${fontFamilies.size}). Stick to 1-2 font families.`);
    recommendations.push('Use consistent font families defined in the design system.');
    score -= 15;
  }

  // Check for medical typography classes
  const hasTypographyClasses = container.querySelectorAll('[class*="text-medical-"], [class*="font-"]').length > 0;
  if (!hasTypographyClasses) {
    issues.push('Medical typography classes not detected.');
    recommendations.push('Use medical design system typography classes (text-medical-title, text-medical-body, etc.).');
    score -= 10;
  }

  // Check heading hierarchy
  const headings = Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  for (let i = 1; i < headings.length; i++) {
    const current = parseInt(headings[i].tagName.charAt(1));
    const previous = parseInt(headings[i - 1].tagName.charAt(1));
    
    if (current > previous + 1) {
      issues.push(`Heading hierarchy skip detected: h${previous} to h${current}`);
      recommendations.push('Maintain proper heading hierarchy for accessibility and SEO.');
      score -= 5;
    }
  }

  return { score: Math.max(0, score), issues, recommendations };
};

// Spacing validation
const auditSpacing = (container: HTMLElement = document.body): DesignSystemAudit['spacing'] => {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let score = 100;

  // Check for consistent spacing usage
  const elements = container.querySelectorAll('*');
  const spacingValues = new Set<string>();

  elements.forEach(element => {
    const computedStyle = window.getComputedStyle(element);
    ['margin', 'padding'].forEach(property => {
      ['Top', 'Right', 'Bottom', 'Left'].forEach(side => {
        const value = computedStyle.getPropertyValue(`${property}${side}`);
        if (value && value !== '0px') {
          spacingValues.add(value);
        }
      });
    });
  });

  // Check for too many unique spacing values
  if (spacingValues.size > 15) {
    issues.push(`Too many unique spacing values (${spacingValues.size}). Use consistent spacing scale.`);
    recommendations.push('Use Tailwind spacing classes or design system spacing tokens.');
    score -= 10;
  }

  // Check for medical spacing classes
  const hasSpacingClasses = container.querySelectorAll('[class*="p-"], [class*="m-"], [class*="gap-"]').length > 0;
  if (!hasSpacingClasses) {
    issues.push('Consistent spacing classes not detected.');
    recommendations.push('Use Tailwind spacing utilities for consistent spacing.');
    score -= 10;
  }

  return { score: Math.max(0, score), issues, recommendations };
};

// Component validation
const auditComponents = (container: HTMLElement = document.body): DesignSystemAudit['components'] => {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let score = 100;

  // Check for medical component classes
  const medicalComponents = [
    'btn-medical-',
    'card-medical',
    'rounded-medical',
    'shadow-card-medical',
    'form-group-medical',
    'label-medical'
  ];

  let componentClassCount = 0;
  medicalComponents.forEach(className => {
    const elements = container.querySelectorAll(`[class*="${className}"]`);
    componentClassCount += elements.length;
  });

  if (componentClassCount === 0) {
    issues.push('Medical design system component classes not detected.');
    recommendations.push('Use medical design system component classes for consistency.');
    score -= 25;
  }

  // Check for consistent button styling
  const buttons = container.querySelectorAll('button, [role="button"]');
  const buttonClasses = new Set<string>();

  buttons.forEach(button => {
    const classList = Array.from(button.classList).join(' ');
    buttonClasses.add(classList);
  });

  if (buttons.length > 0 && buttonClasses.size > buttons.length * 0.7) {
    issues.push('Inconsistent button styling detected.');
    recommendations.push('Use consistent button component classes across the application.');
    score -= 10;
  }

  // Check for proper form styling
  const formElements = container.querySelectorAll('input, select, textarea');
  let styledFormElements = 0;

  formElements.forEach(element => {
    const hasFormClasses = element.classList.toString().includes('form-') || 
                          element.classList.toString().includes('input-') ||
                          element.classList.toString().includes('border-');
    if (hasFormClasses) styledFormElements++;
  });

  if (formElements.length > 0 && styledFormElements / formElements.length < 0.8) {
    issues.push('Inconsistent form element styling.');
    recommendations.push('Apply consistent styling to all form elements.');
    score -= 10;
  }

  return { score: Math.max(0, score), issues, recommendations };
};

// Performance audit
const auditPerformance = (): DesignSystemAudit['performance'] => {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let score = 100;

  // Check for unused CSS
  const stylesheets = Array.from(document.styleSheets);
  let totalRules = 0;
  let unusedRules = 0;

  try {
    stylesheets.forEach(stylesheet => {
      if (stylesheet.cssRules) {
        Array.from(stylesheet.cssRules).forEach(rule => {
          totalRules++;
          if (rule instanceof CSSStyleRule) {
            try {
              const elements = document.querySelectorAll(rule.selectorText);
              if (elements.length === 0) {
                unusedRules++;
              }
            } catch (e) {
              // Invalid selector, skip
            }
          }
        });
      }
    });

    const unusedPercentage = (unusedRules / totalRules) * 100;
    if (unusedPercentage > 30) {
      issues.push(`High percentage of unused CSS rules (${unusedPercentage.toFixed(1)}%)`);
      recommendations.push('Remove unused CSS rules to improve performance.');
      score -= 15;
    }
  } catch (e) {
    // CSS analysis failed, skip
  }

  // Check for large images
  const images = document.querySelectorAll('img');
  let largeImageCount = 0;

  images.forEach(img => {
    if (img.naturalWidth > 2000 || img.naturalHeight > 2000) {
      largeImageCount++;
    }
  });

  if (largeImageCount > 0) {
    issues.push(`${largeImageCount} large images detected that may impact performance.`);
    recommendations.push('Optimize images and use responsive image techniques.');
    score -= 10;
  }

  // Check for inline styles
  const elementsWithInlineStyles = document.querySelectorAll('[style]');
  if (elementsWithInlineStyles.length > 10) {
    issues.push(`${elementsWithInlineStyles.length} elements with inline styles detected.`);
    recommendations.push('Move inline styles to CSS classes for better maintainability.');
    score -= 5;
  }

  return { score: Math.max(0, score), issues, recommendations };
};

// Comprehensive design system audit
export const auditDesignSystem = (container: HTMLElement = document.body): DesignSystemAudit => {
  const colorSystem = auditColorSystem(container);
  const typography = auditTypography(container);
  const spacing = auditSpacing(container);
  const components = auditComponents(container);
  const accessibilityAudit = auditAccessibility(container);
  const performance = auditPerformance();

  // Convert accessibility audit to design system format
  const accessibility = {
    score: accessibilityAudit.overallScore,
    issues: [
      ...accessibilityAudit.ariaIssues.map(issue => issue.issue),
      ...accessibilityAudit.keyboardNavigation.issues,
      ...accessibilityAudit.screenReader.issues,
    ],
    recommendations: [
      'Ensure all interactive elements have accessible names',
      'Maintain proper heading hierarchy',
      'Provide sufficient color contrast',
      'Make all functionality keyboard accessible',
    ],
  };

  // Calculate overall score
  const scores = [
    colorSystem.score,
    typography.score,
    spacing.score,
    components.score,
    accessibility.score,
    performance.score,
  ];
  const overallScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);

  return {
    colorSystem,
    typography,
    spacing,
    components,
    accessibility,
    performance,
    overallScore,
  };
};

// Generate design system report
export const generateDesignSystemReport = (audit: DesignSystemAudit): string => {
  const sections = [
    { name: 'Color System', data: audit.colorSystem },
    { name: 'Typography', data: audit.typography },
    { name: 'Spacing', data: audit.spacing },
    { name: 'Components', data: audit.components },
    { name: 'Accessibility', data: audit.accessibility },
    { name: 'Performance', data: audit.performance },
  ];

  let report = `# Design System Audit Report\n\n`;
  report += `**Overall Score: ${audit.overallScore}/100**\n\n`;

  sections.forEach(section => {
    report += `## ${section.name} (${section.data.score}/100)\n\n`;
    
    if (section.data.issues.length > 0) {
      report += `### Issues:\n`;
      section.data.issues.forEach(issue => {
        report += `- ${issue}\n`;
      });
      report += `\n`;
    }

    if (section.data.recommendations.length > 0) {
      report += `### Recommendations:\n`;
      section.data.recommendations.forEach(rec => {
        report += `- ${rec}\n`;
      });
      report += `\n`;
    }
  });

  return report;
};

// Visual regression testing helper
export const captureDesignSystemSnapshot = async (
  element: HTMLElement,
  name: string
): Promise<string> => {
  // This would integrate with a visual testing service
  // For now, return a placeholder
  return `snapshot-${name}-${Date.now()}`;
};

// Cross-browser testing utilities
export const testCrossBrowserCompatibility = (): {
  supported: string[];
  unsupported: string[];
  warnings: string[];
} => {
  const features = [
    'css-grid',
    'css-flexbox',
    'css-custom-properties',
    'intersection-observer',
    'web-animations',
  ];

  const supported: string[] = [];
  const unsupported: string[] = [];
  const warnings: string[] = [];

  // This would check actual browser support
  // For now, provide mock results
  features.forEach(feature => {
    supported.push(feature);
  });

  return { supported, unsupported, warnings };
};
