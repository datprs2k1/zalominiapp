# iOS Human Interface Guidelines Footer Optimization

## Overview
This document defines specific UX improvements for iOS devices following iOS 17 Human Interface Guidelines for the Zalo Mini App healthcare footer navigation.

## iOS Tab Bar Specifications

### Layout & Dimensions

#### Tab Bar Structure
```css
/* iOS Tab Bar Implementation */
.ios-footer {
  height: 83px; /* 49pt content + 34pt safe area */
  background: rgba(248, 248, 248, 0.94); /* System background with transparency */
  backdrop-filter: blur(20px); /* iOS blur effect */
  border-top: 0.5px solid rgba(60, 60, 67, 0.29); /* Separator color */
  padding-bottom: max(env(safe-area-inset-bottom), 34px);
}

.ios-tab-bar-content {
  height: 49px; /* Standard tab bar content height */
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 8px;
}

.ios-nav-item {
  min-width: 44px; /* 44pt minimum touch target */
  min-height: 44px;
  padding: 4px 8px;
  border-radius: 8px; /* Subtle iOS border radius */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
```

#### Safe Area Handling
```css
/* iOS Safe Area Implementation */
.ios-footer {
  /* iPhone 15 Series Safe Areas */
  padding-bottom: max(env(safe-area-inset-bottom, 34px), 34px);
  padding-left: env(safe-area-inset-left, 0px);
  padding-right: env(safe-area-inset-right, 0px);
}

/* Dynamic Island / Notch Considerations */
@supports (padding: max(0px)) {
  .ios-footer {
    padding-bottom: max(34px, env(safe-area-inset-bottom));
  }
}
```

### iOS Color System

#### System Colors
```typescript
// iOS System Colors for Healthcare App
export const iOSSystemColors = {
  // Primary Colors
  systemBlue: 'rgb(0, 122, 255)', // #007AFF
  systemGreen: 'rgb(52, 199, 89)', // #34C759 (for medical/health)
  systemIndigo: 'rgb(88, 86, 214)', // #5856D6
  
  // Label Colors
  label: 'rgb(0, 0, 0)', // Primary text
  secondaryLabel: 'rgb(60, 60, 67, 0.6)', // Secondary text
  tertiaryLabel: 'rgb(60, 60, 67, 0.3)', // Tertiary text
  
  // Background Colors
  systemBackground: 'rgb(255, 255, 255)',
  secondarySystemBackground: 'rgb(242, 242, 247)', // #F2F2F7
  tertiarySystemBackground: 'rgb(255, 255, 255)',
  
  // Grouped Background Colors
  systemGroupedBackground: 'rgb(242, 242, 247)', // #F2F2F7
  secondarySystemGroupedBackground: 'rgb(255, 255, 255)',
  
  // Separator Colors
  separator: 'rgba(60, 60, 67, 0.29)',
  opaqueSeparator: 'rgb(198, 198, 200)', // #C6C6C8
  
  // Fill Colors
  systemFill: 'rgba(120, 120, 128, 0.2)',
  secondarySystemFill: 'rgba(120, 120, 128, 0.16)',
  tertiarySystemFill: 'rgba(118, 118, 128, 0.12)',
  quaternarySystemFill: 'rgba(116, 116, 128, 0.08)',
};

// Dark Mode Support
export const iOSSystemColorsDark = {
  label: 'rgb(255, 255, 255)',
  secondaryLabel: 'rgba(235, 235, 245, 0.6)',
  tertiaryLabel: 'rgba(235, 235, 245, 0.3)',
  systemBackground: 'rgb(0, 0, 0)',
  secondarySystemBackground: 'rgb(28, 28, 30)',
  separator: 'rgba(84, 84, 88, 0.65)',
  // ... additional dark mode colors
};
```

#### Color Application
```css
/* iOS Tab Bar Color Application */
.ios-footer {
  background-color: var(--ios-system-background);
  border-top-color: var(--ios-separator);
}

.ios-nav-item {
  color: var(--ios-secondary-label);
  
  &.selected {
    color: var(--ios-system-blue);
  }
  
  &:active {
    background-color: var(--ios-quaternary-system-fill);
    transform: scale(0.95); /* iOS-style press feedback */
  }
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  .ios-footer {
    background-color: rgba(28, 28, 30, 0.94);
    border-top-color: rgba(84, 84, 88, 0.65);
  }
}
```

