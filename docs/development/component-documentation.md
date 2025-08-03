# Component Documentation

This document provides comprehensive documentation for all key components in the Zalo Healthcare Mini App, including their props, usage examples, and best practices.

## 📋 Table of Contents

- [Core Components](#core-components)
- [Form Components](#form-components)
- [Medical Components](#medical-components)
- [Loading Components](#loading-components)
- [Layout Components](#layout-components)
- [Icon Components](#icon-components)
- [Navigation Components](#navigation-components)

## 🔧 Core Components

### Button Component

The primary button component with medical-themed variants and accessibility features.

<augment_code_snippet path="src/components/button.tsx" mode="EXCERPT">
````typescript
export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragEnd' | 'onDragStart'> {
  children: ReactNode;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'emergency' | 'success' | 'warning' | 'info' | 'consultation';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  priority?: 'low' | 'medium' | 'high' | 'critical';
}
````
</augment_code_snippet>

**Usage Examples:**

```typescript
// Basic button
<Button variant="primary">Book Appointment</Button>

// Emergency button with icon
<Button variant="emergency" leftIcon={<AlertIcon />} priority="critical">
  Emergency Call
</Button>

// Loading state
<Button loading loadingText="Booking...">
  Confirm Booking
</Button>

// Full width button
<Button variant="success" fullWidth>
  Complete Registration
</Button>
```

**Specialized Variants:**
- `EmergencyButton` - Pre-configured emergency button
- `SuccessButton` - Success state button
- `OutlineButton` - Outlined variant
- `GhostButton` - Minimal ghost variant

### Medical Card Component

Specialized card component for medical information display.

<augment_code_snippet path="src/components/medical-card.tsx" mode="EXCERPT">
````typescript
export interface MedicalCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'emergency' | 'success' | 'info' | 'warning' | 'consultation';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
  status?: 'emergency' | 'urgent' | 'routine' | 'consultation';
  header?: ReactNode;
  footer?: ReactNode;
  icon?: ReactNode;
  priority?: 'low' | 'medium' | 'high' | 'critical';
}
````
</augment_code_snippet>

**Usage Examples:**

```typescript
// Doctor profile card
<MedicalCard
  variant="elevated"
  interactive
  header={<h3>Dr. John Smith</h3>}
  icon={<DoctorIcon />}
  status="consultation"
>
  Cardiologist - Available Today
</MedicalCard>

// Emergency alert card
<MedicalCard
  variant="emergency"
  priority="critical"
  header="Emergency Alert"
>
  Patient requires immediate attention
</MedicalCard>
```

**Specialized Medical Cards:**
- `PatientInfoCard` - Patient information display
- `AppointmentCard` - Appointment details
- `VitalSignsCard` - Medical vital signs
- `PrescriptionCard` - Prescription information

## 📝 Form Components

### Search Input

Medical-themed search input with icon integration.

<augment_code_snippet path="src/components/form/search.tsx" mode="EXCERPT">
````typescript
export default function SearchInput({ className, ...props }: HTMLProps<HTMLInputElement>) {
  return (
    <div className="flex items-center justify-between rounded-full bg-white relative space-x-1 border border-black/10">
      <input
        placeholder="Tìm bệnh, bác sĩ, thuốc..."
        className="placeholder:text-disabled text-sm pl-[34px] h-[34px] flex-1 rounded-full outline-none"
        {...props}
      />
      <SearchIcon className="h-5 w-5 absolute left-2" />
    </div>
  );
}
````
</augment_code_snippet>

### Form Item

Wrapper component for form fields with consistent styling.

```typescript
interface FormItemProps extends HTMLProps<HTMLDivElement> {
  label: string;
  required?: boolean;
  error?: string;
  helpText?: string;
}

// Usage
<FormItem label="Patient Name" required error={errors.name}>
  <input type="text" {...register('name')} />
</FormItem>
```

### Enhanced Form Components

- **DateTimePicker** - Medical appointment scheduling
- **DoctorSelector** - Doctor selection with search and filtering
- **DepartmentPicker** - Medical department selection
- **ServicePicker** - Medical service selection
- **SymptomInquiry** - Symptom description with image upload

## 🏥 Medical Components

### Medical Service Components

Comprehensive medical service display components with hospital theming.

**Key Features:**
- Hospital-themed medical UI with primary blues and secondary greens
- Enhanced accessibility with ARIA labels and Vietnamese localization
- Medical iconography and emergency service indicators
- 44px minimum touch targets for mobile accessibility

### Doctor Profile Components

- **DoctorCard** - Doctor information display
- **DoctorProfileCard** - Detailed doctor profile
- **DoctorList** - Paginated doctor listing
- **DoctorSelector** - Interactive doctor selection

### Medical Information Cards

- **ClinicCard** - Clinic information display
- **InformationCard** - General medical information
- **VitalSignsCard** - Patient vital signs
- **PrescriptionCard** - Medication information

## ⏳ Loading Components

### Loading States

Comprehensive loading state components with medical theming.

<augment_code_snippet path="src/components/loading-states.tsx" mode="EXCERPT">
````typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'medical' | 'minimal' | 'pulse' | 'dots' | 'heartbeat';
  message?: string;
  color?: 'primary' | 'secondary' | 'white';
}
````
</augment_code_snippet>

**Available Loading Components:**
- `LoadingSpinner` - Animated spinner with variants
- `LoadingOverlay` - Full-screen loading overlay
- `Skeleton` - Content placeholder skeletons
- `ProgressiveLoader` - Progressive content loading

### Skeleton Components

Advanced skeleton loading patterns for medical content:

- **MedicalSkeleton** - Medical-themed skeleton loader
- **DoctorProfileSkeleton** - Doctor profile placeholder
- **ContentAwareSkeleton** - Context-aware skeleton patterns
- **AccessibleMedicalSkeleton** - Screen reader friendly skeletons

## 🎨 Layout Components

### Enhanced Layout System

- **Container** - Responsive container with medical spacing
- **Grid** - CSS Grid layout with medical breakpoints
- **Stack** - Vertical/horizontal stacking component
- **Section** - Page section with consistent spacing
- **Card** - Basic card component
- **MedicalCard** - Medical-themed card variant

### Navigation Components

- **Header** - Application header with navigation
- **Footer** - Application footer
- **Tabs** - Tab navigation component
- **ModernBreadcrumb** - Breadcrumb navigation
- **TransitionLink** - Animated page transitions

## 🎭 Icon Components

### Medical Icons

Comprehensive medical icon library with SVG components:

<augment_code_snippet path="src/components/icons/medical-icons.tsx" mode="EXCERPT">
````typescript
// Medical-specific icons
export const HeartIcon = () => <svg>...</svg>;
export const StethoscopeIcon = () => <svg>...</svg>;
export const PillIcon = () => <svg>...</svg>;
export const EmergencyIcon = () => <svg>...</svg>;
````
</augment_code_snippet>

**Available Icon Categories:**
- **Medical Icons** - Healthcare-specific icons
- **Navigation Icons** - App navigation icons
- **Action Icons** - Interactive action icons
- **Status Icons** - Status and state indicators

## 🎬 Animation Components

### Enhanced Animations

Framer Motion-powered animation components:

- **AnimatedContainer** - Container with entrance animations
- **StaggeredList** - List with staggered item animations
- **AnimatedButton** - Button with micro-interactions
- **FloatingActionButton** - FAB with hover animations
- **AnimatedStatusIndicator** - Status change animations

## 📱 Mobile Components

### Mobile Optimizations

- **MobileOptimizedLayout** - Mobile-first layout patterns
- **TouchTarget** - Accessible touch targets
- **SwipeGesture** - Swipe interaction handling
- **IOSScrollTest** - iOS-specific scroll optimizations

## 🔧 Utility Components

### Theme and Context

- **ThemeProvider** - Theme context provider
- **AnimationProvider** - Animation context provider
- **ErrorBoundary** - Error boundary wrapper
- **AccessibilitySettings** - Accessibility preferences

### Performance Components

- **OptimizedImage** - Lazy-loaded optimized images
- **VirtualizedList** - Virtualized list rendering
- **PerformanceMonitor** - Performance monitoring
- **MemoryOptimizer** - Memory usage optimization

## 📚 Best Practices

### Component Usage Guidelines

1. **Accessibility First**: Always include proper ARIA labels and keyboard navigation
2. **Mobile Optimization**: Use touch-friendly sizes (44px minimum)
3. **Loading States**: Provide loading states for all async operations
4. **Error Handling**: Include error boundaries and fallback UI
5. **Performance**: Use lazy loading and code splitting for large components

### Styling Guidelines

1. **Consistent Spacing**: Use design system spacing tokens
2. **Color System**: Follow medical color palette
3. **Typography**: Use semantic typography components
4. **Responsive Design**: Mobile-first responsive patterns
5. **Animation**: Respect reduced motion preferences

### Testing Guidelines

1. **Unit Tests**: Test component props and behavior
2. **Accessibility Tests**: Use axe-core for a11y testing
3. **Visual Tests**: Screenshot testing for UI consistency
4. **Integration Tests**: Test component interactions
5. **Performance Tests**: Monitor rendering performance

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Maintainer**: Zalo Healthcare Development Team
