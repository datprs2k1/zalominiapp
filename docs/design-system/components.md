# Component Examples

Comprehensive examples of all components in the Medical Design System.

## 🔘 Button Component

### Basic Usage
```tsx
import { Button } from '@/components/ui';

// Primary button (default)
<Button>Book Appointment</Button>

// With variant
<Button variant="secondary">Cancel</Button>

// With size
<Button size="lg">Emergency Contact</Button>

// With icons
<Button leftIcon={<PhoneIcon />}>Call Doctor</Button>

// Loading state
<Button loading>Processing...</Button>

// Full width
<Button fullWidth>Continue</Button>
```

### All Variants
```tsx
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="success">Success</Button>
<Button variant="danger">Danger</Button>
<Button variant="ghost">Ghost</Button>
```

### All Sizes
```tsx
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>
```

## 🃏 Card Component

### Basic Usage
```tsx
import { Card } from '@/components/ui';

// Default card
<Card>
  <h3>Appointment Details</h3>
  <p>Dr. Smith - Cardiology</p>
</Card>

// Hoverable card
<Card variant="hover">
  <h3>Click me</h3>
</Card>

// Different padding
<Card padding="lg">
  <h3>Large padding</h3>
</Card>
```

### Specialized Variants
```tsx
// Doctor card layout
<Card variant="doctor">
  <img src="doctor.jpg" alt="Dr. Smith" />
  <h3>Dr. Smith</h3>
  <p>Cardiologist</p>
</Card>

// Appointment card with accent border
<Card variant="appointment">
  <h3>Upcoming Appointment</h3>
  <p>Tomorrow at 2:00 PM</p>
</Card>

// Emergency card
<Card variant="emergency">
  <h3>Emergency Contact</h3>
  <p>Call immediately if symptoms worsen</p>
</Card>
```

## 📝 Input Component

### Basic Usage
```tsx
import { Input } from '@/components/ui';

// Basic input
<Input placeholder="Enter your name" />

// With label
<Input label="Patient Name" placeholder="Enter patient name" />

// Required field
<Input label="Email" required placeholder="patient@email.com" />

// With helper text
<Input 
  label="Phone Number"
  helperText="Include country code"
  placeholder="+1 (555) 123-4567"
/>

// With error
<Input 
  label="Password"
  error="Password must be at least 8 characters"
  type="password"
/>
```

### With Icons
```tsx
// Left icon
<Input 
  leftIcon={<SearchIcon />}
  placeholder="Search doctors..."
/>

// Right icon
<Input 
  rightIcon={<EyeIcon />}
  type="password"
  placeholder="Password"
/>

// Both icons
<Input 
  leftIcon={<UserIcon />}
  rightIcon={<CheckIcon />}
  placeholder="Username"
/>
```

## 👨‍⚕️ DoctorCard Component

### Basic Usage
```tsx
import { DoctorCard } from '@/components/ui';

const doctor = {
  id: '1',
  name: 'Dr. Sarah Johnson',
  specialty: 'Cardiologist',
  avatar: '/doctors/sarah-johnson.jpg',
  rating: 4.8,
  experience: 15,
  availability: 'available',
  bio: 'Specialized in heart surgery with 15 years of experience.'
};

// Full doctor card
<DoctorCard 
  doctor={doctor}
  onSelect={handleDoctorSelect}
  showAvailability={true}
/>

// Compact version
<DoctorCard 
  doctor={doctor}
  compact={true}
  onSelect={handleDoctorSelect}
/>
```

### Without Avatar
```tsx
const doctorNoAvatar = {
  id: '2',
  name: 'Dr. Michael Chen',
  specialty: 'Neurologist',
  rating: 4.9,
  availability: 'busy'
};

<DoctorCard doctor={doctorNoAvatar} />
```

## 🏷️ StatusBadge Component

### Basic Usage
```tsx
import { StatusBadge } from '@/components/ui';

// Available status
<StatusBadge status="available" />

// Busy status
<StatusBadge status="busy" />

// Unavailable status
<StatusBadge status="unavailable" />
```

### Custom Text and Sizes
```tsx
// Custom text
<StatusBadge status="available" text="Online Now" />

// Different sizes
<StatusBadge status="available" size="sm" />
<StatusBadge status="busy" size="md" />
<StatusBadge status="unavailable" size="lg" />
```

## 🎨 CSS Classes

### Medical Button Classes
```html
<!-- Primary button -->
<button class="btn-medical-primary">Book Now</button>

<!-- Secondary button -->
<button class="btn-medical-secondary">Cancel</button>

<!-- Success button -->
<button class="btn-medical-success">Confirm</button>

<!-- Danger button -->
<button class="btn-medical-danger">Delete</button>

<!-- Ghost button -->
<button class="btn-medical-ghost">Skip</button>
```

### Medical Card Classes
```html
<!-- Basic card -->
<div class="card-medical">Content</div>

<!-- Hoverable card -->
<div class="card-medical-hover">Clickable content</div>

<!-- Doctor card -->
<div class="card-doctor">Doctor info</div>

<!-- Appointment card -->
<div class="card-appointment">Appointment details</div>

<!-- Emergency card -->
<div class="card-emergency">Emergency info</div>
```

### Medical Form Classes
```html
<!-- Input field -->
<input class="input-medical" placeholder="Enter text" />

<!-- Input with error -->
<input class="input-medical-error" placeholder="Enter text" />

<!-- Label -->
<label class="label-medical">Field Label</label>

<!-- Form group -->
<div class="form-group-medical">
  <label class="label-medical">Name</label>
  <input class="input-medical" />
</div>
```

### Status Classes
```html
<!-- Available status -->
<span class="status-available">Available</span>

<!-- Busy status -->
<span class="status-busy">Busy</span>

<!-- Unavailable status -->
<span class="status-unavailable">Unavailable</span>
```

### Loading States
```html
<!-- Skeleton loader -->
<div class="skeleton-medical h-4 w-32"></div>

<!-- Loading dots -->
<div class="loading-dots-medical">
  <div></div>
  <div></div>
  <div></div>
</div>
```

## 🎭 Animation Examples

### Slide Animations
```html
<!-- Slide up animation -->
<div class="animate-slide-up">Content slides up</div>

<!-- Slide down animation -->
<div class="animate-slide-down">Content slides down</div>
```

### Medical Animations
```html
<!-- Heartbeat animation -->
<div class="animate-heartbeat">❤️</div>

<!-- Loading dots -->
<div class="animate-loading-dots">Loading...</div>

<!-- Skeleton animation -->
<div class="animate-skeleton bg-gray-200 h-4 w-32"></div>
```

## 📱 Mobile Navigation

### Bottom Navigation
```html
<nav class="nav-medical-bottom">
  <a href="/" class="nav-medical-item-active">
    <HomeIcon />
    <span>Home</span>
  </a>
  <a href="/explore" class="nav-medical-item-inactive">
    <ExploreIcon />
    <span>Explore</span>
  </a>
  <a href="/booking" class="nav-medical-item-inactive">
    <BookingIcon />
    <span>Book</span>
  </a>
  <a href="/profile" class="nav-medical-item-inactive">
    <ProfileIcon />
    <span>Profile</span>
  </a>
</nav>
```
