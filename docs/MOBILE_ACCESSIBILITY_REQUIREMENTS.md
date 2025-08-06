# Mobile Accessibility Requirements

## Overview
This document defines comprehensive accessibility requirements for mobile users, ensuring WCAG 2.1 AA compliance and platform-specific accessibility features for the footer navigation redesign.

## WCAG 2.1 AA Compliance Requirements

### 1. Perceivable

#### 1.1 Text Alternatives
```typescript
// ARIA labels for navigation items
export const accessibilityLabels = {
  vietnamese: {
    home: 'Trang chủ, điều hướng tab 1 trong 5',
    services: 'Dịch vụ y tế, điều hướng tab 2 trong 5',
    explore: 'Khám phá, điều hướng tab 3 trong 5',
    schedule: 'Lịch hẹn khám bệnh, điều hướng tab 4 trong 5',
    profile: 'Hồ sơ cá nhân, điều hướng tab 5 trong 5'
  },
  
  // Badge notifications
  badges: {
    single: '1 thông báo mới',
    multiple: (count: number) => `${count} thông báo mới`,
    urgent: 'Thông báo khẩn cấp'
  }
};
```

#### 1.2 Time-based Media
```html
<!-- Icon alternatives for screen readers -->
<button aria-label="Trang chủ, điều hướng tab 1 trong 5">
  <svg aria-hidden="true" focusable="false">
    <!-- Icon content -->
  </svg>
  <span class="sr-only">Trang chủ</span>
</button>
```

#### 1.3 Adaptable Content
```css
/* Responsive text sizing for accessibility */
.footer-nav-label {
  font-size: clamp(10px, 2.5vw, 14px);
  line-height: 1.4;
}

/* Support for user zoom up to 200% */
@media (min-resolution: 2dppx) {
  .footer-nav-label {
    font-size: max(10px, 1rem);
  }
}
```

#### 1.4 Distinguishable
```css
/* Color contrast requirements (4.5:1 minimum) */
:root {
  --text-primary: #1f2937; /* Contrast ratio: 12.6:1 */
  --text-secondary: #4b5563; /* Contrast ratio: 7.0:1 */
  --text-disabled: #9ca3af; /* Contrast ratio: 4.5:1 */
  --background-primary: #ffffff;
  --accent-primary: #2563eb; /* Contrast ratio: 5.9:1 */
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  :root {
    --text-primary: #000000;
    --text-secondary: #000000;
    --background-primary: #ffffff;
    --accent-primary: #0000ff;
  }
  
  .footer-nav-item {
    border: 2px solid currentColor;
  }
  
  .footer-nav-item.selected {
    background-color: var(--accent-primary);
    color: white;
  }
}
```

### 2. Operable

#### 2.1 Keyboard Accessible
```typescript
// Keyboard navigation implementation
export const keyboardNavigation = {
  // Arrow key navigation
  handleKeyDown: (event: KeyboardEvent, currentIndex: number, totalItems: number) => {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        return currentIndex > 0 ? currentIndex - 1 : totalItems - 1;
      
      case 'ArrowRight':
        event.preventDefault();
        return currentIndex < totalItems - 1 ? currentIndex + 1 : 0;
      
      case 'Home':
        event.preventDefault();
        return 0;
      
      case 'End':
        event.preventDefault();
        return totalItems - 1;
      
      case 'Enter':
      case ' ':
        event.preventDefault();
        // Activate current item
        return currentIndex;
      
      default:
        return currentIndex;
    }
  }
};
```

#### 2.2 Enough Time
```css
/* No time limits for navigation interactions */
.footer-nav-item {
  /* Remove any automatic timeouts */
  transition-duration: 0.2s; /* Quick enough to not cause delays */
}

/* Respect reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  .footer-nav-item {
    transition-duration: 0.01ms;
    animation: none;
  }
}
```

#### 2.3 Seizures and Physical Reactions
```css
/* Avoid flashing content */
.footer-nav-item {
  /* No rapid flashing animations */
  animation-iteration-count: 1;
}

/* Safe animation patterns */
@keyframes safe-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

#### 2.4 Navigable
```html
<!-- Skip link for footer navigation -->
<a href="#footer-navigation" class="skip-link">
  Chuyển đến điều hướng chính
</a>

