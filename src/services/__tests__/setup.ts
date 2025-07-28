/**
 * Test setup and utilities for medical services tests
 */

import { vi } from 'vitest';
import type { WPPost, WPPage, WPDoctor, WPSearchResult } from '../wp-types';

/**
 * Mock WordPress post data for testing
 */
export const createMockWPPost = (overrides: Partial<WPPost> = {}): WPPost => ({
  id: 1,
  title: { rendered: 'Test Medical Post' },
  content: { rendered: '<p>This is test medical content about heart health.</p>' },
  excerpt: { rendered: '<p>Test excerpt about medical topics.</p>' },
  date: '2024-07-15T10:00:00Z',
  date_gmt: '2024-07-15T10:00:00Z',
  modified: '2024-07-15T10:00:00Z',
  modified_gmt: '2024-07-15T10:00:00Z',
  slug: 'test-medical-post',
  status: 'publish',
  type: 'post',
  link: 'https://example.com/test-medical-post',
  author: 1,
  featured_media: 123,
  comment_status: 'open',
  ping_status: 'open',
  sticky: false,
  template: '',
  format: 'standard',
  meta: {},
  categories: [1],
  tags: [],
  _embedded: {
    'wp:featuredmedia': [{
      id: 123,
      source_url: 'https://example.com/medical-image.jpg',
      alt_text: 'Medical illustration',
      media_type: 'image',
      mime_type: 'image/jpeg',
    }],
    'wp:term': [[{
      id: 1,
      name: 'Cardiology',
      slug: 'cardiology',
      taxonomy: 'category',
      description: 'Heart and cardiovascular health',
    }]],
  },
  ...overrides,
});

/**
 * Mock WordPress page data for testing
 */
export const createMockWPPage = (overrides: Partial<WPPage> = {}): WPPage => ({
  ...createMockWPPost(),
  parent: 100,
  menu_order: 1,
  page_template: '',
  type: 'page',
  ...overrides,
});

/**
 * Mock WordPress doctor data for testing
 */
export const createMockWPDoctor = (overrides: Partial<WPDoctor> = {}): WPDoctor => ({
  id: 1,
  title: { rendered: 'Dr. Nguyen Van A' },
  content: { rendered: '<p>Experienced cardiologist with 15 years of experience. Specialization: Heart surgery, consultation fee: 500000 VND.</p>' },
  date: '2024-07-15T10:00:00Z',
  date_gmt: '2024-07-15T10:00:00Z',
  modified: '2024-07-15T10:00:00Z',
  modified_gmt: '2024-07-15T10:00:00Z',
  slug: 'dr-nguyen-van-a',
  status: 'publish',
  type: 'info-bacsi',
  link: 'https://example.com/doctors/dr-nguyen-van-a',
  featured_media: 456,
  template: '',
  meta: {},
  _embedded: {
    'wp:featuredmedia': [{
      id: 456,
      source_url: 'https://example.com/doctor-photo.jpg',
      alt_text: 'Dr. Nguyen Van A',
      media_type: 'image',
      mime_type: 'image/jpeg',
    }],
  },
  specialization: 'Cardiology',
  experience_years: 15,
  qualifications: ['MD', 'PhD'],
  department_id: 1,
  consultation_fee: 500000,
  ...overrides,
});

/**
 * Mock WordPress search result data for testing
 */
export const createMockWPSearchResult = (overrides: Partial<WPSearchResult> = {}): WPSearchResult => ({
  id: 1,
  title: 'Heart Health Tips',
  url: 'https://example.com/heart-health-tips',
  type: 'post',
  subtype: 'post',
  _embedded: {
    'wp:featuredmedia': [{
      id: 123,
      source_url: 'https://example.com/search-result-image.jpg',
      alt_text: 'Search result image',
      media_type: 'image',
      mime_type: 'image/jpeg',
    }],
  },
  ...overrides,
});

/**
 * Mock API responses for testing
 */
