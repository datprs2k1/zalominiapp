# UI Design System Documentation

This comprehensive guide covers the medical design system for the Zalo Healthcare Mini App, including colors, typography, spacing, iconography, and design tokens.

## 📋 Table of Contents

- [Design Principles](#design-principles)
- [Color System](#color-system)
- [Typography System](#typography-system)
- [Spacing and Layout](#spacing-and-layout)
- [Iconography](#iconography)
- [Design Tokens](#design-tokens)
- [Component Patterns](#component-patterns)

## 🎯 Design Principles

### Medical Design Philosophy

The design system is built around healthcare-specific principles:

1. **Trust & Professionalism**: Clean, professional aesthetics that inspire confidence
2. **Accessibility First**: WCAG 2.1 AA compliance for all users
3. **Mobile Optimization**: Touch-friendly, mobile-first design
4. **Clarity & Readability**: Clear information hierarchy and readable typography
5. **Emotional Comfort**: Calming colors and gentle interactions

### Visual Hierarchy

```
Critical Information (Emergency)
├── High contrast colors (Red, Orange)
├── Large typography (24px+)
└── Prominent positioning

Important Information (Medical Data)
├── Primary colors (Blue, Green)
├── Medium typography (16-20px)
└── Clear visual separation

Supporting Information
├── Neutral colors (Gray)
├── Standard typography (14-16px)
└── Subtle visual treatment
```

## 🎨 Color System

### Primary Medical Colors

<augment_code_snippet path="src/styles/unified-color-system.ts" mode="EXCERPT">
````typescript
export const COLOR_TOKENS = {
  // Modern Hospital Primary Colors - Trust & Professionalism
  primary: '#2563EB',        // Medical Blue - Primary actions, trust
  'primary-hover': '#1E40AF', // Dark Blue - Hover states, depth
  'primary-active': '#1D4ED8', // Accent Blue - Active states
  'primary-light': '#DBEAFE', // Light Blue - Backgrounds, subtle highlights
  'primary-dark': '#1E3A8A',  // Dark Blue - Emphasis, headers
````
</augment_code_snippet>

### Semantic Color Palette

```typescript
// Emergency & Critical States
emergency: '#DC2626',      // Critical alerts, emergency actions
'emergency-light': '#FEE2E2', // Emergency backgrounds
'emergency-dark': '#991B1B',  // Emergency emphasis

// Success & Positive States
success: '#059669',        // Success messages, completed actions
'success-light': '#D1FAE5', // Success backgrounds
'success-dark': '#047857',  // Success emphasis

// Warning & Caution States
warning: '#D97706',        // Warning messages, caution states
'warning-light': '#FEF3C7', // Warning backgrounds
'warning-dark': '#92400E',  // Warning emphasis

// Information & Neutral States
info: '#0284C7',          // Information messages, neutral actions
'info-light': '#E0F2FE',  // Information backgrounds
'info-dark': '#0369A1',   // Information emphasis
```

### Medical Specialty Colors

```typescript
// Department-specific color coding
cardiology: '#EF4444',     // Heart/Cardiology - Red
neurology: '#8B5CF6',      // Brain/Neurology - Purple
orthopedics: '#F59E0B',    // Bones/Orthopedics - Orange
pediatrics: '#10B981',     // Children/Pediatrics - Green
dermatology: '#F97316',    // Skin/Dermatology - Orange
ophthalmology: '#3B82F6', // Eyes/Ophthalmology - Blue
```

### Usage Guidelines

```css
/* Primary actions and navigation */
.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-text-on-primary);
}

/* Emergency and critical actions */
.btn-emergency {
  background-color: var(--color-emergency);
  color: white;
  animation: pulse 2s infinite;
}

/* Success states and confirmations */
.alert-success {
  background-color: var(--color-success-light);
  border-color: var(--color-success);
  color: var(--color-success-dark);
}
```

## ✍️ Typography System

### Font Hierarchy

<augment_code_snippet path="src/styles/enhanced-typography.ts" mode="EXCERPT">
````typescript
export const TYPOGRAPHY = {
  // Font Families - Optimized for Medical Readability
  fonts: {
    primary: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
    medical: '"SF Pro Display", "Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    mono: '"SF Mono", "JetBrains Mono", Monaco, "Cascadia Code", "Roboto Mono", monospace',
    display: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
  },
````
</augment_code_snippet>

### Typography Scale

```typescript
// Display Typography (Headers, Titles)
display: {
  '2xl': 'text-4xl md:text-5xl lg:text-6xl', // 36-60px - Hero titles
  'xl': 'text-3xl md:text-4xl lg:text-5xl',  // 30-48px - Page titles
  'lg': 'text-2xl md:text-3xl lg:text-4xl',  // 24-36px - Section titles
  'md': 'text-xl md:text-2xl lg:text-3xl',   // 20-30px - Card titles
  'sm': 'text-lg md:text-xl lg:text-2xl',    // 18-24px - Subsection titles
},

// Body Typography (Content, Labels)
body: {
  'xl': 'text-lg md:text-xl',    // 18-20px - Large body text
  'lg': 'text-base md:text-lg',  // 16-18px - Standard body text
  'md': 'text-sm md:text-base',  // 14-16px - Small body text
  'sm': 'text-xs md:text-sm',    // 12-14px - Caption text
  'xs': 'text-xs',               // 12px - Fine print
}
```

### Medical Typography Patterns

```typescript
// Medical-specific typography presets
MEDICAL_TYPOGRAPHY = {
  // Patient information
  patientName: 'text-xl font-semibold text-text-primary',
  patientId: 'text-sm font-mono text-text-secondary',
  
  // Medical data
  vitalSign: 'text-2xl font-bold text-primary',
  vitalLabel: 'text-sm font-medium text-text-secondary uppercase tracking-wide',
  
  // Diagnostic information
  diagnosis: 'text-lg font-medium text-text-primary',
  symptom: 'text-base text-text-primary',
  
  // Medication and dosage
  medication: 'text-base font-semibold text-text-primary',
  dosage: 'text-sm font-mono text-text-secondary',
  
  // Emergency text
  emergency: 'text-lg font-bold text-emergency uppercase tracking-wide',
}
```

### Responsive Typography

```css
/* Mobile-first responsive typography */
.responsive-title {
  font-size: clamp(1.5rem, 4vw, 3rem);
  line-height: 1.2;
  font-weight: 700;
}

.responsive-body {
  font-size: clamp(0.875rem, 2.5vw, 1.125rem);
  line-height: 1.6;
  font-weight: 400;
}

/* Medical data typography */
.vital-sign {
  font-size: clamp(1.5rem, 5vw, 2.5rem);
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}
```

## 📏 Spacing and Layout

### Spacing Scale

```typescript
// Medical spacing system (based on 4px grid)
SPACING = {
  'xs': '0.25rem',    // 4px - Tight spacing
  'sm': '0.5rem',     // 8px - Small spacing
  'md': '1rem',       // 16px - Standard spacing
  'lg': '1.5rem',     // 24px - Large spacing
  'xl': '2rem',       // 32px - Extra large spacing
  '2xl': '3rem',      // 48px - Section spacing
  '3xl': '4rem',      // 64px - Page spacing
  
  // Medical-specific spacing
  'card-padding': '1.5rem',      // 24px - Card internal padding
  'section-gap': '2rem',         // 32px - Between sections
  'component-gap': '1rem',       // 16px - Between components
  'touch-target': '2.75rem',     // 44px - Minimum touch target
}
```

### Layout Grid System

```css
/* Medical layout containers */
.medical-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.medical-grid {
  display: grid;
  gap: var(--spacing-lg);
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

/* Card layouts */
.medical-card {
  padding: var(--spacing-card-padding);
  border-radius: 0.75rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
}

/* Touch-friendly spacing */
.touch-friendly {
  min-height: var(--spacing-touch-target);
  padding: var(--spacing-sm) var(--spacing-md);
}
```

### Responsive Breakpoints

```typescript
// Medical app breakpoints
BREAKPOINTS = {
  'mobile': '320px',     // Small mobile devices
  'mobile-lg': '480px',  // Large mobile devices
  'tablet': '768px',     // Tablets
  'desktop': '1024px',   // Desktop
  'desktop-lg': '1280px' // Large desktop
}
```

## 🎭 Iconography

### Medical Icon System

<augment_code_snippet path="src/styles/enhanced-medical-iconography.ts" mode="EXCERPT">
````typescript
// Core Medical Icons - Essential Healthcare Symbols
export const MEDICAL_ICONS = {
  // Primary Medical Symbols
  core: {
    stethoscope: 'medical-stethoscope',
    heartRate: 'medical-heart-rate',
    medicalCross: 'medical-cross',
    hospital: 'medical-hospital',
    ambulance: 'medical-ambulance',
    prescription: 'medical-prescription',
    syringe: 'medical-syringe',
    pill: 'medical-pill',
    thermometer: 'medical-thermometer',
    bloodPressure: 'medical-blood-pressure',
  },
````
</augment_code_snippet>

### Icon Sizing System

```typescript
// Medical icon sizes
MEDICAL_ICON_SIZES = {
  'xs': '12px',      // Small inline icons
  'sm': '16px',      // Standard inline icons
  'md': '20px',      // Default icon size
  'lg': '24px',      // Large icons
  'xl': '32px',      // Extra large icons
  '2xl': '48px',     // Hero icons
  'emergency': '64px' // Emergency icons
}
```

### Icon Usage Guidelines

```css
/* Standard medical icons */
.medical-icon {
  width: var(--icon-size-md);
  height: var(--icon-size-md);
  fill: currentColor;
  flex-shrink: 0;
}

/* Emergency icons */
.emergency-icon {
  width: var(--icon-size-emergency);
  height: var(--icon-size-emergency);
  fill: var(--color-emergency);
  animation: pulse 2s infinite;
}

/* Department icons */
.department-icon {
  width: var(--icon-size-xl);
  height: var(--icon-size-xl);
  fill: var(--color-primary);
}
```

## 🎨 Design Tokens

### CSS Custom Properties

```css
:root {
  /* Color tokens */
  --color-primary: #2563EB;
  --color-primary-hover: #1E40AF;
  --color-emergency: #DC2626;
  --color-success: #059669;
  --color-warning: #D97706;
  
  /* Typography tokens */
  --font-family-primary: 'Inter', system-ui, sans-serif;
  --font-size-base: 1rem;
  --line-height-base: 1.6;
  
  /* Spacing tokens */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* Border radius tokens */
  --border-radius-sm: 0.25rem;
  --border-radius-md: 0.5rem;
  --border-radius-lg: 0.75rem;
  --border-radius-xl: 1rem;
  
  /* Shadow tokens */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-medical: 0 4px 12px rgba(37, 99, 235, 0.15);
}
```

### Dark Mode Tokens

```css
[data-theme="dark"] {
  --color-background: #111827;
  --color-surface: #1F2937;
  --color-text-primary: #F9FAFB;
  --color-text-secondary: #D1D5DB;
  --color-border: #374151;
  
  /* Adjusted medical colors for dark mode */
  --color-primary: #3B82F6;
  --color-emergency: #EF4444;
  --color-success: #10B981;
}
```

## 🧩 Component Patterns

### Medical Card Pattern

```css
.medical-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
}

.medical-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.medical-card--emergency {
  border-color: var(--color-emergency);
  background: var(--color-emergency-light);
}
```

### Button Pattern

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  min-height: var(--spacing-touch-target);
  border-radius: var(--border-radius-md);
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
}

.btn--primary {
  background: var(--color-primary);
  color: white;
  border: 1px solid var(--color-primary);
}

.btn--emergency {
  background: var(--color-emergency);
  color: white;
  border: 1px solid var(--color-emergency);
  animation: pulse 2s infinite;
}
```

### Form Pattern

```css
.form-field {
  margin-bottom: var(--spacing-lg);
}

.form-label {
  display: block;
  margin-bottom: var(--spacing-xs);
  font-weight: 500;
  color: var(--color-text-primary);
}

.form-input {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  background: var(--color-surface);
  color: var(--color-text-primary);
  min-height: var(--spacing-touch-target);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}
```

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Maintainer**: Zalo Healthcare Development Team