### Typography System

#### SF Pro Font Family
```css
/* iOS Typography with SF Pro */
.ios-nav-label {
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif;
  font-size: 10px; /* Caption 1 */
  font-weight: 400; /* Regular */
  line-height: 12px;
  letter-spacing: 0px;
  text-align: center;
  margin-top: 2px;
}

.ios-nav-badge {
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif;
  font-size: 12px; /* Caption 1 */
  font-weight: 600; /* Semibold */
  line-height: 16px;
  letter-spacing: 0px;
}

/* Dynamic Type Support */
@media (prefers-reduced-motion: no-preference) {
  .ios-nav-label {
    font-size: max(10px, 1rem * var(--dynamic-type-multiplier, 1));
  }
}
```

### Haptic Feedback System

#### iOS Haptic Patterns
```typescript
// iOS Haptic Feedback Implementation
export class iOSHapticFeedback {
  private isSupported: boolean;
  
  constructor() {
    this.isSupported = 'vibrate' in navigator && /iPhone|iPad|iPod/.test(navigator.userAgent);
  }
  
  // Selection feedback (light tap)
  selection() {
    if (this.isSupported) {
      navigator.vibrate(10);
    }
  }
  
  // Impact feedback
  impactLight() {
    if (this.isSupported) {
      navigator.vibrate(10);
    }
  }
  
  impactMedium() {
    if (this.isSupported) {
      navigator.vibrate(20);
    }
  }
  
  impactHeavy() {
    if (this.isSupported) {
      navigator.vibrate(30);
    }
  }
  
  // Notification feedback
  notificationSuccess() {
    if (this.isSupported) {
      navigator.vibrate([10, 50, 10]);
    }
  }
  
  notificationWarning() {
    if (this.isSupported) {
      navigator.vibrate([20, 100, 20]);
    }
  }
  
  notificationError() {
    if (this.isSupported) {
      navigator.vibrate([50, 100, 50]);
    }
  }
}
```

### Animation System

#### iOS Spring Animations
```css
/* iOS Spring Animation System */
.ios-nav-item {
  transition: 
    color 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    background-color 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* iOS-style press animation */
.ios-nav-item:active {
  transform: scale(0.95);
  transition-duration: 0.1s;
}

/* Tab switching animation */
.ios-footer-enter {
  animation: ios-tab-fade-in 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

@keyframes ios-tab-fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Badge animation */
.ios-badge-enter {
  animation: ios-badge-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes ios-badge-bounce {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
```

### Accessibility Features

#### VoiceOver Support
```typescript
// iOS VoiceOver Implementation
export const iOSAccessibilityFeatures = {
  // VoiceOver labels
  voiceOverLabels: {
    home: 'Trang chủ, tab, 1 trong 5',
    services: 'Dịch vụ, tab, 2 trong 5',
    explore: 'Khám phá, tab, 3 trong 5',
    schedule: 'Lịch hẹn, tab, 4 trong 5, 2 thông báo mới',
    profile: 'Hồ sơ, tab, 5 trong 5'
  },
  
  // Voice Control support
  voiceControlNames: {
    home: 'Trang chủ',
    services: 'Dịch vụ',
    explore: 'Khám phá',
    schedule: 'Lịch hẹn',
    profile: 'Hồ sơ'
  },
  
  // Dynamic Type support
  dynamicType: {
    enabled: true,
    minScale: 0.8,
    maxScale: 2.0,
    preferredSizes: ['Small', 'Medium', 'Large', 'Extra Large']
  },
  
  // Reduce Motion support
  reduceMotion: {
    respectPreference: true,
    fallbackDuration: '0.01s',
    disableParallax: true
  }
};
```

