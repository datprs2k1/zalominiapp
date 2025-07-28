# Medical Design System - Zalo Mini App

## Overview

This document outlines the comprehensive design system for the hospital-themed Zalo Mini App, focusing on creating a modern, accessible, and professional medical interface.

## Design Principles

### 1. Trust & Professionalism
- Clean, modern aesthetics that inspire confidence
- Consistent visual hierarchy for medical information
- Professional color palette appropriate for healthcare

### 2. Accessibility First
- WCAG 2.1 AA compliance
- High contrast support
- Screen reader optimization
- Touch-friendly interface design

### 3. Calming Experience
- Soft, medical-appropriate colors
- Gentle animations and transitions
- Reduced cognitive load through clear information architecture

## Color Palette

### Primary Colors
```css
--primary: #0066cc;              /* Medical blue - trustworthy */
--primary-light: #4d94ff;        /* Lighter medical blue */
--primary-dark: #004499;         /* Darker medical blue */
--primary-gradient: #00aaff;     /* Gradient end - sky blue */
```

### Secondary Colors
```css
--secondary: #00a86b;            /* Medical green - healing */
--secondary-light: #4dcc8a;      /* Light medical green */
--accent: #ff6b35;               /* Warm orange - attention */
--accent-light: #ff9470;         /* Light accent */
```

### Status Colors
```css
--success: #00a86b;              /* Success green */
--warning: #f6ad55;              /* Warning amber */
--error: #e53e3e;                /* Error red */
--info: #3182ce;                 /* Info blue */
```

### Medical Semantic Colors
```css
--emergency: #dc2626;            /* Emergency red */
--urgent: #f59e0b;               /* Urgent amber */
--routine: #10b981;              /* Routine green */
--consultation: #6366f1;         /* Consultation purple */
```

## Typography

### Font Sizes
- **Small**: 14px base (data-font-size="small")
- **Normal**: 16px base (default)
- **Large**: 18px base (data-font-size="large")

### Hierarchy
- **H1**: 2xl (28px) - Page titles
- **H2**: xl (24px) - Section headers
- **H3**: lg (20px) - Subsection headers
- **Body**: base (16px) - Regular text
- **Caption**: sm (14px) - Secondary information

## Components

### Buttons

#### Primary Button
```tsx
<Button variant="primary" size="md">
  Primary Action
</Button>
```

#### Emergency Button
```tsx
<EmergencyButton size="lg">
  Emergency Call
</EmergencyButton>
```

### Cards

#### Medical Card
```tsx
<MedicalCard variant="default" status="routine">
  <h3>Appointment Details</h3>
  <p>Medical information content</p>
</MedicalCard>
```

#### Patient Info Card
```tsx
<PatientInfoCard
  patientName="John Doe"
  patientId="P123456"
  age={35}
  gender="Male"
  bloodType="O+"
  allergies={["Penicillin", "Shellfish"]}
/>
```

### Forms

#### Medical Input
```tsx
<MedicalInput
  label="Patient Name"
  required
  placeholder="Enter patient name"
  leftIcon={<UserIcon />}
/>
```

#### Medical Select
```tsx
<MedicalSelect
  label="Department"
  options={[
    { value: "cardiology", label: "Cardiology" },
    { value: "neurology", label: "Neurology" }
  ]}
  required
/>
```

## Animations

### Medical-Specific Animations

#### Heartbeat (for vital signs)
```tsx
<AnimatedMedicalIcon type="heartbeat" animate />
```

#### Medical Pulse (for status indicators)
```tsx
<div className="animate-medical-pulse">
  Status Indicator
</div>
```

#### Gentle Transitions
```css
transition: all var(--transition-normal) var(--ease-medical);
```

### Animation Guidelines
- Use `var(--ease-medical)` for smooth, medical-appropriate easing
- Keep animations subtle and non-distracting
- Respect `prefers-reduced-motion` settings
- Use loading animations for medical data retrieval

## Accessibility Features

### Focus Management
- Clear focus indicators with medical-themed styling
- Keyboard navigation support
- Focus trapping in modals

### Screen Reader Support
- Semantic HTML structure
- ARIA labels and descriptions
- Screen reader only content for context

### High Contrast Mode
```tsx
<HighContrastToggle />
```

### Font Size Control
```tsx
<FontSizeControl />
```

## Layout Patterns

### Page Structure
```tsx
<Layout>
  <SkipToContent />
  <Header />
  <main id="main-content">
    <PageContent />
  </main>
  <Footer />
</Layout>
```

### Card Layouts
- Use consistent spacing (16px, 24px, 32px)
- Maintain proper information hierarchy
- Include status indicators for medical urgency

### Form Layouts
- Group related fields logically
- Use clear labels and help text
- Provide immediate validation feedback

## Responsive Design

### Breakpoints
- **Mobile**: < 640px (primary focus for Zalo Mini App)
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Mobile-First Approach
- Touch targets minimum 44px
- Optimized for thumb navigation
- Swipe gestures for common actions

## Medical-Specific Guidelines

### Information Hierarchy
1. **Critical Information**: Emergency contacts, vital signs
2. **Primary Information**: Appointments, doctor details
3. **Secondary Information**: Additional services, general info

### Status Indicators
- **Emergency**: Red with pulsing animation
- **Urgent**: Amber with subtle animation
- **Routine**: Green, static
- **Consultation**: Blue, static

### Data Display
- Use cards for medical information grouping
- Include timestamps for medical records
- Show confidence levels for AI-generated content

## Implementation Examples

### Search Bar Component
```tsx
<SearchBarComponent
  showQuickCategories
  onSearch={handleSearch}
  variant="default"
/>
```

### Notification System
```tsx
const { notifications, success, error, emergency } = useNotifications();

// Success notification
success("Appointment Booked", "Your appointment has been confirmed");

// Emergency notification
emergency("Emergency Alert", "Please contact emergency services", {
  persistent: true,
  actions: [
    { label: "Call 115", onClick: () => window.location.href = 'tel:115' }
  ]
});
```

### Medical Progress Tracking
```tsx
<MedicalProgressBar
  progress={75}
  label="Treatment Progress"
  color="success"
  animated
/>
```

## Best Practices

### Do's
- Use consistent spacing and sizing
- Implement proper error handling
- Provide clear feedback for user actions
- Test with screen readers
- Optimize for mobile performance

### Don'ts
- Don't use red for non-critical information
- Avoid complex animations that distract from medical content
- Don't rely solely on color to convey information
- Avoid small touch targets (< 44px)
- Don't use medical terminology without explanation

## Testing Guidelines

### Accessibility Testing
- Test with screen readers (NVDA, JAWS, VoiceOver)
- Verify keyboard navigation
- Check color contrast ratios
- Test with high contrast mode

### Mobile Testing
- Test on various device sizes
- Verify touch interactions
- Check performance on slower devices
- Test offline functionality

### Medical Context Testing
- Verify information accuracy
- Test emergency scenarios
- Validate data privacy measures
- Check medical terminology consistency

## Maintenance

### Regular Updates
- Review accessibility compliance quarterly
- Update color contrast as needed
- Refresh medical terminology
- Monitor user feedback for improvements

### Performance Monitoring
- Track animation performance
- Monitor loading times for medical data
- Optimize images and assets
- Regular accessibility audits
