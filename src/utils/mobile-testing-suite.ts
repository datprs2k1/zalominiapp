/**
 * Mobile Testing Suite
 * Comprehensive testing utilities for mobile UI/UX validation
 */

// Types
interface TestResult {
  name: string;
  passed: boolean;
  message: string;
  score?: number;
  details?: any;
}

interface DeviceTestConfig {
  userAgent: string;
  viewport: { width: number; height: number };
  pixelRatio: number;
  platform: 'ios' | 'android' | 'web';
}

interface AccessibilityTestResult extends TestResult {
  wcagLevel: 'A' | 'AA' | 'AAA';
  violations: Array<{
    element: string;
    issue: string;
    severity: 'critical' | 'serious' | 'moderate' | 'minor';
  }>;
}

// Device configurations for testing
const DEVICE_CONFIGS: Record<string, DeviceTestConfig> = {
  'iPhone 14 Pro': {
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
    viewport: { width: 393, height: 852 },
    pixelRatio: 3,
    platform: 'ios',
  },
  'iPhone SE': {
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
    viewport: { width: 375, height: 667 },
    pixelRatio: 2,
    platform: 'ios',
  },
  'Samsung Galaxy S23': {
    userAgent:
      'Mozilla/5.0 (Linux; Android 13; SM-S911B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36',
    viewport: { width: 360, height: 780 },
    pixelRatio: 3,
    platform: 'android',
  },
  'Google Pixel 7': {
    userAgent:
      'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36',
    viewport: { width: 412, height: 915 },
    pixelRatio: 2.625,
    platform: 'android',
  },
};

// Mobile Testing Suite Class
export class MobileTestingSuite {
  private results: TestResult[] = [];
  private currentDevice: string = 'default';

  // Run all tests
  public async runAllTests(): Promise<TestResult[]> {
    this.results = [];

    console.log('🧪 Starting Mobile Testing Suite...');

    // Run different test categories
    await this.runTouchTargetTests();
    await this.runResponsiveDesignTests();
    await this.runPerformanceTests();
    await this.runAccessibilityTests();
    await this.runPlatformSpecificTests();
    await this.runGestureTests();
    await this.runFooterSpecificTests(); // New footer-specific tests

    console.log('✅ Mobile Testing Suite completed');
    return this.results;
  }

  // Footer-specific UX tests
  private async runFooterSpecificTests(): Promise<void> {
    console.log('🦶 Testing footer-specific UX...');

    const footer = document.querySelector('footer, [role="contentinfo"]');
    if (!footer) {
      this.results.push({
        name: 'Footer Presence',
        passed: false,
        message: 'No footer element found',
      });
      return;
    }

    let passedTests = 0;
    const totalTests = 8;

    // Test 1: Footer positioning
    const footerRect = footer.getBoundingClientRect();
    const isSticky =
      window.getComputedStyle(footer).position === 'sticky' || window.getComputedStyle(footer).position === 'fixed';
    if (isSticky) passedTests++;

    // Test 2: Safe area handling
    const footerStyle = window.getComputedStyle(footer);
    const hasSafeAreaPadding =
      footerStyle.paddingBottom.includes('env(safe-area-inset-bottom)') ||
      footerStyle.paddingBottom.includes('max(') ||
      footer.classList.contains('pb-safe');
    if (hasSafeAreaPadding) passedTests++;

    // Test 3: Navigation items count (should be 3-5 for optimal UX)
    const navItems = footer.querySelectorAll('a, button, [role="tab"]');
    const optimalItemCount = navItems.length >= 3 && navItems.length <= 5;
    if (optimalItemCount) passedTests++;

    // Test 4: Touch target spacing
    let properSpacing = true;
    navItems.forEach((item, index) => {
      if (index > 0) {
        const prevItem = navItems[index - 1];
        const itemRect = item.getBoundingClientRect();
        const prevRect = prevItem.getBoundingClientRect();
        const spacing = itemRect.left - prevRect.right;
        if (spacing < 8) properSpacing = false; // Minimum 8px spacing
      }
    });
    if (properSpacing) passedTests++;

    // Test 5: Visual feedback on interaction
    const hasVisualFeedback = Array.from(navItems).some((item) => {
      const style = window.getComputedStyle(item);
      return (
        style.transition.includes('transform') ||
        style.transition.includes('background') ||
        item.classList.toString().includes('hover:') ||
        item.classList.toString().includes('active:')
      );
    });
    if (hasVisualFeedback) passedTests++;

    // Test 6: Platform-specific styling
    const hasPlatformClasses =
      footer.classList.toString().includes('platform-') ||
      footer.classList.toString().includes('ios') ||
      footer.classList.toString().includes('android');
    if (hasPlatformClasses) passedTests++;

    // Test 7: Accessibility labels
    const hasProperLabels = Array.from(navItems).every(
      (item) => item.getAttribute('aria-label') || item.getAttribute('aria-labelledby') || item.textContent?.trim()
    );
    if (hasProperLabels) passedTests++;

    // Test 8: Badge/notification support
    const hasBadgeSupport = footer.querySelector('[data-badge], .badge, [aria-label*="notification"]');
    if (hasBadgeSupport) passedTests++;

    const score = (passedTests / totalTests) * 100;

    this.results.push({
      name: 'Footer UX Quality',
      passed: score >= 75,
      message: `Footer UX score: ${Math.round(score)}% (${passedTests}/${totalTests} tests passed)`,
      score: Math.round(score),
      details: {
        isSticky,
        hasSafeAreaPadding,
        navigationItemCount: navItems.length,
        optimalItemCount,
        properSpacing,
        hasVisualFeedback,
        hasPlatformClasses,
        hasProperLabels,
        hasBadgeSupport,
      },
    });
  }

