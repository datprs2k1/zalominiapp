# Android Material Design 3 Footer Optimization

## Overview
This document defines specific UX improvements for Android devices following Material Design 3 principles for the Zalo Mini App healthcare footer navigation.

## Material Design 3 Navigation Components

### Bottom Navigation Bar Specifications

#### Layout & Dimensions
```css
/* Material Design 3 Bottom Navigation */
.android-footer {
  height: 80px; /* 80dp with labels */
  background: var(--md-sys-color-surface-container);
  elevation: 3; /* 3dp surface elevation */
  border-top: 1px solid var(--md-sys-color-outline-variant);
}

.android-nav-item {
  min-width: 56px; /* 56dp recommended touch target */
  min-height: 56px;
  padding: 12px 8px 16px; /* Top, horizontal, bottom */
  border-radius: 16px; /* Large border radius for M3 */
}
```

#### Touch Target System
- **Minimum**: 48dp × 48dp (accessibility compliance)
- **Recommended**: 56dp × 56dp (optimal touch experience)
- **Large**: 64dp × 64dp (for primary actions)
- **Spacing**: 8dp minimum between touch targets

#### State Layer System
```css
/* Material Design 3 State Layers */
.android-nav-item {
  /* Hover State (8% opacity) */
  &:hover::before {
    background: var(--md-sys-color-on-surface);
    opacity: 0.08;
  }
  
  /* Focus State (12% opacity) */
  &:focus-visible::before {
    background: var(--md-sys-color-on-surface);
    opacity: 0.12;
  }
  
  /* Pressed State (12% opacity) */
  &:active::before {
    background: var(--md-sys-color-on-surface);
    opacity: 0.12;
  }
  
  /* Selected State */
  &.selected {
    background: var(--md-sys-color-secondary-container);
    color: var(--md-sys-color-on-secondary-container);
  }
}
```

### Material You Color System

#### Dynamic Color Tokens
```typescript
// Material Design 3 Color Tokens for Healthcare
export const androidMaterialColors = {
  // Primary Colors (Medical Blue)
  primary: 'rgb(37, 99, 235)', // #2563EB
  onPrimary: 'rgb(255, 255, 255)',
  primaryContainer: 'rgb(219, 234, 254)', // #DBEAFE
  onPrimaryContainer: 'rgb(30, 64, 175)', // #1E40AF
  
  // Secondary Colors (Medical Green)
  secondary: 'rgb(16, 185, 129)', // #10B981
  onSecondary: 'rgb(255, 255, 255)',
  secondaryContainer: 'rgb(209, 250, 229)', // #D1FAE5
  onSecondaryContainer: 'rgb(6, 95, 70)', // #065F46
  
  // Surface Colors
  surface: 'rgb(255, 255, 255)',
  onSurface: 'rgb(28, 25, 23)',
  surfaceContainer: 'rgb(248, 250, 252)', // #F8FAFC
  surfaceContainerHigh: 'rgb(241, 245, 249)', // #F1F5F9
  
  // Outline Colors
  outline: 'rgb(148, 163, 184)', // #94A3B8
  outlineVariant: 'rgb(226, 232, 240)', // #E2E8F0
};
```

#### Color Application
```css
/* Android Footer Color Application */
.android-footer {
  background-color: var(--md-sys-color-surface-container);
  border-top-color: var(--md-sys-color-outline-variant);
}

.android-nav-item {
  color: var(--md-sys-color-on-surface-variant);
  
  &.selected {
    background-color: var(--md-sys-color-secondary-container);
    color: var(--md-sys-color-on-secondary-container);
  }
  
  &:hover {
    background-color: color-mix(in srgb, var(--md-sys-color-on-surface) 8%, transparent);
  }
}
```

### Typography System

#### Material Design 3 Type Scale
```css
/* Android Navigation Typography */
.android-nav-label {
  font-family: 'Roboto', 'Noto Sans', system-ui, sans-serif;
  font-size: 12px; /* Label Small */
  font-weight: 500; /* Medium weight */
  line-height: 16px;
  letter-spacing: 0.5px;
  text-align: center;
}

.android-nav-badge {
  font-family: 'Roboto', 'Noto Sans', system-ui, sans-serif;
  font-size: 11px; /* Label Extra Small */
  font-weight: 500;
  line-height: 16px;
  letter-spacing: 0.5px;
}
```

### Elevation & Shadows

#### Material Design 3 Elevation System
```css
/* Elevation Level 3 for Bottom Navigation */
.android-footer {
  box-shadow: 
    0px 1px 2px rgba(0, 0, 0, 0.3),
    0px 2px 6px 2px rgba(0, 0, 0, 0.15);
}

/* Elevated state for interactions */
.android-nav-item:active {
  box-shadow: 
    0px 1px 3px 1px rgba(0, 0, 0, 0.15),
    0px 1px 2px rgba(0, 0, 0, 0.3);
}
```

### Ripple Effects & Animations

