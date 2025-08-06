/**
 * Mobile Test Dashboard Component
 * Provides UI for running and viewing mobile test results
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMobileTesting } from '@/utils/mobile-testing-suite';
import { useEnhancedMobile } from '@/hooks/use-enhanced-mobile';
import { EnhancedMobileButton } from './enhanced-mobile-button';
import { EnhancedMobileCard } from './enhanced-mobile-card';
import { EnhancedTypography } from './enhanced-typography';

// Types
interface TestResult {
  name: string;
  passed: boolean;
  message: string;
  score?: number;
  details?: any;
}

// Mobile Test Dashboard Component
export const MobileTestDashboard: React.FC = () => {
  const { runTests, generateReport, getResults } = useMobileTesting();
  const { deviceInfo, getPlatformClasses } = useEnhancedMobile();
  
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [overallScore, setOverallScore] = useState(0);

  // Run tests
  const handleRunTests = async () => {
    setIsRunning(true);
    try {
      const testResults = await runTests();
      setResults(testResults);
      
      // Calculate overall score
      const totalScore = testResults.reduce((sum, result) => sum + (result.score || 0), 0);
      const avgScore = testResults.length > 0 ? totalScore / testResults.length : 0;
      setOverallScore(avgScore);
    } catch (error) {
      console.error('Failed to run tests:', error);
    } finally {
      setIsRunning(false);
    }
  };

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 90) return '#10B981'; // Green
    if (score >= 70) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  // Get status icon
  const getStatusIcon = (passed: boolean) => {
    return passed ? '✅' : '❌';
  };

  // Toggle details
  const toggleDetails = (testName: string) => {
    setShowDetails(showDetails === testName ? null : testName);
  };

  return (
    <div className={getPlatformClasses('mobile-test-dashboard p-4 max-w-4xl mx-auto')}>
      {/* Header */}
      <div className="mb-6">
        <EnhancedTypography variant="headline" weight="bold" className="mb-2">
          Mobile UI/UX Test Dashboard
        </EnhancedTypography>
        <EnhancedTypography variant="body" color="#6B7280">
          Comprehensive testing suite for mobile optimization validation
        </EnhancedTypography>
      </div>

      {/* Device Info */}
      <EnhancedMobileCard variant="outlined" className="mb-6">
        <EnhancedTypography variant="subtitle" weight="semibold" className="mb-3">
          Device Information
        </EnhancedTypography>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Platform:</span> {deviceInfo.platform}
          </div>
          <div>
            <span className="font-medium">Screen Size:</span> {deviceInfo.screenSize}
          </div>
          <div>
            <span className="font-medium">Orientation:</span> {deviceInfo.orientation}
          </div>
          <div>
            <span className="font-medium">Touch Support:</span> {deviceInfo.isTouch ? 'Yes' : 'No'}
          </div>
        </div>
      </EnhancedMobileCard>

      {/* Test Controls */}
      <div className="mb-6">
        <EnhancedMobileButton
          onClick={handleRunTests}
          disabled={isRunning}
          loading={isRunning}
          variant="primary"
          size="large"
          fullWidth
          hapticFeedback="medium"
        >
          {isRunning ? 'Running Tests...' : 'Run Mobile Tests'}
        </EnhancedMobileButton>
      </div>

      {/* Overall Score */}
      {results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <EnhancedMobileCard variant="elevated" className="text-center">
            <EnhancedTypography variant="title" weight="bold" className="mb-2">
              Overall Score
            </EnhancedTypography>
            <div
              className="text-6xl font-bold mb-2"
              style={{ color: getScoreColor(overallScore) }}
            >
              {Math.round(overallScore)}%
            </div>
            <EnhancedTypography 
              variant="body" 
              color={overallScore >= 80 ? '#10B981' : '#EF4444'}
              weight="semibold"
            >
              {overallScore >= 80 ? 'PASS' : 'NEEDS IMPROVEMENT'}
            </EnhancedTypography>
          </EnhancedMobileCard>
        </motion.div>
      )}

      {/* Test Results */}
      {results.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <EnhancedTypography variant="title" weight="bold" className="mb-4">
            Test Results
          </EnhancedTypography>
          
          <div className="space-y-4">
            {results.map((result, index) => (
              <motion.div
                key={result.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <EnhancedMobileCard
                  variant="outlined"
                  interactive
                  onClick={() => toggleDetails(result.name)}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">
                        {getStatusIcon(result.passed)}
                      </span>
                      <div>
                        <EnhancedTypography variant="subtitle" weight="semibold">
                          {result.name}
                        </EnhancedTypography>
                        <EnhancedTypography variant="body" color="#6B7280">
                          {result.message}
                        </EnhancedTypography>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {result.score !== undefined && (
                        <div
                          className="text-2xl font-bold"
                          style={{ color: getScoreColor(result.score) }}
                        >
                          {result.score}%
                        </div>
                      )}
                      <span className="text-gray-400">
                        {showDetails === result.name ? '▼' : '▶'}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <AnimatePresence>
                    {showDetails === result.name && result.details && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 pt-4 border-t border-gray-200"
                      >
                        <EnhancedTypography variant="body" weight="medium" className="mb-2">
                          Details:
                        </EnhancedTypography>
                        <pre className="bg-gray-50 p-3 rounded-lg text-xs overflow-x-auto">
                          {JSON.stringify(result.details, null, 2)}
                        </pre>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </EnhancedMobileCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Export Report */}
      {results.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6"
        >
          <EnhancedMobileButton
            onClick={() => {
              const report = generateReport();
              const blob = new Blob([report], { type: 'text/markdown' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'mobile-test-report.md';
              a.click();
              URL.revokeObjectURL(url);
            }}
            variant="secondary"
            fullWidth
            icon={<span>📄</span>}
          >
            Export Test Report
          </EnhancedMobileButton>
        </motion.div>
      )}

      {/* Quick Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-8"
      >
        <EnhancedMobileCard variant="filled">
          <EnhancedTypography variant="subtitle" weight="semibold" className="mb-3">
            💡 Quick Tips for Better Mobile UX
          </EnhancedTypography>
          <ul className="space-y-2 text-sm">
            <li>• Ensure touch targets are at least 44px × 44px</li>
            <li>• Test on multiple devices and screen sizes</li>
            <li>• Optimize images for mobile bandwidth</li>
            <li>• Use platform-specific design patterns</li>
            <li>• Implement proper safe area handling</li>
            <li>• Add haptic feedback for better interaction</li>
            <li>• Ensure accessibility compliance (WCAG 2.1 AA)</li>
          </ul>
        </EnhancedMobileCard>
      </motion.div>
    </div>
  );
};

export default MobileTestDashboard;