  // Test touch targets
  private async runTouchTargetTests(): Promise<void> {
    console.log('🎯 Testing touch targets...');

    const touchableElements = document.querySelectorAll('button, a, [role="button"], [tabindex]');
    let passedCount = 0;
    const minTouchTarget = 44; // iOS minimum

    touchableElements.forEach((element, index) => {
      const rect = element.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      const passed = width >= minTouchTarget && height >= minTouchTarget;
      if (passed) passedCount++;

      if (!passed) {
        console.warn(`Touch target too small: ${element.tagName} (${width}x${height}px)`);
      }
    });

    const score = (passedCount / touchableElements.length) * 100;

    this.results.push({
      name: 'Touch Target Size',
      passed: score >= 90,
      message: `${passedCount}/${touchableElements.length} elements meet minimum touch target size`,
      score: Math.round(score),
      details: {
        minSize: minTouchTarget,
        totalElements: touchableElements.length,
        passedElements: passedCount,
      },
    });
  }

  // Test responsive design
  private async runResponsiveDesignTests(): Promise<void> {
    console.log('📱 Testing responsive design...');

    const breakpoints = [320, 375, 414, 768, 1024, 1440];
    let passedBreakpoints = 0;

    for (const width of breakpoints) {
      // Simulate viewport change
      const originalWidth = window.innerWidth;
      Object.defineProperty(window, 'innerWidth', { value: width, configurable: true });

      // Check for horizontal scrolling
      const hasHorizontalScroll = document.body.scrollWidth > width;

      // Check for layout breaks
      const hasLayoutBreaks = this.checkLayoutBreaks();

      const passed = !hasHorizontalScroll && !hasLayoutBreaks;
      if (passed) passedBreakpoints++;

      // Restore original width
      Object.defineProperty(window, 'innerWidth', { value: originalWidth, configurable: true });
    }

    const score = (passedBreakpoints / breakpoints.length) * 100;

    this.results.push({
      name: 'Responsive Design',
      passed: score >= 90,
      message: `${passedBreakpoints}/${breakpoints.length} breakpoints pass responsive tests`,
      score: Math.round(score),
      details: {
        breakpoints,
        passedBreakpoints,
      },
    });
  }

