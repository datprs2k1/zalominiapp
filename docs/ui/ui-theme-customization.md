# Theme and Customization Guide

This guide covers the theming system, dark mode implementation, and customization options for the Zalo Healthcare Mini App UI.

## 📋 Table of Contents

- [Theming Architecture](#theming-architecture)
- [Theme Provider System](#theme-provider-system)
- [Dark Mode Implementation](#dark-mode-implementation)
- [Custom Theme Creation](#custom-theme-creation)
- [CSS Custom Properties](#css-custom-properties)
- [Component Theming](#component-theming)
- [Advanced Customization](#advanced-customization)

## 🏗️ Theming Architecture

### Theme System Overview

The theming system is built on a layered architecture:

```
Theme Layer Architecture:
├── Design Tokens (Base values)
├── Theme Definitions (Light/Dark variants)
├── CSS Custom Properties (Runtime variables)
├── Component Styles (Themed components)
└── User Preferences (Runtime customization)
```

### Core Theme Structure

```typescript
interface Theme {
  colors: {
    primary: ColorScale;
    secondary: ColorScale;
    semantic: SemanticColors;
    neutral: NeutralColors;
    medical: MedicalColors;
  };
  typography: TypographySystem;
  spacing: SpacingSystem;
  shadows: ShadowSystem;
  borderRadius: BorderRadiusSystem;
  animations: AnimationSystem;
}
```

## 🎨 Theme Provider System

### Theme Provider Implementation

<augment_code_snippet path="src/components/theme-provider.tsx" mode="EXCERPT">
````typescript
export const useTheme = () => {
  const [isDark, setIsDark] = useAtom(themeAtom);
  
  const getColor = useCallback((colorKey: string) => {
    const cssVar = `--color-${colorKey}`;
    return `var(${cssVar})`;
  }, []);

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
  };
}
````
</augment_code_snippet>

### Theme Context Usage

```tsx
// App-level theme provider
function App() {
  return (
    <ThemeProvider>
      <AnimationProvider>
        <RouterProvider router={router} />
      </AnimationProvider>
    </ThemeProvider>
  );
}

// Component-level theme usage
function MedicalCard({ children }) {
  const { cardStyle, isDark } = useTheme();
  
  return (
    <div 
      style={cardStyle}
      className={`medical-card ${isDark ? 'dark' : 'light'}`}
    >
      {children}
    </div>
  );
}
```

### Theme Toggle Component

```tsx
export const ThemeToggle = () => {
  const [isDark, setIsDark] = useAtom(themeAtom);
  
  const toggleTheme = () => {
    setIsDark(!isDark);
    // Update CSS custom properties
    updateThemeVariables(!isDark);
  };
  
  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
};
```

## 🌙 Dark Mode Implementation

### Dark Mode Color System

```css
/* Light mode (default) */
:root {
  --color-background: #FFFFFF;
  --color-surface: #F9FAFB;
  --color-text-primary: #111827;
  --color-text-secondary: #6B7280;
  --color-border: #E5E7EB;
  
  /* Medical colors - light mode */
  --color-primary: #2563EB;
  --color-primary-light: #DBEAFE;
  --color-emergency: #DC2626;
  --color-success: #059669;
}

/* Dark mode */
[data-theme="dark"] {
  --color-background: #111827;
  --color-surface: #1F2937;
  --color-text-primary: #F9FAFB;
  --color-text-secondary: #D1D5DB;
  --color-border: #374151;
  
  /* Adjusted medical colors for dark mode */
  --color-primary: #3B82F6;
  --color-primary-light: #1E3A8A;
  --color-emergency: #EF4444;
  --color-success: #10B981;
}
```

### Dark Mode Component Adaptations

```css
/* Medical card dark mode */
.medical-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  transition: all 0.3s ease;
}

/* Button dark mode */
.btn-primary {
  background: var(--color-primary);
  color: var(--color-text-on-primary);
  border: 1px solid var(--color-primary);
}

[data-theme="dark"] .btn-primary {
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
}

/* Form inputs dark mode */
.form-input {
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  color: var(--color-text-primary);
}

.form-input::placeholder {
  color: var(--color-text-secondary);
}
```

### Dark Mode Detection

```typescript
// System preference detection
const useSystemTheme = () => {
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  return systemTheme;
};

// Auto theme switching
const useAutoTheme = () => {
  const systemTheme = useSystemTheme();
  const [userPreference, setUserPreference] = useAtom(themePreferenceAtom);
  
  const effectiveTheme = userPreference === 'auto' ? systemTheme : userPreference;
  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', effectiveTheme);
  }, [effectiveTheme]);
  
  return { effectiveTheme, setUserPreference };
};
```

## 🎨 Custom Theme Creation

### Creating Custom Themes

```typescript
// Custom theme definition
const customMedicalTheme: Theme = {
  colors: {
    primary: {
      50: '#F0F9FF',
      100: '#E0F2FE',
      500: '#0EA5E9', // Custom primary color
      600: '#0284C7',
      900: '#0C4A6E',
    },
    medical: {
      cardiology: '#E11D48',    // Custom cardiology color
      neurology: '#7C3AED',     // Custom neurology color
      emergency: '#DC2626',     // Keep standard emergency
    },
    semantic: {
      success: '#059669',
      warning: '#D97706',
      error: '#DC2626',
      info: '#0284C7',
    }
  },
  typography: {
    fontFamily: {
      primary: '"Poppins", system-ui, sans-serif', // Custom font
    },
    fontSize: {
      // Custom font sizes
    }
  },
  // ... other theme properties
};

// Register custom theme
registerTheme('custom-medical', customMedicalTheme);
```

### Theme Variants

```typescript
// Hospital-specific theme variants
const hospitalThemes = {
  'general-hospital': {
    primary: '#2563EB',
    accent: '#059669',
    name: 'General Hospital Blue'
  },
  'childrens-hospital': {
    primary: '#10B981',
    accent: '#F59E0B',
    name: 'Children\'s Hospital Green'
  },
  'cardiac-center': {
    primary: '#EF4444',
    accent: '#2563EB',
    name: 'Cardiac Center Red'
  },
  'mental-health': {
    primary: '#8B5CF6',
    accent: '#06B6D4',
    name: 'Mental Health Purple'
  }
};

// Apply hospital theme
const applyHospitalTheme = (hospitalType: keyof typeof hospitalThemes) => {
  const theme = hospitalThemes[hospitalType];
  updateCSSVariables({
    '--color-primary': theme.primary,
    '--color-accent': theme.accent,
  });
};
```

## 🎛️ CSS Custom Properties

### Dynamic CSS Variables

<augment_code_snippet path="src/styles/unified-color-system.ts" mode="EXCERPT">
````typescript
export function generateCSSVariables(isDark = false): Record<string, string> {
  const variables: Record<string, string> = {};

  // Generate CSS custom properties from color tokens
  Object.entries(COLOR_TOKENS).forEach(([key, value]) => {
    variables[`--color-${key}`] = value;
  });

  // Add dark mode overrides if needed
  if (isDark) {
    variables['--color-background'] = MEDICAL_COLOR_PALETTE.neutral.gray[900];
    variables['--color-surface'] = MEDICAL_COLOR_PALETTE.neutral.gray[800];
    variables['--color-text-primary'] = MEDICAL_COLOR_PALETTE.neutral.gray[50];
  }

  return variables;
}
````
</augment_code_snippet>

### Runtime Variable Updates

```typescript
// Update CSS variables at runtime
const updateThemeVariables = (theme: Partial<Theme>) => {
  const root = document.documentElement;
  
  Object.entries(theme.colors || {}).forEach(([category, colors]) => {
    Object.entries(colors).forEach(([shade, value]) => {
      root.style.setProperty(`--color-${category}-${shade}`, value);
    });
  });
  
  // Update typography variables
  if (theme.typography) {
    Object.entries(theme.typography).forEach(([property, value]) => {
      root.style.setProperty(`--font-${property}`, value);
    });
  }
};

// Batch update for performance
const batchUpdateVariables = (updates: Record<string, string>) => {
  const root = document.documentElement;
  
  // Use requestAnimationFrame for smooth updates
  requestAnimationFrame(() => {
    Object.entries(updates).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  });
};
```

## 🧩 Component Theming

### Themeable Component Pattern

```tsx
interface ThemeableComponentProps {
  theme?: 'light' | 'dark' | 'auto';
  variant?: 'primary' | 'secondary' | 'medical';
  customColors?: {
    primary?: string;
    background?: string;
    text?: string;
  };
}

const ThemeableCard: FC<ThemeableComponentProps> = ({
  children,
  theme = 'auto',
  variant = 'primary',
  customColors,
  ...props
}) => {
  const { isDark } = useTheme();
  const effectiveTheme = theme === 'auto' ? (isDark ? 'dark' : 'light') : theme;
  
  const cardStyles = useMemo(() => ({
    backgroundColor: customColors?.background || `var(--color-surface)`,
    color: customColors?.text || `var(--color-text-primary)`,
    borderColor: `var(--color-border)`,
    ...getVariantStyles(variant, effectiveTheme)
  }), [customColors, variant, effectiveTheme]);
  
  return (
    <div
      className={`themeable-card theme-${effectiveTheme} variant-${variant}`}
      style={cardStyles}
      {...props}
    >
      {children}
    </div>
  );
};
```

### Medical Component Theming

```css
/* Medical card theming */
.medical-card {
  /* Base styles */
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  transition: all var(--transition-duration) ease;
}

/* Variant theming */
.medical-card--cardiology {
  border-left: 4px solid var(--color-cardiology);
  background: linear-gradient(135deg, 
    var(--color-cardiology-light) 0%, 
    var(--color-surface) 100%);
}

.medical-card--emergency {
  border: 2px solid var(--color-emergency);
  background: var(--color-emergency-light);
  animation: pulse 2s infinite;
}

/* Status theming */
.medical-card[data-status="critical"] {
  box-shadow: 0 0 20px rgba(220, 38, 38, 0.3);
}

.medical-card[data-status="normal"] {
  box-shadow: var(--shadow-sm);
}
```

## 🔧 Advanced Customization

### User Preference System

```typescript
// User preferences atom
export const userPreferencesAtom = atomWithStorage('userPreferences', {
  theme: 'auto' as 'light' | 'dark' | 'auto',
  primaryColor: '#2563EB',
  fontSize: 'medium' as 'small' | 'medium' | 'large',
  reducedMotion: false,
  highContrast: false,
  colorBlindMode: 'none' as 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia',
});

// Preference-based theming
const useUserTheming = () => {
  const [preferences] = useAtom(userPreferencesAtom);
  
  useEffect(() => {
    // Apply user preferences
    updateThemeVariables({
      '--color-primary': preferences.primaryColor,
      '--font-size-base': getFontSizeValue(preferences.fontSize),
    });
    
    // Apply accessibility preferences
    if (preferences.reducedMotion) {
      document.documentElement.style.setProperty('--animation-duration', '0s');
    }
    
    if (preferences.highContrast) {
      document.documentElement.classList.add('high-contrast');
    }
    
    if (preferences.colorBlindMode !== 'none') {
      document.documentElement.classList.add(`colorblind-${preferences.colorBlindMode}`);
    }
  }, [preferences]);
};
```

### Accessibility Theming

```css
/* High contrast mode */
.high-contrast {
  --color-text-primary: #000000;
  --color-background: #FFFFFF;
  --color-border: #000000;
  --color-primary: #0000FF;
  --color-emergency: #FF0000;
}

/* Color blind support */
.colorblind-protanopia {
  --color-emergency: #FF6B00; /* Orange instead of red */
  --color-success: #0066CC;   /* Blue instead of green */
}

.colorblind-deuteranopia {
  --color-success: #0066CC;   /* Blue instead of green */
  --color-warning: #FF6B00;   /* Orange for better distinction */
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Large text mode */
.large-text {
  --font-size-base: 1.25rem;
  --font-size-lg: 1.5rem;
  --font-size-xl: 1.875rem;
}
```

### Theme Persistence

```typescript
// Theme persistence service
class ThemePersistenceService {
  private storageKey = 'zalo-healthcare-theme';
  
  saveTheme(theme: Theme): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(theme));
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  }
  
  loadTheme(): Theme | null {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error);
      return null;
    }
  }
  
  clearTheme(): void {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.warn('Failed to clear theme from localStorage:', error);
    }
  }
}

// Usage in theme provider
const themeService = new ThemePersistenceService();

export const usePersistedTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    return themeService.loadTheme() || defaultTheme;
  });
  
  const updateTheme = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
    themeService.saveTheme(newTheme);
    applyThemeToDOM(newTheme);
  }, []);
  
  return { theme, updateTheme };
};
```

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Maintainer**: Zalo Healthcare Development Team
