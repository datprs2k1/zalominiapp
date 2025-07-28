import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { generateCSSVariables, COLOR_TOKENS, getColorToken, type ColorToken } from '@/styles/unified-color-system';

// Theme Context Type Definition
interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  getColor: (token: ColorToken) => string;
  colors: typeof COLOR_TOKENS;
}

// Create theme context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: 'light' | 'dark';
  storageKey?: string;
}

// Theme Provider Component
export function ThemeProvider({
  children,
  defaultTheme = 'light',
  storageKey = 'medical-app-theme',
}: ThemeProviderProps) {
  const [isDark, setIsDark] = useState<boolean>(() => {
    // Check localStorage first
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        return stored === 'dark';
      }

      // Check system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    return defaultTheme === 'dark';
  });

  // Toggle theme function
  const toggleTheme = () => {
    setIsDark((prev) => {
      const newTheme = !prev;
      localStorage.setItem(storageKey, newTheme ? 'dark' : 'light');
      return newTheme;
    });
  };

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    const variables = generateCSSVariables(isDark);

    // Apply CSS custom properties
    Object.entries(variables).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    // Add theme class to body
    document.body.classList.toggle('dark', isDark);
    document.body.classList.toggle('light', !isDark);

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDark ? '#0F172A' : '#FFFFFF');
    }

    // Add theme attribute to document element
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if user hasn't manually set a preference
      const hasManualPreference = localStorage.getItem(storageKey);
      if (!hasManualPreference) {
        setIsDark(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [storageKey]);

  const contextValue: ThemeContextType = {
    isDark,
    toggleTheme,
    getColor: getColorToken,
    colors: COLOR_TOKENS,
  };

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
}

// Hook to use theme
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Utility hook for getting colors
export function useColors() {
  const { getColor, colors } = useTheme();
  return { getColor, colors };
}

// Hook for theme-aware styling
export function useThemeStyles() {
  const { isDark, getColor } = useTheme();

  return {
    isDark,
    getColor,
    // Common style combinations
    cardStyle: {
      backgroundColor: getColor('surface'),
      borderColor: getColor('border'),
      color: getColor('text-primary'),
    },
    buttonPrimaryStyle: {
      backgroundColor: getColor('primary'),
      color: getColor('text-on-primary'),
    },
    buttonSecondaryStyle: {
      backgroundColor: getColor('secondary'),
      color: getColor('text-on-secondary'),
    },
    inputStyle: {
      backgroundColor: getColor('surface'),
      borderColor: getColor('border'),
      color: getColor('text-primary'),
    },
    errorStyle: {
      backgroundColor: getColor('error-light'),
      borderColor: getColor('error'),
      color: getColor('text-primary'),
    },
    successStyle: {
      backgroundColor: getColor('success-light'),
      borderColor: getColor('success'),
      color: getColor('text-primary'),
    },
  };
}

// Theme toggle button component
export function ThemeToggle({ className = '', size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const { isDark, toggleTheme } = useTheme();

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        ${sizeClasses[size]}
        rounded-full bg-surface border border-border
        flex items-center justify-center
        transition-all duration-200
        hover:bg-background-tertiary hover:scale-105
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        ${className}
      `}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        // Sun icon for light mode
        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        // Moon icon for dark mode
        <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  );
}

// Themed container component
export function ThemedContainer({
  children,
  className = '',
  variant = 'primary',
}: {
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'elevated';
}) {
  const { colors } = useTheme();

  const variantStyles = {
    primary: 'bg-surface-primary border-border-primary',
    secondary: 'bg-surface-secondary border-border-secondary',
    elevated: 'bg-surface-elevated shadow-md',
  };

  return <div className={`${variantStyles[variant]} ${className}`}>{children}</div>;
}

// Themed text component
export function ThemedText({
  children,
  variant = 'primary',
  className = '',
}: {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'muted' | 'inverse';
  className?: string;
}) {
  const variantStyles = {
    primary: 'text-text-primary',
    secondary: 'text-text-secondary',
    muted: 'text-text-muted',
    inverse: 'text-text-inverse',
  };

  return <span className={`${variantStyles[variant]} ${className}`}>{children}</span>;
}

// Medical status indicator with theme support
export function MedicalStatusIndicator({
  status,
  size = 'md',
  className = '',
}: {
  status: 'vital' | 'normal' | 'caution' | 'emergency';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const { colors } = useTheme();

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const statusColors = {
    vital: colors.medical.vital,
    normal: colors.medical.normal,
    caution: colors.medical.caution,
    emergency: colors.medical.emergency,
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full ${className}`}
      style={{ backgroundColor: statusColors[status] }}
      aria-label={`Status: ${status}`}
    />
  );
}

// Theme-aware gradient background
export function GradientBackground({
  children,
  variant = 'medical',
  className = '',
}: {
  children: ReactNode;
  variant?: 'medical' | 'success' | 'warning' | 'error';
  className?: string;
}) {
  const { isDark } = useTheme();

  const gradients = {
    medical: isDark
      ? 'bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900'
      : 'bg-gradient-to-br from-blue-50 via-white to-blue-100',
    success: isDark
      ? 'bg-gradient-to-br from-green-900 via-green-800 to-green-900'
      : 'bg-gradient-to-br from-green-50 via-white to-green-100',
    warning: isDark
      ? 'bg-gradient-to-br from-yellow-900 via-yellow-800 to-yellow-900'
      : 'bg-gradient-to-br from-yellow-50 via-white to-yellow-100',
    error: isDark
      ? 'bg-gradient-to-br from-red-900 via-red-800 to-red-900'
      : 'bg-gradient-to-br from-red-50 via-white to-red-100',
  };

  return <div className={`${gradients[variant]} ${className}`}>{children}</div>;
}