export const mockAPIResponses = {
  posts: [
    createMockWPPost({ id: 1, title: { rendered: 'Heart Health Tips' } }),
    createMockWPPost({ id: 2, title: { rendered: 'Diabetes Management' }, sticky: true }),
    createMockWPPost({ id: 3, title: { rendered: 'Mental Health Awareness' } }),
  ],
  
  services: [
    createMockWPPage({ 
      id: 101, 
      title: { rendered: 'Cardiac Consultation' },
      parent: 7222, // SERVICE_ID
      content: { rendered: '<p>Comprehensive cardiac consultation service. Price: 500,000 VND</p>' }
    }),
    createMockWPPage({ 
      id: 102, 
      title: { rendered: 'Blood Test' },
      parent: 7222,
      content: { rendered: '<p>Complete blood count and analysis. Price: 200,000 VND</p>' }
    }),
  ],
  
  departments: [
    createMockWPPage({ 
      id: 201, 
      title: { rendered: 'Khoa Tim Mạch' },
      parent: 1009, // DEPARTMENT_ID
      content: { rendered: '<p>Chuyên khoa: Tim mạch, Điện thoại: 0123456789, 20 bác sĩ</p>' }
    }),
    createMockWPPage({ 
      id: 202, 
      title: { rendered: 'Khoa Cấp Cứu' },
      parent: 1009,
      content: { rendered: '<p>Khoa cấp cứu 24/7, Điện thoại: 0987654321</p>' }
    }),
  ],
  
  doctors: [
    createMockWPDoctor({ 
      id: 301, 
      title: { rendered: 'Tiến sĩ Nguyễn Văn A' },
      content: { rendered: '<p>Chuyên khoa: Tim mạch, 20 năm kinh nghiệm, Phí khám: 500000 VND</p>' }
    }),
    createMockWPDoctor({ 
      id: 302, 
      title: { rendered: 'Bác sĩ Trần Thị B' },
      content: { rendered: '<p>Chuyên khoa: Nội khoa, 10 năm kinh nghiệm, Phí khám: 300000 VND</p>' }
    }),
  ],
  
  searchResults: [
    createMockWPSearchResult({ id: 1, title: 'Heart Health', type: 'post' }),
    createMockWPSearchResult({ id: 101, title: 'Cardiac Service', type: 'page', subtype: 'service' }),
    createMockWPSearchResult({ id: 301, title: 'Dr. Heart Specialist', type: 'info-bacsi' }),
  ],
};

/**
 * Common test utilities
 */
export const testUtils = {
  /**
   * Create a delay for testing async operations
   */
  delay: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),
  
  /**
   * Mock console methods to avoid noise in tests
   */
  mockConsole: () => {
    const originalConsole = { ...console };
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'info').mockImplementation(() => {});
    
    return () => {
      Object.assign(console, originalConsole);
    };
  },
  
  /**
   * Create mock fetch options
   */
  createMockFetchOptions: (overrides = {}) => ({
    cache: true,
    cacheTime: 5000,
    retries: 3,
    retryDelay: 1000,
    ...overrides,
  }),
  
  /**
   * Validate enhanced post structure
   */
  validateEnhancedPost: (post: any) => {
    expect(post).toHaveProperty('id');
    expect(post).toHaveProperty('title');
    expect(post).toHaveProperty('featuredImageUrl');
    expect(post).toHaveProperty('categories');
    expect(post).toHaveProperty('plainTextExcerpt');
    expect(post).toHaveProperty('truncatedExcerpt');
    expect(post).toHaveProperty('formattedDate');
    expect(post).toHaveProperty('readingTime');
    expect(typeof post.readingTime).toBe('number');
    expect(post.readingTime).toBeGreaterThan(0);
  },
  
  /**
   * Validate enhanced service structure
   */
  validateEnhancedService: (service: any) => {
    expect(service).toHaveProperty('id');
    expect(service).toHaveProperty('title');
    expect(service).toHaveProperty('featuredImageUrl');
    expect(service).toHaveProperty('plainTextContent');
    expect(service).toHaveProperty('truncatedDescription');
    expect(service).toHaveProperty('formattedDate');
    expect(service).toHaveProperty('serviceCategory');
  },
  
  /**
   * Validate enhanced department structure
   */
  validateEnhancedDepartment: (department: any) => {
    expect(department).toHaveProperty('id');
    expect(department).toHaveProperty('title');
    expect(department).toHaveProperty('featuredImageUrl');
    expect(department).toHaveProperty('plainTextContent');
    expect(department).toHaveProperty('truncatedDescription');
    expect(department).toHaveProperty('formattedDate');
    expect(department).toHaveProperty('departmentType');
    expect(department).toHaveProperty('specialties');
    expect(department).toHaveProperty('isEmergency');
    expect(department).toHaveProperty('priority');
    expect(typeof department.priority).toBe('number');
  },
  
  /**
   * Validate enhanced doctor structure
   */
  validateEnhancedDoctor: (doctor: any) => {
    expect(doctor).toHaveProperty('id');
    expect(doctor).toHaveProperty('title');
    expect(doctor).toHaveProperty('featuredImageUrl');
    expect(doctor).toHaveProperty('plainTextContent');
    expect(doctor).toHaveProperty('truncatedBio');
    expect(doctor).toHaveProperty('formattedDate');
    expect(doctor).toHaveProperty('specializations');
    expect(doctor).toHaveProperty('qualifications');
    expect(doctor).toHaveProperty('experience');
    expect(doctor).toHaveProperty('languages');
    expect(doctor).toHaveProperty('isAvailable');
    expect(doctor).toHaveProperty('priority');
    expect(typeof doctor.priority).toBe('number');
  },
};

/**
 * Setup function to run before each test
 */
export const setupTest = () => {
  // Clear all mocks
  vi.clearAllMocks();
  
  // Mock console to reduce noise
  const restoreConsole = testUtils.mockConsole();
  
  return {
    restoreConsole,
  };
};

/**
 * Cleanup function to run after each test
 */
export const cleanupTest = (cleanup?: { restoreConsole?: () => void }) => {
  // Restore console
  cleanup?.restoreConsole?.();
  
  // Clear all timers
  vi.clearAllTimers();
  
  // Reset all mocks
  vi.resetAllMocks();
};
