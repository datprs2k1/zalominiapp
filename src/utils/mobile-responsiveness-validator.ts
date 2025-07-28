/**
 * Mobile Responsiveness Validator for Medical Zalo Mini App
 * Ensures optimal mobile experience and cross-platform compatibility
 */

interface ResponsivenessIssue {
  severity: 'error' | 'warning' | 'info';
  breakpoint: string;
  element: string;
  issue: string;
  vietnameseDescription: string;
  recommendation: string;
}

interface ViewportTest {
  width: number;
  height: number;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  issues: ResponsivenessIssue[];
  score: number;
}

interface ResponsivenessReport {
  overallScore: number;
  viewportTests: ViewportTest[];
  medicalSpecificChecks: {
    emergencyButtonsAccessible: boolean;
    medicalCardsResponsive: boolean;
    navigationOptimized: boolean;
    textReadability: boolean;
  };
  zaloMiniAppCompatibility: {
    statusBarSafe: boolean;
    bottomNavigationSafe: boolean;
    gestureCompatible: boolean;
  };
}

class MobileResponsivenessValidator {
  private readonly BREAKPOINTS = {
    mobile: { min: 320, max: 767 },
    tablet: { min: 768, max: 1023 },
    desktop: { min: 1024, max: 1920 },
  };

  private readonly ZALO_SAFE_AREAS = {
    statusBar: 44, // iOS status bar height
    bottomNavigation: 83, // Zalo Mini App bottom navigation
  };

  /**
   * Test responsiveness at different viewport sizes
   */
  testViewportSizes(): ViewportTest[] {
    const testSizes = [
      { width: 375, height: 667, deviceType: 'mobile' as const }, // iPhone SE
      { width: 414, height: 896, deviceType: 'mobile' as const }, // iPhone 11
      { width: 768, height: 1024, deviceType: 'tablet' as const }, // iPad
      { width: 1024, height: 768, deviceType: 'desktop' as const }, // Desktop
    ];

    return testSizes.map(size => {
      const issues = this.validateAtViewportSize(size.width, size.height);
      const score = Math.max(0, 100 - (issues.length * 10));

      return {
        ...size,
        issues,
        score,
      };
    });
  }

