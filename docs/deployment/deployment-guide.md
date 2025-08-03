# Deployment Guide

This guide covers the complete deployment process for the Zalo Healthcare Mini App, including environment setup, build optimization, and platform-specific deployment procedures.

## 📋 Table of Contents

- [Deployment Overview](#deployment-overview)
- [Environment Configuration](#environment-configuration)
- [Build Process](#build-process)
- [Zalo Mini App Deployment](#zalo-mini-app-deployment)
- [Environment Management](#environment-management)
- [Performance Optimization](#performance-optimization)
- [Monitoring and Maintenance](#monitoring-and-maintenance)

## 🚀 Deployment Overview

### Deployment Architecture

```
Development → Staging → Production
     ↓           ↓         ↓
   Local      Testing   Live App
   Server     Server    Platform
```

### Deployment Environments

- **Development**: Local development with hot reload
- **Staging**: Testing environment with production-like setup
- **Production**: Live Zalo Mini App platform

### Key Deployment Components

- **Zalo Mini App Platform**: Primary hosting platform
- **CDN**: Static asset delivery
- **API Backend**: WordPress/custom API endpoints
- **Monitoring**: Performance and error tracking

## ⚙️ Environment Configuration

### Environment Variables

Create environment-specific configuration files:

**`.env.development`**
```bash
# Development environment
NODE_ENV=development
VITE_API_BASE_URL=http://localhost:3001/api
VITE_ZALO_APP_ID=dev-app-id
VITE_ENABLE_DEBUG=true
VITE_CACHE_ENABLED=false
```

**`.env.staging`**
```bash
# Staging environment
NODE_ENV=production
VITE_API_BASE_URL=https://staging-api.healthcare.com
VITE_ZALO_APP_ID=staging-app-id
VITE_ENABLE_DEBUG=false
VITE_CACHE_ENABLED=true
VITE_ANALYTICS_ENABLED=true
```

**`.env.production`**
```bash
# Production environment
NODE_ENV=production
VITE_API_BASE_URL=https://api.healthcare.com
VITE_ZALO_APP_ID=prod-app-id
VITE_ENABLE_DEBUG=false
VITE_CACHE_ENABLED=true
VITE_ANALYTICS_ENABLED=true
VITE_ERROR_REPORTING=true
```

### App Configuration

**`app-config.json`**
```json
{
  "app": {
    "title": "Zalo Healthcare",
    "icon": "icon.png",
    "description": "Healthcare Mini App for Zalo Platform"
  },
  "api": {
    "timeout": 10000,
    "retryAttempts": 3
  },
  "features": {
    "offline": true,
    "analytics": true,
    "errorReporting": true
  },
  "performance": {
    "lazyLoading": true,
    "imageOptimization": true,
    "codesplitting": true
  }
}
```

## 🔨 Build Process

### Build Configuration

**`vite.config.mts`**
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
    outDir: 'dist',
    sourcemap: process.env.NODE_ENV === 'development',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['zmp-ui', 'framer-motion'],
          utils: ['axios', 'jotai'],
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

### Build Scripts

**`package.json`**
```json
{
  "scripts": {
    "build": "vite build",
    "build:staging": "cross-env NODE_ENV=production vite build --mode staging",
    "build:production": "cross-env NODE_ENV=production vite build --mode production",
    "preview": "vite preview",
    "analyze": "vite-bundle-analyzer dist"
  }
}
```

### Build Optimization

```bash
# Production build with optimizations
yarn build:production

# Analyze bundle size
yarn analyze

# Preview production build
yarn preview
```

### Build Output Structure

```
dist/
├── assets/
│   ├── index-[hash].js      # Main application bundle
│   ├── vendor-[hash].js     # Vendor libraries
│   ├── ui-[hash].js         # UI components
│   └── style-[hash].css     # Compiled styles
├── icons/                   # App icons
├── images/                  # Optimized images
├── index.html              # Main HTML file
└── manifest.json           # App manifest
```

## 📱 Zalo Mini App Deployment

### Zalo CLI Setup

```bash
# Install Zalo CLI globally
npm install -g zmp-cli

# Login to Zalo Developer Platform
zmp login

# Initialize app configuration
zmp init
```

### Deployment Configuration

**`zmp-cli.json`**
```json
{
  "appId": "your-app-id",
  "appName": "Zalo Healthcare",
  "version": "1.0.0",
  "description": "Healthcare Mini App",
  "icon": "public/icon.png",
  "pages": [
    "pages/index",
    "pages/booking",
    "pages/profile"
  ],
  "permissions": [
    "getUserInfo",
    "getLocation",
    "camera",
    "writePhotosAlbum"
  ],
  "plugins": [],
  "cloud": false
}
```

### Deployment Commands

```bash
# Deploy to development environment
zmp deploy --env development

# Deploy to staging
zmp deploy --env staging

# Deploy to production
zmp deploy --env production

# Deploy with specific version
zmp deploy --version 1.2.0

# Deploy with build optimization
yarn build:production && zmp deploy --env production
```

### Pre-deployment Checklist

- [ ] Environment variables configured
- [ ] Build passes without errors
- [ ] All tests passing
- [ ] Performance metrics acceptable
- [ ] Security scan completed
- [ ] App icons and metadata updated
- [ ] Permissions properly configured

## 🌍 Environment Management

### Staging Environment

```bash
# Deploy to staging
yarn build:staging
zmp deploy --env staging

# Test staging deployment
curl https://staging.zalo-healthcare.com/health

# Run integration tests against staging
yarn test:integration --env staging
```

### Production Deployment

```bash
# Pre-production checks
yarn lint
yarn type-check
yarn test
yarn build:production

# Deploy to production
zmp deploy --env production

# Post-deployment verification
yarn test:e2e --env production
```

### Rollback Strategy

```bash
# List previous deployments
zmp deployments list

# Rollback to previous version
zmp rollback --version 1.1.0

# Emergency rollback
zmp rollback --immediate
```

## ⚡ Performance Optimization

### Build Optimization

```typescript
// Code splitting for routes
const HomePage = lazy(() => import('@/pages/home'));
const BookingPage = lazy(() => import('@/pages/booking'));
const ProfilePage = lazy(() => import('@/pages/profile'));

// Preload critical routes
const preloadRoute = (routeComponent: () => Promise<any>) => {
  const componentImport = routeComponent();
  return componentImport;
};
```

### Asset Optimization

```bash
# Image optimization
yarn imagemin src/static/**/*.{jpg,png} --out-dir=dist/images

# CSS optimization
yarn postcss src/css/app.scss -o dist/assets/app.css --env production

# JavaScript minification
yarn terser dist/assets/app.js -o dist/assets/app.min.js
```

### Caching Strategy

```typescript
// Service worker for caching
const CACHE_NAME = 'zalo-healthcare-v1.0.0';
const STATIC_ASSETS = [
  '/',
  '/static/css/app.css',
  '/static/js/app.js',
  '/static/images/logo.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
  );
});
```

## 📊 Monitoring and Maintenance

### Health Checks

```typescript
// Health check endpoint
export const healthCheck = async (): Promise<HealthStatus> => {
  const checks = await Promise.allSettled([
    checkAPIConnection(),
    checkDatabaseConnection(),
    checkCacheStatus(),
    checkExternalServices()
  ]);
  
  return {
    status: checks.every(check => check.status === 'fulfilled') ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    checks: checks.map((check, index) => ({
      name: ['api', 'database', 'cache', 'external'][index],
      status: check.status,
      message: check.status === 'rejected' ? check.reason.message : 'OK'
    }))
  };
};
```

### Error Monitoring

```typescript
// Error reporting setup
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  integrations: [
    new Sentry.BrowserTracing(),
  ],
  tracesSampleRate: 1.0,
});

// Custom error boundary
export const ErrorBoundary = Sentry.withErrorBoundary(App, {
  fallback: ({ error, resetError }) => (
    <ErrorFallback error={error} resetError={resetError} />
  ),
});
```

### Performance Monitoring

```typescript
// Performance metrics
const performanceObserver = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    if (entry.entryType === 'navigation') {
      console.log('Page load time:', entry.loadEventEnd - entry.loadEventStart);
    }
    
    if (entry.entryType === 'paint') {
      console.log(`${entry.name}:`, entry.startTime);
    }
  });
});

performanceObserver.observe({ entryTypes: ['navigation', 'paint'] });
```

### Deployment Automation

**`.github/workflows/deploy.yml`**
```yaml
name: Deploy to Zalo Mini App

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
        cache: 'yarn'
    
    - name: Install dependencies
      run: yarn install --frozen-lockfile
    
    - name: Run tests
      run: yarn test
    
    - name: Build application
      run: yarn build:production
    
    - name: Deploy to Zalo
      run: |
        yarn zmp login --token ${{ secrets.ZALO_TOKEN }}
        yarn zmp deploy --env production
```

### Maintenance Tasks

```bash
# Regular maintenance
yarn audit                    # Security audit
yarn outdated                # Check for updates
yarn clean                   # Clean build artifacts
yarn optimize                # Optimize assets

# Database maintenance (if applicable)
yarn db:migrate              # Run migrations
yarn db:seed                 # Seed test data
yarn db:backup               # Backup database
```

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Maintainer**: Zalo Healthcare Development Team
