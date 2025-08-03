# Visual Style Guide

This visual style guide showcases the complete visual language of the Zalo Healthcare Mini App, including color palettes, typography scales, iconography, and visual patterns.

## 📋 Table of Contents

- [Brand Identity](#brand-identity)
- [Color Palette](#color-palette)
- [Typography Scale](#typography-scale)
- [Iconography System](#iconography-system)
- [Visual Patterns](#visual-patterns)
- [Component Showcase](#component-showcase)
- [Usage Examples](#usage-examples)

## 🎨 Brand Identity

### Visual Principles

The Zalo Healthcare visual identity is built on four core principles:

1. **Trust & Professionalism** - Clean, medical-grade aesthetics
2. **Accessibility & Clarity** - High contrast, readable design
3. **Warmth & Comfort** - Approachable, human-centered design
4. **Modern & Reliable** - Contemporary design with timeless appeal

### Brand Colors

```
Primary Brand Color: Medical Blue (#2563EB)
- Represents trust, professionalism, and medical expertise
- Used for primary actions, navigation, and key UI elements

Secondary Brand Color: Healthcare Green (#059669)
- Represents health, wellness, and positive outcomes
- Used for success states, confirmations, and wellness indicators

Accent Color: Emergency Red (#DC2626)
- Represents urgency, critical alerts, and emergency situations
- Used sparingly for high-priority notifications and emergency actions
```

## 🌈 Color Palette

### Primary Color System

```css
/* Medical Blue Palette */
--color-primary-50:  #EFF6FF;  /* Ultra light backgrounds */
--color-primary-100: #DBEAFE;  /* Light backgrounds, subtle highlights */
--color-primary-200: #BFDBFE;  /* Light borders, disabled states */
--color-primary-300: #93C5FD;  /* Muted elements, placeholders */
--color-primary-400: #60A5FA;  /* Secondary elements */
--color-primary-500: #2563EB;  /* Primary brand color */
--color-primary-600: #1E40AF;  /* Hover states, emphasis */
--color-primary-700: #1D4ED8;  /* Active states, pressed */
--color-primary-800: #1E3A8A;  /* Dark emphasis, headers */
--color-primary-900: #1E293B;  /* Darkest shade, high contrast */
```

### Semantic Color System

```css
/* Success - Healthcare Green */
--color-success-light: #D1FAE5;  /* Success backgrounds */
--color-success:       #059669;  /* Success messages, positive states */
--color-success-dark:  #047857;  /* Success emphasis */

/* Warning - Medical Orange */
--color-warning-light: #FEF3C7;  /* Warning backgrounds */
--color-warning:       #D97706;  /* Warning messages, caution */
--color-warning-dark:  #92400E;  /* Warning emphasis */

/* Error/Emergency - Medical Red */
--color-error-light:   #FEE2E2;  /* Error backgrounds */
--color-error:         #DC2626;  /* Error messages, emergency */
--color-error-dark:    #991B1B;  /* Error emphasis */

/* Information - Medical Cyan */
--color-info-light:    #E0F2FE;  /* Info backgrounds */
--color-info:          #0284C7;  /* Info messages, neutral */
--color-info-dark:     #0369A1;  /* Info emphasis */
```

### Neutral Color System

```css
/* Gray Scale for Text and Backgrounds */
--color-gray-50:  #F9FAFB;  /* Lightest background */
--color-gray-100: #F3F4F6;  /* Light background */
--color-gray-200: #E5E7EB;  /* Light borders */
--color-gray-300: #D1D5DB;  /* Borders, dividers */
--color-gray-400: #9CA3AF;  /* Disabled text */
--color-gray-500: #6B7280;  /* Secondary text */
--color-gray-600: #4B5563;  /* Primary text */
--color-gray-700: #374151;  /* Dark text */
--color-gray-800: #1F2937;  /* Darker backgrounds */
--color-gray-900: #111827;  /* Darkest backgrounds */
```

### Medical Specialty Colors

```css
/* Department-Specific Color Coding */
--color-cardiology:    #EF4444;  /* Heart/Cardiology - Red */
--color-neurology:     #8B5CF6;  /* Brain/Neurology - Purple */
--color-orthopedics:   #F59E0B;  /* Bones/Orthopedics - Orange */
--color-pediatrics:    #10B981;  /* Children/Pediatrics - Green */
--color-dermatology:   #F97316;  /* Skin/Dermatology - Orange */
--color-ophthalmology: #3B82F6;  /* Eyes/Ophthalmology - Blue */
--color-dentistry:     #06B6D4;  /* Dental - Cyan */
--color-psychiatry:    #A855F7;  /* Mental Health - Purple */
```

## ✍️ Typography Scale

### Font Hierarchy

```css
/* Primary Font Stack */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;

/* Display Typography (Headers, Titles) */
--font-size-display-2xl: clamp(2.25rem, 5vw, 3.75rem);  /* 36-60px - Hero titles */
--font-size-display-xl:  clamp(1.875rem, 4vw, 3rem);    /* 30-48px - Page titles */
--font-size-display-lg:  clamp(1.5rem, 3.5vw, 2.25rem); /* 24-36px - Section titles */
--font-size-display-md:  clamp(1.25rem, 3vw, 1.875rem); /* 20-30px - Card titles */
--font-size-display-sm:  clamp(1.125rem, 2.5vw, 1.5rem);/* 18-24px - Subsection titles */

/* Body Typography (Content, Labels) */
--font-size-body-xl: clamp(1.125rem, 2.5vw, 1.25rem);   /* 18-20px - Large body */
--font-size-body-lg: clamp(1rem, 2vw, 1.125rem);        /* 16-18px - Standard body */
--font-size-body-md: clamp(0.875rem, 1.5vw, 1rem);      /* 14-16px - Small body */
--font-size-body-sm: clamp(0.75rem, 1.25vw, 0.875rem);  /* 12-14px - Caption */
--font-size-body-xs: 0.75rem;                            /* 12px - Fine print */
```

### Font Weights

```css
--font-weight-light:     300;  /* Light text, subtle elements */
--font-weight-normal:    400;  /* Body text, standard content */
--font-weight-medium:    500;  /* Emphasis, labels, buttons */
--font-weight-semibold:  600;  /* Headings, important text */
--font-weight-bold:      700;  /* Strong emphasis, titles */
--font-weight-extrabold: 800;  /* Hero text, major headings */
```

### Line Heights

```css
--line-height-tight:  1.25;  /* Headings, titles */
--line-height-normal: 1.5;   /* Body text, standard */
--line-height-relaxed: 1.625; /* Long-form content */
--line-height-loose:  2;     /* Spaced content, captions */
```

### Medical Typography Examples

```css
/* Patient Information */
.patient-name {
  font-size: var(--font-size-display-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
}

.patient-id {
  font-size: var(--font-size-body-sm);
  font-weight: var(--font-weight-medium);
  font-family: 'SF Mono', monospace;
  color: var(--color-gray-600);
}

/* Vital Signs */
.vital-sign-value {
  font-size: var(--font-size-display-xl);
  font-weight: var(--font-weight-bold);
  font-variant-numeric: tabular-nums;
  color: var(--color-primary);
}

.vital-sign-label {
  font-size: var(--font-size-body-sm);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-gray-500);
}

/* Emergency Text */
.emergency-text {
  font-size: var(--font-size-display-lg);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-error);
}
```

## 🎭 Iconography System

### Icon Categories

```
Medical Core Icons (24 icons)
├── Stethoscope, Heart Rate, Medical Cross
├── Hospital, Ambulance, Prescription
├── Syringe, Pill, Thermometer
└── Blood Pressure, X-Ray, Microscope

Medical Specialties (16 icons)
├── Cardiology, Neurology, Orthopedics
├── Pediatrics, Dermatology, Ophthalmology
├── Dentistry, Psychiatry, Oncology
└── Emergency, Surgery, Radiology

User Interface Icons (32 icons)
├── Navigation: Home, Back, Menu, Search
├── Actions: Add, Edit, Delete, Share
├── Status: Check, Warning, Error, Info
└── Controls: Play, Pause, Settings, Help
```

### Icon Sizing System

```css
/* Icon Size Scale */
--icon-size-xs:  12px;  /* Inline icons, small indicators */
--icon-size-sm:  16px;  /* Standard inline icons */
--icon-size-md:  20px;  /* Default icon size */
--icon-size-lg:  24px;  /* Large icons, buttons */
--icon-size-xl:  32px;  /* Extra large icons, headers */
--icon-size-2xl: 48px;  /* Hero icons, empty states */
--icon-size-3xl: 64px;  /* Emergency icons, splash screens */
```

### Icon Usage Guidelines

```css
/* Standard Icon Styling */
.medical-icon {
  width: var(--icon-size-md);
  height: var(--icon-size-md);
  fill: currentColor;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

/* Emergency Icons */
.emergency-icon {
  width: var(--icon-size-3xl);
  height: var(--icon-size-3xl);
  fill: var(--color-error);
  animation: pulse 2s infinite;
}

/* Department Icons */
.department-icon {
  width: var(--icon-size-xl);
  height: var(--icon-size-xl);
  fill: var(--color-primary);
  background: var(--color-primary-50);
  border-radius: 50%;
  padding: 8px;
}
```

## 🎨 Visual Patterns

### Card Patterns

```css
/* Medical Card Base */
.medical-card {
  background: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.medical-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

/* Emergency Card Variant */
.medical-card--emergency {
  border-color: var(--color-error);
  background: linear-gradient(135deg, 
    var(--color-error-light) 0%, 
    var(--color-white) 100%);
}

/* Success Card Variant */
.medical-card--success {
  border-color: var(--color-success);
  background: linear-gradient(135deg, 
    var(--color-success-light) 0%, 
    var(--color-white) 100%);
}
```

### Button Patterns

```css
/* Primary Button */
.btn-primary {
  background: linear-gradient(135deg, 
    var(--color-primary) 0%, 
    var(--color-primary-600) 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 500;
  min-height: 44px;
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
  transition: all 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(37, 99, 235, 0.3);
}

/* Emergency Button */
.btn-emergency {
  background: linear-gradient(135deg, 
    var(--color-error) 0%, 
    var(--color-error-dark) 100%);
  color: white;
  animation: pulse 2s infinite;
  box-shadow: 0 0 20px rgba(220, 38, 38, 0.4);
}
```

### Form Patterns

```css
/* Form Field */
.form-field {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--color-gray-700);
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--color-gray-200);
  border-radius: 8px;
  background: var(--color-white);
  font-size: var(--font-size-body-md);
  min-height: 44px;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-input--error {
  border-color: var(--color-error);
  background: var(--color-error-light);
}
```

## 🎯 Component Showcase

### Doctor Card Example

```css
.doctor-card {
  background: var(--color-white);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.doctor-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.doctor-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 3px solid var(--color-primary-100);
}

.doctor-name {
  font-size: var(--font-size-display-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
  margin: 16px 0 8px;
}

.doctor-specialty {
  font-size: var(--font-size-body-md);
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
}

.doctor-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
}
```

### Appointment Card Example

```css
.appointment-card {
  background: linear-gradient(135deg, 
    var(--color-primary-50) 0%, 
    var(--color-white) 100%);
  border: 1px solid var(--color-primary-200);
  border-radius: 12px;
  padding: 20px;
}

.appointment-time {
  font-size: var(--font-size-display-md);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  font-variant-numeric: tabular-nums;
}

.appointment-date {
  font-size: var(--font-size-body-sm);
  color: var(--color-gray-600);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.appointment-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: var(--font-size-body-sm);
  font-weight: var(--font-weight-medium);
}

.appointment-status--confirmed {
  background: var(--color-success-light);
  color: var(--color-success-dark);
}
```

## 📱 Usage Examples

### Mobile-First Responsive Design

```css
/* Mobile First (320px+) */
.responsive-container {
  padding: 16px;
  max-width: 100%;
}

.responsive-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

/* Tablet (768px+) */
@media (min-width: 768px) {
  .responsive-container {
    padding: 24px;
    max-width: 768px;
    margin: 0 auto;
  }
  
  .responsive-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .responsive-container {
    padding: 32px;
    max-width: 1200px;
  }
  
  .responsive-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
  }
}
```

### Dark Mode Support

```css
[data-theme="dark"] {
  --color-background: #111827;
  --color-surface: #1F2937;
  --color-text-primary: #F9FAFB;
  --color-text-secondary: #D1D5DB;
  --color-border: #374151;
  
  /* Adjusted medical colors for dark mode */
  --color-primary: #3B82F6;
  --color-primary-light: #1E3A8A;
}

.medical-card {
  background: var(--color-surface);
  border-color: var(--color-border);
  color: var(--color-text-primary);
}
```

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Maintainer**: Zalo Healthcare Development Team