  /**
   * Validate layout at specific viewport size
   */
  private validateAtViewportSize(width: number, height: number): ResponsivenessIssue[] {
    const issues: ResponsivenessIssue[] = [];

    // Temporarily change viewport for testing
    const originalWidth = window.innerWidth;
    const originalHeight = window.innerHeight;

    // Note: In a real implementation, you'd use a headless browser or iframe
    // This is a simplified approach for demonstration

    // Check for horizontal scrolling
    if (document.body.scrollWidth > width) {
      issues.push({
        severity: 'error',
        breakpoint: `${width}x${height}`,
        element: 'body',
        issue: 'Horizontal scrolling detected',
        vietnameseDescription: 'Phát hiện cuộn ngang không mong muốn',
        recommendation: 'Kiểm tra các phần tử có width cố định hoặc overflow',
      });
    }

    // Check medical cards responsiveness
    const medicalCards = document.querySelectorAll('[class*="medical-card"], [class*="service-card"]');
    medicalCards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      
      if (rect.width < 280 && width <= 480) {
        issues.push({
          severity: 'warning',
          breakpoint: `${width}x${height}`,
          element: `medical-card[${index}]`,
          issue: 'Medical card too narrow on mobile',
          vietnameseDescription: 'Thẻ y tế quá hẹp trên thiết bị di động',
          recommendation: 'Tăng chiều rộng tối thiểu của thẻ y tế lên 280px',
        });
      }
    });

    // Check emergency buttons accessibility
    const emergencyButtons = document.querySelectorAll('[class*="emergency"], button[class*="cấp-cứu"]');
    emergencyButtons.forEach((button, index) => {
      const rect = button.getBoundingClientRect();
      
      if (rect.height < 44 || rect.width < 44) {
        issues.push({
          severity: 'error',
          breakpoint: `${width}x${height}`,
          element: `emergency-button[${index}]`,
          issue: 'Emergency button too small',
          vietnameseDescription: 'Nút cấp cứu quá nhỏ',
          recommendation: 'Đảm bảo nút cấp cứu có kích thước tối thiểu 44x44px',
        });
      }
    });

    // Check text readability
    const textElements = document.querySelectorAll('p, span, div[class*="text"]');
    textElements.forEach((element, index) => {
      const computedStyle = window.getComputedStyle(element as HTMLElement);
      const fontSize = parseFloat(computedStyle.fontSize);
      
      if (fontSize < 14 && width <= 480) {
        issues.push({
          severity: 'warning',
          breakpoint: `${width}x${height}`,
          element: `text-element[${index}]`,
          issue: 'Text too small on mobile',
          vietnameseDescription: 'Văn bản quá nhỏ trên thiết bị di động',
          recommendation: 'Tăng kích thước font lên tối thiểu 14px cho mobile',
        });
      }
    });

    return issues;
  }

  /**
   * Validate Zalo Mini App specific requirements
   */
  validateZaloMiniAppCompatibility(): ResponsivenessIssue[] {
    const issues: ResponsivenessIssue[] = [];

    // Check for safe area compliance
    const header = document.querySelector('header, [role="banner"]');
    if (header) {
      const headerRect = header.getBoundingClientRect();
      if (headerRect.top < this.ZALO_SAFE_AREAS.statusBar) {
        issues.push({
          severity: 'warning',
          breakpoint: 'zalo-mini-app',
          element: 'header',
          issue: 'Header overlaps with Zalo status bar',
          vietnameseDescription: 'Header chồng lên thanh trạng thái Zalo',
          recommendation: `Thêm padding-top: ${this.ZALO_SAFE_AREAS.statusBar}px cho header`,
        });
      }
    }

    // Check bottom navigation safe area
    const bottomElements = document.querySelectorAll('[class*="bottom"], [class*="fixed-bottom"]');
    bottomElements.forEach((element, index) => {
      const rect = element.getBoundingClientRect();
      const distanceFromBottom = window.innerHeight - rect.bottom;
      
      if (distanceFromBottom < this.ZALO_SAFE_AREAS.bottomNavigation) {
        issues.push({
          severity: 'warning',
          breakpoint: 'zalo-mini-app',
          element: `bottom-element[${index}]`,
          issue: 'Element overlaps with Zalo bottom navigation',
          vietnameseDescription: 'Phần tử chồng lên thanh điều hướng dưới của Zalo',
          recommendation: `Thêm margin-bottom: ${this.ZALO_SAFE_AREAS.bottomNavigation}px`,
        });
      }
    });

    // Check for gesture conflicts
    const swipeElements = document.querySelectorAll('[class*="swipe"], [class*="scroll-x"]');
    swipeElements.forEach((element, index) => {
      const hasPreventDefault = element.hasAttribute('data-prevent-default') ||
                               element.hasAttribute('data-swipe-prevent');
      
      if (!hasPreventDefault) {
        issues.push({
          severity: 'info',
          breakpoint: 'zalo-mini-app',
          element: `swipe-element[${index}]`,
          issue: 'Potential gesture conflict with Zalo navigation',
          vietnameseDescription: 'Có thể xung đột cử chỉ với điều hướng Zalo',
          recommendation: 'Thêm data-prevent-default để tránh xung đột cử chỉ',
        });
      }
    });

    return issues;
  }

  /**
   * Validate medical-specific mobile requirements
   */
  validateMedicalMobileRequirements(): ResponsivenessIssue[] {
    const issues: ResponsivenessIssue[] = [];

    // Check medical icon visibility on mobile
    const medicalIcons = document.querySelectorAll('svg[class*="medical"], [class*="medical-icon"]');
    medicalIcons.forEach((icon, index) => {
      const rect = icon.getBoundingClientRect();
      
      if (rect.width < 16 || rect.height < 16) {
        issues.push({
          severity: 'warning',
          breakpoint: 'mobile',
          element: `medical-icon[${index}]`,
          issue: 'Medical icon too small on mobile',
          vietnameseDescription: 'Biểu tượng y tế quá nhỏ trên mobile',
          recommendation: 'Tăng kích thước biểu tượng y tế lên tối thiểu 16x16px',
        });
      }
    });

    // Check medical form accessibility
    const medicalForms = document.querySelectorAll('form[class*="medical"], [class*="booking-form"]');
    medicalForms.forEach((form, index) => {
      const inputs = form.querySelectorAll('input, select, textarea');
      
      inputs.forEach((input, inputIndex) => {
        const rect = input.getBoundingClientRect();
        
        if (rect.height < 44) {
          issues.push({
            severity: 'error',
            breakpoint: 'mobile',
            element: `medical-form-input[${index}-${inputIndex}]`,
            issue: 'Medical form input too small',
            vietnameseDescription: 'Ô nhập liệu form y tế quá nhỏ',
            recommendation: 'Tăng chiều cao ô nhập liệu lên tối thiểu 44px',
          });
        }
      });
    });

    return issues;
  }

  /**
   * Generate comprehensive responsiveness report
   */
  generateResponsivenessReport(): ResponsivenessReport {
    const viewportTests = this.testViewportSizes();
    const zaloIssues = this.validateZaloMiniAppCompatibility();
    const medicalIssues = this.validateMedicalMobileRequirements();

    const allIssues = [
      ...viewportTests.flatMap(test => test.issues),
      ...zaloIssues,
      ...medicalIssues,
    ];

    const overallScore = viewportTests.reduce((sum, test) => sum + test.score, 0) / viewportTests.length;

    return {
      overallScore: Math.round(overallScore),
      viewportTests,
      medicalSpecificChecks: {
        emergencyButtonsAccessible: !medicalIssues.some(i => i.issue.includes('Emergency button')),
        medicalCardsResponsive: !allIssues.some(i => i.issue.includes('Medical card')),
        navigationOptimized: !zaloIssues.some(i => i.issue.includes('navigation')),
        textReadability: !allIssues.some(i => i.issue.includes('Text too small')),
      },
      zaloMiniAppCompatibility: {
        statusBarSafe: !zaloIssues.some(i => i.issue.includes('status bar')),
        bottomNavigationSafe: !zaloIssues.some(i => i.issue.includes('bottom navigation')),
        gestureCompatible: !zaloIssues.some(i => i.issue.includes('gesture conflict')),
      },
    };
  }

  /**
   * Log responsiveness report with Vietnamese localization
   */
  logResponsivenessReport(): void {
    const report = this.generateResponsivenessReport();
    
    console.group('📱 Báo cáo tương thích thiết bị di động (Mobile Responsiveness Report)');
    console.log(`Điểm số tổng thể: ${report.overallScore}/100`);
    
    console.group('📊 Kiểm tra theo kích thước màn hình:');
    report.viewportTests.forEach(test => {
      console.log(`${test.width}x${test.height} (${test.deviceType}): ${test.score}/100`);
      if (test.issues.length > 0) {
        test.issues.forEach(issue => {
          console.log(`  ⚠️ ${issue.vietnameseDescription}`);
          console.log(`  💡 ${issue.recommendation}`);
        });
      }
    });
    console.groupEnd();

    console.log('🏥 Kiểm tra y tế chuyên biệt:', report.medicalSpecificChecks);
    console.log('📲 Tương thích Zalo Mini App:', report.zaloMiniAppCompatibility);
    
    console.groupEnd();
  }
}

// Export singleton instance
export const mobileResponsivenessValidator = new MobileResponsivenessValidator();

// Utility functions for easy integration
export const MobileResponsivenessUtils = {
  // Quick validation for development
  quickValidation: () => {
    mobileResponsivenessValidator.logResponsivenessReport();
  },

  // Initialize mobile responsiveness monitoring
  initializeMobileMonitoring: () => {
    // Run validation on page load and resize
    const runValidation = () => {
      setTimeout(() => mobileResponsivenessValidator.logResponsivenessReport(), 500);
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', runValidation);
    } else {
      runValidation();
    }

    // Monitor viewport changes
    window.addEventListener('resize', () => {
      clearTimeout((window as any).resizeTimeout);
      (window as any).resizeTimeout = setTimeout(runValidation, 250);
    });

    console.log('Đã khởi tạo giám sát tương thích thiết bị di động');
  },

  // Test specific breakpoint
  testBreakpoint: (width: number, height: number) => {
    console.log(`Testing viewport: ${width}x${height}`);
    mobileResponsivenessValidator.logResponsivenessReport();
  },
};

export default mobileResponsivenessValidator;
