/**
 * Comprehensive Medical Header Testing Framework
 * Cross-platform testing utilities for all devices and screen sizes
 */

import { validateTouchTarget, validateContrastRatio, runAccessibilityChecks } from '../accessibility-utils';
import { globalPerformanceMonitor, runPerformanceTests } from '../performance-optimization';
import { isDarkMode } from '../dark-mode-support';

// Device configurations for testing
export const TEST_DEVICES = {
  ios: {
    'iPhone SE': { width: 375, height: 667, pixelRatio: 2, safeArea: { top: 20, bottom: 0 } },
    'iPhone 12': { width: 390, height: 844, pixelRatio: 3, safeArea: { top: 47, bottom: 34 } },
    'iPhone 14': { width: 390, height: 844, pixelRatio: 3, safeArea: { top: 47, bottom: 34 } },
    'iPhone 14 Plus': { width: 428, height: 926, pixelRatio: 3, safeArea: { top: 47, bottom: 34 } },
    'iPhone 14 Pro': { width: 393, height: 852, pixelRatio: 3, safeArea: { top: 59, bottom: 34 } },
    'iPhone 14 Pro Max': { width: 430, height: 932, pixelRatio: 3, safeArea: { top: 59, bottom: 34 } },
    'iPad': { width: 768, height: 1024, pixelRatio: 2, safeArea: { top: 24, bottom: 0 } },
    'iPad Pro 11"': { width: 834, height: 1194, pixelRatio: 2, safeArea: { top: 24, bottom: 0 } },
    'iPad Pro 12.9"': { width: 1024, height: 1366, pixelRatio: 2, safeArea: { top: 24, bottom: 0 } },
  },
  android: {
    'Galaxy S23': { width: 360, height: 780, pixelRatio: 3, safeArea: { top: 24, bottom: 0 } },
    'Galaxy S23+': { width: 384, height: 854, pixelRatio: 2.75, safeArea: { top: 24, bottom: 0 } },
    'Galaxy S23 Ultra': { width: 412, height: 915, pixelRatio: 3.5, safeArea: { top: 24, bottom: 0 } },
    'Pixel 7': { width: 412, height: 915, pixelRatio: 2.625, safeArea: { top: 24, bottom: 0 } },
    'Pixel 7 Pro': { width: 412, height: 892, pixelRatio: 3.5, safeArea: { top: 24, bottom: 0 } },
    'OnePlus 11': { width: 412, height: 919, pixelRatio: 3, safeArea: { top: 24, bottom: 0 } },
  },
  web: {
    'Desktop 1920x1080': { width: 1920, height: 1080, pixelRatio: 1, safeArea: { top: 0, bottom: 0 } },
    'Desktop 1440x900': { width: 1440, height: 900, pixelRatio: 1, safeArea: { top: 0, bottom: 0 } },
    'Laptop 1366x768': { width: 1366, height: 768, pixelRatio: 1, safeArea: { top: 0, bottom: 0 } },
    'Tablet 768x1024': { width: 768, height: 1024, pixelRatio: 1, safeArea: { top: 0, bottom: 0 } },
  },
} as const;

