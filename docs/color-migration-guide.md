# Color System Migration Guide

## 🎯 Migration Overview

✅ **Migration Status: COMPLETED** - All layout components have been successfully migrated to the unified medical color system.

This guide documents the migration process and serves as a reference for future development. The migration ensures consistency, accessibility, and maintainability across the entire application.

## 📋 Pre-Migration Checklist

### 1. Audit Current Color Usage

```bash
# Search for hardcoded colors in your codebase
grep -r "#[0-9A-Fa-f]\{6\}" src/
grep -r "rgb(" src/
grep -r "rgba(" src/
```

### 2. Identify Components to Update

- [ ] Header and navigation components
- [ ] Button components
- [ ] Form elements (inputs, selects, textareas)
- [ ] Card components
- [ ] Modal and dialog components
- [ ] Alert and notification components
- [ ] Loading states and skeletons

### 3. Backup Current Styles

```bash
# Create a backup branch
git checkout -b backup/pre-color-migration
git add .
git commit -m "Backup before color system migration"
git checkout main
```

## 🔄 Step-by-Step Migration

### Step 1: Import the Unified Color System

#### In TypeScript/React Components

```typescript
// Before
import { THEME_CONFIG } from '@/styles/enhanced-theme';

// After
import { getColorToken, COLOR_TOKENS, type ColorToken } from '@/styles/unified-color-system';
import { useThemeStyles } from '@/components/theme-provider';
```

#### In CSS Files

```css
/* Before */
@import '../styles/enhanced-theme.css';

/* After */
@import '../styles/unified-colors.css';
```

### Step 2: Update CSS Custom Properties

#### Replace Old Variables

```css
/* Before */
:root {
  --primary-color: #2563eb;
  --text-color: #333333;
  --background-color: #ffffff;
  --border-color: #e5e5e5;
}

/* After */
:root {
  --color-primary: #2563eb;
  --color-text-primary: #475569;
  --color-background: #ffffff;
  --color-border: #e2e8f0;
}
```

#### Update CSS Classes

```css
/* Before */
.button-primary {
  background-color: var(--primary-color);
  color: white;
  border: 1px solid var(--primary-color);
}

/* After */
.button-primary {
  background-color: var(--color-primary);
  color: var(--color-text-on-primary);
  border: 1px solid var(--color-primary);
}
```

### Step 3: Update React Components

#### Replace Hardcoded Colors

```tsx
// Before
const ButtonComponent = ({ children, variant = 'primary' }) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: '#2563EB',
          color: '#FFFFFF',
          border: 'none',
        };
      case 'secondary':
        return {
          backgroundColor: '#10B981',
          color: '#FFFFFF',
          border: 'none',
        };
      default:
        return {
          backgroundColor: '#F3F4F6',
          color: '#374151',
          border: '1px solid #D1D5DB',
        };
    }
  };

  return <button style={getButtonStyle()}>{children}</button>;
};

// After
import { useThemeStyles } from '@/components/theme-provider';

const ButtonComponent = ({ children, variant = 'primary' }) => {
  const { getColor, buttonPrimaryStyle, buttonSecondaryStyle } = useThemeStyles();

  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return buttonPrimaryStyle;
      case 'secondary':
        return buttonSecondaryStyle;
      default:
        return {
          backgroundColor: getColor('surface'),
          color: getColor('text-primary'),
          border: `1px solid ${getColor('border')}`,
        };
    }
  };

  return <button style={getButtonStyle()}>{children}</button>;
};
```

#### Update Styled Components

```tsx
// Before
import styled from 'styled-components';

const StyledCard = styled.div`
  background-color: #ffffff;
  border: 1px solid #e5e5e5;
  color: #333333;
  border-radius: 8px;
  padding: 16px;

  &:hover {
    background-color: #f9fafb;
  }
`;

// After
import styled from 'styled-components';

const StyledCard = styled.div`
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  border-radius: 8px;
  padding: 16px;

  &:hover {
    background-color: var(--color-surface-hover);
  }
`;
```

### Step 4: Update Tailwind Classes

#### Replace Old Classes

