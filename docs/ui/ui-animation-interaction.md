# Animation and Interaction Guide

This guide documents animation patterns, micro-interactions, and motion design principles for the Zalo Healthcare Mini App UI.

## 📋 Table of Contents

- [Motion Design Principles](#motion-design-principles)
- [Animation System](#animation-system)
- [Micro-Interactions](#micro-interactions)
- [Page Transitions](#page-transitions)
- [Loading Animations](#loading-animations)
- [Medical-Specific Animations](#medical-specific-animations)
- [Accessibility Considerations](#accessibility-considerations)

## 🎯 Motion Design Principles

### Healthcare Motion Philosophy

Motion design in healthcare applications should be:

1. **Purposeful**: Every animation serves a functional purpose
2. **Gentle**: Calm, non-aggressive movements that reduce anxiety
3. **Efficient**: Quick, responsive animations that don't delay user tasks
4. **Accessible**: Respectful of motion sensitivity and accessibility needs
5. **Professional**: Subtle, refined animations that maintain medical credibility

### Animation Timing

```typescript
// Medical animation timing system
export const MEDICAL_TIMING = {
  // Micro-interactions (button hover, focus states)
  micro: '150ms',
  
  // Standard transitions (card hover, modal open)
  standard: '300ms',
  
  // Page transitions and major state changes
  page: '500ms',
  
  // Loading and progress animations
  loading: '1000ms',
  
  // Emergency animations (pulse, urgent alerts)
  emergency: '2000ms',
  
  // Breathing animations (calm, meditative)
  breathing: '4000ms',
} as const;
```

### Easing Functions

```css
/* Medical easing curves */
:root {
  --ease-gentle: cubic-bezier(0.25, 0.46, 0.45, 0.94);     /* Gentle, calm */
  --ease-medical: cubic-bezier(0.4, 0.0, 0.2, 1);          /* Material design */
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);   /* Playful bounce */
  --ease-emergency: cubic-bezier(0.25, 0.46, 0.45, 0.94);  /* Urgent but controlled */
}
```

## 🎬 Animation System

### Framer Motion Integration

The app uses Framer Motion for declarative animations:

```tsx
// Animation variants system
export const medicalAnimations = {
  // Page entrance animations
  pageEnter: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  
  // Card hover animations
  cardHover: {
    whileHover: { 
      scale: 1.02, 
      y: -4,
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)"
    },
    transition: { duration: 0.2 }
  },
  
  // Button press animations
  buttonPress: {
    whileTap: { scale: 0.98 },
    whileHover: { scale: 1.02 },
    transition: { duration: 0.15 }
  },
  
  // Emergency pulse animation
  emergencyPulse: {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [1, 0.8, 1]
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};
```

### Animation Components

```tsx
// Animated container component
export const AnimatedContainer = ({ 
  children, 
  variant = 'pageEnter',
  delay = 0 
}: AnimatedContainerProps) => {
  const animation = medicalAnimations[variant];
  
  return (
    <motion.div
      initial={animation.initial}
      animate={animation.animate}
      exit={animation.exit}
      transition={{ ...animation.transition, delay }}
    >
      {children}
    </motion.div>
  );
};

// Staggered list animation
export const StaggeredList = ({ 
  children, 
  staggerDelay = 0.1 
}: StaggeredListProps) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.3 }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};
```

### CSS Animation Classes

```css
/* Utility animation classes */
.animate-fade-in {
  animation: fadeIn 0.3s var(--ease-gentle) forwards;
}

.animate-slide-up {
  animation: slideUp 0.3s var(--ease-gentle) forwards;
}

.animate-pulse-gentle {
  animation: pulseGentle 2s var(--ease-gentle) infinite;
}

.animate-heartbeat {
  animation: heartbeat 1.5s var(--ease-gentle) infinite;
}

/* Keyframe definitions */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

@keyframes pulseGentle {
  0%, 100% { 
    transform: scale(1); 
    opacity: 1; 
  }
  50% { 
    transform: scale(1.02); 
    opacity: 0.9; 
  }
}

@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  14% { transform: scale(1.1); }
  28% { transform: scale(1); }
  42% { transform: scale(1.1); }
  70% { transform: scale(1); }
}
```

## 🎯 Micro-Interactions

### Button Interactions

```tsx
// Enhanced button with micro-interactions
export const InteractiveButton = ({ 
  children, 
  variant = 'primary',
  ...props 
}: ButtonProps) => {
  return (
    <motion.button
      className={`btn btn-${variant}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      whileFocus={{ 
        boxShadow: "0 0 0 3px rgba(37, 99, 235, 0.2)" 
      }}
      transition={{ duration: 0.15 }}
      {...props}
    >
      {children}
      
      {/* Ripple effect */}
      <motion.div
        className="button-ripple"
        initial={{ scale: 0, opacity: 0.5 }}
        whileTap={{ 
          scale: 1, 
          opacity: 0,
          transition: { duration: 0.3 }
        }}
      />
    </motion.button>
  );
};
```

### Form Field Interactions

```css
/* Form field micro-interactions */
.form-field {
  position: relative;
  transition: all 0.2s var(--ease-gentle);
}

.form-input {
  transition: all 0.2s var(--ease-gentle);
  border: 2px solid var(--color-border);
}

.form-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  transform: translateY(-1px);
}

.form-label {
  transition: all 0.2s var(--ease-gentle);
  transform-origin: left top;
}

.form-field:focus-within .form-label {
  color: var(--color-primary);
  transform: translateY(-8px) scale(0.85);
}

/* Floating label animation */
.form-field--floating .form-label {
  position: absolute;
  top: 12px;
  left: 16px;
  pointer-events: none;
}

.form-field--floating:focus-within .form-label,
.form-field--floating.has-value .form-label {
  transform: translateY(-24px) scale(0.85);
  background: var(--color-background);
  padding: 0 4px;
}
```

### Card Interactions

```tsx
// Interactive medical card
export const InteractiveMedicalCard = ({ 
  children, 
  onClick,
  ...props 
}: MedicalCardProps) => {
  return (
    <motion.div
      className="medical-card interactive"
      onClick={onClick}
      whileHover={{
        y: -4,
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)"
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
      
      {/* Hover indicator */}
      <motion.div
        className="card-hover-indicator"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
};
```

## 🔄 Page Transitions

### Route Transitions

```tsx
// Page transition wrapper
export const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ 
          duration: 0.3, 
          ease: [0.25, 0.46, 0.45, 0.94] 
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Modal transitions
export const ModalTransition = ({ 
  isOpen, 
  children 
}: ModalTransitionProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          
          {/* Modal content */}
          <motion.div
            className="modal-content"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
```

## ⏳ Loading Animations

### Medical Loading Spinners

```tsx
// Medical-themed loading spinner
export const MedicalSpinner = ({ 
  variant = 'heartbeat',
  size = 'md' 
}: MedicalSpinnerProps) => {
  const spinnerVariants = {
    heartbeat: {
      animate: {
        scale: [1, 1.2, 1],
        rotate: [0, 0, 0]
      },
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    pulse: {
      animate: {
        opacity: [1, 0.5, 1],
        scale: [1, 1.1, 1]
      },
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    rotate: {
      animate: { rotate: 360 },
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };
  
  return (
    <motion.div
      className={`medical-spinner medical-spinner--${size}`}
      variants={spinnerVariants[variant]}
      animate="animate"
    >
      <HeartIcon />
    </motion.div>
  );
};
```

### Skeleton Loading

```tsx
// Animated skeleton loader
export const SkeletonLoader = ({ 
  lines = 3,
  avatar = false 
}: SkeletonProps) => {
  return (
    <div className="skeleton-container">
      {avatar && (
        <motion.div
          className="skeleton-avatar"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
      
      {Array.from({ length: lines }).map((_, index) => (
        <motion.div
          key={index}
          className="skeleton-line"
          style={{ width: `${100 - (index * 10)}%` }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            delay: index * 0.1
          }}
        />
      ))}
    </div>
  );
};
```

## 🏥 Medical-Specific Animations

### Vital Signs Animations

```tsx
// Animated vital signs display
export const AnimatedVitalSign = ({ 
  value, 
  label, 
  status = 'normal' 
}: VitalSignProps) => {
  const statusColors = {
    normal: 'var(--color-success)',
    warning: 'var(--color-warning)',
    critical: 'var(--color-emergency)'
  };
  
  return (
    <motion.div
      className="vital-sign"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: "backOut" }}
    >
      <motion.div
        className="vital-sign-value"
        style={{ color: statusColors[status] }}
        animate={status === 'critical' ? {
          scale: [1, 1.05, 1],
          color: [statusColors[status], '#FF0000', statusColors[status]]
        } : {}}
        transition={status === 'critical' ? {
          duration: 1.5,
          repeat: Infinity
        } : {}}
      >
        {value}
      </motion.div>
      
      <div className="vital-sign-label">{label}</div>
      
      {/* Pulse indicator for heart rate */}
      {label.toLowerCase().includes('heart') && (
        <motion.div
          className="pulse-indicator"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [1, 0.7, 1]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.div>
  );
};
```

### Emergency Animations

```css
/* Emergency alert animations */
.emergency-alert {
  animation: emergencyPulse 2s infinite;
  box-shadow: 0 0 20px rgba(220, 38, 38, 0.5);
}

@keyframes emergencyPulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 20px rgba(220, 38, 38, 0.5);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 0 30px rgba(220, 38, 38, 0.8);
  }
}

/* Critical status indicator */
.status-critical {
  position: relative;
  overflow: hidden;
}

.status-critical::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(220, 38, 38, 0.3),
    transparent
  );
  animation: criticalSweep 2s infinite;
}

@keyframes criticalSweep {
  0% { left: -100%; }
  100% { left: 100%; }
}
```

## ♿ Accessibility Considerations

### Reduced Motion Support

```css
/* Respect user's motion preferences */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  
  /* Keep essential animations but make them instant */
  .emergency-alert {
    animation: none;
    background-color: var(--color-emergency);
  }
  
  /* Maintain focus indicators */
  .form-input:focus {
    transition-duration: 0.01ms;
  }
}
```

### Animation Controls

```tsx
// User-controlled animation preferences
export const useAnimationPreferences = () => {
  const [reducedMotion, setReducedMotion] = useAtom(reducedMotionAtom);
  const [animationSpeed, setAnimationSpeed] = useAtom(animationSpeedAtom);
  
  const getAnimationDuration = useCallback((baseDuration: number) => {
    if (reducedMotion) return 0.01;
    
    const speedMultiplier = {
      slow: 1.5,
      normal: 1,
      fast: 0.5
    }[animationSpeed];
    
    return baseDuration * speedMultiplier;
  }, [reducedMotion, animationSpeed]);
  
  return {
    reducedMotion,
    animationSpeed,
    getAnimationDuration,
    setReducedMotion,
    setAnimationSpeed
  };
};

// Accessible animation component
export const AccessibleAnimation = ({ 
  children, 
  animation,
  fallback 
}: AccessibleAnimationProps) => {
  const { reducedMotion } = useAnimationPreferences();
  
  if (reducedMotion && fallback) {
    return fallback;
  }
  
  return (
    <motion.div {...animation}>
      {children}
    </motion.div>
  );
};
```

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Maintainer**: Zalo Healthcare Development Team
