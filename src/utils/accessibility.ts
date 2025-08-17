/**
 * Accessibility Testing and Validation Utilities
 * WCAG 2.1 AA compliance helpers
 */

// Color contrast validation
export const validateColorContrast = (foreground: string, background: string): {
  ratio: number;
  wcagAA: boolean;
  wcagAAA: boolean;
} => {
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const getLuminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);

  if (!fg || !bg) {
    return { ratio: 0, wcagAA: false, wcagAAA: false };
  }

  const fgLuminance = getLuminance(fg.r, fg.g, fg.b);
  const bgLuminance = getLuminance(bg.r, bg.g, bg.b);

  const lighter = Math.max(fgLuminance, bgLuminance);
  const darker = Math.min(fgLuminance, bgLuminance);
  const ratio = (lighter + 0.05) / (darker + 0.05);

  return {
    ratio,
    wcagAA: ratio >= 4.5,
    wcagAAA: ratio >= 7,
  };
};

// Touch target size validation
export const validateTouchTarget = (element: HTMLElement): {
  width: number;
  height: number;
  isValid: boolean;
  recommendation: string;
} => {
  const rect = element.getBoundingClientRect();
  const minSize = 44; // WCAG minimum touch target size

  return {
    width: rect.width,
    height: rect.height,
    isValid: rect.width >= minSize && rect.height >= minSize,
    recommendation: rect.width < minSize || rect.height < minSize 
      ? `Touch target should be at least ${minSize}px x ${minSize}px`
      : 'Touch target size is adequate',
  };
};

// Focus management utilities
export const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
  const focusableSelectors = [
    'button:not([disabled])',
    '[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(', ');

  return Array.from(container.querySelectorAll(focusableSelectors));
};

export const trapFocus = (container: HTMLElement) => {
  const focusableElements = getFocusableElements(container);
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    }
  };

  container.addEventListener('keydown', handleKeyDown);
  firstElement?.focus();

  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
};

// ARIA validation
export const validateAriaLabels = (container: HTMLElement): Array<{
  element: HTMLElement;
  issue: string;
  severity: 'error' | 'warning';
}> => {
  const issues: Array<{
    element: HTMLElement;
    issue: string;
    severity: 'error' | 'warning';
  }> = [];

  // Check for buttons without accessible names
  const buttons = container.querySelectorAll('button');
  buttons.forEach(button => {
    const hasText = button.textContent?.trim();
    const hasAriaLabel = button.getAttribute('aria-label');
    const hasAriaLabelledBy = button.getAttribute('aria-labelledby');

    if (!hasText && !hasAriaLabel && !hasAriaLabelledBy) {
      issues.push({
        element: button as HTMLElement,
        issue: 'Button lacks accessible name',
        severity: 'error',
      });
    }
  });

  // Check for images without alt text
  const images = container.querySelectorAll('img');
  images.forEach(img => {
    const hasAlt = img.hasAttribute('alt');
    const isDecorative = img.getAttribute('role') === 'presentation' || 
                        img.getAttribute('alt') === '';

    if (!hasAlt && !isDecorative) {
      issues.push({
        element: img as HTMLElement,
        issue: 'Image lacks alt text',
        severity: 'error',
      });
    }
  });

  // Check for form inputs without labels
  const inputs = container.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    const hasLabel = container.querySelector(`label[for="${input.id}"]`);
    const hasAriaLabel = input.getAttribute('aria-label');
    const hasAriaLabelledBy = input.getAttribute('aria-labelledby');

    if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
      issues.push({
        element: input as HTMLElement,
        issue: 'Form control lacks label',
        severity: 'error',
      });
    }
  });

  return issues;
};

// Keyboard navigation testing
export const testKeyboardNavigation = (container: HTMLElement): {
  focusableCount: number;
  tabOrder: HTMLElement[];
  issues: string[];
} => {
  const focusableElements = getFocusableElements(container);
  const issues: string[] = [];

  // Check for skip links
  const skipLinks = container.querySelectorAll('a[href^="#"]');
  if (skipLinks.length === 0) {
    issues.push('No skip links found for keyboard navigation');
  }

  // Check for focus indicators
  focusableElements.forEach((element, index) => {
    element.focus();
    const computedStyle = window.getComputedStyle(element, ':focus');
    const hasOutline = computedStyle.outline !== 'none' && computedStyle.outline !== '';
    const hasBoxShadow = computedStyle.boxShadow !== 'none';
    const hasCustomFocus = element.classList.contains('focus:') || 
                          element.getAttribute('class')?.includes('focus:');

    if (!hasOutline && !hasBoxShadow && !hasCustomFocus) {
      issues.push(`Element ${index + 1} lacks visible focus indicator`);
    }
  });

  return {
    focusableCount: focusableElements.length,
    tabOrder: focusableElements,
    issues,
  };
};