```html
<!-- Before -->
<div class="bg-blue-600 text-white border-blue-600">
  <h2 class="text-gray-900">Title</h2>
  <p class="text-gray-600">Description</p>
</div>

<!-- After -->
<div class="bg-primary text-text-on-primary border-primary">
  <h2 class="text-text-primary">Title</h2>
  <p class="text-text-secondary">Description</p>
</div>
```

#### Update Tailwind Config

Make sure your `tailwind.config.js` includes the new color tokens:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
        secondary: 'var(--color-secondary)',
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        border: 'var(--color-border)',
        error: 'var(--color-error)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        info: 'var(--color-info)',
      },
    },
  },
};
```

## 🔍 Common Migration Patterns

### Pattern 1: Medical Cards

```tsx
// Before
const MedicalCard = ({ type, children }) => (
  <div
    className="p-4 rounded-lg border"
    style={{
      backgroundColor: type === 'emergency' ? '#FEF2F2' : '#FFFFFF',
      borderColor: type === 'emergency' ? '#DC2626' : '#E5E5E5',
      color: '#333333',
    }}
  >
    {children}
  </div>
);

// After
import { useThemeStyles } from '@/components/theme-provider';

const MedicalCard = ({ type, children }) => {
  const { getColor } = useThemeStyles();

  const getCardStyle = () => {
    switch (type) {
      case 'emergency':
        return {
          backgroundColor: getColor('error-light'),
          borderColor: getColor('error'),
          color: getColor('text-primary'),
        };
      case 'success':
        return {
          backgroundColor: getColor('success-light'),
          borderColor: getColor('success'),
          color: getColor('text-primary'),
        };
      default:
        return {
          backgroundColor: getColor('surface'),
          borderColor: getColor('border'),
          color: getColor('text-primary'),
        };
    }
  };

  return (
    <div className="p-4 rounded-lg border" style={getCardStyle()}>
      {children}
    </div>
  );
};
```

### Pattern 2: Form Elements

```tsx
// Before
const MedicalInput = ({ error, ...props }) => (
  <input
    className="w-full px-3 py-2 rounded border"
    style={{
      backgroundColor: '#FFFFFF',
      borderColor: error ? '#DC2626' : '#D1D5DB',
      color: '#374151',
    }}
    {...props}
  />
);

// After
import { useThemeStyles } from '@/components/theme-provider';

const MedicalInput = ({ error, ...props }) => {
  const { inputStyle, getColor } = useThemeStyles();

  return (
    <input
      className="w-full px-3 py-2 rounded border focus:outline-none focus:ring-2"
      style={{
        ...inputStyle,
        borderColor: error ? getColor('border-error') : inputStyle.borderColor,
        '--tw-ring-color': getColor('border-focus'),
      }}
      {...props}
    />
  );
};
```

### Pattern 3: Status Indicators

```tsx
// Before
const StatusBadge = ({ status, children }) => {
  const getStatusStyle = () => {
    switch (status) {
      case 'success':
        return { backgroundColor: '#D1FAE5', color: '#065F46' };
      case 'error':
        return { backgroundColor: '#FEE2E2', color: '#991B1B' };
      case 'warning':
        return { backgroundColor: '#FEF3C7', color: '#92400E' };
      default:
        return { backgroundColor: '#F3F4F6', color: '#374151' };
    }
  };

  return (
    <span className="px-2 py-1 rounded-full text-xs font-medium" style={getStatusStyle()}>
      {children}
    </span>
  );
};

// After
import { useThemeStyles } from '@/components/theme-provider';

const StatusBadge = ({ status, children }) => {
  const { getColor } = useThemeStyles();

  const getStatusStyle = () => {
    switch (status) {
      case 'success':
        return {
          backgroundColor: getColor('success-light'),
          color: getColor('success'),
        };
      case 'error':
        return {
          backgroundColor: getColor('error-light'),
          color: getColor('error'),
        };
      case 'warning':
        return {
          backgroundColor: getColor('warning-light'),
          color: getColor('warning'),
        };
      default:
        return {
          backgroundColor: getColor('surface'),
          color: getColor('text-secondary'),
        };
    }
  };

  return (
    <span className="px-2 py-1 rounded-full text-xs font-medium" style={getStatusStyle()}>
      {children}
    </span>
  );
};
```

## ✅ Post-Migration Validation

### 1. Run Color System Tests

```typescript
import { runColorSystemTests } from '@/utils/color-testing';

