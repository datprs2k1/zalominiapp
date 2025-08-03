# Configuration Guide

This guide covers all configuration files and settings for the Zalo Healthcare Mini App, including app configuration, build settings, and environment variables.

## 📋 Table of Contents

- [App Configuration](#app-configuration)
- [TypeScript Configuration](#typescript-configuration)
- [Build Configuration](#build-configuration)
- [Environment Variables](#environment-variables)
- [Zalo Mini App Configuration](#zalo-mini-app-configuration)
- [Development vs Production](#development-vs-production)

## 🔧 App Configuration

### `app-config.json`

The main application configuration file for Zalo Mini App platform:

```json
{
  "app": {
    "title": "zalo",
    "textColor": "black",
    "statusBar": "transparent",
    "actionBarHidden": true,
    "hideIOSSafeAreaBottom": true,
    "hideAndroidBottomNavigationBar": false
  },
  "listCSS": [],
  "listSyncJS": [],
  "listAsyncJS": [],
  "template": {
    "name": "zaui-doctor",
    "oaID": "4318657068771012646"
  }
}
```

#### Configuration Options

| Property | Type | Description | Default |
|----------|------|-------------|---------|
| `app.title` | string | App title displayed in Zalo | "zalo" |
| `app.textColor` | string | Status bar text color | "black" |
| `app.statusBar` | string | Status bar style | "transparent" |
| `app.actionBarHidden` | boolean | Hide action bar | true |
| `app.hideIOSSafeAreaBottom` | boolean | Hide iOS safe area bottom | true |
| `app.hideAndroidBottomNavigationBar` | boolean | Hide Android navigation bar | false |
| `template.name` | string | Template identifier | "zaui-doctor" |
| `template.oaID` | string | Official Account ID | Required |

#### Customization Examples

**For Production:**
```json
{
  "app": {
    "title": "Zalo Healthcare",
    "textColor": "white",
    "statusBar": "dark-content"
  }
}
```

**For Development:**
```json
{
  "app": {
    "title": "Zalo Healthcare (Dev)",
    "textColor": "black",
    "statusBar": "light-content"
  }
}
```

## 📝 TypeScript Configuration

### `tsconfig.json`

TypeScript compiler configuration optimized for React and Zalo Mini App development:

```json
{
  "compilerOptions": {
    "target": "es6",
    "module": "esnext",
    "lib": ["dom", "es5", "es6", "es7", "es2017"],
    "jsx": "react-jsx",
    "strict": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

#### Key Configuration Highlights

- **Path Mapping**: `@/*` maps to `./src/*` for clean imports
- **React JSX**: Uses new JSX transform (`react-jsx`)
- **Strict Mode**: Enabled for better type safety
- **ES6+ Support**: Modern JavaScript features enabled
- **JSON Imports**: Allows importing JSON files as modules

## 🏗️ Build Configuration

### `vite.config.mts`

Vite configuration for fast development and optimized builds:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    target: 'es2015',
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['zmp-ui', 'framer-motion'],
        },
      },
    },
  },
  server: {
    port: 3000,
    host: true,
  },
});
```

### `tailwind.config.js`

Tailwind CSS configuration with medical theme customizations:

```javascript
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
        },
        medical: {
          blue: '#1e40af',
          green: '#059669',
          red: '#dc2626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

## 🌍 Environment Variables

### Development Environment (`.env.local`)

```bash
# API Configuration
WORDPRESS_API_URL=https://your-wordpress-api.com/wp-json/wp/v2
API_TIMEOUT=10000
API_RETRY_ATTEMPTS=3

# Zalo Mini App Configuration
ZALO_APP_ID=your-app-id
ZALO_APP_SECRET=your-app-secret
ZALO_OA_ID=your-official-account-id

# Development Settings
NODE_ENV=development
VITE_DEV_MODE=true
VITE_DEBUG_MODE=true
VITE_MOCK_API=false

# Performance Settings
VITE_ENABLE_PERFORMANCE_MONITORING=true
VITE_CACHE_DURATION=300000
```

### Production Environment

```bash
# API Configuration
WORDPRESS_API_URL=https://api.zalohealthcare.com/wp-json/wp/v2
API_TIMEOUT=5000
API_RETRY_ATTEMPTS=2

# Zalo Mini App Configuration
ZALO_APP_ID=production-app-id
ZALO_APP_SECRET=production-app-secret
ZALO_OA_ID=production-oa-id

# Production Settings
NODE_ENV=production
VITE_DEV_MODE=false
VITE_DEBUG_MODE=false
VITE_MOCK_API=false

# Performance Settings
VITE_ENABLE_PERFORMANCE_MONITORING=false
VITE_CACHE_DURATION=600000
```

## 📱 Zalo Mini App Configuration

### Platform-Specific Settings

#### iOS Configuration
```json
{
  "app": {
    "hideIOSSafeAreaBottom": true,
    "statusBar": "dark-content"
  }
}
```

#### Android Configuration
```json
{
  "app": {
    "hideAndroidBottomNavigationBar": false,
    "statusBar": "light-content"
  }
}
```

### Official Account Integration

The `oaID` in `app-config.json` must match your registered Zalo Official Account:

1. Register at [Zalo Official Account](https://oa.zalo.me/)
2. Get your Official Account ID
3. Update `app-config.json` with the correct `oaID`

## 🔄 Development vs Production

### Key Differences

| Setting | Development | Production |
|---------|-------------|------------|
| API Timeout | 10000ms | 5000ms |
| Debug Mode | Enabled | Disabled |
| Source Maps | Enabled | Enabled |
| Cache Duration | 5 minutes | 10 minutes |
| Performance Monitoring | Enabled | Disabled |

### Environment Detection

The app automatically detects the environment:

```typescript
// In src/config.ts
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;
export const apiUrl = import.meta.env.VITE_API_URL || 'https://default-api.com';
```

## 🛠️ Configuration Validation

### Runtime Validation

The app validates configuration at startup:

```typescript
// In src/app.ts
import appConfig from '../app-config.json';

if (!window.APP_CONFIG) {
  window.APP_CONFIG = appConfig;
}

// Validate required configuration
if (!appConfig.template.oaID) {
  throw new Error('Missing required oaID in app-config.json');
}
```

### Development Checks

During development, the app performs additional validation:

- Checks for required environment variables
- Validates API endpoints
- Verifies Zalo Mini App configuration

## 📚 Additional Resources

- [Zalo Mini App Documentation](https://mini.zalo.me/docs/)
- [Vite Configuration Reference](https://vitejs.dev/config/)
- [TypeScript Configuration Reference](https://www.typescriptlang.org/tsconfig)
- [Tailwind CSS Configuration](https://tailwindcss.com/docs/configuration)

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Maintainer**: Zalo Healthcare Development Team
