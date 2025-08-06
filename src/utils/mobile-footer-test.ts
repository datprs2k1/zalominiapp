/**
 * Mobile Footer Testing Utilities
 * Validates footer functionality across platforms
 */

import { MobileTestingSuite } from './mobile-testing-suite';

// Footer-specific test results
interface FooterTestResult {
  name: string;
  passed: boolean;
  message: string;
  score?: number;
  details?: Record<string, any>;
}

// Mobile Footer Test Suite
export class MobileFooterTestSuite {
  private results: FooterTestResult[] = [];
  private mobileTestingSuite: MobileTestingSuite;

  constructor() {
    this.mobileTestingSuite = new MobileTestingSuite();
  }

  // Run comprehensive footer tests
  public async runFooterTests(): Promise<FooterTestResult[]> {
    this.results = [];

    console.log('🦶 Starting Mobile Footer Test Suite...');

    // Run different test categories
    await this.testFooterPresence();
    await this.testPlatformDetection();
    await this.testTouchTargets();
    await this.testAccessibility();
    await this.testResponsiveDesign();
    await this.testHapticFeedback();
    await this.testKeyboardNavigation();
    await this.testSafeAreaHandling();

    console.log('✅ Mobile Footer Test Suite completed');
    return this.results;
  }

  // Test 1: Footer presence and basic structure
  private async testFooterPresence(): Promise<void> {
    console.log('Testing footer presence...');

    const footer = document.querySelector('footer, [role="contentinfo"]');
    const hasFooter = !!footer;

    if (hasFooter) {
      const navItems = footer!.querySelectorAll('a, button, [role="tab"]');
      const hasNavigation = navItems.length >= 3 && navItems.length <= 5;

      this.results.push({
        name: 'Footer Presence',
        passed: hasNavigation,
        message: hasNavigation
          ? `Footer found with ${navItems.length} navigation items`
          : `Footer found but has ${navItems.length} navigation items (expected 3-5)`,
        details: {
          footerElement: footer!.tagName,
          navigationItemCount: navItems.length,
          hasProperRole: footer!.getAttribute('role') === 'contentinfo',
        },
      });
    } else {
      this.results.push({
        name: 'Footer Presence',
        passed: false,
        message: 'No footer element found',
      });
    }
  }

  // Test 2: Platform detection and appropriate rendering
  private async testPlatformDetection(): Promise<void> {
    console.log('Testing platform detection...');

    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);

    const footer = document.querySelector('footer');
    if (!footer) {
      this.results.push({
        name: 'Platform Detection',
        passed: false,
        message: 'No footer found for platform testing',
      });
      return;
    }

    const hasIOSClasses = footer.classList.contains('ios-footer') || footer.querySelector('.ios-footer');
    const hasAndroidClasses = footer.classList.contains('android-footer') || footer.querySelector('.android-footer');
    const hasUniversalClasses =
      footer.classList.contains('universal-footer') || footer.querySelector('.universal-footer');

    let passed = false;
    let message = '';

    if (isIOS && hasIOSClasses) {
      passed = true;
      message = 'iOS platform correctly detected and styled';
    } else if (isAndroid && hasAndroidClasses) {
      passed = true;
      message = 'Android platform correctly detected and styled';
    } else if (!isIOS && !isAndroid && hasUniversalClasses) {
      passed = true;
      message = 'Universal platform correctly detected and styled';
    } else {
      message = `Platform detection mismatch. iOS: ${isIOS}, Android: ${isAndroid}, iOS classes: ${hasIOSClasses}, Android classes: ${hasAndroidClasses}`;
    }

