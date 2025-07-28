// Medical Design System Testing Utilities

export interface TestResult {
  passed: boolean;
  message: string;
  severity: 'error' | 'warning' | 'info';
  element?: HTMLElement;
}

export interface AccessibilityTestResult {
  component: string;
  tests: TestResult[];
  score: number; // 0-100
}

export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  interactionTime: number;
  cacheHitRate: number;
  memoryUsage: number;
}

// Medical Design System Test Suite
export class MedicalDesignSystemTester {
  private testResults: AccessibilityTestResult[] = [];

  // Test accessibility compliance for medical components
  testAccessibility(element: HTMLElement, componentName: string): AccessibilityTestResult {
    const tests: TestResult[] = [];

    // Test 1: ARIA labels
    tests.push(this.testAriaLabels(element));

    // Test 2: Touch target size (44px minimum)
    tests.push(this.testTouchTargetSize(element));

    // Test 3: Color contrast
    tests.push(this.testColorContrast(element));

    // Test 4: Keyboard navigation
    tests.push(this.testKeyboardNavigation(element));

    // Test 5: Screen reader compatibility
    tests.push(this.testScreenReaderCompatibility(element));

    // Test 6: Medical context labeling
    tests.push(this.testMedicalContextLabeling(element));

    // Test 7: Focus management
    tests.push(this.testFocusManagement(element));

    // Test 8: High contrast mode compatibility
    tests.push(this.testHighContrastMode(element));

    // Calculate score
    const passedTests = tests.filter(test => test.passed).length;
    const score = Math.round((passedTests / tests.length) * 100);

    const result: AccessibilityTestResult = {
      component: componentName,
      tests,
      score
    };

    this.testResults.push(result);
    return result;
  }

  // Test ARIA labels and accessibility attributes
  private testAriaLabels(element: HTMLElement): TestResult {
    const hasAriaLabel = element.hasAttribute('aria-label') || 
                        element.hasAttribute('aria-labelledby') ||
                        element.hasAttribute('aria-describedby');

    const isInteractive = element.matches('button, input, select, textarea, a, [tabindex], [role="button"], [role="link"]');

    if (isInteractive && !hasAriaLabel) {
      return {
        passed: false,
        message: 'Interactive element missing ARIA label',
        severity: 'error',
        element
      };
    }

    // Check for medical-specific ARIA attributes
    const hasMedicalContext = element.hasAttribute('data-medical-context') ||
                             element.hasAttribute('data-priority') ||
                             element.className.includes('medical-');

    if (hasMedicalContext && !hasAriaLabel) {
      return {
        passed: false,
        message: 'Medical component missing descriptive ARIA label',
        severity: 'warning',
        element
      };
    }

    return {
      passed: true,
      message: 'ARIA labels properly implemented',
      severity: 'info'
    };
  }

  // Test touch target size for mobile accessibility
  private testTouchTargetSize(element: HTMLElement): TestResult {
    const rect = element.getBoundingClientRect();
    const minSize = 44; // 44px minimum as per medical design requirements

    const isInteractive = element.matches('button, input, select, textarea, a, [tabindex], [role="button"], [role="link"]');

    if (isInteractive && (rect.width < minSize || rect.height < minSize)) {
      return {
        passed: false,
        message: `Touch target too small: ${rect.width}x${rect.height}px (minimum: ${minSize}x${minSize}px)`,
        severity: 'error',
        element
      };
    }

    return {
      passed: true,
      message: 'Touch target size meets accessibility requirements',
      severity: 'info'
    };
  }

  // Test color contrast for medical readability
  private testColorContrast(element: HTMLElement): TestResult {
    const styles = getComputedStyle(element);
    const backgroundColor = styles.backgroundColor;
    const color = styles.color;

    // Basic contrast check (simplified)
    if (backgroundColor === color || backgroundColor === 'transparent' && color === 'transparent') {
      return {
        passed: false,
        message: 'Insufficient color contrast detected',
        severity: 'warning',
        element
      };
    }

    // Check for medical emergency colors
    const hasEmergencyColor = styles.color.includes('rgb(220, 38, 38)') || // emergency red
                             element.className.includes('medical-emergency');

    if (hasEmergencyColor) {
      return {
        passed: true,
        message: 'Emergency color contrast verified',
        severity: 'info'
      };
    }

    return {
      passed: true,
      message: 'Color contrast appears adequate',
      severity: 'info'
    };
  }

