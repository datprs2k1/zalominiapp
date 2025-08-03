# UI Component Library Documentation

This comprehensive guide documents all UI components in the Zalo Healthcare Mini App with visual examples, props, usage guidelines, and best practices.

## 📋 Table of Contents

- [Component Overview](#component-overview)
- [Core Components](#core-components)
- [Form Components](#form-components)
- [Medical Components](#medical-components)
- [Layout Components](#layout-components)
- [Feedback Components](#feedback-components)
- [Navigation Components](#navigation-components)

## 🎯 Component Overview

### Component Architecture

The component library follows atomic design principles:

```
Atoms (Basic Elements)
├── Button, Input, Icon, Typography
├── Avatar, Badge, Divider, Spinner

Molecules (Simple Combinations)
├── SearchBar, FormField, Card, Alert
├── DoctorCard, ServiceItem, StatCard

Organisms (Complex Components)
├── Header, Navigation, DoctorList
├── BookingForm, SearchResults, Dashboard

Templates (Page Layouts)
├── PageLayout, ModalLayout, ListLayout
├── DetailLayout, FormLayout, GridLayout
```

### Component Standards

- **Accessibility**: All components meet WCAG 2.1 AA standards
- **Mobile-First**: Optimized for touch interactions
- **TypeScript**: Full type safety with comprehensive interfaces
- **Responsive**: Adaptive to all screen sizes
- **Themeable**: Support for light/dark modes

## 🔧 Core Components

### Button Component

The primary interactive element with medical-themed variants.

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

```tsx
// Primary action button
<Button variant="primary" size="lg">
  Book Appointment
</Button>

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

**Visual Variants:**
- `primary` - Main actions (blue)
- `emergency` - Critical actions (red, animated)
- `success` - Positive actions (green)
- `warning` - Caution actions (orange)
- `outline` - Secondary actions (outlined)
- `ghost` - Subtle actions (transparent)

### Typography Components

Semantic typography components for consistent text rendering.

<augment_code_snippet path="src/components/typography.tsx" mode="EXCERPT">
````typescript
// Page Title Component
export function PageTitle({ 
  children, 
  className = '', 
  animated = false,
  ...props 
}: Omit<BaseTypographyProps, 'variant' | 'as'>) {
  return (
    <Typography
      variant="pageTitle"
      as="h1"
      className={className}
      animated={animated}
      {...props}
    >
      {children}
    </Typography>
  );
}
````
</augment_code_snippet>

**Typography Components:**

```tsx
// Page and section titles
<PageTitle>Patient Dashboard</PageTitle>
<SectionTitle>Recent Appointments</SectionTitle>
<CardTitle>Dr. John Smith</CardTitle>

// Body text variants
<BodyText size="lg">Large body text for important content</BodyText>
<BodyText>Standard body text for general content</BodyText>
<BodyText size="sm">Small text for captions and metadata</BodyText>

// Medical-specific typography
<VitalSign value="120/80" label="Blood Pressure" />
<MedicalLabel>Patient ID: #12345</MedicalLabel>

// Responsive and animated text
<ResponsiveTitle level="hero">Welcome to Healthcare</ResponsiveTitle>
<GradientText>Premium Care</GradientText>
<TypewriterText text="Your health is our priority" />
```

### Icon Components

Medical-themed icon system with consistent sizing and styling.

```tsx
// Medical icons
<HeartIcon size="md" color="primary" />
<StethoscopeIcon size="lg" color="success" />
<EmergencyIcon size="xl" color="emergency" animated />

// UI icons
<SearchIcon size="sm" />
<MenuIcon size="md" />
<CloseIcon size="lg" />

// Status icons
<CheckIcon color="success" />
<AlertIcon color="warning" />
<ErrorIcon color="emergency" />
```

## 📝 Form Components

### Input Components

```tsx
// Basic input
<Input
  type="text"
  placeholder="Enter patient name"
  value={patientName}
  onChange={setPatientName}
  required
/>

// Input with validation
<Input
  type="email"
  label="Email Address"
  error={errors.email}
  helperText="We'll use this for appointment confirmations"
/>

// Medical-specific inputs
<PhoneInput
  label="Phone Number"
  country="VN"
  value={phone}
  onChange={setPhone}
/>

<DatePicker
  label="Appointment Date"
  value={appointmentDate}
  onChange={setAppointmentDate}
  minDate={new Date()}
/>
```

### Search Component

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

### Form Field Component

```tsx
<FormField
  label="Patient Information"
  required
  error={errors.patient}
  helperText="Enter complete patient details"
>
  <Input
    type="text"
    placeholder="Full name"
    {...register('patientName')}
  />
</FormField>
```

## 🏥 Medical Components

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

```tsx
// Doctor profile card
<MedicalCard
  variant="elevated"
  interactive
  header={<h3>Dr. John Smith</h3>}
  icon={<DoctorIcon />}
  status="consultation"
  onClick={() => viewDoctor(doctor.id)}
>
  <p>Cardiologist - 15 years experience</p>
  <p>Available today: 9:00 AM - 5:00 PM</p>
</MedicalCard>

// Emergency alert card
<MedicalCard
  variant="emergency"
  priority="critical"
  header="Emergency Alert"
  icon={<AlertIcon />}
>
  <p>Patient requires immediate attention</p>
  <p>Room 302 - Code Blue</p>
</MedicalCard>

// Patient information card
<PatientInfoCard
  patientName="John Doe"
  patientId="P12345"
  age={45}
  gender="Male"
  bloodType="O+"
  allergies={['Penicillin', 'Shellfish']}
/>
```

### Doctor Components

```tsx
// Doctor card for listings
<DoctorCard
  doctor={doctor}
  variant="compact"
  showAvailability
  onSelect={handleDoctorSelect}
/>

// Detailed doctor profile
<DoctorProfileCard
  doctor={doctor}
  showSchedule
  showReviews
  onBookAppointment={handleBooking}
/>

// Doctor selector for forms
<DoctorSelector
  specialty="cardiology"
  onSelect={setSelectedDoctor}
  value={selectedDoctor}
/>
```

### Service Components

```tsx
// Service item for menus
<ServiceItem
  to="/cardiology"
  icon={<HeartIcon />}
  label="Cardiology"
  description="Heart and cardiovascular care"
/>

// Service card with pricing
<ServiceCard
  service={service}
  showPricing
  onSelect={handleServiceSelect}
/>
```

## 🎨 Layout Components

### Container and Grid

```tsx
// Responsive container
<Container maxWidth="lg" padding="md">
  <content />
</Container>

// Medical grid layout
<Grid
  columns={{ mobile: 1, tablet: 2, desktop: 3 }}
  gap="lg"
  className="medical-grid"
>
  {items.map(item => <GridItem key={item.id}>{item}</GridItem>)}
</Grid>

// Stack layout
<Stack direction="vertical" spacing="md" align="center">
  <StackItem>Header</StackItem>
  <StackItem>Content</StackItem>
  <StackItem>Footer</StackItem>
</Stack>
```

### Section Components

```tsx
// Page section with title
<Section
  title="Recent Appointments"
  subtitle="Your upcoming medical appointments"
  action={<Button variant="outline">View All</Button>}
>
  <AppointmentsList />
</Section>

// Medical section with status
<MedicalSection
  title="Vital Signs"
  status="normal"
  timestamp="2 hours ago"
>
  <VitalSignsChart />
</MedicalSection>
```

## 💬 Feedback Components

### Loading States

```tsx
// Loading spinner
<LoadingSpinner
  size="lg"
  variant="medical"
  message="Loading patient data..."
/>

// Skeleton loading
<Skeleton
  variant="card"
  lines={3}
  animated
  className="doctor-card-skeleton"
/>

// Progressive loading
<ProgressiveLoader
  skeleton={<DoctorCardSkeleton />}
  component={<DoctorCard doctor={doctor} />}
  loading={isLoading}
/>
```

### Alert Components

```tsx
// Success alert
<Alert
  variant="success"
  title="Appointment Confirmed"
  message="Your appointment has been successfully booked"
  dismissible
  onDismiss={handleDismiss}
/>

// Emergency alert
<Alert
  variant="emergency"
  title="Critical Alert"
  message="Patient requires immediate attention"
  actions={[
    <Button variant="emergency">Respond</Button>,
    <Button variant="outline">Dismiss</Button>
  ]}
/>

// Information alert
<Alert
  variant="info"
  title="System Maintenance"
  message="Scheduled maintenance tonight from 2-4 AM"
  icon={<InfoIcon />}
/>
```

### Toast Notifications

```tsx
// Success toast
toast.success('Appointment booked successfully!', {
  duration: 4000,
  icon: <CheckIcon />,
});

// Error toast
toast.error('Failed to book appointment', {
  duration: 6000,
  action: {
    label: 'Retry',
    onClick: retryBooking,
  },
});

// Medical toast with custom styling
toast.custom(
  <MedicalToast
    type="emergency"
    title="Emergency Alert"
    message="Code Blue - Room 302"
  />,
  { duration: Infinity }
);
```

## 🧭 Navigation Components

### Header Component

```tsx
<Header
  title="Zalo Healthcare"
  showBack
  onBack={handleBack}
  actions={[
    <IconButton icon={<SearchIcon />} onClick={openSearch} />,
    <IconButton icon={<MenuIcon />} onClick={openMenu} />
  ]}
/>
```

### Navigation Menu

```tsx
<NavigationMenu>
  <NavItem to="/" icon={<HomeIcon />} label="Home" />
  <NavItem to="/doctors" icon={<DoctorIcon />} label="Doctors" />
  <NavItem to="/appointments" icon={<CalendarIcon />} label="Appointments" />
  <NavItem to="/profile" icon={<ProfileIcon />} label="Profile" />
</NavigationMenu>
```

### Breadcrumb Navigation

```tsx
<Breadcrumb>
  <BreadcrumbItem to="/">Home</BreadcrumbItem>
  <BreadcrumbItem to="/doctors">Doctors</BreadcrumbItem>
  <BreadcrumbItem current>Dr. John Smith</BreadcrumbItem>
</Breadcrumb>
```

## 🎯 Best Practices

### Component Usage Guidelines

1. **Accessibility**: Always include proper ARIA labels and keyboard navigation
2. **Mobile Touch**: Use minimum 44px touch targets
3. **Loading States**: Provide loading states for all async operations
4. **Error Handling**: Include error boundaries and fallback UI
5. **Performance**: Use lazy loading and memoization for heavy components

### Styling Guidelines

1. **Design Tokens**: Use CSS custom properties for consistent styling
2. **Responsive Design**: Mobile-first responsive patterns
3. **Animation**: Respect reduced motion preferences
4. **Color Contrast**: Ensure WCAG AA compliance
5. **Typography**: Use semantic typography components

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
