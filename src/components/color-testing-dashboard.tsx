/**
 * Color Testing Dashboard Component
 * Visual interface for testing and validating the color system
 */

import React, { useState, useEffect } from 'react';
import { colorTesting, runColorSystemTests } from '@/utils/color-testing';
import { useThemeStyles } from './theme-provider';

interface TestResult {
  timestamp: string;
  overallScore: number;
  healthCheck: ReturnType<typeof colorTesting.colorSystemHealthCheck>;
  colorBlindnessTest: {
    protanopia: Array<{ original: string; simulated: string; token: string }>;
    deuteranopia: Array<{ original: string; simulated: string; token: string }>;
    tritanopia: Array<{ original: string; simulated: string; token: string }>;
  };
  summary: {
    totalTests: number;
    passed: number;
    failed: number;
    warnings: number;
  };
}

export const ColorTestingDashboard: React.FC = () => {
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const { getColor, cardStyle, buttonPrimaryStyle } = useThemeStyles();

  const runTests = async () => {
    setIsRunning(true);
    try {
      // Simulate async testing
      await new Promise(resolve => setTimeout(resolve, 1000));
      const result = runColorSystemTests();
      setTestResult(result);
    } catch (error) {
      console.error('Error running color tests:', error);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    // Run tests on component mount
    runTests();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 90) return getColor('success');
    if (score >= 70) return getColor('warning');
    return getColor('error');
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: getColor('text-primary') }}>
            Color System Testing Dashboard
          </h1>
          <p className="text-sm mt-1" style={{ color: getColor('text-secondary') }}>
            Automated testing and validation for the medical color system
          </p>
        </div>
        <button
          onClick={runTests}
          disabled={isRunning}
          className="px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
          style={buttonPrimaryStyle}
        >
          {isRunning ? 'Running Tests...' : 'Run Tests'}
        </button>
      </div>

      {testResult && (
        <>
          {/* Overall Score */}
          <div 
            className="p-6 rounded-lg border"
            style={cardStyle}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold" style={{ color: getColor('text-primary') }}>
                  Overall Health Score
                </h2>
                <p className="text-sm" style={{ color: getColor('text-secondary') }}>
                  Last updated: {new Date(testResult.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <div 
                  className="text-3xl font-bold"
                  style={{ color: getScoreColor(testResult.overallScore) }}
                >
                  {testResult.overallScore}%
                </div>
                <div 
                  className="text-sm font-medium"
                  style={{ color: getScoreColor(testResult.overallScore) }}
                >
                  {getScoreLabel(testResult.overallScore)}
                </div>
              </div>
            </div>
          </div>

          {/* Test Summary */}
          <div 
            className="p-6 rounded-lg border"
            style={cardStyle}
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: getColor('text-primary') }}>
              Test Summary
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: getColor('text-primary') }}>
                  {testResult.summary.totalTests}
                </div>
                <div className="text-sm" style={{ color: getColor('text-secondary') }}>
                  Total Tests
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: getColor('success') }}>
                  {testResult.summary.passed}
                </div>
                <div className="text-sm" style={{ color: getColor('text-secondary') }}>
                  Passed
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: getColor('error') }}>
                  {testResult.summary.failed}
                </div>
                <div className="text-sm" style={{ color: getColor('text-secondary') }}>
                  Failed
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: getColor('warning') }}>
                  {testResult.summary.warnings}
                </div>
                <div className="text-sm" style={{ color: getColor('text-secondary') }}>
                  Warnings
                </div>
              </div>
            </div>
          </div>

          {/* Contrast Test Results */}
          <div 
            className="p-6 rounded-lg border"
            style={cardStyle}
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: getColor('text-primary') }}>
              Contrast Test Results
            </h2>
            <div className="space-y-3">
              {testResult.healthCheck.contrastResults.results.map((result, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 rounded border"
                  style={{
                    backgroundColor: result.result.passesAA 
                      ? getColor('success-light') 
                      : getColor('error-light'),
                    borderColor: result.result.passesAA 
                      ? getColor('success') 
                      : getColor('error')
                  }}
                >
                  <div>
                    <div className="font-medium" style={{ color: getColor('text-primary') }}>
                      {result.combination}
                    </div>
                    <div className="text-sm" style={{ color: getColor('text-secondary') }}>
                      Ratio: {result.result.ratio}:1 • Level: {result.result.level}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded border"
                      style={{ backgroundColor: result.foreground }}
                      title={`Foreground: ${result.foreground}`}
                    />
                    <div 
                      className="w-4 h-4 rounded border"
                      style={{ backgroundColor: result.background }}
                      title={`Background: ${result.background}`}
                    />
                    <span 
                      className={`text-sm font-medium ${
                        result.result.passesAA ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {result.result.passesAA ? '✓' : '✗'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Issues and Recommendations */}
          {(testResult.healthCheck.issues.length > 0 || testResult.healthCheck.recommendations.length > 0) && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Issues */}
              {testResult.healthCheck.issues.length > 0 && (
                <div 
                  className="p-6 rounded-lg border"
                  style={{
                    ...cardStyle,
                    borderColor: getColor('error'),
                    backgroundColor: getColor('error-light')
                  }}
                >
                  <h3 className="text-lg font-semibold mb-3" style={{ color: getColor('error') }}>
                    Issues Found
                  </h3>
                  <ul className="space-y-2">
                    {testResult.healthCheck.issues.map((issue, index) => (
                      <li key={index} className="text-sm" style={{ color: getColor('text-primary') }}>
                        • {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              {testResult.healthCheck.recommendations.length > 0 && (
                <div 
                  className="p-6 rounded-lg border"
                  style={{
                    ...cardStyle,
                    borderColor: getColor('info'),
                    backgroundColor: getColor('info-light')
                  }}
                >
                  <h3 className="text-lg font-semibold mb-3" style={{ color: getColor('info') }}>
                    Recommendations
                  </h3>
                  <ul className="space-y-2">
                    {testResult.healthCheck.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm" style={{ color: getColor('text-primary') }}>
                        • {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Color Blindness Simulation */}
          <div 
            className="p-6 rounded-lg border"
            style={cardStyle}
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: getColor('text-primary') }}>
              Color Blindness Simulation
            </h2>
            <div className="space-y-4">
              {Object.entries(testResult.colorBlindnessTest).map(([type, colors]) => (
                <div key={type}>
                  <h3 className="font-medium mb-2 capitalize" style={{ color: getColor('text-secondary') }}>
                    {type}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {colors.map((color, index) => (
                      <div key={index} className="text-center">
                        <div className="flex space-x-1 mb-1">
                          <div 
                            className="w-8 h-8 rounded border"
                            style={{ backgroundColor: color.original }}
                            title={`Original: ${color.original}`}
                          />
                          <div 
                            className="w-8 h-8 rounded border"
                            style={{ backgroundColor: color.simulated }}
                            title={`Simulated: ${color.simulated}`}
                          />
                        </div>
                        <div className="text-xs" style={{ color: getColor('text-muted') }}>
                          {color.token}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ColorTestingDashboard;