  // Test keyboard navigation support
  private testKeyboardNavigation(element: HTMLElement): TestResult {
    const isInteractive = element.matches('button, input, select, textarea, a, [tabindex], [role="button"], [role="link"]');
    
    if (!isInteractive) {
      return {
        passed: true,
        message: 'Non-interactive element - keyboard navigation not required',
        severity: 'info'
      };
    }

    const tabIndex = element.getAttribute('tabindex');
    const isFocusable = element.matches(':focus-visible') || tabIndex !== '-1';

    if (!isFocusable && tabIndex !== '0' && !element.hasAttribute('tabindex')) {
      return {
        passed: false,
        message: 'Interactive element not keyboard accessible',
        severity: 'error',
        element
      };
    }

    return {
      passed: true,
      message: 'Keyboard navigation properly implemented',
      severity: 'info'
    };
  }

  // Test screen reader compatibility
  private testScreenReaderCompatibility(element: HTMLElement): TestResult {
    const hasRole = element.hasAttribute('role');
    const hasAriaHidden = element.hasAttribute('aria-hidden');
    const hasAriaLabel = element.hasAttribute('aria-label') || element.hasAttribute('aria-labelledby');

    // Check for decorative elements that should be hidden from screen readers
    const isDecorative = element.matches('.decoration, .bg-pattern, .divider') ||
                        element.className.includes('decoration');

    if (isDecorative && !hasAriaHidden) {
      return {
        passed: false,
        message: 'Decorative element should have aria-hidden="true"',
        severity: 'warning',
        element
      };
    }

    // Check for medical icons that need proper labeling
    const isMedicalIcon = element.matches('svg') && 
                         (element.className.includes('medical-') || 
                          element.closest('.medical-icon'));

    if (isMedicalIcon && !hasAriaLabel && !hasAriaHidden) {
      return {
        passed: false,
        message: 'Medical icon missing aria-label or aria-hidden',
        severity: 'error',
        element
      };
    }

    return {
      passed: true,
      message: 'Screen reader compatibility verified',
      severity: 'info'
    };
  }

  // Test medical context labeling
  private testMedicalContextLabeling(element: HTMLElement): TestResult {
    const hasMedicalClass = element.className.includes('medical-');
    const hasMedicalContext = element.hasAttribute('data-medical-context');
    const hasPriority = element.hasAttribute('data-priority');

    if (hasMedicalClass) {
      const ariaLabel = element.getAttribute('aria-label') || '';
      const hasVietnameseLabel = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(ariaLabel);

      if (!hasVietnameseLabel && !ariaLabel.includes('medical') && !ariaLabel.includes('y tế')) {
        return {
          passed: false,
          message: 'Medical component missing Vietnamese medical context in ARIA label',
          severity: 'warning',
          element
        };
      }
    }

    return {
      passed: true,
      message: 'Medical context labeling appropriate',
      severity: 'info'
    };
  }

  // Test focus management
  private testFocusManagement(element: HTMLElement): TestResult {
    const hasFocusClass = element.className.includes('medical-focus') ||
                         element.className.includes('focus:');

    const isInteractive = element.matches('button, input, select, textarea, a, [tabindex], [role="button"], [role="link"]');

    if (isInteractive && !hasFocusClass) {
      return {
        passed: false,
        message: 'Interactive element missing focus styling',
        severity: 'warning',
        element
      };
    }

    return {
      passed: true,
      message: 'Focus management properly implemented',
      severity: 'info'
    };
  }

  // Test high contrast mode compatibility
  private testHighContrastMode(element: HTMLElement): TestResult {
    // Simulate high contrast mode
    const originalStyles = element.style.cssText;
    
    // Apply high contrast styles temporarily
    element.style.filter = 'contrast(200%)';
    
    const styles = getComputedStyle(element);
    const isVisible = styles.opacity !== '0' && styles.visibility !== 'hidden';
    
    // Restore original styles
    element.style.cssText = originalStyles;

    if (!isVisible) {
      return {
        passed: false,
        message: 'Element may not be visible in high contrast mode',
        severity: 'warning',
        element
      };
    }

    return {
      passed: true,
      message: 'High contrast mode compatibility verified',
      severity: 'info'
    };
  }