// Run comprehensive tests
const testResults = runColorSystemTests();
console.log('Color System Health Score:', testResults.overallScore);
```

### 2. Visual Testing Checklist

- [ ] All components render correctly in light mode
- [ ] All components render correctly in dark mode
- [ ] Contrast ratios meet WCAG AA standards
- [ ] Colors are consistent across all pages
- [ ] Hover and focus states work properly
- [ ] Error and success states are clearly visible

### 3. Accessibility Testing

- [ ] Test with screen readers
- [ ] Test with high contrast mode
- [ ] Test color blindness simulation
- [ ] Verify keyboard navigation visibility

## 🚨 Common Migration Issues

### Issue 1: Missing Color Tokens

**Problem**: Using a color token that doesn't exist

```typescript
// This will cause an error
const color = getColor('non-existent-token');
```

**Solution**: Check available tokens in `COLOR_TOKENS`

```typescript
import { COLOR_TOKENS } from '@/styles/unified-color-system';
console.log(Object.keys(COLOR_TOKENS)); // See all available tokens
```

### Issue 2: Hardcoded Colors Still Present

**Problem**: Forgot to replace some hardcoded colors

```css
/* This should be updated */
.legacy-component {
  background-color: #2563eb; /* Hardcoded color */
}
```

**Solution**: Use the detection utility

```typescript
import { detectHardcodedColors } from '@/utils/color-testing';

const cssContent = `/* your CSS content */`;
const hardcodedColors = detectHardcodedColors(cssContent);
console.log('Found hardcoded colors:', hardcodedColors);
```

### Issue 3: Dark Mode Not Working

**Problem**: Colors don't change in dark mode

```css
/* Missing dark mode support */
.component {
  background-color: #ffffff; /* Fixed color */
}
```

**Solution**: Use CSS custom properties

```css
/* Proper dark mode support */
.component {
  background-color: var(--color-surface); /* Adapts to theme */
}
```

## 📊 Migration Progress Tracking

Create a checklist to track your migration progress:

```markdown
## Migration Progress

### Core Components

- [ ] Header/Navigation
- [ ] Footer
- [ ] Sidebar
- [ ] Main Layout

### UI Components

- [ ] Buttons
- [ ] Forms
- [ ] Cards
- [ ] Modals
- [ ] Alerts
- [ ] Loading States

### Pages

- [ ] Home Page
- [ ] About Page
- [ ] Services Page
- [ ] Contact Page
- [ ] Profile Page

### Testing

- [ ] Visual regression tests
- [ ] Accessibility tests
- [ ] Cross-browser tests
- [ ] Mobile responsiveness
```

## 🎉 Migration Complete!

Once migration is complete:

1. **Run final tests**: Execute the color system health check
2. **Update documentation**: Ensure all docs reflect the new system
3. **Train team**: Share the new color system with your team
4. **Monitor**: Keep an eye on any issues in production
5. **Celebrate**: You've successfully modernized your color system! 🎊

## 🔧 Automated Migration Tools

### Color Migration Script

```bash
# Run the automated migration script
npm run migrate:colors

# Or manually with specific patterns
npx ts-node scripts/migrate-colors.ts --pattern="src/components/**/*.tsx"
```

### Validation Script

```bash
# Validate migration completeness
npm run validate:colors

# Generate migration report
npm run report:color-migration
```

## 📞 Need Help?

If you encounter issues during migration:

- Check the [Color Design System Documentation](./color-design-system.md)
- Review [Color Usage Examples](./color-usage-examples.md)
- Use the Color Testing Dashboard for validation
- Run automated testing tools
- Consult the team for complex migration scenarios

## 📚 Additional Resources

- [Unified Color System API](../src/styles/unified-color-system.ts)
- [Theme Provider Documentation](../src/components/theme-provider.tsx)
- [Color Testing Utilities](../src/utils/color-testing.ts)
- [Accessibility Guidelines](./accessibility-guidelines.md)
