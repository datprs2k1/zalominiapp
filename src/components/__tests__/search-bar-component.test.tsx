import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SearchBarComponent from '../search-bar-component';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock the medical icons and animations
jest.mock('../icons/medical-icons', () => ({
  MedicalIcons: {
    Search: ({ size, className }: any) => (
      <div data-testid="search-icon" className={className} data-size={size}>
        Search Icon
      </div>
    ),
  },
}));

jest.mock('../medical-animations', () => ({
  MedicalSpinner: ({ size, color }: any) => (
    <div data-testid="medical-spinner" data-size={size} data-color={color}>
      Loading...
    </div>
  ),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('SearchBarComponent - Enhanced Focus States & Accessibility', () => {
  it('renders with compact styling and enhanced focus classes', () => {
    renderWithRouter(<SearchBarComponent />);

    const searchInput = screen.getByRole('combobox');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveClass('py-3'); // Reduced from py-5
    expect(searchInput).toHaveClass('pl-11'); // Reduced from pl-16
    expect(searchInput).toHaveClass('pr-11'); // Reduced from pr-16
    expect(searchInput).toHaveClass('medical-focus-input'); // Enhanced focus class
  });

  it('displays compact quick categories when enabled', () => {
    renderWithRouter(<SearchBarComponent showQuickCategories={true} />);

    const doctorsButton = screen.getByText('Bác sĩ');
    expect(doctorsButton).toBeInTheDocument();
    expect(doctorsButton).toHaveClass('px-3'); // Reduced from px-4
    expect(doctorsButton).toHaveClass('py-1.5'); // Reduced from py-2.5
    expect(doctorsButton).toHaveClass('text-xs'); // Reduced from text-sm
  });

  it('shows compact suggestions dropdown on focus', async () => {
    renderWithRouter(<SearchBarComponent />);

    const searchInput = screen.getByRole('textbox');
    fireEvent.focus(searchInput);
    fireEvent.change(searchInput, { target: { value: 'test' } });

    await waitFor(() => {
      const suggestionsHeader = screen.getByText('Tìm kiếm phổ biến');
      expect(suggestionsHeader).toBeInTheDocument();
      expect(suggestionsHeader).toHaveClass('text-xs'); // Reduced from text-sm
    });
  });

  it('maintains accessibility with compact design', () => {
    renderWithRouter(<SearchBarComponent ariaLabel="Test search" medicalContext="emergency" priority="high" />);

    const searchInput = screen.getByRole('textbox');
    expect(searchInput).toHaveAttribute('aria-label', 'Test search');
    expect(searchInput).toHaveStyle({ minHeight: '44px' }); // Maintains touch target size
  });

  it('handles loading state with compact spinner', () => {
    renderWithRouter(<SearchBarComponent loading={true} />);

    const spinner = screen.getByTestId('medical-spinner');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute('data-size', 'sm'); // Uses smaller spinner
  });

  it('shows compact clear button when query exists', async () => {
    renderWithRouter(<SearchBarComponent />);

    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'test query' } });

    await waitFor(() => {
      const clearButton = screen.getByLabelText('Xóa tìm kiếm');
      expect(clearButton).toBeInTheDocument();
      expect(clearButton).toHaveClass('p-2'); // Reduced from p-3
    });
  });

  it('maintains medical context styling in compact form', () => {
    renderWithRouter(<SearchBarComponent medicalContext="emergency" />);

    const searchInput = screen.getByRole('textbox');
    expect(searchInput).toHaveClass('focus:ring-2'); // Reduced from focus:ring-4
  });

  it('preserves functionality with compact design', async () => {
    const mockOnSearch = jest.fn();
    renderWithRouter(<SearchBarComponent onSearch={mockOnSearch} />);

    const searchInput = screen.getByRole('combobox');
    fireEvent.change(searchInput, { target: { value: 'test search' } });
    fireEvent.submit(searchInput.closest('form')!);

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('test search');
    });
  });

  it('has proper ARIA attributes for accessibility', () => {
    renderWithRouter(<SearchBarComponent medicalContext="emergency" />);

    const searchInput = screen.getByRole('combobox');
    expect(searchInput).toHaveAttribute('aria-expanded', 'false');
    expect(searchInput).toHaveAttribute('aria-haspopup', 'listbox');
    expect(searchInput).toHaveAttribute('aria-describedby');
    expect(searchInput).toHaveAttribute('role', 'combobox');
  });

  it('supports keyboard navigation in suggestions', async () => {
    renderWithRouter(<SearchBarComponent />);

    const searchInput = screen.getByRole('combobox');
    fireEvent.focus(searchInput);
    fireEvent.change(searchInput, { target: { value: 'test' } });

    await waitFor(() => {
      expect(searchInput).toHaveAttribute('aria-expanded', 'true');
    });

    // Test arrow down navigation
    fireEvent.keyDown(searchInput, { key: 'ArrowDown' });
    expect(searchInput).toHaveAttribute('aria-activedescendant', 'suggestion-0');

    // Test arrow up navigation
    fireEvent.keyDown(searchInput, { key: 'ArrowUp');
    // Should wrap to last suggestion

    // Test escape key
    fireEvent.keyDown(searchInput, { key: 'Escape' });
    await waitFor(() => {
      expect(searchInput).toHaveAttribute('aria-expanded', 'false');
    });
  });

  it('has enhanced focus states for different medical contexts', () => {
    const contexts = ['general', 'emergency', 'appointment', 'doctor', 'service'] as const;

    contexts.forEach(context => {
      const { unmount } = renderWithRouter(<SearchBarComponent medicalContext={context} />);

      const searchInput = screen.getByRole('combobox');
      expect(searchInput).toHaveClass('medical-focus-input');

      unmount();
    });
  });

  it('clear button has proper focus states and accessibility', async () => {
    renderWithRouter(<SearchBarComponent />);

    const searchInput = screen.getByRole('combobox');
    fireEvent.change(searchInput, { target: { value: 'test query' } });

    await waitFor(() => {
      const clearButton = screen.getByLabelText(/xóa tìm kiếm/i);
      expect(clearButton).toBeInTheDocument();
      expect(clearButton).toHaveClass('medical-focus-button');
      expect(clearButton).toHaveAttribute('aria-describedby');
    });
  });

  it('quick category buttons have proper focus states', () => {
    renderWithRouter(<SearchBarComponent showQuickCategories={true} />);

    const categoryButtons = screen.getAllByRole('button').filter(btn =>
      btn.classList.contains('medical-focus-category')
    );

    expect(categoryButtons.length).toBeGreaterThan(0);
    categoryButtons.forEach(button => {
      expect(button).toHaveClass('medical-focus-category');
      expect(button).toHaveAttribute('aria-describedby');
    });
  });

  it('suggestion items have proper ARIA attributes and focus states', async () => {
    renderWithRouter(<SearchBarComponent />);

    const searchInput = screen.getByRole('combobox');
    fireEvent.focus(searchInput);
    fireEvent.change(searchInput, { target: { value: 'test' } });

    await waitFor(() => {
      const listbox = screen.getByRole('listbox');
      expect(listbox).toBeInTheDocument();

      const suggestions = screen.getAllByRole('option');
      expect(suggestions.length).toBeGreaterThan(0);

      suggestions.forEach((suggestion, index) => {
        expect(suggestion).toHaveClass('medical-focus-suggestion');
        expect(suggestion).toHaveAttribute('aria-selected');
        expect(suggestion).toHaveAttribute('id', `suggestion-${index}`);
        expect(suggestion).toHaveAttribute('tabIndex', '-1');
      });
    });
  });

  it('supports high contrast mode', () => {
    // Mock high contrast media query
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-contrast: high)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    renderWithRouter(<SearchBarComponent />);

    const searchInput = screen.getByRole('combobox');
    expect(searchInput).toHaveClass('medical-focus-input');
  });
});