    this.results.push({
      name: 'Platform Detection',
      passed,
      message,
      details: {
        userAgent: navigator.userAgent,
        detectedIOS: isIOS,
        detectedAndroid: isAndroid,
        hasIOSClasses,
        hasAndroidClasses,
        hasUniversalClasses,
      },
    });
  }

  // Test 3: Touch target compliance
  private async testTouchTargets(): Promise<void> {
    console.log('Testing touch targets...');

    const footer = document.querySelector('footer');
    if (!footer) {
      this.results.push({
        name: 'Touch Targets',
        passed: false,
        message: 'No footer found for touch target testing',
      });
      return;
    }

    const navItems = footer.querySelectorAll('a, button, [role="tab"]');
    let passedItems = 0;
    const minTouchTarget = 44; // 44px minimum

    navItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const meetsMinimum = rect.width >= minTouchTarget && rect.height >= minTouchTarget;
      if (meetsMinimum) passedItems++;
    });

    const score = navItems.length > 0 ? (passedItems / navItems.length) * 100 : 0;
    const passed = score >= 100;

    this.results.push({
      name: 'Touch Targets',
      passed,
      message: `${passedItems}/${navItems.length} items meet minimum touch target size (${minTouchTarget}px)`,
      score: Math.round(score),
      details: {
        totalItems: navItems.length,
        passedItems,
        minimumSize: minTouchTarget,
      },
    });
  }

  // Test 4: Accessibility compliance
  private async testAccessibility(): Promise<void> {
    console.log('Testing accessibility...');

    const footer = document.querySelector('footer');
    if (!footer) {
      this.results.push({
        name: 'Accessibility',
        passed: false,
        message: 'No footer found for accessibility testing',
      });
      return;
    }

    let passedChecks = 0;
    const totalChecks = 6;

    // Check 1: Proper ARIA role
    if (footer.getAttribute('role') === 'contentinfo') passedChecks++;

    // Check 2: Navigation has proper role
    const nav = footer.querySelector('nav');
    if (nav && nav.getAttribute('role') === 'navigation') passedChecks++;

    // Check 3: Items have proper ARIA labels
    const navItems = footer.querySelectorAll('a, button, [role="tab"]');
    const hasProperLabels = Array.from(navItems).every(
      (item) => item.getAttribute('aria-label') || item.getAttribute('aria-labelledby') || item.textContent?.trim()
    );
    if (hasProperLabels) passedChecks++;

    // Check 4: Keyboard navigation support
    const hasTabIndex = Array.from(navItems).some((item) => item.getAttribute('tabindex') !== null);
    if (hasTabIndex) passedChecks++;

    // Check 5: Focus indicators
    const hasFocusStyles = Array.from(navItems).some((item) => {
      const styles = window.getComputedStyle(item, ':focus-visible');
      return styles.outline !== 'none' || styles.boxShadow !== 'none';
    });
    if (hasFocusStyles) passedChecks++;

    // Check 6: Screen reader instructions
    const hasInstructions = footer.querySelector('[aria-describedby], .sr-only');
    if (hasInstructions) passedChecks++;

    const score = (passedChecks / totalChecks) * 100;
    const passed = score >= 80;

    this.results.push({
      name: 'Accessibility',
      passed,
      message: `${passedChecks}/${totalChecks} accessibility checks passed`,
      score: Math.round(score),
      details: {
        hasProperRole: footer.getAttribute('role') === 'contentinfo',
        hasNavigationRole: !!nav?.getAttribute('role'),
        hasProperLabels,
        hasTabIndex,
        hasFocusStyles,
        hasInstructions: !!hasInstructions,
      },
    });
  }

  // Test 5: Responsive design
  private async testResponsiveDesign(): Promise<void> {
    console.log('Testing responsive design...');

    const footer = document.querySelector('footer');
    if (!footer) {
      this.results.push({
        name: 'Responsive Design',
        passed: false,
        message: 'No footer found for responsive testing',
      });
      return;
    }

    const footerStyles = window.getComputedStyle(footer);
    const isFixed = footerStyles.position === 'fixed';
    const isSticky = footerStyles.position === 'sticky';
    const hasProperZIndex = parseInt(footerStyles.zIndex) >= 1000;

    const passed = (isFixed || isSticky) && hasProperZIndex;

    this.results.push({
      name: 'Responsive Design',
      passed,
      message: passed
        ? 'Footer has proper positioning and z-index'
        : `Footer positioning issues: position=${footerStyles.position}, z-index=${footerStyles.zIndex}`,
      details: {
        position: footerStyles.position,
        zIndex: footerStyles.zIndex,
        isFixed,
        isSticky,
        hasProperZIndex,
      },
    });
  }

  // Test 6: Haptic feedback (if supported)
  private async testHapticFeedback(): Promise<void> {
    console.log('Testing haptic feedback...');

    const isSupported = 'vibrate' in navigator;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    this.results.push({
      name: 'Haptic Feedback',
      passed: isSupported || !isMobile,
      message: isSupported
        ? 'Haptic feedback is supported'
        : isMobile
          ? 'Haptic feedback not supported on this mobile device'
          : 'Haptic feedback not applicable for desktop',
      details: {
        isSupported,
        isMobile,
        userAgent: navigator.userAgent,
      },
    });
  }

  // Test 7: Keyboard navigation
  private async testKeyboardNavigation(): Promise<void> {
    console.log('Testing keyboard navigation...');

    const footer = document.querySelector('footer');
    if (!footer) {
      this.results.push({
        name: 'Keyboard Navigation',
        passed: false,
        message: 'No footer found for keyboard testing',
      });
      return;
    }

    const navItems = footer.querySelectorAll('a, button, [role="tab"]');
    const hasKeyboardSupport = Array.from(navItems).some((item) => {
      const tabIndex = item.getAttribute('tabindex');
      return tabIndex === '0' || tabIndex === '-1' || item.tagName === 'A' || item.tagName === 'BUTTON';
    });

    this.results.push({
      name: 'Keyboard Navigation',
      passed: hasKeyboardSupport,
      message: hasKeyboardSupport ? 'Keyboard navigation is supported' : 'No keyboard navigation support detected',
      details: {
        totalItems: navItems.length,
        hasKeyboardSupport,
      },
    });
  }

  // Test 8: Safe area handling
  private async testSafeAreaHandling(): Promise<void> {
    console.log('Testing safe area handling...');

    const footer = document.querySelector('footer');
    if (!footer) {
      this.results.push({
        name: 'Safe Area Handling',
        passed: false,
        message: 'No footer found for safe area testing',
      });
      return;
    }

    const footerStyles = window.getComputedStyle(footer);
    const hasSafeAreaPadding =
      footerStyles.paddingBottom.includes('env(safe-area-inset-bottom)') ||
      footerStyles.paddingBottom.includes('max(') ||
      footer.classList.contains('pb-safe');

    const supportsSafeArea = CSS.supports('padding', 'env(safe-area-inset-bottom)');

    this.results.push({
      name: 'Safe Area Handling',
      passed: hasSafeAreaPadding || !supportsSafeArea,
      message: hasSafeAreaPadding
        ? 'Safe area handling is implemented'
        : supportsSafeArea
          ? 'Safe area support available but not implemented'
          : 'Safe area not supported by browser',
      details: {
        hasSafeAreaPadding,
        supportsSafeArea,
        paddingBottom: footerStyles.paddingBottom,
      },
    });
  }

  // Generate test report
  public generateReport(): string {
    const totalTests = this.results.length;
    const passedTests = this.results.filter((r) => r.passed).length;
    const overallScore = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

    let report = `\n📊 Mobile Footer Test Report\n`;
    report += `${'='.repeat(50)}\n`;
    report += `Overall Score: ${Math.round(overallScore)}% (${passedTests}/${totalTests} tests passed)\n\n`;

    this.results.forEach((result, index) => {
      const status = result.passed ? '✅' : '❌';
      const score = result.score ? ` (${result.score}%)` : '';
      report += `${index + 1}. ${status} ${result.name}${score}\n`;
      report += `   ${result.message}\n\n`;
    });

    return report;
  }
}

// Export singleton instance
export const mobileFooterTestSuite = new MobileFooterTestSuite();
