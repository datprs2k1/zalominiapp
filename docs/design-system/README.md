# Medical Design System

A comprehensive design system for modern hospital mobile applications, built with Tailwind CSS and React TypeScript.

## 🎨 Design Principles

### 1. Trust & Professionalism
- Clean, medical-grade aesthetics
- Consistent visual hierarchy
- Professional color palette

### 2. Accessibility First
- WCAG 2.1 AA compliance
- Minimum 4.5:1 contrast ratios
- 44px minimum touch targets
- Screen reader optimizations

### 3. Mobile-First Approach
- Touch-friendly interactions
- Thumb-zone navigation
- Responsive breakpoints
- Performance optimized

### 4. Clarity & Efficiency
- Clear information hierarchy
- Quick access to critical functions
- Intuitive navigation patterns

## 🎯 Color System

### Primary Medical Colors
```css
--medical-500: #0ea5e9  /* Primary brand color */
--medical-600: #0284c7  /* Hover states */
--medical-700: #0369a1  /* Active states */
```

### Wellness Colors
```css
--wellness-500: #22c55e  /* Success, health indicators */
--wellness-600: #16a34a  /* Hover states */
```

### Accent Colors
```css
--accent-500: #f97316   /* Call-to-action, highlights */
--accent-600: #ea580c   /* Hover states */
```

### Status Colors
```css
--success-500: #22c55e  /* Success messages */
--warning-500: #f59e0b  /* Warnings */
--danger-500: #ef4444   /* Errors, urgent actions */
```

## 📝 Typography

### Font Sizes
- **Medical Label**: 12px / 16px line-height (Form labels, small text)
- **Medical Body**: 14px / 20px line-height (Body text, descriptions)
- **Medical Heading**: 18px / 24px line-height (Section headings)
- **Medical Title**: 24px / 32px line-height (Page titles)

### Font Weights
- **Regular (400)**: Body text
- **Medium (500)**: Labels, secondary headings
- **Semibold (600)**: Primary headings
- **Bold (700)**: Titles, emphasis

## 🧩 Component Library

### Core Components

#### Button
```tsx
import { Button } from '@/components/ui';

<Button variant="primary" size="md">
  Book Appointment
</Button>
```

**Variants**: `primary`, `secondary`, `success`, `danger`, `ghost`
**Sizes**: `sm`, `md`, `lg`, `xl`

#### Card
```tsx
import { Card } from '@/components/ui';

<Card variant="hover" padding="md">
  Content here
</Card>
```

**Variants**: `default`, `hover`, `doctor`, `appointment`, `emergency`

#### Input
```tsx
import { Input } from '@/components/ui';

<Input
  label="Patient Name"
  placeholder="Enter patient name"
  required
/>
```

### Specialized Components

#### DoctorCard
```tsx
import { DoctorCard } from '@/components/ui';

<DoctorCard
  doctor={doctorData}
  showAvailability={true}
  onSelect={handleDoctorSelect}
/>
```

#### StatusBadge
```tsx
import { StatusBadge } from '@/components/ui';

<StatusBadge status="available" size="md" />
```

## 📐 Spacing System

### Standard Spacing
- **Touch Target**: 44px (minimum touch target size)
- **Form Gap**: 1.5rem (24px) (spacing between form elements)
- **Card Padding**: 1.25rem (20px) (standard card padding)

### Responsive Breakpoints
- **Mobile**: 320px - 767px (primary focus)
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

## 🎭 Animation System

### Timing Functions
- **Standard**: `cubic-bezier(0.16, 1, 0.3, 1)` (smooth, natural)
- **Bounce**: `cubic-bezier(0.4, 0, 0.6, 1)` (playful interactions)

### Durations
- **Fast**: 150ms (micro-interactions)
- **Standard**: 200ms (most transitions)
- **Slow**: 300ms (complex animations)

### Available Animations
- `slide-up`, `slide-down`: Content reveals
- `heartbeat`: Health-related indicators
- `loading-dots`: Loading states
- `skeleton`: Content placeholders

## 🔧 Usage Guidelines

### Do's
✅ Use consistent spacing from the design system
✅ Maintain minimum touch target sizes (44px)
✅ Follow color contrast guidelines
✅ Use semantic HTML elements
✅ Include proper ARIA labels

### Don'ts
❌ Create custom colors outside the system
❌ Use touch targets smaller than 44px
❌ Mix different animation timings
❌ Override component styles directly
❌ Ignore accessibility requirements

## 🚀 Getting Started

1. **Import Components**
```tsx
import { Button, Card, Input } from '@/components/ui';
```

2. **Use Design Tokens**
```tsx
className="bg-medical-500 text-white p-card-padding"
```

3. **Follow Patterns**
```tsx
// Good: Using component variants
<Button variant="primary" size="md">Submit</Button>

// Avoid: Custom styling
<button className="bg-blue-500 px-4 py-2">Submit</button>
```

## 📚 Resources

- [Component Examples](./components.md)
- [Color Palette](./colors.md)
- [Typography Guide](./typography.md)
- [Accessibility Guidelines](./accessibility.md)
- [Mobile Patterns](./mobile-patterns.md)
