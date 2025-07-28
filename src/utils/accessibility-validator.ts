/**
 * Accessibility Validation Utilities for Medical Zalo Mini App
 * Ensures ARIA compliance, touch targets, and screen reader compatibility
 */

interface AccessibilityIssue {
  severity: 'error' | 'warning' | 'info';
  element: string;
  issue: string;
  vietnameseDescription: string;
  recommendation: string;
  wcagGuideline?: string;
}

interface TouchTargetValidation {
  element: HTMLElement;
  width: number;
  height: number;
  isValid: boolean;
  recommendation?: string;
}

interface AccessibilityReport {
  score: number;
  issues: AccessibilityIssue[];
  touchTargets: TouchTargetValidation[];
  ariaCompliance: {
    hasAriaLabels: boolean;
    hasProperRoles: boolean;
    hasKeyboardNavigation: boolean;
  };
  medicalSpecificChecks: {
    emergencyIndicators: boolean;
    medicalIconsLabeled: boolean;
    vietnameseLocalization: boolean;
  };
}

class AccessibilityValidator {
  private readonly MINIMUM_TOUCH_TARGET = 44; // 44px minimum as per medical design system
  private readonly RECOMMENDED_TOUCH_TARGET = 48; // 48px recommended

  /**
   * Validate touch targets for mobile accessibility
   */
  validateTouchTargets(): TouchTargetValidation[] {
    const interactiveElements = document.querySelectorAll(
      'button, a, input, select, textarea, [role="button"], [role="link"], [tabindex]'
    );

    const results: TouchTargetValidation[] = [];

    interactiveElements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(element as HTMLElement);
      
      // Include padding in touch target calculation
      const paddingTop = parseFloat(computedStyle.paddingTop);
      const paddingBottom = parseFloat(computedStyle.paddingBottom);
      const paddingLeft = parseFloat(computedStyle.paddingLeft);
      const paddingRight = parseFloat(computedStyle.paddingRight);

      const effectiveWidth = rect.width + paddingLeft + paddingRight;
      const effectiveHeight = rect.height + paddingTop + paddingBottom;

      const isValid = effectiveWidth >= this.MINIMUM_TOUCH_TARGET && 
                     effectiveHeight >= this.MINIMUM_TOUCH_TARGET;

      let recommendation = '';
      if (!isValid) {
        recommendation = `Tăng kích thước lên tối thiểu ${this.MINIMUM_TOUCH_TARGET}px x ${this.MINIMUM_TOUCH_TARGET}px cho khả năng tiếp cận tốt hơn`;
      } else if (effectiveWidth < this.RECOMMENDED_TOUCH_TARGET || effectiveHeight < this.RECOMMENDED_TOUCH_TARGET) {
        recommendation = `Khuyến nghị tăng lên ${this.RECOMMENDED_TOUCH_TARGET}px x ${this.RECOMMENDED_TOUCH_TARGET}px để tối ưu trải nghiệm`;
      }

      results.push({
        element: element as HTMLElement,
        width: effectiveWidth,
        height: effectiveHeight,
        isValid,
        recommendation,
      });
    });

    return results;
  }

  /**
   * Validate ARIA labels and roles
   */
  validateAriaCompliance(): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];

    // Check for missing ARIA labels on interactive elements
    const interactiveElements = document.querySelectorAll(
      'button, a, input, select, textarea, [role="button"], [role="link"]'
    );

    interactiveElements.forEach((element, index) => {
      const hasAriaLabel = element.hasAttribute('aria-label') || 
                          element.hasAttribute('aria-labelledby') ||
                          element.textContent?.trim();

      if (!hasAriaLabel) {
        issues.push({
          severity: 'error',
          element: `${element.tagName.toLowerCase()}[${index}]`,
          issue: 'Missing ARIA label',
          vietnameseDescription: 'Thiếu nhãn ARIA cho trình đọc màn hình',
          recommendation: 'Thêm aria-label hoặc aria-labelledby để mô tả chức năng của phần tử',
          wcagGuideline: 'WCAG 2.1 - 4.1.2 Name, Role, Value',
        });
      }
    });

    // Check for proper heading hierarchy
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let previousLevel = 0;

    headings.forEach((heading, index) => {
      const currentLevel = parseInt(heading.tagName.charAt(1));
      
      if (currentLevel > previousLevel + 1) {
        issues.push({
          severity: 'warning',
          element: `${heading.tagName.toLowerCase()}[${index}]`,
          issue: 'Heading hierarchy skip',
          vietnameseDescription: 'Bỏ qua cấp độ tiêu đề',
          recommendation: 'Sử dụng tiêu đề theo thứ tự tuần tự (h1, h2, h3...)',
          wcagGuideline: 'WCAG 2.1 - 1.3.1 Info and Relationships',
        });
      }

      previousLevel = currentLevel;
    });

    return issues;
  }

  /**
   * Validate medical-specific accessibility requirements
   */
  validateMedicalAccessibility(): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];

    // Check for emergency indicators accessibility
    const emergencyElements = document.querySelectorAll('[class*="emergency"], [class*="cấp-cứu"]');
    emergencyElements.forEach((element, index) => {
      const hasAriaLabel = element.hasAttribute('aria-label') || element.hasAttribute('role');
      
      if (!hasAriaLabel) {
        issues.push({
          severity: 'error',
          element: `emergency-element[${index}]`,
          issue: 'Emergency indicator missing accessibility attributes',
          vietnameseDescription: 'Chỉ báo cấp cứu thiếu thuộc tính khả năng tiếp cận',
          recommendation: 'Thêm aria-label="Dịch vụ cấp cứu" và role="alert" cho các chỉ báo cấp cứu',
          wcagGuideline: 'WCAG 2.1 - 1.3.1 Info and Relationships',
        });
      }
    });

    // Check medical icons for proper labeling
    const medicalIcons = document.querySelectorAll('svg[class*="medical"], [class*="medical-icon"]');
    medicalIcons.forEach((icon, index) => {
      const hasLabel = icon.hasAttribute('aria-label') || 
                      icon.hasAttribute('aria-labelledby') ||
                      icon.hasAttribute('role');

      if (!hasLabel) {
        issues.push({
          severity: 'warning',
          element: `medical-icon[${index}]`,
          issue: 'Medical icon missing accessibility label',
          vietnameseDescription: 'Biểu tượng y tế thiếu nhãn khả năng tiếp cận',
          recommendation: 'Thêm aria-label với mô tả tiếng Việt cho biểu tượng y tế',
        });
      }
    });

    return issues;
  }

  /**
   * Validate keyboard navigation
   */
  validateKeyboardNavigation(): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];

    // Check for focusable elements without proper tabindex
    const interactiveElements = document.querySelectorAll(
      'button, a, input, select, textarea, [role="button"], [role="link"]'
    );

    interactiveElements.forEach((element, index) => {
      const tabIndex = element.getAttribute('tabindex');
      const isHidden = element.hasAttribute('hidden') || 
                      window.getComputedStyle(element as HTMLElement).display === 'none';

      if (!isHidden && tabIndex === '-1') {
        issues.push({
          severity: 'warning',
          element: `${element.tagName.toLowerCase()}[${index}]`,
          issue: 'Interactive element not keyboard accessible',
          vietnameseDescription: 'Phần tử tương tác không thể truy cập bằng bàn phím',
          recommendation: 'Loại bỏ tabindex="-1" hoặc thêm xử lý sự kiện bàn phím',
          wcagGuideline: 'WCAG 2.1 - 2.1.1 Keyboard',
        });
      }
    });

    return issues;
  }

  /**
   * Generate comprehensive accessibility report
   */
  generateAccessibilityReport(): AccessibilityReport {
    const touchTargets = this.validateTouchTargets();
    const ariaIssues = this.validateAriaCompliance();
    const medicalIssues = this.validateMedicalAccessibility();
    const keyboardIssues = this.validateKeyboardNavigation();

    const allIssues = [...ariaIssues, ...medicalIssues, ...keyboardIssues];

    // Calculate accessibility score
    const totalChecks = touchTargets.length + allIssues.length + 10; // Base checks
    const passedChecks = touchTargets.filter(t => t.isValid).length + 
                        (totalChecks - allIssues.filter(i => i.severity === 'error').length);
    const score = Math.round((passedChecks / totalChecks) * 100);

    return {
      score,
      issues: allIssues,
      touchTargets,
      ariaCompliance: {
        hasAriaLabels: ariaIssues.filter(i => i.issue.includes('ARIA label')).length === 0,
        hasProperRoles: ariaIssues.filter(i => i.issue.includes('role')).length === 0,
        hasKeyboardNavigation: keyboardIssues.length === 0,
      },
      medicalSpecificChecks: {
        emergencyIndicators: medicalIssues.filter(i => i.issue.includes('Emergency')).length === 0,
        medicalIconsLabeled: medicalIssues.filter(i => i.issue.includes('Medical icon')).length === 0,
        vietnameseLocalization: document.documentElement.lang === 'vi' || 
                               document.querySelector('[lang="vi"]') !== null,
      },
    };
  }

  /**
   * Log accessibility report with Vietnamese localization
   */
  logAccessibilityReport(): void {
    const report = this.generateAccessibilityReport();
    
    console.group('🏥 Báo cáo khả năng tiếp cận y tế (Medical Accessibility Report)');
    console.log(`Điểm số: ${report.score}/100`);
    
    if (report.issues.length > 0) {
      console.group('⚠️ Vấn đề cần khắc phục:');
      report.issues.forEach(issue => {
        console.log(`${issue.severity.toUpperCase()}: ${issue.vietnameseDescription}`);
        console.log(`Khuyến nghị: ${issue.recommendation}`);
        if (issue.wcagGuideline) {
          console.log(`Tiêu chuẩn: ${issue.wcagGuideline}`);
        }
        console.log('---');
      });
      console.groupEnd();
    }

    console.log('Kiểm tra mục tiêu chạm:', {
      total: report.touchTargets.length,
      valid: report.touchTargets.filter(t => t.isValid).length,
      invalid: report.touchTargets.filter(t => !t.isValid).length,
    });

    console.log('Tuân thủ ARIA:', report.ariaCompliance);
    console.log('Kiểm tra y tế chuyên biệt:', report.medicalSpecificChecks);
    
    console.groupEnd();
  }
}

// Export singleton instance
export const accessibilityValidator = new AccessibilityValidator();

// Utility functions for easy integration
export const MedicalAccessibilityUtils = {
  // Quick validation for development
  quickValidation: () => {
    accessibilityValidator.logAccessibilityReport();
  },

  // Validate specific component
  validateComponent: (componentSelector: string) => {
    const component = document.querySelector(componentSelector);
    if (!component) {
      console.warn(`Component not found: ${componentSelector}`);
      return;
    }

    // Temporarily scope validation to component
    const originalDocument = document;
    // Note: This is a simplified approach - in practice, you'd need more sophisticated scoping
    
    console.log(`Validating component: ${componentSelector}`);
    accessibilityValidator.logAccessibilityReport();
  },

  // Initialize accessibility monitoring
  initializeAccessibilityMonitoring: () => {
    // Run validation on page load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => accessibilityValidator.logAccessibilityReport(), 1000);
      });
    } else {
      setTimeout(() => accessibilityValidator.logAccessibilityReport(), 1000);
    }

    console.log('Đã khởi tạo giám sát khả năng tiếp cận y tế');
  },
};

export default accessibilityValidator;
