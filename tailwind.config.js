module.exports = {
  darkMode: ['selector', '[zaui-theme="dark"]'],
  purge: {
    enabled: true,
    content: ['./src/**/*.{js,jsx,ts,tsx,vue}'],
  },
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        'primary-gradient': 'var(--primary-gradient)',
        highlight: 'var(--highlight)',
        background: 'var(--background)',
        foreground: 'var(--foreground, #1f2937)', // Added foreground color with fallback
        disabled: 'var(--disabled)',
      },
      spacing: {
        st: 'var(--safe-top)',
        sb: 'var(--safe-bottom)',
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
        popup: 'popup 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-small': 'bounce-small 1s infinite',
        'fade-in': 'fadeIn 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
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
      },
      boxShadow: {
        footer: '0 -4px 12px rgba(0, 0, 0, 0.05)',
        button: '0 2px 8px rgba(0, 0, 0, 0.12)',
        menu: '0 4px 20px rgba(0, 0, 0, 0.1)',
      },
    },
  },
};