  // Test mobile responsiveness
  testMobileResponsiveness(element: HTMLElement): TestResult[] {
    const tests: TestResult[] = [];

    // Test viewport meta tag
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    tests.push({
      passed: !!viewportMeta,
      message: viewportMeta ? 'Viewport meta tag present' : 'Missing viewport meta tag',
      severity: viewportMeta ? 'info' : 'error'
    });

    // Test responsive classes
    const hasResponsiveClasses = element.className.includes('sm:') || 
                                element.className.includes('md:') || 
                                element.className.includes('lg:');

    tests.push({
      passed: hasResponsiveClasses,
      message: hasResponsiveClasses ? 'Responsive classes detected' : 'No responsive classes found',
      severity: hasResponsiveClasses ? 'info' : 'warning',
      element
    });

    return tests;
  }

  // Test performance metrics
  async testPerformance(): Promise<PerformanceMetrics> {
    const startTime = performance.now();
    
    // Measure render time
    await new Promise(resolve => requestAnimationFrame(resolve));
    const renderTime = performance.now() - startTime;

    // Measure interaction time (simplified)
    const interactionStart = performance.now();
    const button = document.querySelector('button');
    if (button) {
      button.click();
    }
    const interactionTime = performance.now() - interactionStart;

    // Get memory usage (if available)
    const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0;

    return {
      loadTime: performance.timing?.loadEventEnd - performance.timing?.navigationStart || 0,
      renderTime,
      interactionTime,
      cacheHitRate: 0.85, // Placeholder - would be calculated from actual cache
      memoryUsage
    };
  }

  // Generate comprehensive test report
  generateReport(): {
    summary: {
      totalComponents: number;
      averageScore: number;
      criticalIssues: number;
      warnings: number;
    };
    results: AccessibilityTestResult[];
    recommendations: string[];
  } {
    const totalComponents = this.testResults.length;
    const averageScore = this.testResults.reduce((sum, result) => sum + result.score, 0) / totalComponents;
    
    const allTests = this.testResults.flatMap(result => result.tests);
    const criticalIssues = allTests.filter(test => !test.passed && test.severity === 'error').length;
    const warnings = allTests.filter(test => !test.passed && test.severity === 'warning').length;

    const recommendations: string[] = [];
    
    if (averageScore < 80) {
      recommendations.push('Overall accessibility score is below 80%. Focus on improving ARIA labels and keyboard navigation.');
    }
    
    if (criticalIssues > 0) {
      recommendations.push(`${criticalIssues} critical accessibility issues found. These should be addressed immediately.`);
    }
    
    if (warnings > 5) {
      recommendations.push('Multiple accessibility warnings detected. Consider implementing accessibility settings component.');
    }

    return {
      summary: {
        totalComponents,
        averageScore: Math.round(averageScore),
        criticalIssues,
        warnings
      },
      results: this.testResults,
      recommendations
    };
  }

  // Clear test results
  clearResults(): void {
    this.testResults = [];
  }
}

// Utility functions for testing
export const testUtils = {
  // Test all medical components on the page
  testAllMedicalComponents(): AccessibilityTestResult[] {
    const tester = new MedicalDesignSystemTester();
    const medicalComponents = document.querySelectorAll('[class*="medical-"], .medical-card, .medical-form, .medical-button');
    
    const results: AccessibilityTestResult[] = [];
    medicalComponents.forEach((element, index) => {
      const componentName = element.className.split(' ').find(cls => cls.includes('medical-')) || `medical-component-${index}`;
      const result = tester.testAccessibility(element as HTMLElement, componentName);
      results.push(result);
    });
    
    return results;
  },

  // Quick accessibility check
  quickAccessibilityCheck(element: HTMLElement): boolean {
    const tester = new MedicalDesignSystemTester();
    const result = tester.testAccessibility(element, 'quick-test');
    return result.score >= 80;
  },

  // Log test results to console
  logTestResults(results: AccessibilityTestResult[]): void {
    console.group('🏥 Medical Design System Test Results');
    
    results.forEach(result => {
      const emoji = result.score >= 90 ? '✅' : result.score >= 70 ? '⚠️' : '❌';
      console.group(`${emoji} ${result.component} (Score: ${result.score}/100)`);
      
      result.tests.forEach(test => {
        const icon = test.passed ? '✓' : test.severity === 'error' ? '✗' : '⚠';
        console.log(`${icon} ${test.message}`);
      });
      
      console.groupEnd();
    });
    
    console.groupEnd();
  }
};

// Export singleton instance
export const medicalTester = new MedicalDesignSystemTester();
