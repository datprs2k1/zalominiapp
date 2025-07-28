import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Layout from '../layout';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    main: ({ children, ...props }: any) => <main {...props}>{children}</main>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    svg: ({ children, ...props }: any) => <svg {...props}>{children}</svg>,
    circle: ({ children, ...props }: any) => <circle {...props}>{children}</circle>,
  },
  useReducedMotion: () => false,
  AnimatePresence: ({ children }: any) => children,
}));

// Mock components
jest.mock('../header', () => {
  return function MockHeader() {
    return <header data-testid="header">Header</header>;
  };
});

jest.mock('../footer', () => {
  return function MockFooter() {
    return <footer data-testid="footer">Footer</footer>;
  };
});

jest.mock('../page', () => {
  return function MockPage() {
    return <div data-testid="page">Page Content</div>;
  };
});

jest.mock('../scroll-restoration', () => {
  return {
    ScrollRestoration: function MockScrollRestoration() {
      return <div data-testid="scroll-restoration" />;
    },
  };
});

jest.mock('react-hot-toast', () => ({
  Toaster: function MockToaster() {
    return <div data-testid="toaster" />;
  },
}));

// Mock accessibility settings
jest.mock('../accessibility-settings', () => ({
  AccessibilitySettings: function MockAccessibilitySettings({ isOpen, onClose }: any) {
    return isOpen ? (
      <div data-testid="accessibility-settings" role="dialog">
        <button onClick={onClose}>Close</button>
      </div>
    ) : null;
  },
}));

// Mock utilities
jest.mock('@/utils/performance-monitor', () => ({
  performanceMonitor: {
    trackMedicalPageLoad: jest.fn(),
  },
}));

jest.mock('../mobile-optimized-layout', () => ({
  MobileViewportUtils: {
    setMobileViewport: jest.fn(() => jest.fn()),
    optimizeTouchInteractions: jest.fn(),
    enhanceMedicalAccessibility: jest.fn(),
  },
}));

jest.mock('@/utils/accessibility', () => ({
  announceToScreenReader: jest.fn(),
  manageFocus: {
    trapFocus: jest.fn(),
  },
}));

describe('Layout Component', () => {
  beforeEach(() => {
    // Mock window dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders all main layout components', () => {
    render(<Layout />);
    
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByTestId('page')).toBeInTheDocument();
    expect(screen.getByTestId('toaster')).toBeInTheDocument();
    expect(screen.getByTestId('scroll-restoration')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<Layout data-testid="layout" />);
    
    const layout = screen.getByTestId('layout');
    expect(layout).toHaveAttribute('role', 'application');
    expect(layout).toHaveAttribute('aria-label', 'Ứng dụng y tế Zalo - Giao diện chính');
    
    const mainContent = screen.getByRole('main');
    expect(mainContent).toHaveAttribute('id', 'main-content');
    expect(mainContent).toHaveAttribute('aria-label', 'Nội dung chính của ứng dụng');
  });

  it('renders accessibility quick access button', () => {
    render(<Layout />);
    
    const accessibilityButton = screen.getByRole('button', { name: /mở cài đặt trợ năng/i });
    expect(accessibilityButton).toBeInTheDocument();
    expect(accessibilityButton).toHaveAttribute('title', 'Cài đặt trợ năng');
  });

  it('opens accessibility settings when button is clicked', async () => {
    render(<Layout />);
    
    const accessibilityButton = screen.getByRole('button', { name: /mở cài đặt trợ năng/i });
    fireEvent.click(accessibilityButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('accessibility-settings')).toBeInTheDocument();
    });
  });

  it('handles keyboard shortcuts', () => {
    render(<Layout />);
    
    // Test Alt + A shortcut
    fireEvent.keyDown(document, { key: 'a', altKey: true });
    
    expect(screen.getByTestId('accessibility-settings')).toBeInTheDocument();
    
    // Test Escape to close
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(screen.queryByTestId('accessibility-settings')).not.toBeInTheDocument();
  });

  it('applies responsive classes based on screen size', () => {
    render(<Layout data-testid="layout" />);
    
    const layout = screen.getByTestId('layout');
    expect(layout).toHaveAttribute('data-screen-size', 'desktop');
  });

  it('handles mobile screen size', () => {
    // Mock mobile dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 600,
    });
    
    render(<Layout data-testid="layout" />);
    
    // Trigger resize event
    fireEvent(window, new Event('resize'));
    
    const layout = screen.getByTestId('layout');
    expect(layout).toHaveAttribute('data-screen-size', 'mobile');
  });

  it('renders skip to main content link', () => {
    render(<Layout />);
    
    const skipLink = screen.getByRole('link', { name: /chuyển đến nội dung chính/i });
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  it('applies custom className when provided', () => {
    render(<Layout className="custom-class" data-testid="layout" />);
    
    const layout = screen.getByTestId('layout');
    expect(layout).toHaveClass('custom-class');
  });

  it('handles error states gracefully', () => {
    render(<Layout data-testid="layout" />);
    
    const layout = screen.getByTestId('layout');
    expect(layout).toHaveAttribute('data-has-error', 'false');
  });
});
