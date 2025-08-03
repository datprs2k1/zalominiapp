# Development Guide

This comprehensive guide covers everything developers need to know to work effectively with the Zalo Healthcare Mini App, from initial setup to advanced development patterns.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Environment](#development-environment)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Strategy](#testing-strategy)
- [Debugging and Troubleshooting](#debugging-and-troubleshooting)

## 🚀 Getting Started

### Prerequisites

Before starting development, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **Yarn** package manager (v1.22+)
- **Git** for version control
- **VS Code** (recommended) with extensions:
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense
  - ES7+ React/Redux/React-Native snippets
  - Prettier - Code formatter
  - ESLint

### Initial Setup

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd zalo-healthcare
   ```

2. **Install Dependencies**

   ```bash
   yarn install
   ```

3. **Environment Configuration**

   The project uses several configuration files that need to be set up:

   **App Configuration (`app-config.json`)**

   ```json
   {
     "app": {
       "title": "Zalo Healthcare",
       "textColor": "black",
       "statusBar": "transparent",
       "actionBarHidden": true,
       "hideIOSSafeAreaBottom": true,
       "hideAndroidBottomNavigationBar": false
     },
     "template": {
       "name": "zaui-doctor",
       "oaID": "your-official-account-id"
     }
   }
   ```

   **Environment Variables** Create a `.env.local` file for local development:

   ```bash
   # API Configuration
   WORDPRESS_API_URL=https://your-wordpress-api.com/wp-json/wp/v2
   API_TIMEOUT=10000

   # Zalo Mini App Configuration
   ZALO_APP_ID=your-app-id
   ZALO_APP_SECRET=your-app-secret

   # Development Settings
   NODE_ENV=development
   VITE_DEV_MODE=true
   ```

4. **Zalo Mini App Setup**

   ```bash
   # Login to Zalo Mini App platform
   yarn login

   # Follow the authentication prompts
   ```

5. **Start Development Server**
   ```bash
   yarn start
   ```

The application will be available at the URL provided by the Zalo Mini App development server.

## 🛠️ Development Environment

### Available Scripts

```bash
# Development
yarn start          # Start development server
yarn dev           # Alternative development command

# Building
yarn build         # Build for production
yarn preview       # Preview production build

# Code Quality
yarn format        # Format code with Prettier
yarn lint          # Run ESLint
yarn type-check    # TypeScript type checking

# Deployment
yarn deploy        # Deploy to Zalo Mini App platform
yarn deploy:staging # Deploy to staging environment
```

### VS Code Configuration

Create `.vscode/settings.json`:

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  }
}
```

### Browser Development Tools

For Zalo Mini App development:

1. **Chrome DevTools**: Standard web debugging
2. **Zalo Developer Tools**: Platform-specific debugging
3. **React Developer Tools**: Component inspection
4. **Redux DevTools**: State management debugging (if using Redux)

## 📁 Project Structure

### Directory Organization

```
src/
├── app.ts                 # Application entry point
├── components/            # Reusable UI components
│   ├── button.tsx         # Core button component
│   ├── form/              # Form-related components
│   ├── icons/             # SVG icon components
│   ├── items/             # List item components
│   ├── loading-states/    # Loading and skeleton components
│   ├── medical/           # Medical-specific components
│   └── layout/            # Layout components
├── contexts/              # React context providers
│   ├── animation-context.tsx
│   └── theme-context.tsx
├── css/                   # Global styles
│   ├── app.scss           # Main application styles
│   └── tailwind.scss      # Tailwind CSS imports
├── data/                  # Mock data and constants
├── hooks/                 # Custom React hooks
│   ├── use-route-transition.ts
│   └── use-safe-loading-state.ts
├── pages/                 # Application pages/routes
│   ├── home/              # Home page components
│   ├── booking/           # Appointment booking flow
│   ├── profile/           # User profile pages
│   └── services/          # Medical services pages
├── services/              # API services layer
│   ├── api.ts             # HTTP client
│   ├── cache.ts           # Caching system
│   ├── common.ts          # Shared utilities
│   └── doctors.ts         # Doctor data service
├── static/                # Static assets (images, icons)
├── styles/                # Component-specific styles
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions
└── router.tsx             # Application routing
```

### File Naming Conventions

- **Components**: PascalCase (`Button.tsx`, `MedicalCard.tsx`)
- **Hooks**: camelCase with `use` prefix (`useRouteTransition.ts`)
- **Utilities**: camelCase (`formatDate.ts`, `apiHelpers.ts`)
- **Types**: PascalCase (`UserTypes.ts`, `ApiTypes.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS.ts`)

## 🔄 Development Workflow

### Feature Development Process

1. **Create Feature Branch**

   ```bash
   git checkout -b feature/appointment-booking
   ```

2. **Development Cycle**

   ```bash
   # Make changes
   # Test locally
   yarn start

   # Run quality checks
   yarn lint
   yarn type-check
   yarn format
   ```

3. **Commit Changes**

   ```bash
   git add .
   git commit -m "feat: add appointment booking functionality"
   ```

4. **Push and Create PR**
   ```bash
   git push origin feature/appointment-booking
   # Create pull request through GitHub/GitLab
   ```

### Component Development Pattern

```typescript
// 1. Define interfaces
interface DoctorCardProps {
  doctor: Doctor;
  onSelect?: (doctor: Doctor) => void;
  variant?: 'compact' | 'detailed';
}

// 2. Create component
export const DoctorCard: FC<DoctorCardProps> = ({
  doctor,
  onSelect,
  variant = 'compact'
}) => {
  // Component logic
  return (
    <MedicalCard
      variant="elevated"
      interactive={!!onSelect}
      onClick={() => onSelect?.(doctor)}
    >
      {/* Component content */}
    </MedicalCard>
  );
};

// 3. Export with display name
DoctorCard.displayName = 'DoctorCard';
```

### State Management Pattern

```typescript
// 1. Define atoms
export const doctorsAtom = atom<Doctor[]>([]);
export const selectedDoctorAtom = atom<Doctor | null>(null);

// 2. Create derived atoms
export const availableDoctorsAtom = atom((get) =>
  get(doctorsAtom).filter(doctor => doctor.available)
);

// 3. Use in components
const DoctorsList = () => {
  const doctors = useAtomValue(availableDoctorsAtom);
  const setSelectedDoctor = useSetAtom(selectedDoctorAtom);

  return (
    <div>
      {doctors.map(doctor => (
        <DoctorCard
          key={doctor.id}
          doctor={doctor}
          onSelect={setSelectedDoctor}
        />
      ))}
    </div>
  );
};
```

## 📏 Coding Standards

### TypeScript Guidelines

```typescript
// Use explicit types for props
interface ButtonProps {
  children: ReactNode;
  variant: 'primary' | 'secondary';
  onClick: () => void;
}

// Use type assertions carefully
const element = document.getElementById('app') as HTMLElement;

// Prefer interfaces over types for object shapes
interface User {
  id: number;
  name: string;
  email: string;
}

// Use enums for constants
enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}
```

### React Best Practices

```typescript
// Use functional components with hooks
const DoctorProfile: FC<DoctorProfileProps> = ({ doctorId }) => {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctor(doctorId).then(setDoctor).finally(() => setLoading(false));
  }, [doctorId]);

  if (loading) return <DoctorProfileSkeleton />;
  if (!doctor) return <NotFound />;

  return <DoctorCard doctor={doctor} />;
};

// Use custom hooks for reusable logic
const useDoctor = (doctorId: number) => {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchDoctor(doctorId)
      .then(setDoctor)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [doctorId]);

  return { doctor, loading, error };
};
```

### CSS/Styling Guidelines

```scss
// Use Tailwind utilities first
.doctor-card {
  @apply bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow;
}

// Custom styles when needed
.medical-gradient {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
}

// Responsive design
.responsive-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4;
}
```

### Error Handling Patterns

```typescript
// Service layer error handling
export const fetchDoctor = async (id: number): Promise<Doctor> => {
  try {
    const response = await apiClient.get(`/doctors/${id}`);
    return transformDoctor(response.data);
  } catch (error) {
    if (error.response?.status === 404) {
      throw new NotFoundError(`Doctor with ID ${id} not found`);
    }
    throw new APIError('Failed to fetch doctor', error);
  }
};

// Component error handling
const DoctorProfile = ({ doctorId }: { doctorId: number }) => {
  const { doctor, loading, error } = useDoctor(doctorId);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!doctor) return <NotFound />;

  return <DoctorCard doctor={doctor} />;
};
```

## 🧪 Testing Strategy

### Unit Testing

```typescript
// Component testing
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Integration Testing

```typescript
// Service testing
import { getDoctors } from '../services/doctors';
import { mockApiResponse } from '../__mocks__/api';

describe('Doctors Service', () => {
  it('fetches and transforms doctors correctly', async () => {
    mockApiResponse('/doctors', { data: mockDoctorsData });

    const doctors = await getDoctors();

    expect(doctors).toHaveLength(3);
    expect(doctors[0]).toHaveProperty('specialty');
    expect(doctors[0]).toHaveProperty('available');
  });
});
```

## 🐛 Debugging and Troubleshooting

### Common Issues

1. **Zalo SDK Issues**

   ```typescript
   // Check if running in Zalo environment
   if (typeof window !== 'undefined' && window.ZaloJavaScriptInterface) {
     // Zalo-specific code
   } else {
     // Fallback for development
   }
   ```

2. **State Management Issues**

   ```typescript
   // Debug Jotai atoms
   import { useAtomValue } from 'jotai';
   import { RESET } from 'jotai/utils';

   const DebugPanel = () => {
     const doctors = useAtomValue(doctorsAtom);
     console.log('Current doctors state:', doctors);

     return <div>Debug info here</div>;
   };
   ```

3. **Performance Issues**

   ```typescript
   // Use React DevTools Profiler
   import { Profiler } from 'react';

   const onRenderCallback = (id, phase, actualDuration) => {
     console.log('Component render time:', { id, phase, actualDuration });
   };

   <Profiler id="DoctorsList" onRender={onRenderCallback}>
     <DoctorsList />
   </Profiler>
   ```

### Development Tools

- **React DevTools**: Component inspection and profiling
- **Network Tab**: API request monitoring
- **Console**: Error tracking and debugging
- **Lighthouse**: Performance auditing
- **Zalo DevTools**: Platform-specific debugging

### Logging Strategy

```typescript
// Structured logging
const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data);
  },
  error: (message: string, error?: Error) => {
    console.error(`[ERROR] ${message}`, error);
  },
  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, data);
    }
  },
};
```

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Maintainer**: Zalo Healthcare Development Team