<!-- Proper heading structure -->
<footer role="contentinfo" aria-label="Điều hướng chính của ứng dụng">
  <nav id="footer-navigation" aria-label="Điều hướng tab chính">
    <ul role="tablist">
      <li role="presentation">
        <a role="tab" aria-selected="true" aria-controls="home-panel">
          Trang chủ
        </a>
      </li>
    </ul>
  </nav>
</footer>
```

### 3. Understandable

#### 3.1 Readable
```css
/* Vietnamese language support */
html[lang="vi"] .footer-nav-label {
  font-family: 'Inter', 'Roboto', 'Noto Sans', system-ui, sans-serif;
  font-feature-settings: "kern" 1, "liga" 1;
}

/* Text spacing for readability */
.footer-nav-label {
  letter-spacing: 0.025em;
  word-spacing: 0.1em;
  line-height: 1.4;
}
```

#### 3.2 Predictable
```typescript
// Consistent navigation behavior
export const navigationBehavior = {
  // Always maintain same order
  navigationOrder: ['home', 'services', 'explore', 'schedule', 'profile'],
  
  // Consistent interaction patterns
  activationMethod: 'single-tap', // No double-tap requirements
  
  // Predictable focus management
  focusManagement: {
    maintainFocusOnNavigation: true,
    returnFocusAfterModal: true,
    trapFocusInModals: true
  }
};
```

#### 3.3 Input Assistance
```html
<!-- Clear error messages -->
<div role="alert" aria-live="polite" id="navigation-error">
  <!-- Error messages appear here -->
</div>

<!-- Helpful instructions -->
<div class="sr-only" id="navigation-instructions">
  Sử dụng phím mũi tên để điều hướng giữa các tab. 
  Nhấn Enter hoặc Space để kích hoạt tab đã chọn.
</div>
```

### 4. Robust

#### 4.1 Compatible
```html
<!-- Semantic HTML structure -->
<footer role="contentinfo">
  <nav role="navigation" aria-label="Điều hướng chính">
    <ul role="tablist" aria-describedby="navigation-instructions">
      <li role="presentation">
        <button 
          role="tab"
          aria-selected="true"
          aria-controls="home-panel"
          id="home-tab"
          tabindex="0"
        >
          <svg aria-hidden="true" focusable="false">
            <!-- Icon -->
          </svg>
          <span>Trang chủ</span>
        </button>
      </li>
    </ul>
  </nav>
</footer>
```

## Platform-Specific Accessibility

### iOS Accessibility Features

#### VoiceOver Support
```typescript
// iOS VoiceOver implementation
export const iOSVoiceOver = {
  // Custom rotor support
  customRotor: {
    name: 'Điều hướng y tế',
    items: [
      { label: 'Trang chủ', element: '#home-tab' },
      { label: 'Dịch vụ', element: '#services-tab' },
      { label: 'Khám phá', element: '#explore-tab' },
      { label: 'Lịch hẹn', element: '#schedule-tab' },
      { label: 'Hồ sơ', element: '#profile-tab' }
    ]
  },
  
  // Voice Control support
  voiceControlNames: {
    home: ['Trang chủ', 'Home', 'Nhà'],
    services: ['Dịch vụ', 'Services', 'Khám bệnh'],
    explore: ['Khám phá', 'Explore', 'Tìm hiểu'],
    schedule: ['Lịch hẹn', 'Schedule', 'Đặt lịch'],
    profile: ['Hồ sơ', 'Profile', 'Tài khoản']
  }
};
```

#### Dynamic Type Support
```css
/* iOS Dynamic Type support */
@media (prefers-reduced-motion: no-preference) {
  .ios-footer-nav-label {
    font-size: max(10px, 1rem * var(--ios-dynamic-type-multiplier, 1));
  }
}