#### Focus Management
```css
/* iOS Focus Indicators */
.ios-nav-item:focus-visible {
  outline: 2px solid var(--ios-system-blue);
  outline-offset: 2px;
  border-radius: 8px;
}

/* High Contrast Mode Support */
@media (prefers-contrast: high) {
  .ios-footer {
    border-top-width: 2px;
    border-top-color: var(--ios-label);
  }
  
  .ios-nav-item {
    border: 1px solid var(--ios-label);
  }
  
  .ios-nav-item.selected {
    background-color: var(--ios-system-blue);
    color: white;
  }
}
```

### Badge System

#### iOS Notification Badges
```css
/* iOS Badge Implementation */
.ios-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  min-width: 17px;
  height: 17px;
  background-color: var(--ios-system-red);
  color: white;
  border-radius: 8.5px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.ios-badge:empty {
  min-width: 8px;
  height: 8px;
  border-radius: 4px;
  padding: 0;
}

/* Badge animation */
.ios-badge-update {
  animation: ios-badge-pulse 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

@keyframes ios-badge-pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
```

### Healthcare-Specific Adaptations

#### Medical iOS Patterns
```typescript
// Healthcare-specific iOS adaptations
export const iOSHealthcarePatterns = {
  // Emergency button styling
  emergencyButton: {
    backgroundColor: 'var(--ios-system-red)',
    color: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(255, 59, 48, 0.3)',
    hapticFeedback: 'heavy',
  },
  
  // Health status indicators
  healthStatus: {
    excellent: 'var(--ios-system-green)',
    good: 'var(--ios-system-blue)',
    warning: 'var(--ios-system-orange)',
    critical: 'var(--ios-system-red)',
  },
  
  // Medical badge colors
  medicalBadges: {
    appointment: 'var(--ios-system-blue)',
    urgent: 'var(--ios-system-red)',
    reminder: 'var(--ios-system-orange)',
    completed: 'var(--ios-system-green)',
  }
};
```

### Responsive Behavior

#### iPad and Large Screen Adaptations
```css
/* iPad Tab Bar Adaptations */
@media (min-width: 768px) {
  .ios-footer {
    height: 70px; /* Slightly taller for iPad */
    padding: 0 max(env(safe-area-inset-left), 20px) 
             max(env(safe-area-inset-bottom), 20px) 
             max(env(safe-area-inset-right), 20px);
  }
  
  .ios-nav-item {
    min-width: 60px;
    min-height: 50px;
    padding: 8px 12px;
  }
  
  .ios-nav-label {
    font-size: 12px;
    margin-top: 4px;
  }
}

/* iPhone Pro Max Adaptations */
@media (min-width: 428px) {
  .ios-nav-item {
    min-width: 48px;
    padding: 6px 10px;
  }
}
```

## Implementation Checklist

### Component Requirements
- [ ] iOS system color implementation with dark mode
- [ ] 44pt minimum touch targets
- [ ] SF Pro font family integration
- [ ] Backdrop blur effects
- [ ] Safe area inset handling
- [ ] Spring animation system
- [ ] Haptic feedback patterns
- [ ] VoiceOver accessibility support
- [ ] Dynamic Type support
- [ ] Badge notification system

### Testing Requirements
- [ ] Touch target size validation (44pt minimum)
- [ ] VoiceOver screen reader testing
- [ ] Voice Control compatibility testing
- [ ] Dynamic Type scaling testing
- [ ] Dark mode appearance testing
- [ ] High contrast mode validation
- [ ] Safe area handling on all iPhone models
- [ ] iPad layout testing

### Performance Considerations
- [ ] Backdrop filter performance optimization
- [ ] Spring animation performance
- [ ] Haptic feedback battery impact
- [ ] Memory management for blur effects
- [ ] Bundle size optimization

## Success Metrics

### iOS HIG Compliance
- **Design System**: 95%+ iOS Human Interface Guidelines compliance
- **Touch Targets**: 100% meet 44pt minimum requirement
- **Accessibility**: 100% VoiceOver compatibility
- **Performance**: 60fps animations on all iOS devices

### User Experience
- **Navigation Speed**: 30% faster than current implementation
- **Touch Accuracy**: 98%+ successful touch interactions
- **Accessibility Score**: 95%+ using iOS Accessibility Inspector
- **User Satisfaction**: 4.7+ rating in iOS App Store reviews
