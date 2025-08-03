/**
 * Jest Configuration for Services Tests
 * Optimized configuration for testing medical API services
 *
 * @version 1.0.0
 * @author Zalo Healthcare Development Team
 */

module.exports = {
  // Test environment
  testEnvironment: "jsdom",

  // Root directory for tests
  rootDir: "../",

  // Test file patterns
  testMatch: [
    "<rootDir>/__tests__/**/*.test.{js,ts}",
    "<rootDir>/**/__tests__/**/*.test.{js,ts}",
  ],

  // File extensions to consider
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],

  // Transform files with TypeScript
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },

  // Module name mapping for path aliases
  moduleNameMapping: {
    "^@/(.*)$": "<rootDir>/../$1",
    "^@/services/(.*)$": "<rootDir>/$1",
  },

  // Setup files
  setupFilesAfterEnv: ["<rootDir>/__tests__/setup.ts"],

  // Coverage configuration
  collectCoverage: true,
  collectCoverageFrom: [
    "<rootDir>/**/*.{ts,tsx}",
    "!<rootDir>/**/*.d.ts",
    "!<rootDir>/__tests__/**",
    "!<rootDir>/node_modules/**",
  ],

  coverageDirectory: "<rootDir>/__tests__/coverage",

  coverageReporters: ["text", "lcov", "html", "json-summary"],

  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // Test timeout
  testTimeout: 10000,

  // Clear mocks between tests
  clearMocks: true,

  // Restore mocks after each test
  restoreMocks: true,

  // Verbose output
  verbose: true,

  // Error handling
  errorOnDeprecated: true,

  // Module directories
  moduleDirectories: ["node_modules", "<rootDir>"],

  // Ignore patterns
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/build/"],

  // Transform ignore patterns
  transformIgnorePatterns: ["node_modules/(?!(axios|@testing-library)/)"],

  // Global setup and teardown
  globalSetup: "<rootDir>/__tests__/global-setup.ts",
  globalTeardown: "<rootDir>/__tests__/global-teardown.ts",

  // Mock configuration
  automock: false,

  // Snapshot serializers
  snapshotSerializers: [],

  // Watch plugins
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
  ],

  // Reporters
  reporters: [
    "default",
    [
      "jest-junit",
      {
        outputDirectory: "<rootDir>/__tests__/reports",
        outputName: "junit.xml",
        classNameTemplate: "{classname}",
        titleTemplate: "{title}",
        ancestorSeparator: " › ",
        usePathForSuiteName: true,
      },
    ],
  ],

  // Test results processor
  testResultsProcessor: "jest-sonar-reporter",

  // Preset
  preset: "ts-jest",

  // TypeScript configuration
  globals: {
    "ts-jest": {
      tsconfig: {
        compilerOptions: {
          module: "commonjs",
          target: "es2020",
          lib: ["es2020", "dom"],
          allowJs: true,
          skipLibCheck: true,
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          strict: true,
          forceConsistentCasingInFileNames: true,
          moduleResolution: "node",
          resolveJsonModule: true,
          isolatedModules: true,
          noEmit: true,
          jsx: "react-jsx",
        },
      },
    },
  },

  // Cache configuration
  cache: true,
  cacheDirectory: "<rootDir>/__tests__/.jest-cache",

  // Bail configuration
  bail: false,

  // Max workers
  maxWorkers: "50%",

  // Notify configuration
  notify: false,
  notifyMode: "failure-change",

  // Silent mode
  silent: false,

  // Watch mode configuration
  watchman: true,
};
