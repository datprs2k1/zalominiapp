module.exports = {
  darkMode: ['selector', '[zaui-theme="dark"]'],
  purge: {
    enabled: true,
    content: ['./src/**/*.{js,jsx,ts,tsx,vue}'],
  },
  theme: {
    screens: {
      xs: '360px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        // Legacy colors (maintain compatibility)
        primary: 'var(--primary)',
        'primary-gradient': 'var(--primary-gradient)',
        highlight: 'var(--highlight)',
        background: 'var(--background)',
        foreground: 'var(--foreground, #1f2937)',
        disabled: 'var(--disabled)',

        // Enhanced Serene Blues Design System Colors
        // Optimized for healthcare mobile applications with improved accessibility
        medical: {
          50: '#E3F2FD', // Serene Blues - Lightest background
          100: '#BBDEFB', // Serene Blues - Light cards and surfaces
          200: '#90CAF9', // Serene Blues - Subtle accents and borders
          300: '#64B5F6', // Serene Blues - Primary interactive elements
          400: '#42A5F5', // Enhanced contrast for better accessibility
          500: '#2196F3', // Primary action color - WCAG AA compliant
          600: '#1E88E5', // Enhanced focus states and hover
          700: '#1976D2', // Better text contrast on light backgrounds
          800: '#1565C0', // Improved readability for important text
          900: '#0D47A1', // Enhanced depth and emphasis
          950: '#0A3D91', // Maximum contrast for critical text
        },
        wellness: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        // Status colors for medical context
        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        danger: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        // Neutral grays for medical UI
        neutral: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
      },
      spacing: {
        st: 'var(--safe-top)',
        sb: 'var(--safe-bottom)',
        // Medical-specific spacing
        'touch-target': '44px', // Minimum touch target size
        'form-gap': '1.5rem', // Standard form element spacing
        'card-padding': '1.25rem', // Standard card padding
      },
      scale: {
        102: '1.02',
        98: '0.98',
      },
      fontSize: {
        // Existing sizes
        '4xs': ['10px', '14px'],
        '3xs': ['11px', '16px'],
        '2xs': ['12px', '16px'],
        xs: ['13px', '18px'],
        sm: ['14px', '18px'],
        base: ['15px', '20px'],
        lg: ['16px', '22px'],
        xl: ['18px', '24px'],
        // Medical-specific typography
        'medical-label': ['12px', { lineHeight: '16px', fontWeight: '500' }],
        'medical-body': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'medical-heading': ['18px', { lineHeight: '24px', fontWeight: '600' }],
        'medical-title': ['24px', { lineHeight: '32px', fontWeight: '700' }],
      },
      animation: {
        // Existing animations
        popup: 'popup 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-small': 'bounce-small 1s infinite',
        'fade-in': 'fadeIn 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        // Medical-specific animations optimized for mobile performance
        'slide-up': 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up-mobile': 'slideUpMobile 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'fade-in-mobile': 'fadeInMobile 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        heartbeat: 'heartbeat 1.5s ease-in-out infinite',
        'loading-dots': 'loadingDots 1.4s ease-in-out infinite',
        skeleton: 'skeleton 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        // Enhanced mobile touch feedback
        'touch-feedback': 'touchFeedback 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      keyframes: {
        // Existing keyframes
        popup: {
          '0%': { transform: 'translateY(100%) translateZ(0)', opacity: 0 },
          '100%': { transform: 'translateY(0) translateZ(0)', opacity: 1 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9) translateZ(0)', opacity: 0 },
          '100%': { transform: 'scale(1) translateZ(0)', opacity: 1 },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'bounce-small': {
          '0%, 100%': {
            transform: 'translateY(0) translateZ(0)',
          },
          '50%': {
            transform: 'translateY(-10%) translateZ(0)',
          },
        },
        // Medical-specific keyframes
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        loadingDots: {
          '0%, 80%, 100%': { transform: 'scale(0)' },
          '40%': { transform: 'scale(1)' },
        },
        skeleton: {
          '0%': { backgroundPosition: '-200px 0' },
          '100%': { backgroundPosition: 'calc(200px + 100%) 0' },
        },
        // Enhanced mobile-optimized keyframes
        slideUpMobile: {
          '0%': { transform: 'translateY(20px) translateZ(0)', opacity: 0 },
          '100%': { transform: 'translateY(0) translateZ(0)', opacity: 1 },
        },
        fadeInMobile: {
          '0%': { opacity: 0, transform: 'translateZ(0)' },
          '100%': { opacity: 1, transform: 'translateZ(0)' },
        },
        touchFeedback: {
          '0%': { transform: 'scale(1) translateZ(0)' },
          '50%': { transform: 'scale(0.97) translateZ(0)' },
          '100%': { transform: 'scale(1) translateZ(0)' },
        },
      },
      boxShadow: {
        // Existing shadows
        footer: '0 -4px 12px rgba(0, 0, 0, 0.05)',
        button: '0 2px 8px rgba(0, 0, 0, 0.12)',
        menu: '0 4px 20px rgba(0, 0, 0, 0.1)',
        // Enhanced Medical-specific shadows with Serene Blues
        // Updated to use the new Serene Blues palette (medical-500: #2196F3)
        'card-medical': '0 2px 12px rgba(33, 150, 243, 0.08)',
        'card-hover': '0 6px 20px rgba(33, 150, 243, 0.12)',
        'card-elevated': '0 8px 24px rgba(33, 150, 243, 0.15)',
        'button-medical': '0 3px 10px rgba(33, 150, 243, 0.15)',
        'form-focus': '0 0 0 3px rgba(33, 150, 243, 0.12)',
        emergency: '0 4px 16px rgba(239, 68, 68, 0.15)',
        subtle: '0 1px 3px rgba(33, 150, 243, 0.05)',
        // Modern header shadows
        header: '0 1px 3px rgba(0, 0, 0, 0.1)',
        'header-scroll': '0 2px 8px rgba(0, 0, 0, 0.15)',
      },
      borderRadius: {
        medical: '12px',
        'medical-lg': '16px',
        'medical-xl': '20px',
      },
      backdropBlur: {
        medical: '8px',
      },
    },
  },
};
