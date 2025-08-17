# Migration Guide

Step-by-step guide for migrating to the new Medical Design System.

## 🚀 Phase 1: Foundation Setup ✅

### ✅ Updated Tailwind Configuration
- Added medical color palette
- Included wellness and accent colors
- Added status colors (success, warning, danger)
- Extended typography scale
- Added medical-specific spacing tokens
- Included animation keyframes
- Added shadow and border radius tokens

### ✅ Created Design Tokens
- Established CSS custom properties
- Updated legacy color variables
- Added typography tokens
- Included spacing and layout tokens
- Integrated with ZaUI components

### ✅ Set up Component Library
- Created TypeScript interfaces
- Built core components (Button, Card, Input)
- Added specialized components (DoctorCard, StatusBadge)
- Established utility functions
- Created centralized exports

### ✅ Documentation System
- Created comprehensive README
- Added component examples
- Included usage guidelines
- Established best practices

## 🔄 Phase 2: Core Components Migration

### Button Component Migration

#### Before (Legacy)
```tsx
// Old button usage
<button className="bg-primary text-white px-4 py-2 rounded-lg">
  Submit
</button>
```

#### After (New Design System)
```tsx
// New button usage
import { Button } from '@/components/ui';

<Button variant="primary" size="md">
  Submit
</Button>
```

#### Migration Steps
1. Replace all `<button>` elements with `<Button>` component
2. Update class-based styling to use variants
3. Ensure minimum touch target size (44px)
4. Add loading states where appropriate

### Card Component Migration

#### Before (Legacy)
```tsx
// Old card usage
<div className="bg-white rounded-xl shadow-md p-4">
  Content
</div>
```

#### After (New Design System)
```tsx
// New card usage
import { Card } from '@/components/ui';

<Card variant="default" padding="md">
  Content
</Card>
```

### Input Component Migration

#### Before (Legacy)
```tsx
// Old input usage
<div>
  <label>Name</label>
  <input className="border rounded px-3 py-2" />
</div>
```

#### After (New Design System)
```tsx
// New input usage
import { Input } from '@/components/ui';

<Input label="Name" placeholder="Enter your name" />
```

## 🎨 Phase 3: Layout & Navigation Migration

### Header Component Updates
```tsx
// Update header with new design tokens
<header className="bg-white shadow-card-medical border-b border-neutral-200">
  {/* Header content */}
</header>
```

### Bottom Navigation Updates
```tsx
// Replace existing navigation with medical navigation classes
<nav className="nav-medical-bottom">
  <a href="/" className="nav-medical-item-active">
    <HomeIcon />
    <span>Home</span>
  </a>
  {/* Other nav items */}
</nav>
```

## 📄 Phase 4: Page-by-Page Migration

### Home Page Migration
1. **Hero Section**: Update colors to medical palette
2. **Quick Actions**: Use new Button components
3. **Service Cards**: Migrate to Card component with hover variant
4. **Navigation**: Update to medical navigation system

### Booking Page Migration
1. **Form Elements**: Replace with Input components
2. **Doctor Selection**: Use DoctorCard components
3. **Status Indicators**: Implement StatusBadge components
4. **Action Buttons**: Update to Button component variants

### Profile Page Migration
1. **User Info Cards**: Use Card component
2. **Settings Forms**: Implement Input components
3. **Action Buttons**: Update button styling
4. **Status Displays**: Use StatusBadge components

## 🔧 Common Migration Patterns

### Color Updates
```scss
// Before
.custom-element {
  background-color: #00abbb;
  color: white;
}

// After
.custom-element {
  @apply bg-medical-500 text-white;
}
```

### Spacing Updates
```scss
// Before
.element {
  padding: 16px;
  margin-bottom: 24px;
}

// After
.element {
  @apply p-card-padding mb-form-gap;
}
```

### Shadow Updates
```scss
// Before
.card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

// After
.card {
  @apply shadow-card-medical;
}
```

## ✅ Migration Checklist

### Phase 1: Foundation ✅
- [x] Update Tailwind configuration
- [x] Create design tokens
- [x] Set up component library
- [x] Establish documentation

### Phase 2: Core Components
- [ ] Migrate Button components
- [ ] Update Card components
- [ ] Replace Input components
- [ ] Add loading states

### Phase 3: Layout & Navigation
- [ ] Update header component
- [ ] Redesign bottom navigation
- [ ] Improve responsive layouts
- [ ] Add proper loading states

### Phase 4: Page Migration
- [ ] Home page redesign
- [ ] Booking flow optimization
- [ ] Profile page updates
- [ ] Search functionality
- [ ] Doctor listings

### Phase 5: Advanced Features
- [ ] Add micro-interactions
- [ ] Implement accessibility features
- [ ] Performance optimizations
- [ ] Cross-platform testing

### Phase 6: Polish & Launch
- [ ] Final design review
- [ ] User testing
- [ ] Performance audit
- [ ] Documentation completion

## 🚨 Breaking Changes

### Color Variables
- `--primary` changed from `#00abbb` to `#0ea5e9`
- `--background` changed from `#f2f9f9` to `#f9fafb`
- Added new color variables for medical context

### Component Props
- Button component now uses `variant` prop instead of custom classes
- Card component has new `variant` and `padding` props
- Input component includes built-in label and error handling

### CSS Classes
- Legacy button classes are deprecated
- New medical-specific classes added
- Some spacing classes have been updated

## 🔄 Rollback Plan

If issues arise during migration:

1. **Immediate Rollback**: Revert to previous Tailwind config
2. **Component Rollback**: Use legacy components alongside new ones
3. **Gradual Migration**: Migrate one page at a time
4. **Feature Flags**: Use feature flags to control new component usage

## 📞 Support

For migration support:
- Check component documentation
- Review example implementations
- Test on multiple devices
- Validate accessibility compliance