#### Material Ripple Implementation
```typescript
// Android Ripple Effect
export const createMaterialRipple = (element: HTMLElement, color: string = 'currentColor') => {
  const ripple = document.createElement('span');
  ripple.className = 'material-ripple';
  
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;
  
  ripple.style.cssText = `
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
    background: ${color};
    opacity: 0.12;
    border-radius: 50%;
    transform: scale(0);
    animation: material-ripple 300ms cubic-bezier(0.2, 0.0, 0, 1.0);
  `;
  
  element.appendChild(ripple);
  setTimeout(() => ripple.remove(), 300);
};
```

#### Animation Specifications
```css
/* Material Design 3 Animations */
@keyframes material-ripple {
  to {
    transform: scale(2);
    opacity: 0;
  }
}

.android-nav-item {
  transition: 
    background-color 150ms cubic-bezier(0.2, 0.0, 0, 1.0),
    color 150ms cubic-bezier(0.2, 0.0, 0, 1.0),
    transform 150ms cubic-bezier(0.2, 0.0, 0, 1.0);
}

/* Emphasized easing for important transitions */
.android-footer-enter {
  animation: android-footer-slide-up 300ms cubic-bezier(0.2, 0.0, 0, 1.0);
}

@keyframes android-footer-slide-up {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
```

### Accessibility Enhancements

#### Android Accessibility Features
```typescript
// Android-specific accessibility
export const androidAccessibilityFeatures = {
  // TalkBack support
  talkBackLabels: {
    home: 'Trang chủ, tab 1 trong 5',
    services: 'Dịch vụ, tab 2 trong 5',
    explore: 'Khám phá, tab 3 trong 5',
    schedule: 'Lịch hẹn, tab 4 trong 5, có 2 thông báo mới',
    profile: 'Hồ sơ, tab 5 trong 5'
  },
  
  // Touch exploration
  touchExploration: {
    enabled: true,
    hapticFeedback: true,
    audioFeedback: true
  },
  
  // High contrast support
  highContrast: {
    borderWidth: '2px',
    focusIndicatorWidth: '3px',
    minimumContrast: 4.5
  }
};
```

### Responsive Behavior

#### Navigation Rail for Larger Screens
```css
/* Navigation Rail for tablets/large screens */
@media (min-width: 768px) and (orientation: landscape) {
  .android-footer {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 80px; /* Collapsed rail width */
    height: 100vh;
    flex-direction: column;
    padding: 24px 0;
  }
  
  .android-nav-item {
    width: 56px;
    height: 56px;
    margin: 12px auto;
    border-radius: 16px;
  }
  
  .android-nav-label {
    font-size: 11px;
    margin-top: 4px;
  }
}
```

### Healthcare-Specific Adaptations

#### Medical Navigation Patterns
```typescript
// Healthcare-specific Android adaptations
export const androidHealthcarePatterns = {
  // Emergency button styling
  emergencyButton: {
    backgroundColor: 'var(--md-sys-color-error-container)',
    color: 'var(--md-sys-color-on-error-container)',
    elevation: 6, // Higher elevation for prominence
    rippleColor: 'var(--md-sys-color-error)',
  },
  
  // Notification badges
  notificationBadge: {
    backgroundColor: 'var(--md-sys-color-error)',
    color: 'var(--md-sys-color-on-error)',
    minWidth: '16px',
    height: '16px',
    borderRadius: '8px',
    fontSize: '11px',
  },
  
  // Status indicators
  statusIndicators: {
    online: 'var(--md-sys-color-tertiary)',
    offline: 'var(--md-sys-color-outline)',
    urgent: 'var(--md-sys-color-error)',
    normal: 'var(--md-sys-color-primary)',
  }
};
```

## Implementation Checklist

### Component Requirements
- [ ] Material Design 3 color system implementation
- [ ] 56dp touch targets with proper spacing
- [ ] State layer system for interactions
- [ ] Ripple effects for touch feedback
- [ ] Elevation system with proper shadows
- [ ] Roboto font family integration
- [ ] TalkBack accessibility support
- [ ] Navigation rail for larger screens

### Testing Requirements
- [ ] Touch target size validation (48dp minimum)
- [ ] Color contrast testing (4.5:1 minimum)
- [ ] TalkBack screen reader testing
- [ ] Ripple animation performance testing
- [ ] High contrast mode validation
- [ ] RTL layout support testing
- [ ] Tablet/landscape mode testing

### Performance Considerations
- [ ] Ripple animation optimization
- [ ] Color system CSS custom properties
- [ ] Lazy loading of navigation rail
- [ ] Memory management for animations
- [ ] Bundle size optimization

## Success Metrics

### Material Design Compliance
- **Design System**: 95%+ Material Design 3 compliance
- **Touch Targets**: 100% meet 48dp minimum requirement
- **Color Contrast**: 100% meet 4.5:1 ratio requirement
- **Animation Performance**: 60fps on all Android devices

### User Experience
- **Navigation Speed**: 25% faster than current implementation
- **Touch Accuracy**: 95%+ successful touch interactions
- **Accessibility Score**: 90%+ using Android Accessibility Scanner
- **User Satisfaction**: 4.5+ rating in Android app reviews
