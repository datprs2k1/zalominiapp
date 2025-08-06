# Deployment Guide

## Overview
This guide covers the deployment process for the Zalo Medical Mini App to the Zalo Mini Program platform.

## Prerequisites

### Required Tools
- Zalo Mini Program CLI (zmp-cli)
- Node.js 16+
- Yarn package manager
- Valid Zalo Developer Account

### Account Setup
1. Register for a Zalo Developer Account
2. Create a Mini Program project
3. Obtain necessary credentials and permissions
4. Configure app settings in Zalo Developer Console

## Environment Configuration

### Environment Variables
Create environment-specific configuration files:

```bash
# .env.development
REACT_APP_API_URL=https://dev-api.example.com
REACT_APP_ENV=development
REACT_APP_DEBUG=true

# .env.staging
REACT_APP_API_URL=https://staging-api.example.com
REACT_APP_ENV=staging
REACT_APP_DEBUG=false

# .env.production
REACT_APP_API_URL=https://api.example.com
REACT_APP_ENV=production
REACT_APP_DEBUG=false
```

### App Configuration
Update `app-config.json` for different environments:

```json
{
  "app": {
    "title": "Zalo Medical App",
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
    "oaID": "your-oa-id"
  }
}
```

## Build Process

### Development Build
```bash
# Install dependencies
yarn install

# Start development server
yarn start
```

### Production Build
```bash
# Build for production
yarn build

# Verify build output
ls -la dist/
```

### Build Optimization
The build process includes:
- TypeScript compilation
- CSS optimization with Tailwind
- JavaScript minification
- Asset optimization
- Bundle splitting
- Tree shaking

## Deployment Steps

### 1. Authentication
```bash
# Login to ZMP CLI
yarn login

# Or use zmp-cli directly
zmp login
```

### 2. Pre-deployment Checks
```bash
# Run tests
yarn test

# Check TypeScript compilation
yarn tsc --noEmit

# Lint code
yarn lint

# Format code
yarn format
```

### 3. Deploy to Platform
```bash
# Deploy to development environment
yarn deploy

# Deploy to specific environment
zmp deploy --env staging
zmp deploy --env production
```

### 4. Post-deployment Verification
- Test app functionality
- Verify API connections
- Check performance metrics
- Test on different devices

## Environment-Specific Deployments

### Development Environment
```bash
# Set development environment
export NODE_ENV=development

# Deploy to development
zmp deploy --env development
```

### Staging Environment
```bash
# Set staging environment
export NODE_ENV=staging

# Deploy to staging
zmp deploy --env staging
```

### Production Environment
```bash
# Set production environment
export NODE_ENV=production

# Deploy to production
zmp deploy --env production
```

## Deployment Configuration

### ZMP CLI Configuration (`zmp-cli.json`)
```json
{
  "type": "mini-app",
  "name": "zalo-medical-app",
  "version": "1.0.0",
  "environments": {
    "development": {
      "appId": "dev-app-id",
      "apiUrl": "https://dev-api.example.com"
    },
    "staging": {
      "appId": "staging-app-id", 
      "apiUrl": "https://staging-api.example.com"
    },
    "production": {
      "appId": "prod-app-id",
      "apiUrl": "https://api.example.com"
    }
  }
}
```

### Vite Configuration (`vite.config.mts`)
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { zmpPlugin } from 'zmp-vite-plugin';

export default defineConfig({
  plugins: [
    react(),
    zmpPlugin()
  ],
  build: {
    outDir: 'dist',
    sourcemap: process.env.NODE_ENV !== 'production',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          zmp: ['zmp-sdk', 'zmp-ui']
        }
      }
    }
  }
});
```

## Continuous Integration/Continuous Deployment (CI/CD)

### GitHub Actions Example
```yaml
name: Deploy to Zalo Mini Program

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'yarn'
      
      - run: yarn install
      - run: yarn test
      - run: yarn build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'yarn'
      
      - run: yarn install
      - run: yarn build
      
      - name: Deploy to ZMP
        env:
          ZMP_TOKEN: ${{ secrets.ZMP_TOKEN }}
        run: |
          echo $ZMP_TOKEN | zmp login --token
          zmp deploy --env production
```

## Monitoring and Logging

### Deployment Monitoring
- Monitor deployment success/failure
- Track deployment metrics
- Set up alerts for deployment issues
- Monitor app performance post-deployment

### Logging Configuration
```typescript
// Production logging configuration
const logger = {
  level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
  transports: [
    new ConsoleTransport(),
    new RemoteTransport({
      endpoint: process.env.REACT_APP_LOG_ENDPOINT
    })
  ]
};
```

## Rollback Strategy

### Quick Rollback
```bash
# Rollback to previous version
zmp rollback

# Rollback to specific version
zmp rollback --version 1.0.0
```

### Manual Rollback
1. Identify the last known good version
2. Deploy the previous version
3. Verify functionality
4. Update monitoring and alerts

## Performance Optimization

### Build Optimization
- Enable code splitting
- Optimize bundle size
- Compress assets
- Use CDN for static assets

### Runtime Optimization
- Implement lazy loading
- Use service workers for caching
- Optimize API calls
- Monitor performance metrics

## Security Considerations

### Deployment Security
- Use secure authentication tokens
- Implement proper access controls
- Encrypt sensitive configuration
- Regular security audits

### Runtime Security
- Sanitize user inputs
- Implement CSP headers
- Use HTTPS for all communications
- Regular dependency updates

## Troubleshooting

### Common Deployment Issues

#### Authentication Errors
```bash
# Clear authentication cache
zmp logout
zmp login

# Verify credentials
zmp whoami
```

#### Build Failures
```bash
# Clear build cache
rm -rf node_modules
rm -rf dist
yarn install
yarn build
```

#### Deployment Failures
```bash
# Check deployment logs
zmp logs

# Verify app configuration
zmp config show

# Test deployment in staging first
zmp deploy --env staging
```

### Debug Mode
```bash
# Enable debug mode
export DEBUG=zmp:*
zmp deploy --verbose
```

## Best Practices

### Pre-deployment Checklist
- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Environment variables configured
- [ ] Build successful
- [ ] Security scan completed
- [ ] Performance benchmarks met

### Post-deployment Checklist
- [ ] App functionality verified
- [ ] Performance metrics checked
- [ ] Error rates monitored
- [ ] User feedback collected
- [ ] Documentation updated

### Deployment Schedule
- Development: Continuous deployment
- Staging: Daily deployments
- Production: Weekly scheduled deployments
- Hotfixes: As needed with approval
