// Jest configuration for About page tests
// Optimized testing configuration with coverage and performance settings

const path = require('path');

module.exports = {
  // Test environment
  testEnvironment: 'jsdom',
  
  // Setup files
  setupFilesAfterEnv: [
    '<rootDir>/__tests__/setup.ts',
    '@testing-library/jest-dom/extend-expect',
  ],
  
  // Test file patterns
  testMatch: [
    '<rootDir>/__tests__/**/*.test.{ts,tsx}',
    '<rootDir>/**/*.test.{ts,tsx}',
  ],
  
  // Module name mapping for path aliases
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/../../$1',
    '^@/components/(.*)$': '<rootDir>/../../components/$1',
    '^@/styles/(.*)$': '<rootDir>/../../styles/$1',
    '^@/data/(.*)$': '<rootDir>/../../data/$1',
    '^@/utils/(.*)$': '<rootDir>/../../utils/$1',
  },
  
  // Transform configuration
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      },
    }],
    '^.+\\.(js|jsx)$': 'babel-jest',
    '^.+\\.css$': 'jest-transform-css',
  },
  
  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // Coverage configuration
  collectCoverage: true,
  collectCoverageFrom: [
    'components/**/*.{ts,tsx}',
    'hooks/**/*.{ts,tsx}',
    'utils/**/*.{ts,tsx}',
    'constants/**/*.{ts,tsx}',
    'index.tsx',
    '!**/*.d.ts',
    '!**/*.stories.{ts,tsx}',
    '!**/__tests__/**',
    '!**/node_modules/**',
  ],
  
  coverageDirectory: '<rootDir>/coverage',
  
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov',
    'json',
  ],
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    './components/': {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
    './utils/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  
  // Test timeout
  testTimeout: 10000,
  
  // Verbose output
  verbose: true,
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Restore mocks after each test
  restoreMocks: true,
  
  // Error handling
  errorOnDeprecated: true,
  
  // Performance settings
  maxWorkers: '50%',
  
  // Watch mode settings
  watchPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/coverage/',
    '<rootDir>/dist/',
  ],
  
  // Global setup and teardown
  globalSetup: undefined,
  globalTeardown: undefined,
  
  // Custom matchers
  setupFilesAfterEnv: [
    '<rootDir>/__tests__/setup.ts',
  ],
  
  // Module directories
  moduleDirectories: ['node_modules', '<rootDir>'],
  
  // Ignore patterns
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/coverage/',
  ],
  
  // Transform ignore patterns
  transformIgnorePatterns: [
    'node_modules/(?!(framer-motion|@testing-library)/)',
  ],
  
  // Reporters
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: '<rootDir>/coverage/html-report',
        filename: 'report.html',
        expand: true,
        hideIcon: false,
        pageTitle: 'About Page Test Report',
      },
    ],
    [
      'jest-junit',
      {
        outputDirectory: '<rootDir>/coverage',
        outputName: 'junit.xml',
        ancestorSeparator: ' › ',
        uniqueOutputName: 'false',
        suiteNameTemplate: '{filepath}',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
      },
    ],
  ],
  
  // Custom test environment options
  testEnvironmentOptions: {
    url: 'http://localhost:3000',
  },
  
  // Snapshot serializers
  snapshotSerializers: [
    '@emotion/jest/serializer',
  ],
  
  // Custom globals
  globals: {
    'ts-jest': {
      tsconfig: {
        jsx: 'react-jsx',
      },
    },
  },
  
  // Test result processor
  testResultsProcessor: undefined,
  
  // Notify mode
  notify: false,
  notifyMode: 'failure-change',
  
  // Bail settings
  bail: 0,
  
  // Cache settings
  cache: true,
  cacheDirectory: '<rootDir>/node_modules/.cache/jest',
  
  // Dependency extraction
  dependencyExtractor: undefined,
  
  // Force exit
  forceExit: false,
  
  // Detect open handles
  detectOpenHandles: false,
  
  // Detect leaked timers
  detectLeakedTimers: false,
  
  // Max concurrent tests
  maxConcurrency: 5,
  
  // Pass with no tests
  passWithNoTests: true,
  
  // Preset
  preset: undefined,
  
  // Pretty format
  prettierPath: 'prettier',
  
  // Project configuration
  projects: undefined,
  
  // Runner
  runner: 'jest-runner',
  
  // Silent mode
  silent: false,
  
  // Skip filter
  skipFilter: false,
  
  // Slow test threshold
  slowTestThreshold: 5,
  
  // Test name pattern
  testNamePattern: undefined,
  
  // Test runner
  testRunner: 'jest-circus/runner',
  
  // Test sequence
  testSequencer: '@jest/test-sequencer',
  
  // Update snapshot
  updateSnapshot: false,
  
  // Use stderr
  useStderr: false,
  
  // Watch
  watch: false,
  watchAll: false,
  
  // Watch plugins
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
};
