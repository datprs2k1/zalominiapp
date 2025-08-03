# Accessibility UI Guide

This comprehensive guide documents accessibility features, WCAG compliance, and inclusive design patterns in the Zalo Healthcare Mini App UI.

## 📋 Table of Contents

- [Accessibility Principles](#accessibility-principles)
- [WCAG Compliance](#wcag-compliance)
- [Keyboard Navigation](#keyboard-navigation)
- [Screen Reader Support](#screen-reader-support)
- [Visual Accessibility](#visual-accessibility)
- [Motor Accessibility](#motor-accessibility)
- [Cognitive Accessibility](#cognitive-accessibility)
- [Testing and Validation](#testing-and-validation)

## 🎯 Accessibility Principles

### Healthcare Accessibility Standards

Healthcare applications must meet the highest accessibility standards:

1. **Universal Access**: Usable by people with diverse abilities and disabilities
2. **Medical Clarity**: Critical health information must be accessible to all users
3. **Emergency Accessibility**: Emergency features must be immediately accessible
4. **Inclusive Design**: Design for the widest range of users from the start
5. **Legal Compliance**: Meet ADA, Section 508, and international accessibility laws

### Core Accessibility Features

```typescript
// Accessibility configuration
export const ACCESSIBILITY_CONFIG = {
  // WCAG 2.1 AA compliance targets
  colorContrast: {
    normal: 4.5,      // Normal text contrast ratio
    large: 3.0,       // Large text contrast ratio
    nonText: 3.0,     // Non-text elements
  },
  
  // Touch target sizes (iOS/Android guidelines)
  touchTargets: {
    minimum: 44,      // 44px minimum (iOS/WCAG)
    recommended: 48,  // 48dp recommended (Android)
    comfortable: 56,  // Comfortable size for medical apps
  },
  
  // Animation and motion
  motion: {
    respectReducedMotion: true,
    maxAnimationDuration: 5000, // 5 seconds max
    allowInfiniteAnimations: false, // For non-essential animations
  }
};
```

## ✅ WCAG Compliance

### WCAG 2.1 AA Implementation

#### Perceivable

```css
/* Color contrast compliance */
:root {
  /* Text colors meeting 4.5:1 contrast ratio */
  --color-text-primary: #111827;    /* 16.94:1 on white */
  --color-text-secondary: #4B5563;  /* 7.07:1 on white */
  --color-text-disabled: #9CA3AF;   /* 2.84:1 - for disabled only */
  
  /* Background colors for sufficient contrast */
  --color-background-primary: #FFFFFF;
  --color-background-secondary: #F9FAFB;
  --color-background-elevated: #FFFFFF;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  :root {
    --color-text-primary: #000000;
    --color-background-primary: #FFFFFF;
    --color-border: #000000;
    --color-primary: #0000FF;
    --color-emergency: #FF0000;
  }
}

/* Ensure focus indicators are visible */
.focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
}
```

#### Operable

```tsx
// Keyboard navigation support
export const AccessibleButton = ({ 
  children, 
  onClick, 
  disabled = false,
  ariaLabel,
  ...props 
}: AccessibleButtonProps) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    // Support Enter and Space key activation
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick?.(event as any);
    }
  };
  
  return (
    <button
      className="accessible-button"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      {...props}
    >
      {children}
    </button>
  );
};
```

#### Understandable

```tsx
// Form validation with accessible error messages
export const AccessibleFormField = ({ 
  label, 
  error, 
  helperText,
  required = false,
  children 
}: AccessibleFormFieldProps) => {
  const fieldId = useId();
  const errorId = `${fieldId}-error`;
  const helperId = `${fieldId}-helper`;
  
  return (
    <div className="form-field">
      <label 
        htmlFor={fieldId}
        className="form-label"
      >
        {label}
        {required && (
          <span className="required-indicator" aria-label="required">
            *
          </span>
        )}
      </label>
      
      {React.cloneElement(children as ReactElement, {
        id: fieldId,
        'aria-describedby': [
          error ? errorId : null,
          helperText ? helperId : null
        ].filter(Boolean).join(' '),
        'aria-invalid': !!error,
        'aria-required': required,
      })}
      
      {helperText && (
        <div id={helperId} className="helper-text">
          {helperText}
        </div>
      )}
      
      {error && (
        <div 
          id={errorId} 
          className="error-message"
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      )}
    </div>
  );
};
```

#### Robust

```tsx
// Semantic HTML structure
export const AccessibleCard = ({ 
  title, 
  children, 
  onClick,
  role = 'article' 
}: AccessibleCardProps) => {
  const isInteractive = !!onClick;
  
  const CardElement = isInteractive ? 'button' : 'div';
  
  return (
    <CardElement
      className={`medical-card ${isInteractive ? 'interactive' : ''}`}
      onClick={onClick}
      role={isInteractive ? 'button' : role}
      tabIndex={isInteractive ? 0 : undefined}
      aria-label={isInteractive ? `View ${title}` : undefined}
    >
      {title && (
        <h3 className="card-title">
          {title}
        </h3>
      )}
      
      <div className="card-content">
        {children}
      </div>
    </CardElement>
  );
};
```

## ⌨️ Keyboard Navigation

### Focus Management

```tsx
// Focus trap for modals
export const useFocusTrap = (isActive: boolean) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!isActive || !containerRef.current) return;
    
    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };
    
    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();
    
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, [isActive]);
  
  return containerRef;
};
```

### Skip Links

```tsx
// Skip navigation links
export const SkipLinks = () => {
  return (
    <div className="skip-links">
      <a 
        href="#main-content" 
        className="skip-link"
        onFocus={(e) => e.target.scrollIntoView()}
      >
        Skip to main content
      </a>
      <a 
        href="#navigation" 
        className="skip-link"
      >
        Skip to navigation
      </a>
      <a 
        href="#search" 
        className="skip-link"
      >
        Skip to search
      </a>
    </div>
  );
};
```

### Keyboard Shortcuts

```tsx
// Global keyboard shortcuts
export const useKeyboardShortcuts = () => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Alt + S: Focus search
      if (event.altKey && event.key === 's') {
        event.preventDefault();
        const searchInput = document.getElementById('search-input');
        searchInput?.focus();
      }
      
      // Alt + M: Open main menu
      if (event.altKey && event.key === 'm') {
        event.preventDefault();
        const menuButton = document.getElementById('menu-button');
        menuButton?.click();
      }
      
      // Escape: Close modals/menus
      if (event.key === 'Escape') {
        const openModal = document.querySelector('[role="dialog"][aria-hidden="false"]');
        if (openModal) {
          const closeButton = openModal.querySelector('[aria-label*="close"]');
          (closeButton as HTMLElement)?.click();
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
};
```

## 🔊 Screen Reader Support

### ARIA Labels and Descriptions

```tsx
// Medical data with screen reader support
export const AccessibleVitalSigns = ({ 
  bloodPressure, 
  heartRate, 
  temperature 
}: VitalSignsProps) => {
  return (
    <section 
      aria-labelledby="vital-signs-title"
      role="region"
    >
      <h2 id="vital-signs-title">Vital Signs</h2>
      
      <div className="vital-signs-grid">
        <div 
          className="vital-sign"
          role="group"
          aria-labelledby="bp-label"
        >
          <div id="bp-label" className="vital-sign-label">
            Blood Pressure
          </div>
          <div 
            className="vital-sign-value"
            aria-label={`Blood pressure ${bloodPressure.systolic} over ${bloodPressure.diastolic} millimeters of mercury`}
          >
            {bloodPressure.systolic}/{bloodPressure.diastolic} mmHg
          </div>
        </div>
        
        <div 
          className="vital-sign"
          role="group"
          aria-labelledby="hr-label"
        >
          <div id="hr-label" className="vital-sign-label">
            Heart Rate
          </div>
          <div 
            className="vital-sign-value"
            aria-label={`Heart rate ${heartRate} beats per minute`}
          >
            {heartRate} BPM
          </div>
        </div>
      </div>
    </section>
  );
};
```

### Live Regions

```tsx
// Accessible status announcements
export const useScreenReaderAnnouncement = () => {
  const announce = useCallback((
    message: string, 
    priority: 'polite' | 'assertive' = 'polite'
  ) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);
  
  return announce;
};

// Usage in components
export const BookingForm = () => {
  const announce = useScreenReaderAnnouncement();
  
  const handleSubmit = async (data: BookingData) => {
    try {
      await submitBooking(data);
      announce('Appointment booked successfully', 'assertive');
    } catch (error) {
      announce('Failed to book appointment. Please try again.', 'assertive');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
};
```

### Screen Reader Only Content

```css
/* Screen reader only utility class */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Show on focus for keyboard users */
.sr-only-focusable:focus {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

## 👁️ Visual Accessibility

### Color and Contrast

```css
/* Ensure sufficient color contrast */
.text-primary {
  color: var(--color-text-primary); /* 16.94:1 contrast */
}

.text-secondary {
  color: var(--color-text-secondary); /* 7.07:1 contrast */
}

/* Don't rely on color alone */
.status-indicator {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.status-indicator::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

.status-success {
  color: var(--color-success);
}

.status-success::after {
  content: '✓';
  font-weight: bold;
  margin-left: 0.25rem;
}

.status-error {
  color: var(--color-error);
}

.status-error::after {
  content: '✗';
  font-weight: bold;
  margin-left: 0.25rem;
}
```

### Typography and Readability

```css
/* Readable typography */
.readable-text {
  font-size: clamp(1rem, 2.5vw, 1.125rem);
  line-height: 1.6;
  letter-spacing: 0.01em;
  word-spacing: 0.1em;
}

/* Medical text formatting */
.medical-data {
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum";
}

/* Dyslexia-friendly options */
.dyslexia-friendly {
  font-family: 'OpenDyslexic', 'Comic Sans MS', sans-serif;
  letter-spacing: 0.12em;
  word-spacing: 0.16em;
  line-height: 1.8;
}
```

## 🤲 Motor Accessibility

### Touch Targets

```css
/* Accessible touch targets */
.touch-target {
  min-height: 44px;
  min-width: 44px;
  padding: 8px;
  margin: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Large touch targets for critical actions */
.emergency-button {
  min-height: 64px;
  min-width: 64px;
  font-size: 1.25rem;
  font-weight: bold;
}

/* Spacing between interactive elements */
.interactive-list > * + * {
  margin-top: 8px;
}
```

### Alternative Input Methods

```tsx
// Voice control support
export const VoiceControlButton = ({ 
  children, 
  voiceCommand,
  ...props 
}: VoiceControlButtonProps) => {
  useEffect(() => {
    if ('speechRecognition' in window || 'webkitSpeechRecognition' in window) {
      // Register voice command
      registerVoiceCommand(voiceCommand, () => {
        // Trigger button action
        props.onClick?.({} as any);
      });
    }
  }, [voiceCommand, props.onClick]);
  
  return (
    <button {...props}>
      {children}
      <span className="sr-only">
        Voice command: "{voiceCommand}"
      </span>
    </button>
  );
};
```

## 🧠 Cognitive Accessibility

### Clear Information Architecture

```tsx
// Progressive disclosure pattern
export const ProgressiveDisclosure = ({ 
  summary, 
  details,
  defaultOpen = false 
}: ProgressiveDisclosureProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <details 
      className="progressive-disclosure"
      open={isOpen}
      onToggle={(e) => setIsOpen(e.currentTarget.open)}
    >
      <summary 
        className="disclosure-summary"
        aria-expanded={isOpen}
      >
        {summary}
        <span className="disclosure-icon" aria-hidden="true">
          {isOpen ? '−' : '+'}
        </span>
      </summary>
      
      <div className="disclosure-content">
        {details}
      </div>
    </details>
  );
};
```

### Error Prevention and Recovery

```tsx
// Confirmation dialog for critical actions
export const ConfirmationDialog = ({ 
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  severity = 'normal'
}: ConfirmationDialogProps) => {
  return (
    <div 
      role="dialog"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-message"
      className={`confirmation-dialog severity-${severity}`}
    >
      <h2 id="dialog-title">{title}</h2>
      <p id="dialog-message">{message}</p>
      
      <div className="dialog-actions">
        <button 
          onClick={onCancel}
          className="btn btn-secondary"
          autoFocus={severity !== 'critical'}
        >
          {cancelText}
        </button>
        <button 
          onClick={onConfirm}
          className={`btn ${severity === 'critical' ? 'btn-emergency' : 'btn-primary'}`}
          autoFocus={severity === 'critical'}
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
};
```

## 🧪 Testing and Validation

### Automated Testing

```typescript
// Accessibility testing with jest-axe
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(<MedicalCard />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('should support keyboard navigation', () => {
    render(<InteractiveButton>Click me</InteractiveButton>);
    const button = screen.getByRole('button');
    
    button.focus();
    expect(button).toHaveFocus();
    
    fireEvent.keyDown(button, { key: 'Enter' });
    // Assert expected behavior
  });
});
```

### Manual Testing Checklist

```markdown
## Accessibility Testing Checklist

### Keyboard Navigation
- [ ] All interactive elements are keyboard accessible
- [ ] Tab order is logical and intuitive
- [ ] Focus indicators are visible and clear
- [ ] Skip links work correctly
- [ ] Keyboard shortcuts function as expected

### Screen Reader Testing
- [ ] All content is announced correctly
- [ ] ARIA labels and descriptions are meaningful
- [ ] Live regions announce changes appropriately
- [ ] Form validation errors are announced
- [ ] Status changes are communicated

### Visual Testing
- [ ] Color contrast meets WCAG AA standards
- [ ] Content is readable at 200% zoom
- [ ] High contrast mode works correctly
- [ ] Information is not conveyed by color alone
- [ ] Text is readable and well-formatted

### Motor Accessibility
- [ ] Touch targets meet minimum size requirements
- [ ] Interactive elements have adequate spacing
- [ ] Drag and drop has keyboard alternatives
- [ ] Time limits can be extended or disabled
```

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Maintainer**: Zalo Healthcare Development Team