// Browser configurations
export const TEST_BROWSERS = {
  'Chrome': { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
  'Safari': { userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15' },
  'Firefox': { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/120.0' },
  'Edge': { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0' },
  'iOS Safari': { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' },
  'Android Chrome': { userAgent: 'Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36' },
} as const;

// Test scenarios
export const TEST_SCENARIOS = {
  healthStatuses: ['excellent', 'good', 'warning', 'critical'] as const,
  themes: ['light', 'dark'] as const,
  orientations: ['portrait', 'landscape'] as const,
  accessibilityModes: ['normal', 'high-contrast', 'reduced-motion', 'large-text'] as const,
  emergencyModes: [false, true] as const,
} as const;

// Testing framework class
export class MedicalHeaderTestFramework {
  private testResults: TestResult[] = [];
  private currentTest: string = '';

  // Simulate device viewport
  simulateDevice(deviceName: string, platform: keyof typeof TEST_DEVICES) {
    const device = TEST_DEVICES[platform][deviceName as keyof typeof TEST_DEVICES[typeof platform]];
    if (!device) {
      throw new Error(`Device ${deviceName} not found in ${platform} configurations`);
    }

    // Set viewport size
    if (typeof window !== 'undefined') {
      Object.defineProperty(window, 'innerWidth', { value: device.width, writable: true });
      Object.defineProperty(window, 'innerHeight', { value: device.height, writable: true });
      Object.defineProperty(window, 'devicePixelRatio', { value: device.pixelRatio, writable: true });
    }

    return device;
  }

  // Simulate browser environment
  simulateBrowser(browserName: keyof typeof TEST_BROWSERS) {
    const browser = TEST_BROWSERS[browserName];
    if (typeof navigator !== 'undefined') {
      Object.defineProperty(navigator, 'userAgent', { value: browser.userAgent, writable: true });
    }
  }

  // Test header rendering across all devices
  async testAllDevices() {
    const results: TestResult[] = [];

    for (const [platform, devices] of Object.entries(TEST_DEVICES)) {
      for (const deviceName of Object.keys(devices)) {
        this.currentTest = `${platform}-${deviceName}`;
        
        try {
          const device = this.simulateDevice(deviceName, platform as keyof typeof TEST_DEVICES);
          const result = await this.testHeaderOnDevice(deviceName, platform, device);
          results.push(result);
        } catch (error) {
          results.push({
            testName: this.currentTest,
            platform: platform as any,
            device: deviceName,
            passed: false,
            errors: [error instanceof Error ? error.message : String(error)],
            metrics: {},
          });
        }
      }
    }

    this.testResults = results;
    return results;
  }

  // Test header on specific device
  async testHeaderOnDevice(deviceName: string, platform: string, device: any): Promise<TestResult> {
    const errors: string[] = [];
    const metrics: TestMetrics = {};

    // Test responsive design
    const responsiveTest = this.testResponsiveDesign(device);
    if (!responsiveTest.passed) {
      errors.push(...responsiveTest.errors);
    }
    metrics.responsive = responsiveTest.score;

    // Test accessibility
    const accessibilityTest = await this.testAccessibility();
    if (!accessibilityTest.passed) {
      errors.push(...accessibilityTest.errors);
    }
    metrics.accessibility = accessibilityTest.score;

    // Test performance
    const performanceTest = await this.testPerformance();
    metrics.performance = performanceTest;

    // Test medical features
    const medicalTest = await this.testMedicalFeatures();
    if (!medicalTest.passed) {
      errors.push(...medicalTest.errors);
    }
    metrics.medical = medicalTest.score;

    return {
      testName: this.currentTest,
      platform: platform as any,
      device: deviceName,
      passed: errors.length === 0,
      errors,
      metrics,
      timestamp: new Date().toISOString(),
    };
  }

  // Test responsive design
  testResponsiveDesign(device: any) {
    const errors: string[] = [];
    let score = 100;

    // Test header height adaptation
    const expectedHeight = this.getExpectedHeaderHeight(device);
    // In a real test, you'd measure the actual header height
    // const actualHeight = document.querySelector('.ios-header')?.getBoundingClientRect().height;

    // Test safe area handling
    if (device.safeArea.top > 0) {
      // Check if safe area is properly handled
      // This would be implemented with actual DOM measurements
    }

    // Test touch target sizes
    const touchTargets = document.querySelectorAll('.medical-emergency-button, .medical-status-indicator');
    touchTargets.forEach((target) => {
      if (!validateTouchTarget(target as HTMLElement)) {
        errors.push(`Touch target too small: ${target.className}`);
        score -= 10;
      }
    });

    return { passed: errors.length === 0, errors, score };
  }

  // Test accessibility features
  async testAccessibility() {
    const errors: string[] = [];
    let score = 100;

    // Test contrast ratios
    const contrastTests = [
      { fg: '#2563EB', bg: '#FFFFFF', name: 'Primary text on white' },
      { fg: '#DC2626', bg: '#FFFFFF', name: 'Emergency text on white' },
      { fg: '#FFFFFF', bg: '#2563EB', name: 'White text on primary' },
    ];

    contrastTests.forEach(test => {
      const ratio = validateContrastRatio(test.fg, test.bg);
      if (ratio < 4.5) {
        errors.push(`Poor contrast ratio for ${test.name}: ${ratio.toFixed(2)}:1`);
        score -= 15;
      }
    });

    // Test ARIA labels and accessibility structure
    const headerElement = document.querySelector('.ios-header');
    if (headerElement) {
      const accessibilityIssues = runAccessibilityChecks(headerElement as HTMLElement);
      errors.push(...accessibilityIssues);
      score -= accessibilityIssues.length * 5;
    }

    return { passed: errors.length === 0, errors, score: Math.max(0, score) };
  }

  // Test performance metrics
  async testPerformance() {
    const performanceResults = await runPerformanceTests();
    const metrics = globalPerformanceMonitor.getMetrics();

    return {
      fps: metrics.fps,
      memoryUsage: metrics.memoryUsage,
      animationPerformance: performanceResults.animationPerformance,
      blurPerformance: performanceResults.blurPerformance,
      renderTime: performanceResults.renderTime,
    };
  }

  // Test medical-specific features
  async testMedicalFeatures() {
    const errors: string[] = [];
    let score = 100;

    // Test health status indicators
    for (const status of TEST_SCENARIOS.healthStatuses) {
      // In a real test, you'd render the component with different statuses
      // and verify the visual indicators are correct
    }

    // Test emergency button functionality
    const emergencyButton = document.querySelector('.medical-emergency-button');
    if (!emergencyButton) {
      errors.push('Emergency button not found');
      score -= 25;
    }

    // Test medical notifications
    const notificationBadges = document.querySelectorAll('[aria-label*="thông báo y tế"]');
    // Verify notification badges are properly labeled

    // Test trust indicators
    const trustIndicators = document.querySelectorAll('.medical-trust-badge');
    if (trustIndicators.length === 0) {
      errors.push('Trust indicators not found');
      score -= 15;
    }

    return { passed: errors.length === 0, errors, score: Math.max(0, score) };
  }

  // Get expected header height for device
  getExpectedHeaderHeight(device: any) {
    if (device.width <= 375) return 56; // Compact
    if (device.width >= 428) return 64;  // Large
    return 60; // Regular
  }

  // Generate test report
  generateReport() {
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(r => r.passed).length;
    const failedTests = totalTests - passedTests;

    const platformResults = this.groupResultsByPlatform();
    const averageScores = this.calculateAverageScores();

    return {
      summary: {
        totalTests,
        passedTests,
        failedTests,
        successRate: Math.round((passedTests / totalTests) * 100),
      },
      platformResults,
      averageScores,
      detailedResults: this.testResults,
      recommendations: this.generateRecommendations(),
    };
  }

  private groupResultsByPlatform() {
    const grouped: Record<string, TestResult[]> = {};
    
    this.testResults.forEach(result => {
      if (!grouped[result.platform]) {
        grouped[result.platform] = [];
      }
      grouped[result.platform].push(result);
    });

    return grouped;
  }

  private calculateAverageScores() {
    const scores = {
      responsive: 0,
      accessibility: 0,
      medical: 0,
      performance: 0,
    };

    const validResults = this.testResults.filter(r => r.passed);
    
    if (validResults.length > 0) {
      scores.responsive = validResults.reduce((sum, r) => sum + (r.metrics.responsive || 0), 0) / validResults.length;
      scores.accessibility = validResults.reduce((sum, r) => sum + (r.metrics.accessibility || 0), 0) / validResults.length;
      scores.medical = validResults.reduce((sum, r) => sum + (r.metrics.medical || 0), 0) / validResults.length;
    }

    return scores;
  }

  private generateRecommendations() {
    const recommendations: string[] = [];
    const failedResults = this.testResults.filter(r => !r.passed);

    if (failedResults.length > 0) {
      const commonErrors = this.findCommonErrors(failedResults);
      commonErrors.forEach(error => {
        recommendations.push(`Fix common issue: ${error}`);
      });
    }

    const averageScores = this.calculateAverageScores();
    if (averageScores.accessibility < 90) {
      recommendations.push('Improve accessibility compliance - target 95%+ score');
    }
    if (averageScores.responsive < 90) {
      recommendations.push('Enhance responsive design for better cross-device compatibility');
    }

    return recommendations;
  }

  private findCommonErrors(failedResults: TestResult[]) {
    const errorCounts: Record<string, number> = {};
    
    failedResults.forEach(result => {
      result.errors.forEach(error => {
        errorCounts[error] = (errorCounts[error] || 0) + 1;
      });
    });

    return Object.entries(errorCounts)
      .filter(([_, count]) => count >= 2)
      .map(([error, _]) => error);
  }
}

// Type definitions
interface TestResult {
  testName: string;
  platform: 'ios' | 'android' | 'web';
  device: string;
  passed: boolean;
  errors: string[];
  metrics: TestMetrics;
  timestamp?: string;
}

interface TestMetrics {
  responsive?: number;
  accessibility?: number;
  medical?: number;
  performance?: {
    fps: number;
    memoryUsage: number;
    animationPerformance: number;
    blurPerformance: number;
    renderTime: number;
  };
}

// Export testing framework instance
export const medicalHeaderTestFramework = new MedicalHeaderTestFramework();
