module.exports = {
  darkMode: ['selector', '[zaui-theme="dark"]'],
  purge: {
    enabled: true,
    content: ['./src/**/*.{js,jsx,ts,tsx,vue}'],
  },
  theme: {
    extend: {
      colors: {
        // Primary Medical Colors - Unified Color System
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          active: 'var(--color-primary-active)',
          light: 'var(--color-primary-light)',
          dark: 'var(--color-primary-dark)',
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#2563EB',
          600: '#1E40AF',
          700: '#1D4ED8',
          800: '#1E3A8A',
          900: '#1E293B',
        },

        // Secondary Medical Colors - Healing Greens
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          hover: 'var(--color-secondary-hover)',
          light: 'var(--color-secondary-light)',
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },

        // Accent Colors - Trust Cyan
        accent: {
          DEFAULT: 'var(--color-accent)',
          hover: 'var(--color-accent-hover)',
          light: 'var(--color-accent-light)',
          50: '#ECFEFF',
          100: '#CFFAFE',
          200: '#A5F3FC',
          300: '#67E8F9',
          400: '#22D3EE',
          500: '#0891B2',
          600: '#0E7490',
          700: '#155E75',
          800: '#164E63',
          900: '#083344',
        },

        // Background Colors - Unified System
        background: {
          DEFAULT: 'var(--color-background)',
          secondary: 'var(--color-background-secondary)',
          tertiary: 'var(--color-background-tertiary)',
          elevated: 'var(--color-background-elevated)',
          overlay: 'var(--color-background-overlay)',
        },

        // Surface Colors - Unified System
        surface: {
          DEFAULT: 'var(--color-surface)',
          elevated: 'var(--color-surface-elevated)',
          hover: 'var(--color-surface-hover)',
          medical: 'var(--color-surface-medical)',
        },

        // Border Colors - Unified System
        border: {
          DEFAULT: 'var(--color-border)',
          light: 'var(--color-border-light)',
          strong: 'var(--color-border-strong)',
          focus: 'var(--color-border-focus)',
          error: 'var(--color-border-error)',
        },

        // Text Colors - Unified System
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
          disabled: 'var(--color-text-disabled)',
          inverse: 'var(--color-text-inverse)',
          'on-primary': 'var(--color-text-on-primary)',
          'on-secondary': 'var(--color-text-on-secondary)',
        },

        // Semantic State Colors - Unified System
        success: {
          DEFAULT: 'var(--color-success)',
          light: 'var(--color-success-light)',
          hover: 'var(--color-success-hover)',
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
        },

        warning: {
          DEFAULT: 'var(--color-warning)',
          light: 'var(--color-warning-light)',
          hover: 'var(--color-warning-hover)',
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#451A03',
        },

        error: {
          DEFAULT: 'var(--color-error)',
          light: 'var(--color-error-light)',
          hover: 'var(--color-error-hover)',
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#DC2626',
          600: '#B91C1C',
          700: '#991B1B',
          800: '#7F1D1D',
          900: '#450A0A',
        },

        info: {
          DEFAULT: 'var(--color-info)',
          light: 'var(--color-info-light)',
          hover: 'var(--color-info-hover)',
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
        },

        // Medical Neutral Colors - Hospital Environment
        neutral: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },

        // Legacy colors removed - use unified color system tokens instead
        foreground: 'var(--text-primary)',
        disabled: 'var(--text-disabled)',
      },
      spacing: {
        // Safe areas
        st: 'var(--safe-top)',
        sb: 'var(--safe-bottom)',

        // Touch targets
        touch: 'var(--touch-target)', // 44px minimum touch target
        'touch-lg': 'var(--touch-target-lg)', // 56px large touch target

        // Medical spacing system
        xs: 'var(--spacing-xs)', // 4px
        sm: 'var(--spacing-sm)', // 8px
        md: 'var(--spacing-md)', // 16px
        lg: 'var(--spacing-lg)', // 24px
        xl: 'var(--spacing-xl)', // 32px
        '2xl': 'var(--spacing-2xl)', // 48px
        '3xl': 'var(--spacing-3xl)', // 64px

        // Component specific spacing
        'card-sm': 'var(--card-padding-sm)',
        'card-md': 'var(--card-padding-md)',
        'card-lg': 'var(--card-padding-lg)',
      },

      borderRadius: {
        none: '0',
        xs: 'var(--border-radius-xs)', // 4px
        sm: 'var(--border-radius-sm)', // 8px
        DEFAULT: 'var(--border-radius-md)', // 12px
        md: 'var(--border-radius-md)', // 12px
        lg: 'var(--border-radius-lg)', // 16px
        xl: 'var(--border-radius-xl)', // 20px
        '2xl': 'var(--border-radius-2xl)', // 24px
        '3xl': '32px',
        full: 'var(--border-radius-full)', // 9999px
      },

      // Medical component heights
      height: {
        'input-sm': 'var(--input-height-sm)', // 40px
        'input-md': 'var(--input-height-md)', // 48px
        'input-lg': 'var(--input-height-lg)', // 56px
        'button-sm': 'var(--button-height-sm)', // 36px
        'button-md': 'var(--button-height-md)', // 44px
        'button-lg': 'var(--button-height-lg)', // 52px
      },

      // Medical icon sizes
      width: {
        'icon-xs': 'var(--icon-xs)', // 12px
        'icon-sm': 'var(--icon-sm)', // 16px
        'icon-md': 'var(--icon-md)', // 20px
        'icon-lg': 'var(--icon-lg)', // 24px
        'icon-xl': 'var(--icon-xl)', // 32px
        'icon-2xl': 'var(--icon-2xl)', // 48px
      },
      fontSize: {
        '4xs': ['10px', '14px'],
        '3xs': ['11px', '16px'],
        '2xs': ['12px', '16px'],
        xs: ['13px', '18px'],
        sm: ['14px', '18px'],
        base: ['15px', '20px'],
        lg: ['16px', '22px'],
        xl: ['18px', '24px'],
      },
      animation: {
        // Existing animations
        popup: 'popup 0.3s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-small': 'bounce-small 1s infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.25s ease-out',
        'pulse-subtle': 'pulseSubtle 2s infinite',

        // Medical-specific animations
        heartbeat: 'heartbeat 2s ease-in-out infinite',
        'medical-pulse': 'medicalPulse 1.5s ease-in-out infinite',
        'slide-up-gentle': 'slideUpGentle 0.4s var(--ease-medical)',
        'slide-down-gentle': 'slideDownGentle 0.4s var(--ease-medical)',
        'slide-left-gentle': 'slideLeftGentle 0.3s var(--ease-medical)',
        'slide-right-gentle': 'slideRightGentle 0.3s var(--ease-medical)',
        'fade-in-up': 'fadeInUp 0.5s var(--ease-medical)',
        'fade-in-down': 'fadeInDown 0.5s var(--ease-medical)',
        'scale-in-gentle': 'scaleInGentle 0.3s var(--ease-medical)',
        'loading-dots': 'loadingDots 1.4s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        'progress-bar': 'progressBar 2s ease-in-out',
        'notification-slide': 'notificationSlide 0.4s var(--ease-medical)',
        'card-hover': 'cardHover 0.2s var(--ease-medical)',
        'button-press': 'buttonPress 0.15s var(--ease-medical)',
        'focus-ring': 'focusRing 0.2s var(--ease-medical)',
      },
      keyframes: {
        popup: {
          '0%': { transform: 'translateY(100%)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'bounce-small': {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-10%)',
          },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },

        // Medical-specific keyframes
        heartbeat: {
          '0%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.1)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.1)' },
          '70%': { transform: 'scale(1)' },
        },

        medicalPulse: {
          '0%': { transform: 'scale(1)', opacity: 1 },
          '50%': { transform: 'scale(1.05)', opacity: 0.8 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },

        slideUpGentle: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },

        slideDownGentle: {
          '0%': { transform: 'translateY(-20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },

        slideLeftGentle: {
          '0%': { transform: 'translateX(20px)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },

        slideRightGentle: {
          '0%': { transform: 'translateX(-20px)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },

        fadeInUp: {
          '0%': { transform: 'translateY(30px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },

        fadeInDown: {
          '0%': { transform: 'translateY(-30px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },

        scaleInGentle: {
          '0%': { transform: 'scale(0.95)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },

        loadingDots: {
          '0%, 80%, 100%': { transform: 'scale(0)' },
          '40%': { transform: 'scale(1)' },
        },

        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },

        progressBar: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },

        notificationSlide: {
          '0%': { transform: 'translateX(100%)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },

        cardHover: {
          '0%': { transform: 'translateY(0) scale(1)', boxShadow: 'var(--shadow-sm)' },
          '100%': { transform: 'translateY(-2px) scale(1.01)', boxShadow: 'var(--shadow-md)' },
        },

        buttonPress: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.98)' },
          '100%': { transform: 'scale(1)' },
        },

        focusRing: {
          '0%': { boxShadow: '0 0 0 0 rgba(0, 102, 204, 0.4)' },
          '100%': { boxShadow: '0 0 0 4px rgba(0, 102, 204, 0.1)' },
        },
      },
      boxShadow: {
        // Enhanced shadow system for medical UI
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        medical: 'var(--shadow-medical)',
        'medical-hover': 'var(--shadow-medical-hover)',

        // Specific component shadows - Enhanced
        card: '0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.06)',
        'card-elevated': '0 4px 16px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)',

        // Button shadows
        button: '0 2px 8px rgba(0, 102, 204, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1)',
        'button-hover': '0 4px 12px rgba(0, 102, 204, 0.2), 0 2px 4px rgba(0, 0, 0, 0.1)',
        'button-pressed': '0 1px 4px rgba(0, 102, 204, 0.2), inset 0 1px 2px rgba(0, 0, 0, 0.1)',

        // Input shadows
        input: '0 1px 3px rgba(0, 0, 0, 0.05), inset 0 1px 2px rgba(0, 0, 0, 0.02)',
        'input-focus': '0 0 0 3px rgba(0, 102, 204, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1)',
        'input-error': '0 0 0 3px rgba(229, 62, 62, 0.1), 0 1px 3px rgba(229, 62, 62, 0.2)',

        // Overlay shadows
        dropdown: '0 8px 24px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08)',
        modal: '0 20px 40px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1)',
        notification: '0 4px 16px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
        tooltip: '0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)',

        // Status-specific shadows - Enhanced
        success: '0 2px 8px rgba(0, 168, 107, 0.15)',
        'success-hover': '0 4px 12px rgba(0, 168, 107, 0.2)',
        warning: '0 2px 8px rgba(245, 158, 11, 0.15)',
        'warning-hover': '0 4px 12px rgba(245, 158, 11, 0.2)',
        error: '0 2px 8px rgba(229, 62, 62, 0.15)',
        'error-hover': '0 4px 12px rgba(229, 62, 62, 0.2)',
        info: '0 2px 8px rgba(49, 130, 206, 0.15)',
        'info-hover': '0 4px 12px rgba(49, 130, 206, 0.2)',

        // Medical semantic shadows
        emergency: '0 2px 8px rgba(220, 38, 38, 0.2), 0 1px 3px rgba(220, 38, 38, 0.1)',
        urgent: '0 2px 8px rgba(245, 158, 11, 0.2), 0 1px 3px rgba(245, 158, 11, 0.1)',
        routine: '0 2px 8px rgba(16, 185, 129, 0.15), 0 1px 3px rgba(16, 185, 129, 0.1)',
        consultation: '0 2px 8px rgba(99, 102, 241, 0.15), 0 1px 3px rgba(99, 102, 241, 0.1)',

        // Legacy support
        footer: '0 -4px 12px rgba(0, 0, 0, 0.05)',
        menu: '0 4px 20px rgba(0, 0, 0, 0.1)',
      },
    },
  },
};
