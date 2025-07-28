# Color Usage Examples

## 🎯 Component-Specific Color Usage

### 1. Medical Cards

#### Primary Medical Card
```tsx
import { getColorToken } from '@/styles/unified-color-system';

const MedicalCard = ({ children, type = 'primary' }) => {
  const getCardStyles = () => {
    switch (type) {
      case 'emergency':
        return {
          backgroundColor: getColorToken('error-light'),
          borderColor: getColorToken('error'),
          color: getColorToken('text-primary')
        };
      case 'success':
        return {
          backgroundColor: getColorToken('success-light'),
          borderColor: getColorToken('success'),
          color: getColorToken('text-primary')
        };
      default:
        return {
          backgroundColor: getColorToken('surface'),
          borderColor: getColorToken('border'),
          color: getColorToken('text-primary')
        };
    }
  };

  return (
    <div 
      className="p-4 rounded-lg border"
      style={getCardStyles()}
    >
      {children}
    </div>
  );
};
```

#### CSS Implementation
```css
.medical-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.medical-card--emergency {
  background-color: var(--color-error-light);
  border-color: var(--color-error);
}

.medical-card--success {
  background-color: var(--color-success-light);
  border-color: var(--color-success);
}

.medical-card--warning {
  background-color: var(--color-warning-light);
  border-color: var(--color-warning);
}
```

### 2. Buttons

#### Medical Button Component
```tsx
import { getColorToken, ColorToken } from '@/styles/unified-color-system';

interface MedicalButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'emergency';
  children: React.ReactNode;
  onClick?: () => void;
}

const MedicalButton = ({ variant, children, onClick }: MedicalButtonProps) => {
  const getButtonStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: getColorToken('primary'),
          color: getColorToken('text-on-primary'),
          border: 'none'
        };
      case 'secondary':
        return {
          backgroundColor: getColorToken('secondary'),
          color: getColorToken('text-on-secondary'),
          border: 'none'
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: getColorToken('primary'),
          border: `1px solid ${getColorToken('primary')}`
        };
      case 'emergency':
        return {
          backgroundColor: getColorToken('error'),
          color: getColorToken('text-on-primary'),
          border: 'none'
        };
    }
  };

  return (
    <button
      className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-md"
      style={getButtonStyles()}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

### 3. Form Elements

#### Medical Input Field
```tsx
const MedicalInput = ({ label, error, ...props }) => {
  return (
    <div className="mb-4">
      <label 
        className="block text-sm font-medium mb-2"
        style={{ color: getColorToken('text-secondary') }}
      >
        {label}
      </label>
      <input
        className={`w-full px-3 py-2 rounded-lg border transition-colors ${
          error ? 'border-error' : 'border-border'
        } focus:border-border-focus focus:outline-none`}
        style={{
          backgroundColor: getColorToken('surface'),
          color: getColorToken('text-primary'),
          borderColor: error ? getColorToken('error') : getColorToken('border')
        }}
        {...props}
      />
      {error && (
        <p 
          className="text-sm mt-1"
          style={{ color: getColorToken('error') }}
        >
          {error}
        </p>
      )}
    </div>
  );
};
```

### 4. Navigation

#### Medical Header
```tsx
const MedicalHeader = () => {
  return (
    <header 
      className="px-4 py-3 border-b"
      style={{
        backgroundColor: getColorToken('surface'),
        borderColor: getColorToken('border')
      }}
    >
      <div className="flex items-center justify-between">
        <h1 
          className="text-xl font-bold"
          style={{ color: getColorToken('primary') }}
        >
          Medical App
        </h1>
        <nav className="flex space-x-4">
          <a 
            href="/home"
            className="hover:underline"
            style={{ color: getColorToken('text-secondary') }}
          >
            Trang chủ
          </a>
          <a 
            href="/services"
            className="hover:underline"
            style={{ color: getColorToken('text-secondary') }}
          >
            Dịch vụ
          </a>
        </nav>
      </div>
    </header>
  );
};
```

## 🎨 Tailwind CSS Classes

### Custom Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Primary colors
        'primary': 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
        'primary-light': 'var(--color-primary-light)',
        
        // Secondary colors
        'secondary': 'var(--color-secondary)',
        'secondary-hover': 'var(--color-secondary-hover)',
        
        // Background colors
        'background': 'var(--color-background)',
        'surface': 'var(--color-surface)',
        
        // Text colors
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted': 'var(--color-text-muted)',
        
        // Border colors
        'border': 'var(--color-border)',
        'border-focus': 'var(--color-border-focus)',
        
        // State colors
        'error': 'var(--color-error)',
        'error-light': 'var(--color-error-light)',
        'success': 'var(--color-success)',
        'success-light': 'var(--color-success-light)',
        'warning': 'var(--color-warning)',
        'warning-light': 'var(--color-warning-light)',
      }
    }
  }
};
```

### Usage Examples
```html
<!-- Primary Button -->
<button class="bg-primary text-white hover:bg-primary-hover px-4 py-2 rounded-lg">
  Primary Action
</button>

<!-- Medical Card -->
<div class="bg-surface border border-border text-text-primary p-4 rounded-lg">
  <h3 class="text-primary font-semibold">Medical Information</h3>
  <p class="text-text-secondary">Patient details...</p>
</div>

<!-- Error State -->
<div class="bg-error-light border border-error text-text-primary p-3 rounded">
  <p class="text-error font-medium">Error message</p>
</div>

<!-- Success State -->
<div class="bg-success-light border border-success text-text-primary p-3 rounded">
  <p class="text-success font-medium">Success message</p>
</div>
```

## 🌙 Dark Mode Examples

### Theme Toggle Implementation
```tsx
import { generateCSSVariables } from '@/styles/unified-color-system';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    // Apply CSS variables
    const variables = generateCSSVariables(newTheme);
    Object.entries(variables).forEach(([property, value]) => {
      document.documentElement.style.setProperty(property, value);
    });
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg border"
      style={{
        backgroundColor: getColorToken('surface'),
        borderColor: getColorToken('border'),
        color: getColorToken('text-primary')
      }}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
};
```

### Dark Mode CSS
```css
/* Light mode (default) */
:root {
  --color-background: #FFFFFF;
  --color-surface: #FFFFFF;
  --color-text-primary: #475569;
  --color-border: #E2E8F0;
}

/* Dark mode */
[data-theme="dark"] {
  --color-background: #0F172A;
  --color-surface: #1E293B;
  --color-text-primary: #F8FAFC;
  --color-border: #334155;
}

/* Components automatically adapt */
.medical-card {
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  border-color: var(--color-border);
}
```

## 📱 Responsive Color Usage

### Mobile-First Approach
```css
/* Base mobile styles */
.medical-header {
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}

/* Tablet and up */
@media (min-width: 768px) {
  .medical-header {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .medical-header {
    background-color: var(--color-background);
  }
}
```

## ✅ Best Practices Summary

### Do's
- Always use color tokens from the unified system
- Test color combinations for accessibility
- Implement proper hover and focus states
- Use semantic color names
- Support dark mode from the start

### Don'ts
- Never hardcode hex colors in components
- Don't rely solely on color to convey information
- Avoid using too many colors in one interface
- Don't skip accessibility testing
- Never ignore contrast ratio requirements