// Screen reader testing utilities
export const validateScreenReaderContent = (container: HTMLElement): {
  headingStructure: Array<{ level: number; text: string; element: HTMLElement }>;
  landmarks: Array<{ role: string; element: HTMLElement }>;
  issues: string[];
} => {
  const issues: string[] = [];

  // Check heading structure
  const headings = Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  const headingStructure = headings.map(heading => ({
    level: parseInt(heading.tagName.charAt(1)),
    text: heading.textContent || '',
    element: heading as HTMLElement,
  }));

  // Validate heading hierarchy
  for (let i = 1; i < headingStructure.length; i++) {
    const current = headingStructure[i];
    const previous = headingStructure[i - 1];
    
    if (current.level > previous.level + 1) {
      issues.push(`Heading level jumps from h${previous.level} to h${current.level}`);
    }
  }

  // Check for landmarks
  const landmarks = Array.from(container.querySelectorAll('[role], main, nav, aside, header, footer, section'))
    .map(element => ({
      role: element.getAttribute('role') || element.tagName.toLowerCase(),
      element: element as HTMLElement,
    }));

  if (landmarks.length === 0) {
    issues.push('No landmark elements found for screen reader navigation');
  }

  return {
    headingStructure,
    landmarks,
    issues,
  };
};

// Comprehensive accessibility audit
export const auditAccessibility = (container: HTMLElement = document.body): {
  colorContrast: Array<{ element: HTMLElement; ratio: number; passes: boolean }>;
  touchTargets: Array<{ element: HTMLElement; width: number; height: number; passes: boolean }>;
  ariaIssues: Array<{ element: HTMLElement; issue: string; severity: 'error' | 'warning' }>;
  keyboardNavigation: { focusableCount: number; issues: string[] };
  screenReader: { headingStructure: any[]; landmarks: any[]; issues: string[] };
  overallScore: number;
} => {
  // Color contrast audit
  const colorContrast: Array<{ element: HTMLElement; ratio: number; passes: boolean }> = [];
  const textElements = container.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, a, button, label');
  
  textElements.forEach(element => {
    const computedStyle = window.getComputedStyle(element);
    const color = computedStyle.color;
    const backgroundColor = computedStyle.backgroundColor;
    
    if (color && backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)') {
      const contrast = validateColorContrast(color, backgroundColor);
      colorContrast.push({
        element: element as HTMLElement,
        ratio: contrast.ratio,
        passes: contrast.wcagAA,
      });
    }
  });

  // Touch target audit
  const touchTargets: Array<{ element: HTMLElement; width: number; height: number; passes: boolean }> = [];
  const interactiveElements = container.querySelectorAll('button, a, input, select, textarea');
  
  interactiveElements.forEach(element => {
    const validation = validateTouchTarget(element as HTMLElement);
    touchTargets.push({
      element: element as HTMLElement,
      width: validation.width,
      height: validation.height,
      passes: validation.isValid,
    });
  });

  // ARIA audit
  const ariaIssues = validateAriaLabels(container);

  // Keyboard navigation audit
  const keyboardNavigation = testKeyboardNavigation(container);

  // Screen reader audit
  const screenReader = validateScreenReaderContent(container);

  // Calculate overall score
  const totalTests = colorContrast.length + touchTargets.length + ariaIssues.length + 
                    keyboardNavigation.issues.length + screenReader.issues.length;
  const passedTests = colorContrast.filter(c => c.passes).length + 
                     touchTargets.filter(t => t.passes).length + 
                     (totalTests - ariaIssues.length - keyboardNavigation.issues.length - screenReader.issues.length);
  
  const overallScore = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 100;

  return {
    colorContrast,
    touchTargets,
    ariaIssues,
    keyboardNavigation,
    screenReader,
    overallScore,
  };
};
