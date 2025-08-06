/**
 * Test Runner for Mobile Footer
 * Can be executed in browser console for testing
 */

import { mobileFooterTestSuite } from './mobile-footer-test';
import { mobilePerformanceValidator } from './mobile-performance-validator';

// Global test runner function
declare global {
  interface Window {
    runMobileFooterTests: () => Promise<void>;
    runPerformanceValidation: () => Promise<void>;
    runAllTests: () => Promise<void>;
    testResults: any[];
    performanceResults: any;
  }
}

// Test runner function
export async function runMobileFooterTests(): Promise<void> {
  console.log('🚀 Starting Mobile Footer Tests...');

  try {
    const results = await mobileFooterTestSuite.runFooterTests();
    const report = mobileFooterTestSuite.generateReport();

    console.log(report);

    // Store results globally for inspection
    window.testResults = results;

    // Show summary
    const totalTests = results.length;
    const passedTests = results.filter((r) => r.passed).length;
    const overallScore = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

    console.log(`\n🎯 Test Summary:`);
    console.log(`   Overall Score: ${Math.round(overallScore)}%`);
    console.log(`   Passed: ${passedTests}/${totalTests}`);
    console.log(`   Results stored in window.testResults`);

    // Show failed tests
    const failedTests = results.filter((r) => !r.passed);
    if (failedTests.length > 0) {
      console.log(`\n❌ Failed Tests:`);
      failedTests.forEach((test) => {
        console.log(`   - ${test.name}: ${test.message}`);
      });
    }
  } catch (error) {
    console.error('❌ Test execution failed:', error);
  }
}

// Performance validation function
export async function runPerformanceValidation(): Promise<void> {
  console.log('⚡ Starting Performance Validation...');

  try {
    const result = await mobilePerformanceValidator.validatePerformance();
    const report = mobilePerformanceValidator.generateDetailedReport(result);

    console.log(report);

    // Store results globally for inspection
    window.performanceResults = result;

    console.log(`\n🎯 Performance Summary:`);
    console.log(`   Overall Score: ${result.overall.score}%`);
    console.log(`   Status: ${result.overall.passed ? 'PASSED' : 'FAILED'}`);
    console.log(`   Results stored in window.performanceResults`);

    if (result.recommendations.length > 0) {
      console.log(`\n💡 Recommendations:`);
      result.recommendations.forEach((rec, index) => {
        console.log(`   ${index + 1}. ${rec}`);
      });
    }
  } catch (error) {
    console.error('❌ Performance validation failed:', error);
  }
}

// Run all tests function
export async function runAllTests(): Promise<void> {
  console.log('🧪 Running All Mobile Footer Tests...');

  await runMobileFooterTests();
  console.log('\n' + '='.repeat(50) + '\n');
  await runPerformanceValidation();

  console.log('\n✅ All tests completed!');
}

// Make test runners available globally
if (typeof window !== 'undefined') {
  window.runMobileFooterTests = runMobileFooterTests;
  window.runPerformanceValidation = runPerformanceValidation;
  window.runAllTests = runAllTests;
}

// Auto-run tests in development
if (import.meta.env.DEV) {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(runAllTests, 2000); // Wait 2 seconds for components to render
    });
  } else {
    setTimeout(runAllTests, 2000);
  }
}