  // Check for layout breaks
  private checkLayoutBreaks(): boolean {
    const elements = document.querySelectorAll('*');

    for (const element of elements) {
      const rect = element.getBoundingClientRect();

      // Check if element overflows viewport
      if (rect.right > window.innerWidth + 10) {
        // 10px tolerance
        return true;
      }

      // Check for negative margins causing layout issues
      const styles = getComputedStyle(element);
      const marginLeft = parseInt(styles.marginLeft);
      const marginRight = parseInt(styles.marginRight);

      if (marginLeft < -50 || marginRight < -50) {
        return true;
      }
    }

    return false;
  }

  // Test performance
  private async runPerformanceTests(): Promise<void> {
    console.log('⚡ Testing performance...');

    const performanceEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    const navigationEntry = performanceEntries[0];

    if (!navigationEntry) {
      this.results.push({
        name: 'Performance',
        passed: false,
        message: 'Performance data not available',
      });
      return;
    }

    const loadTime = navigationEntry.loadEventEnd - navigationEntry.navigationStart;
    const domContentLoaded = navigationEntry.domContentLoadedEventEnd - navigationEntry.navigationStart;
    const firstPaint = performance.getEntriesByName('first-paint')[0]?.startTime || 0;

    // Performance thresholds (in milliseconds)
    const thresholds = {
      loadTime: 3000,
      domContentLoaded: 1500,
      firstPaint: 1000,
    };

    const tests = [
      { name: 'Load Time', value: loadTime, threshold: thresholds.loadTime },
      { name: 'DOM Content Loaded', value: domContentLoaded, threshold: thresholds.domContentLoaded },
      { name: 'First Paint', value: firstPaint, threshold: thresholds.firstPaint },
    ];

    const passedTests = tests.filter((test) => test.value <= test.threshold).length;
    const score = (passedTests / tests.length) * 100;

    this.results.push({
      name: 'Performance',
      passed: score >= 80,
      message: `${passedTests}/${tests.length} performance metrics meet thresholds`,
      score: Math.round(score),
      details: {
        loadTime: Math.round(loadTime),
        domContentLoaded: Math.round(domContentLoaded),
        firstPaint: Math.round(firstPaint),
        thresholds,
      },
    });
  }

  // Test accessibility
  private async runAccessibilityTests(): Promise<void> {
    console.log('♿ Testing accessibility...');

    const violations: AccessibilityTestResult['violations'] = [];
    let score = 100;

    // Check for missing alt text
    const images = document.querySelectorAll('img');
    images.forEach((img, index) => {
      if (!img.alt && !img.getAttribute('aria-label')) {
        violations.push({
          element: `img[${index}]`,
          issue: 'Missing alt text',
          severity: 'serious',
        });
        score -= 5;
      }
    });

    // Check for missing form labels
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach((input, index) => {
      const hasLabel =
        input.getAttribute('aria-label') ||
        input.getAttribute('aria-labelledby') ||
        document.querySelector(`label[for="${input.id}"]`);

      if (!hasLabel) {
        violations.push({
          element: `${input.tagName.toLowerCase()}[${index}]`,
          issue: 'Missing form label',
          severity: 'serious',
        });
        score -= 10;
      }
    });

    // Check color contrast (simplified)
    const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6');
    let contrastIssues = 0;

    textElements.forEach((element) => {
      const styles = getComputedStyle(element);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;

      // Simplified contrast check (would need proper color library in production)
      if (this.hasLowContrast(color, backgroundColor)) {
        contrastIssues++;
      }
    });

    if (contrastIssues > 0) {
      violations.push({
        element: 'multiple',
        issue: `${contrastIssues} elements with low color contrast`,
        severity: 'moderate',
      });
      score -= contrastIssues * 2;
    }

    score = Math.max(0, score);

    this.results.push({
      name: 'Accessibility',
      passed: score >= 80,
      message: `${violations.length} accessibility violations found`,
      score: Math.round(score),
      details: {
        violations,
        wcagLevel: score >= 90 ? 'AA' : score >= 70 ? 'A' : 'Below A',
      },
    } as AccessibilityTestResult);
  }

  // Simplified contrast check
  private hasLowContrast(color: string, backgroundColor: string): boolean {
    // This is a very simplified check
    // In production, use a proper color contrast library
    return color === backgroundColor || (color.includes('rgb(128') && backgroundColor.includes('rgb(128'));
  }

