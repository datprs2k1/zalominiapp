/**
 * Test Setup Configuration
 * Global test setup for medical API services testing
 *
 * @version 1.0.0
 * @author Zalo Healthcare Development Team
 */

import "@testing-library/jest-dom";

// Mock console methods to reduce noise in tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleLog = console.log;

beforeAll(() => {
  // Mock console.error to suppress expected error messages in tests
  console.error = (...args: any[]) => {
    const message = args[0];

    // Suppress specific expected errors
    const suppressedErrors = [
      "Warning: ReactDOM.render is deprecated",
      "Warning: componentWillReceiveProps has been renamed",
      "Warning: componentWillMount has been renamed",
    ];

    if (
      typeof message === "string" &&
      suppressedErrors.some((error) => message.includes(error))
    ) {
      return;
    }

    originalConsoleError(...args);
  };

  // Mock console.warn for similar reasons
  console.warn = (...args: any[]) => {
    const message = args[0];

    const suppressedWarnings = [
      "React Hook useEffect has missing dependencies",
      "Can't perform a React state update on an unmounted component",
    ];

    if (
      typeof message === "string" &&
      suppressedWarnings.some((warning) => message.includes(warning))
    ) {
      return;
    }

    originalConsoleWarn(...args);
  };
});

afterAll(() => {
  // Restore original console methods
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
  console.log = originalConsoleLog;
});

// Mock fetch for API tests
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};

Object.defineProperty(window, "sessionStorage", {
  value: sessionStorageMock,
});

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn((callback) => {
  return setTimeout(callback, 16);
});

global.cancelAnimationFrame = jest.fn((id) => {
  clearTimeout(id);
});

// Mock requestIdleCallback
global.requestIdleCallback = jest.fn((callback) => {
  return setTimeout(callback, 1);
});

global.cancelIdleCallback = jest.fn((id) => {
  clearTimeout(id);
});

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => "mocked-url");
global.URL.revokeObjectURL = jest.fn();

// Mock navigator
Object.defineProperty(navigator, "clipboard", {
  value: {
    writeText: jest.fn().mockResolvedValue(undefined),
    readText: jest.fn().mockResolvedValue(""),
  },
});

// Mock navigator.connection for network-aware features
Object.defineProperty(navigator, "connection", {
  value: {
    effectiveType: "4g",
    type: "wifi",
    downlink: 10,
    rtt: 50,
    saveData: false,
  },
  writable: true,
});

// Mock navigator.deviceMemory
Object.defineProperty(navigator, "deviceMemory", {
  value: 8,
  writable: true,
});

// Mock performance API
global.performance = {
  ...global.performance,
  mark: jest.fn(),
  measure: jest.fn(),
  getEntriesByName: jest.fn().mockReturnValue([]),
  getEntriesByType: jest.fn().mockReturnValue([]),
  clearMarks: jest.fn(),
  clearMeasures: jest.fn(),
  now: jest.fn(() => Date.now()),
};

// Mock crypto for UUID generation
Object.defineProperty(global, "crypto", {
  value: {
    randomUUID: jest.fn(() => "mocked-uuid-1234-5678-9012"),
    getRandomValues: jest.fn((array) => {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
      return array;
    }),
  },
});

// Mock document.visibilityState
Object.defineProperty(document, "visibilityState", {
  value: "visible",
  writable: true,
});

// Mock document.hidden
Object.defineProperty(document, "hidden", {
  value: false,
  writable: true,
});

// Test utilities
export const createMockWPPost = (overrides = {}) => ({
  id: 1,
  title: { rendered: "Test Post" },
  content: { rendered: "Test content" },
  excerpt: { rendered: "Test excerpt" },
  status: "publish",
  date: "2024-01-01T00:00:00Z",
  modified: "2024-01-01T00:00:00Z",
  slug: "test-post",
  link: "https://example.com/test-post",
  type: "post",
  featured_media: 0,
  ...overrides,
});

export const createMockWPDoctor = (overrides = {}) => ({
  ...createMockWPPost(),
  type: "info-bacsi",
  bacsi_phone: "0123456789",
  bacsi_email: "doctor@example.com",
  bacsi_chuyenkhoa: "Tim mạch",
  bacsi_kinhnghiem: "10 năm",
  bacsi_hocvan: "Tiến sĩ Y khoa",
  ...overrides,
});

export const createMockWPPage = (overrides = {}) => ({
  ...createMockWPPost(),
  type: "page",
  parent: 0,
  menu_order: 0,
  ...overrides,
});

export const createMockAPIResponse = <T>(data: T, status = 200) => ({
  data,
  status,
  statusText: "OK",
  headers: {},
  config: {},
});

export const createMockAPIError = (
  status = 500,
  message = "Internal Server Error",
) => ({
  response: {
    status,
    statusText: message,
    data: {
      code: `http_${status}`,
      message,
    },
  },
  message,
  isAxiosError: true,
});

// Custom matchers
expect.extend({
  toBeValidWPContent(received) {
    const pass =
      received &&
      typeof received.id === "number" &&
      received.title &&
      received.title.rendered &&
      received.status === "publish";

    if (pass) {
      return {
        message: () =>
          `expected ${JSON.stringify(received)} not to be valid WordPress content`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${JSON.stringify(received)} to be valid WordPress content`,
        pass: false,
      };
    }
  },

  toHaveMedicalContent(received) {
    const medicalKeywords = [
      "bác sĩ",
      "doctor",
      "khám",
      "chữa",
      "điều trị",
      "y tế",
      "sức khỏe",
    ];
    const content =
      received?.content?.rendered || received?.title?.rendered || "";
    const pass = medicalKeywords.some((keyword) =>
      content.toLowerCase().includes(keyword.toLowerCase()),
    );

    if (pass) {
      return {
        message: () => `expected content not to contain medical keywords`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected content to contain medical keywords`,
        pass: false,
      };
    }
  },
});

// Declare custom matchers for TypeScript
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidWPContent(): R;
      toHaveMedicalContent(): R;
    }
  }
}

// Global test timeout
jest.setTimeout(10000);

// Clean up after each test
afterEach(() => {
  // Clear all mocks
  jest.clearAllMocks();

  // Clear localStorage and sessionStorage
  localStorageMock.clear();
  sessionStorageMock.clear();

  // Reset fetch mock
  (global.fetch as jest.Mock).mockReset();
});

// Global error handler for unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

export default {};
