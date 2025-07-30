import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import '@testing-library/jest-dom';
import { ScrollRestoration } from '../scroll-restoration';

// Mock the hooks
jest.mock('@/hooks', () => ({
  useRouteHandle: () => [{}],
}));

// Mock the scroll performance utilities
jest.mock('@/utils/scroll-performance', () => ({
  ScrollPositionTracker: jest.fn().mockImplementation(() => ({
    getPosition: jest.fn().mockReturnValue(0),
    savePosition: jest.fn(),
    clearPosition: jest.fn(),
    clearAll: jest.fn(),
  })),
  createOptimizedScrollHandler: jest.fn().mockImplementation((handler) => ({
    attach: jest.fn(),
    detach: jest.fn(),
    destroy: jest.fn(),
  })),
}));

// Mock console methods to avoid noise in tests
const originalConsole = console;
beforeAll(() => {
  console.log = jest.fn();
  console.warn = jest.fn();
  console.error = jest.fn();
});

afterAll(() => {
  console.log = originalConsole.log;
  console.warn = originalConsole.warn;
  console.error = originalConsole.error;
});

// Helper component to test scroll restoration
const TestComponent = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <div>
      <main style={{ height: '200px', overflow: 'auto' }}>
        <div style={{ height: '1000px' }}>
          {children}
          <ScrollRestoration />
        </div>
      </main>
    </div>
  </BrowserRouter>
);

describe('ScrollRestoration', () => {
  beforeEach(() => {
    // Clear any existing scroll positions
    jest.clearAllMocks();

    // Mock scrollTo method
    Element.prototype.scrollTo = jest.fn();

    // Mock addEventListener and removeEventListener
    Element.prototype.addEventListener = jest.fn();
    Element.prototype.removeEventListener = jest.fn();
  });

  it('should render without crashing', () => {
    render(
      <TestComponent>
        <div>Test content</div>
      </TestComponent>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should find the main element for scrolling', () => {
    render(
      <TestComponent>
        <div>Test content</div>
      </TestComponent>
    );

    // Should call console.log with the found element
    expect(console.log).toHaveBeenCalledWith('Found scrollable element:', expect.any(HTMLElement));
  });

  it('should scroll to top for new locations', async () => {
    const mockScrollTo = jest.fn();
    Element.prototype.scrollTo = mockScrollTo;

    render(
      <TestComponent>
        <div>Test content</div>
      </TestComponent>
    );

    await waitFor(() => {
      expect(mockScrollTo).toHaveBeenCalledWith(0, 0);
    });
  });

  it('should handle explicit scroll restoration from route handle', async () => {
    const mockScrollTo = jest.fn();
    Element.prototype.scrollTo = mockScrollTo;

    // Mock useRouteHandle to return explicit scroll position
    jest.doMock('@/hooks', () => ({
      useRouteHandle: () => [{ scrollRestoration: 500 }],
    }));

    const { ScrollRestoration: TestScrollRestoration } = await import('../scroll-restoration');

    render(
      <BrowserRouter>
        <div>
          <main style={{ height: '200px', overflow: 'auto' }}>
            <div style={{ height: '1000px' }}>
              <TestScrollRestoration />
            </div>
          </main>
        </div>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockScrollTo).toHaveBeenCalledWith(0, 500);
    });
  });

  it('should add scroll event listener for position saving', async () => {
    const mockAddEventListener = jest.fn();
    Element.prototype.addEventListener = mockAddEventListener;

    render(
      <TestComponent>
        <div>Test content</div>
      </TestComponent>
    );

    await waitFor(() => {
      expect(mockAddEventListener).toHaveBeenCalledWith('scroll', expect.any(Function), { passive: true });
    });
  });

  it('should handle errors gracefully', async () => {
    // Mock querySelector to throw an error
    const originalQuerySelector = document.querySelector;
    document.querySelector = jest.fn().mockImplementation(() => {
      throw new Error('Test error');
    });

    render(
      <TestComponent>
        <div>Test content</div>
      </TestComponent>
    );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error in scroll restoration:', expect.any(Error));
    });

    // Restore original querySelector
    document.querySelector = originalQuerySelector;
  });

  it('should warn when no scrollable element is found', async () => {
    // Mock querySelector to return null
    const originalQuerySelector = document.querySelector;
    document.querySelector = jest.fn().mockReturnValue(null);

    render(
      <TestComponent>
        <div>Test content</div>
      </TestComponent>
    );

    await waitFor(() => {
      expect(console.warn).toHaveBeenCalledWith('No scrollable element found for scroll restoration');
    });

    // Restore original querySelector
    document.querySelector = originalQuerySelector;
  });
});