  // Test platform-specific features
  private async runPlatformSpecificTests(): Promise<void> {
    console.log('🔧 Testing platform-specific features...');

    const platform = this.detectPlatform();
    let passedTests = 0;
    const totalTests = 4;

    // Test safe area support
    const hasSafeAreaSupport =
      getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-top') !== '';
    if (hasSafeAreaSupport) passedTests++;

    // Test touch action support
    const hasTouchActionSupport = CSS.supports('touch-action', 'manipulation');
    if (hasTouchActionSupport) passedTests++;

    // Test viewport meta tag
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    const hasProperViewport = viewportMeta && viewportMeta.getAttribute('content')?.includes('viewport-fit=cover');
    if (hasProperViewport) passedTests++;

    // Test platform-specific CSS classes
    const hasPlatformClasses = document.body.classList.contains(`platform-${platform}`);
    if (hasPlatformClasses) passedTests++;

    const score = (passedTests / totalTests) * 100;

    this.results.push({
      name: 'Platform-Specific Features',
      passed: score >= 75,
      message: `${passedTests}/${totalTests} platform features implemented`,
      score: Math.round(score),
      details: {
        platform,
        safeAreaSupport: hasSafeAreaSupport,
        touchActionSupport: hasTouchActionSupport,
        properViewport: hasProperViewport,
        platformClasses: hasPlatformClasses,
      },
    });
  }

  // Test gesture support
  private async runGestureTests(): Promise<void> {
    console.log('👆 Testing gesture support...');

    let passedTests = 0;
    const totalTests = 3;

    // Test touch event support
    const hasTouchEvents = 'ontouchstart' in window;
    if (hasTouchEvents) passedTests++;

    // Test pointer events support
    const hasPointerEvents = 'onpointerdown' in window;
    if (hasPointerEvents) passedTests++;

    // Test gesture elements
    const gestureElements = document.querySelectorAll('[data-gesture]');
    const hasGestureElements = gestureElements.length > 0;
    if (hasGestureElements) passedTests++;

    const score = (passedTests / totalTests) * 100;

    this.results.push({
      name: 'Gesture Support',
      passed: score >= 66,
      message: `${passedTests}/${totalTests} gesture features available`,
      score: Math.round(score),
      details: {
        touchEvents: hasTouchEvents,
        pointerEvents: hasPointerEvents,
        gestureElements: gestureElements.length,
      },
    });
  }

  // Detect platform
  private detectPlatform(): 'ios' | 'android' | 'web' {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) return 'ios';
    if (/android/.test(userAgent)) return 'android';
    return 'web';
  }

  // Generate test report
  public generateReport(): string {
    const totalTests = this.results.length;
    const passedTests = this.results.filter((result) => result.passed).length;
    const overallScore = this.results.reduce((sum, result) => sum + (result.score || 0), 0) / totalTests;

    let report = `
# Mobile UI/UX Test Report

## Summary
- **Overall Score**: ${Math.round(overallScore)}%
- **Tests Passed**: ${passedTests}/${totalTests}
- **Status**: ${overallScore >= 80 ? '✅ PASS' : '❌ FAIL'}

## Test Results
`;

    this.results.forEach((result) => {
      const status = result.passed ? '✅' : '❌';
      const score = result.score ? ` (${result.score}%)` : '';
      report += `\n### ${status} ${result.name}${score}\n${result.message}\n`;

      if (result.details) {
        report += `\n**Details**: ${JSON.stringify(result.details, null, 2)}\n`;
      }
    });

    return report;
  }

  // Get results
  public getResults(): TestResult[] {
    return [...this.results];
  }
}

// Create global instance
export const mobileTestingSuite = new MobileTestingSuite();

// React hook for testing
export const useMobileTesting = () => {
  return {
    runTests: mobileTestingSuite.runAllTests.bind(mobileTestingSuite),
    generateReport: mobileTestingSuite.generateReport.bind(mobileTestingSuite),
    getResults: mobileTestingSuite.getResults.bind(mobileTestingSuite),
  };
};
