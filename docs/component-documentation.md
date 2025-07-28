# Component Documentation

This document provides detailed documentation for the key components in the Zalo Healthcare application. All components have been updated to use the unified medical color design system for consistency, accessibility, and maintainability.

## 🎨 Color System Integration

All components now use the unified color system tokens instead of hardcoded colors:

```tsx
// ✅ Correct - Using unified color tokens
import { getColorToken } from '@/styles/unified-color-system';

const styles = {
  backgroundColor: getColorToken('primary'),
  color: getColorToken('text-on-primary'),
};

// ❌ Incorrect - Hardcoded colors (deprecated)
const styles = {
  backgroundColor: '#2563EB',
  color: '#FFFFFF',
};
```

For more details, see the [Color Design System Documentation](./color-design-system.md).

## Table of Contents

- [UI Components](#ui-components)
  - [Button](#button)
  - [Icons](#icons)
  - [Section](#section)
  - [Tabs](#tabs)
- [Layout Components](#layout-components)
  - [Header](#header)
  - [Footer](#footer)
  - [Layout](#layout)
- [Form Components](#form-components)
  - [DateTimePicker](#datetimepicker)
  - [DepartmentPicker](#departmentpicker)
  - [ServicePicker](#servicepicker)
  - [DoctorSelector](#doctorselector)
- [Feature Components](#feature-components)
  - [ClinicCard](#cliniccard)
  - [HeroSection](#herosection)
  - [ContentProcessor](#contentprocessor)

## UI Components

### Button

A customizable button component with medical-grade styling using the unified color system.

**File Location:** `src/components/button.tsx`

**Props:**

- `variant` (string): 'primary', 'secondary', 'outline', 'ghost', 'emergency', 'success', 'warning', 'info', 'consultation'
- `size` (string): 'sm', 'md', 'lg', 'xl'
- `disabled` (boolean): Whether the button is disabled
- `children` (React.ReactNode): Button content
- `className` (string): Additional CSS classes
- `onClick` (function): Click handler
- `loading` (boolean): Show loading state
- `leftIcon` (React.ReactNode): Optional left icon
- `rightIcon` (React.ReactNode): Optional right icon
- `priority` (string): 'low', 'medium', 'high', 'critical' for medical context
- `fullWidth` (boolean): Make button full width

**Color System Integration:** All button variants use the unified color system tokens:

- Primary: Uses `getColorToken('primary')` and `getColorToken('primary-dark')`
- Secondary: Uses `getColorToken('secondary')` and `getColorToken('secondary-hover')`
- Emergency: Uses `getColorToken('error')` and `getColorToken('error-hover')`

**Example Usage:**

```tsx
import { Button } from '@/components/button';

// Primary medical action button
<Button
  variant="primary"
  size="md"
  onClick={() => handleBooking()}
  leftIcon={<CalendarIcon />}
>
  Book Appointment
</Button>

// Emergency action button
<Button
  variant="emergency"
  priority="critical"
  onClick={() => handleEmergency()}
>
  Emergency Call
</Button>

// Secondary action with unified colors
<Button
  variant="secondary"
  size="lg"
  fullWidth
  rightIcon={<ArrowRightIcon />}
>
  View Health Records
</Button>
```

### Icons

SVG icons implemented as React components.

**Directory:** `src/components/icons/`

**Common Props:**

- `size` (number): Icon size in pixels
- `color` (string): Icon color
- `className` (string): Additional CSS classes

**Example Usage:**

```tsx
import { HomeIcon } from '@/components/icons/home';
import { SearchIcon } from '@/components/icons/medical-icons';

<HomeIcon size={24} color="currentColor" />
<SearchIcon className="w-5 h-5 text-primary" />
```

### Section

A container component for page sections with consistent spacing and styling.

**File Location:** `src/components/section.tsx`

**Props:**

- `title` (string): Section title
- `description` (string): Optional section description
- `children` (React.ReactNode): Section content
- `className` (string): Additional CSS classes
- `titleClassName` (string): Classes for the title element
- `descriptionClassName` (string): Classes for the description element

**Example Usage:**

```tsx
import { Section } from '@/components/section';

<Section title="Popular Departments" description="Explore our medical specialties">
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
    {departments.map((dept) => (
      <DepartmentCard key={dept.id} department={dept} />
    ))}
  </div>
</Section>;
```

### Tabs

A tabbed interface component for switching between different content views.

**File Location:** `src/components/tabs.tsx`

**Props:**

- `tabs` (array): Array of tab objects with `id`, `label`, and `content` properties
- `defaultTab` (string): ID of the default active tab
- `onChange` (function): Callback when tab changes
- `className` (string): Additional CSS classes
- `tabsClassName` (string): Classes for the tabs container
- `contentClassName` (string): Classes for the content container

**Example Usage:**

```tsx
import { Tabs } from '@/components/tabs';

const tabsData = [
  { id: 'info', label: 'Information', content: <DoctorInfo doctor={doctor} /> },
  { id: 'reviews', label: 'Reviews', content: <DoctorReviews doctorId={doctor.id} /> },
  { id: 'schedule', label: 'Schedule', content: <DoctorSchedule doctorId={doctor.id} /> },
];

<Tabs tabs={tabsData} defaultTab="info" onChange={(tabId) => console.log(`Tab changed to ${tabId}`)} />;
```

## Layout Components

### Header

The application header component with medical branding and navigation, fully integrated with the unified color system.

**File Location:** `src/components/header.tsx`

**Features:**

- Medical logo with unified color gradients
- Responsive design with mobile optimization
- Accessibility-compliant focus states
- Dynamic theme support (light/dark mode)
- Medical cross pattern overlay

**Color System Integration:**

- Logo gradient: Uses `getColorToken('primary')` and `getColorToken('primary-dark')`
- Text colors: `text-primary` and `text-secondary` classes
- Medical pattern: Uses unified primary color token
- Background gradients: Semantic color references

**Props:**

- Automatically detects route context for back navigation
- Supports custom titles and profile display
- Responsive behavior based on screen size

**Example Usage:**

```tsx
// Header automatically renders based on route configuration
// No manual instantiation needed - handled by Layout component

// For custom title pages:
import { customTitleState } from '@/state';
import { useSetAtom } from 'jotai';

const setCustomTitle = useSetAtom(customTitleState);
setCustomTitle('Medical Records');
```

### Footer

The application footer component with links and information.

**File Location:** `src/components/footer.tsx`

**Props:**

- `className` (string): Additional CSS classes

**Example Usage:**

```tsx
import { Footer } from '@/components/footer';

<Footer />;
```

### Layout

The main layout component wrapping all pages.

**File Location:** `src/components/layout.tsx`

**Props:**

- `children` (React.ReactNode): Page content
- `hideHeader` (boolean): Whether to hide the header
- `hideFooter` (boolean): Whether to hide the footer
- `transparentHeader` (boolean): Whether the header has a transparent background

**Example Usage:**

```tsx
import { Layout } from '@/components/layout';

<Layout hideFooter={isBookingFlow} transparentHeader={isHomePage}>
  <HomePage />
</Layout>;
```

## Form Components

### DateTimePicker

A component for selecting date and time for appointments.

**File Location:** `src/components/form/date-time-picker.tsx`

**Props:**

- `value` (Date): Current selected date/time
- `onChange` (function): Called when date/time changes
- `minDate` (Date): Minimum selectable date
- `maxDate` (Date): Maximum selectable date
- `timeSlots` (array): Available time slots
- `disabled` (boolean): Whether the picker is disabled
- `className` (string): Additional CSS classes

**Example Usage:**

```tsx
import { DateTimePicker } from '@/components/form/date-time-picker';

const [appointmentDate, setAppointmentDate] = useState(new Date());
const availableSlots = ['09:00', '09:30', '10:00', '10:30', '11:00'];

<DateTimePicker
  value={appointmentDate}
  onChange={setAppointmentDate}
  minDate={new Date()}
  timeSlots={availableSlots}
/>;
```

### DepartmentPicker

A component for selecting medical departments.

**File Location:** `src/components/form/department-picker.tsx`

**Props:**

- `value` (string | string[]): Selected department ID(s)
- `onChange` (function): Called when selection changes
- `multiple` (boolean): Whether multiple selection is allowed
- `className` (string): Additional CSS classes

**Example Usage:**

```tsx
import { DepartmentPicker } from '@/components/form/department-picker';

const [department, setDepartment] = useState('');

<DepartmentPicker value={department} onChange={setDepartment} multiple={false} />;
```

### ServicePicker

A component for selecting medical services.

**File Location:** `src/components/form/service-picker.tsx`

**Props:**

- `value` (string | string[]): Selected service ID(s)
- `onChange` (function): Called when selection changes
- `departmentId` (string): Optional filter by department
- `multiple` (boolean): Whether multiple selection is allowed
- `className` (string): Additional CSS classes

**Example Usage:**

```tsx
import { ServicePicker } from '@/components/form/service-picker';

const [service, setService] = useState('');

<ServicePicker value={service} onChange={setService} departmentId={selectedDepartment} multiple={false} />;
```

### DoctorSelector

A component for searching and selecting doctors.

**File Location:** `src/components/form/doctor-selector.tsx`

**Props:**

- `value` (string): Selected doctor ID
- `onChange` (function): Called when selection changes
- `departmentId` (string): Optional filter by department
- `serviceId` (string): Optional filter by service
- `className` (string): Additional CSS classes

**Example Usage:**

```tsx
import { DoctorSelector } from '@/components/form/doctor-selector';

const [doctor, setDoctor] = useState('');

<DoctorSelector value={doctor} onChange={setDoctor} departmentId={selectedDepartment} serviceId={selectedService} />;
```

## Feature Components

### ClinicCard

Displays information about a clinic location.

**File Location:** `src/components/ClinicCard.tsx`

**Props:**

- `clinic` (object): Clinic data object
- `className` (string): Additional CSS classes

**Example Usage:**

```tsx
import { ClinicCard } from '@/components/ClinicCard';

<ClinicCard clinic={clinicData} />;
```

### HeroSection

Hero banner component for page headers.

**File Location:** `src/components/hero-section.tsx`

**Props:**

- `title` (string): Main heading
- `description` (string): Subheading text
- `image` (string): Background image URL
- `actions` (array): Array of action button objects
- `className` (string): Additional CSS classes

**Example Usage:**

```tsx
import { HeroSection } from '@/components/hero-section';

<HeroSection
  title="Your Health, Our Priority"
  description="Schedule appointments with top doctors in your area"
  image="/static/header-illus.svg"
  actions={[
    { label: 'Book Appointment', onClick: () => navigate('/booking'), variant: 'primary' },
    { label: 'Find Doctor', onClick: () => navigate('/doctors'), variant: 'outline' },
  ]}
/>;
```

### ContentProcessor

A utility component that processes HTML content from WordPress to Tailwind CSS format.

**File Location:** `src/components/ContentProcessor.tsx`

**Props:**

- `htmlContent` (string): Raw HTML content to process
- `showSteps` (boolean): Whether to show processing steps
- `className` (string): Additional CSS classes

**Example Usage:**

```tsx
import { ContentProcessor } from '@/components/ContentProcessor';

<ContentProcessor htmlContent={articleData.content} showSteps={false} />;
```

## Best Practices

1. **Component Composition**

   - Break down complex components into smaller, reusable pieces
   - Use composition over inheritance for component reuse

2. **Props Consistency**

   - Include `className` prop for all components to allow style customization
   - Use consistent prop naming across similar components

3. **Responsive Design**

   - All components should be mobile-first and responsive
   - Use Tailwind's responsive classes for consistent breakpoints

4. **Accessibility**

   - Include proper ARIA attributes and semantic HTML
   - Ensure keyboard navigation works for all interactive elements

5. **State Management**

   - Keep component state minimal and focused
   - Use Jotai atoms for shared state across components

6. **Performance**
   - Memoize expensive calculations with useMemo
   - Use React.memo for pure components that re-render frequently
   - Optimize lists with virtualization for large datasets
