# State Management Guide

This guide covers the Jotai-based state management implementation in the Zalo Healthcare Mini App, including atomic patterns, best practices, and advanced usage scenarios.

## 📋 Table of Contents

- [Jotai Overview](#jotai-overview)
- [Atomic State Patterns](#atomic-state-patterns)
- [Service Integration](#service-integration)
- [Advanced Patterns](#advanced-patterns)
- [Performance Optimization](#performance-optimization)
- [Testing State](#testing-state)
- [Migration Guide](#migration-guide)

## ⚛️ Jotai Overview

### Why Jotai?

Jotai provides atomic state management that's perfect for the healthcare app's needs:

- **Granular Reactivity**: Only components using specific atoms re-render
- **Async Support**: Built-in support for async data fetching
- **TypeScript Integration**: Excellent TypeScript support
- **Minimal Boilerplate**: Less code compared to Redux
- **Bottom-up Approach**: Compose state from small atoms

### Core Concepts

```typescript
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';

// Basic atom
const countAtom = atom(0);

// Derived atom
const doubleCountAtom = atom((get) => get(countAtom) * 2);

// Async atom
const userAtom = atom(async () => {
  const response = await fetch('/api/user');
  return response.json();
});
```

## 🔬 Atomic State Patterns

### Basic Atoms

<augment_code_snippet path="src/state.ts" mode="EXCERPT">
````typescript
// Core data atoms
export const servicesState = atom<Promise<Service[]>>(mockServices);
export const doctorsState = atom<Promise<Doctor[]>>(mockDoctors);
export const articlesState = atom<Promise<Article[]>>(mockArticles);
export const departmentsState = atom<Promise<Department[]>>(mockDepartments);

// User state with error handling
export const userState = atomWithRefresh(() => {
  return getUserInfo({
    avatarType: 'normal',
  }).catch(() => {
    throw new NotifiableError('Vui lòng cho phép truy cập tên và ảnh đại diện!');
  });
});
````
</augment_code_snippet>

### Derived Atoms

```typescript
// Filter available doctors
export const availableDoctorsAtom = atom((get) => {
  const doctors = get(doctorsState);
  return doctors.filter(doctor => doctor.available);
});

// Search functionality
export const searchResultsAtom = atom((get) => {
  const keyword = get(searchKeywordAtom);
  const doctors = get(doctorsState);
  const departments = get(departmentsState);
  const news = get(articlesState);
  
  if (!keyword) return { doctors: [], departments: [], news: [] };
  
  const normalizedKeyword = toLowerCaseNonAccentVietnamese(keyword);
  return {
    doctors: doctors.filter(d => 
      toLowerCaseNonAccentVietnamese(d.name).includes(normalizedKeyword)
    ),
    departments: departments.filter(d => 
      toLowerCaseNonAccentVietnamese(d.name).includes(normalizedKeyword)
    ),
    news: news.filter(n => 
      toLowerCaseNonAccentVietnamese(n.title).includes(normalizedKeyword)
    ),
  };
});
```

### Atom Families

```typescript
import { atomFamily } from 'jotai/utils';

// Doctor details by ID
export const doctorAtomFamily = atomFamily((doctorId: number) =>
  atom(async () => {
    const response = await fetchDoctor(doctorId);
    return response;
  })
);

// Search results by query
export const searchAtomFamily = atomFamily((query: string) =>
  atom(async () => {
    if (!query.trim()) return [];
    return await searchDoctors(query);
  })
);

// Usage in components
const DoctorProfile = ({ doctorId }: { doctorId: number }) => {
  const doctor = useAtomValue(doctorAtomFamily(doctorId));
  return <div>{doctor.name}</div>;
};
```

## 🔌 Service Integration

### API Integration Atoms

<augment_code_snippet path="src/services/doctors.ts" mode="EXCERPT">
````typescript
// Service-integrated atoms
export const doctorsAtom = atom(async () => await getDoctors());
export const availableDoctorsAtom = atom(async () => await getAvailableDoctors());
export const seniorDoctorsAtom = atom(async () => await getSeniorDoctors());

// Search doctors atom family
export const searchDoctorsAtomFamily = atomFamily((query: string) => 
  atom(async () => await searchDoctors(query))
);

// Doctor statistics atom
export const doctorStatsAtom = atom(async () => await getDoctorStats());
````
</augment_code_snippet>

### Cache-Aware Atoms

```typescript
// Atom with cache integration
export const cachedDoctorsAtom = atom(async () => {
  const cached = getCachedData('doctors');
  if (cached && !isCacheExpired(cached)) {
    return cached.data;
  }
  
  const fresh = await getDoctors();
  setCachedData('doctors', fresh);
  return fresh;
});

// Invalidation atom
export const invalidateDoctorsAtom = atom(null, (get, set) => {
  invalidateCache('doctors');
  set(doctorsAtom, getDoctors()); // Refresh data
});
```

### Loading State Management

```typescript
import { loadable } from 'jotai/utils';

// Loadable atom for loading states
export const loadableDoctorsAtom = loadable(doctorsAtom);

// Usage in components
const DoctorsList = () => {
  const doctorsLoadable = useAtomValue(loadableDoctorsAtom);
  
  if (doctorsLoadable.state === 'loading') {
    return <DoctorsListSkeleton />;
  }
  
  if (doctorsLoadable.state === 'hasError') {
    return <ErrorMessage error={doctorsLoadable.error} />;
  }
  
  return (
    <div>
      {doctorsLoadable.data.map(doctor => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
};
```

## 🚀 Advanced Patterns

### Atom with Reset

```typescript
import { atomWithReset, RESET } from 'jotai/utils';

// Resettable form state
export const bookingFormAtom = atomWithReset({
  doctorId: null,
  date: null,
  timeSlot: null,
  symptoms: '',
  patientInfo: null
});

// Reset form
const BookingForm = () => {
  const [form, setForm] = useAtom(bookingFormAtom);
  
  const resetForm = () => setForm(RESET);
  
  return (
    <form>
      {/* Form fields */}
      <button type="button" onClick={resetForm}>
        Reset Form
      </button>
    </form>
  );
};
```

### Atom with Storage

```typescript
import { atomWithStorage } from 'jotai/utils';

// Persistent user preferences
export const userPreferencesAtom = atomWithStorage('userPreferences', {
  theme: 'light',
  language: 'vi',
  notifications: true,
  accessibility: {
    fontSize: 'medium',
    highContrast: false
  }
});

// Theme atom derived from preferences
export const themeAtom = atom(
  (get) => get(userPreferencesAtom).theme,
  (get, set, newTheme: 'light' | 'dark') => {
    const prefs = get(userPreferencesAtom);
    set(userPreferencesAtom, { ...prefs, theme: newTheme });
  }
);
```

### Async Write Atoms

```typescript
// Booking submission atom
export const submitBookingAtom = atom(
  null, // No read value
  async (get, set, booking: BookingData) => {
    set(bookingLoadingAtom, true);
    
    try {
      const result = await submitBooking(booking);
      set(bookingResultAtom, result);
      set(bookingFormAtom, RESET); // Reset form on success
      return result;
    } catch (error) {
      set(bookingErrorAtom, error);
      throw error;
    } finally {
      set(bookingLoadingAtom, false);
    }
  }
);

// Usage
const BookingSubmit = () => {
  const submitBooking = useSetAtom(submitBookingAtom);
  const [form] = useAtom(bookingFormAtom);
  
  const handleSubmit = async () => {
    try {
      await submitBooking(form);
      toast.success('Booking confirmed!');
    } catch (error) {
      toast.error('Booking failed');
    }
  };
  
  return <button onClick={handleSubmit}>Submit Booking</button>;
};
```

### Atom Composition

```typescript
// Compose multiple atoms for complex state
export const dashboardDataAtom = atom(async (get) => {
  const [doctors, appointments, stats] = await Promise.all([
    get(doctorsAtom),
    get(appointmentsAtom),
    get(statsAtom)
  ]);
  
  return {
    doctors,
    appointments,
    stats,
    summary: {
      totalDoctors: doctors.length,
      todayAppointments: appointments.filter(isToday).length,
      availableDoctors: doctors.filter(d => d.available).length
    }
  };
});
```

## ⚡ Performance Optimization

### Selective Subscriptions

```typescript
// Only subscribe to specific fields
const DoctorName = ({ doctorId }: { doctorId: number }) => {
  const doctorName = useAtomValue(
    useMemo(
      () => atom((get) => get(doctorAtomFamily(doctorId)).name),
      [doctorId]
    )
  );
  
  return <span>{doctorName}</span>;
};
```

### Debounced Atoms

```typescript
import { atomWithDebounce } from './utils/atoms';

// Debounced search
export const searchQueryAtom = atom('');
export const debouncedSearchAtom = atomWithDebounce(searchQueryAtom, 300);

export const searchResultsAtom = atom(async (get) => {
  const query = get(debouncedSearchAtom);
  if (!query) return [];
  return await searchDoctors(query);
});
```

### Memoized Computations

```typescript
// Expensive computation with memoization
export const doctorAnalyticsAtom = atom((get) => {
  const doctors = get(doctorsAtom);
  const appointments = get(appointmentsAtom);
  
  // Memoize expensive calculations
  return useMemo(() => {
    return {
      specialtyDistribution: calculateSpecialtyDistribution(doctors),
      appointmentTrends: calculateTrends(appointments),
      popularDoctors: findPopularDoctors(doctors, appointments)
    };
  }, [doctors, appointments]);
});
```

## 🧪 Testing State

### Testing Atoms

```typescript
import { createStore } from 'jotai';
import { doctorsAtom } from '../state';

describe('Doctors Atom', () => {
  it('should fetch and store doctors', async () => {
    const store = createStore();
    
    // Mock the API
    jest.spyOn(api, 'getDoctors').mockResolvedValue(mockDoctors);
    
    // Get atom value
    const doctors = await store.get(doctorsAtom);
    
    expect(doctors).toHaveLength(3);
    expect(doctors[0]).toHaveProperty('name');
  });
});
```

### Testing Components with Atoms

```typescript
import { Provider } from 'jotai';
import { render, screen } from '@testing-library/react';
import { DoctorsList } from '../DoctorsList';
import { doctorsAtom } from '../state';

const TestProvider = ({ children, initialValues = [] }) => (
  <Provider initialValues={initialValues}>
    {children}
  </Provider>
);

describe('DoctorsList', () => {
  it('renders doctors from atom', async () => {
    const mockDoctors = [
      { id: 1, name: 'Dr. Smith', specialty: 'Cardiology' }
    ];
    
    render(
      <TestProvider initialValues={[[doctorsAtom, mockDoctors]]}>
        <DoctorsList />
      </TestProvider>
    );
    
    expect(await screen.findByText('Dr. Smith')).toBeInTheDocument();
  });
});
```

## 🔄 Migration Guide

### From useState to Atoms

```typescript
// Before: Local state
const [doctors, setDoctors] = useState<Doctor[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchDoctors().then(setDoctors).finally(() => setLoading(false));
}, []);

// After: Atoms
const doctors = useAtomValue(doctorsAtom);
const loading = useAtomValue(loadable(doctorsAtom)).state === 'loading';
```

### From Context to Atoms

```typescript
// Before: Context
const ThemeContext = createContext();
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// After: Atoms
export const themeAtom = atomWithStorage('theme', 'light');

// Usage
const ThemeToggle = () => {
  const [theme, setTheme] = useAtom(themeAtom);
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Toggle Theme
    </button>
  );
};
```

### Best Practices

1. **Keep Atoms Small**: Create focused, single-purpose atoms
2. **Use Derived Atoms**: Compute values from other atoms instead of duplicating state
3. **Leverage Atom Families**: Use for dynamic, parameterized state
4. **Handle Async Properly**: Use loadable for loading states
5. **Test Atoms**: Write unit tests for complex atom logic
6. **Performance**: Use selective subscriptions for large objects

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Maintainer**: Zalo Healthcare Development Team