/* Large accessibility sizes */
@media (prefers-reduced-motion: no-preference) and (min-width: 375px) {
  .ios-footer-nav-label {
    font-size: max(12px, 1.2rem * var(--ios-dynamic-type-multiplier, 1));
  }
}
```

### Android Accessibility Features

#### TalkBack Support
```typescript
// Android TalkBack implementation
export const androidTalkBack = {
  // Content descriptions
  contentDescriptions: {
    home: 'Trang chủ, tab, 1 trong 5',
    services: 'Dịch vụ y tế, tab, 2 trong 5',
    explore: 'Khám phá, tab, 3 trong 5',
    schedule: 'Lịch hẹn khám bệnh, tab, 4 trong 5, có thông báo mới',
    profile: 'Hồ sơ cá nhân, tab, 5 trong 5'
  },
  
  // Touch exploration
  touchExploration: {
    enabled: true,
    hapticFeedback: true,
    audioFeedback: true
  }
};
```

#### Switch Access Support
```css
/* Android Switch Access support */
.android-footer-nav-item {
  /* Ensure proper focus indicators */
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.android-footer-nav-item:focus {
  outline-color: var(--android-accent-color);
  background-color: rgba(var(--android-accent-color-rgb), 0.12);
}
```

## Motor Accessibility

### Touch Target Enhancements
```css
/* Enhanced touch targets for motor impairments */
@media (pointer: coarse) {
  .footer-nav-item {
    min-width: 56px; /* Larger than standard 44px */
    min-height: 56px;
    padding: 8px;
  }
}

/* Tremor-friendly interactions */
.footer-nav-item {
  /* Prevent accidental activation */
  touch-action: manipulation;
  
  /* Longer press delay for users with tremors */
  -webkit-tap-highlight-color: transparent;
}
```

### Alternative Input Methods
```typescript
// Support for alternative input methods
export const alternativeInputs = {
  // Voice commands
  voiceCommands: {
    'đi trang chủ': () => navigateTo('home'),
    'mở dịch vụ': () => navigateTo('services'),
    'xem lịch hẹn': () => navigateTo('schedule')
  },
  
  // Switch control
  switchControl: {
    scanningSpeed: 'slow', // Adjustable scanning speed
    dwellTime: 1000, // 1 second dwell time
    autoScan: true
  },
  
  // Eye tracking support
  eyeTracking: {
    dwellTime: 800,
    fixationRadius: 50,
    smoothPursuit: true
  }
};
```

## Cognitive Accessibility

### Clear Visual Hierarchy
```css
/* Clear visual hierarchy for cognitive accessibility */
.footer-nav-item {
  /* Consistent visual patterns */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.footer-nav-icon {
  /* Consistent icon sizing */
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.footer-nav-label {
  /* Clear, readable text */
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 60px;
}
```

### Error Prevention and Recovery
```typescript
// Error prevention for cognitive accessibility
export const errorPrevention = {
  // Confirmation for destructive actions
  confirmDestructiveActions: true,
  
  // Undo functionality
  undoTimeout: 5000, // 5 seconds to undo
  
  // Clear error messages
  errorMessages: {
    networkError: 'Không thể kết nối. Vui lòng thử lại.',
    navigationError: 'Không thể chuyển trang. Vui lòng thử lại.',
    accessError: 'Không có quyền truy cập. Vui lòng đăng nhập.'
  }
};
```

## Testing Requirements

### Automated Testing
```typescript
// Accessibility testing suite
export const accessibilityTests = {
  // WCAG compliance tests
  wcagTests: [
    'color-contrast',
    'keyboard-navigation',
    'focus-management',
    'aria-labels',
    'semantic-structure'
  ],
  
  // Platform-specific tests
  platformTests: {
    ios: ['voiceover', 'voice-control', 'dynamic-type', 'switch-control'],
    android: ['talkback', 'switch-access', 'voice-access', 'select-to-speak']
  },
  
  // Motor accessibility tests
  motorTests: [
    'touch-target-size',
    'touch-target-spacing',
    'alternative-inputs',
    'tremor-friendly'
  ]
};
```

### Manual Testing Checklist
- [ ] Screen reader navigation (VoiceOver/TalkBack)
- [ ] Keyboard-only navigation
- [ ] Voice control functionality
- [ ] Switch access compatibility
- [ ] High contrast mode appearance
- [ ] Large text scaling (up to 200%)
- [ ] Color blindness simulation
- [ ] Motor impairment simulation
- [ ] Cognitive load assessment

## Success Metrics

### WCAG Compliance
- **Level AA**: 100% compliance with WCAG 2.1 AA
- **Color Contrast**: 4.5:1 minimum ratio for all text
- **Touch Targets**: 44px minimum, 56px recommended
- **Keyboard Navigation**: 100% functionality without mouse

### Platform Accessibility
- **iOS**: 95%+ VoiceOver compatibility score
- **Android**: 95%+ TalkBack compatibility score
- **Voice Control**: 90%+ command recognition accuracy
- **Switch Access**: 100% navigation coverage

### User Testing
- **Task Completion**: 90%+ success rate for users with disabilities
- **Time to Complete**: <50% increase compared to non-disabled users
- **User Satisfaction**: 4.0+ rating from accessibility users
- **Error Rate**: <5% for critical navigation tasks
