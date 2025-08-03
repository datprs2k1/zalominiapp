# Troubleshooting Guide

This guide provides solutions to common issues encountered while developing the Zalo Healthcare Mini App.

## 📋 Table of Contents

- [Installation Issues](#installation-issues)
- [Development Server Issues](#development-server-issues)
- [Zalo Mini App Platform Issues](#zalo-mini-app-platform-issues)
- [API and Network Issues](#api-and-network-issues)
- [Build and Deployment Issues](#build-and-deployment-issues)
- [TypeScript Issues](#typescript-issues)
- [Performance Issues](#performance-issues)
- [Mobile-Specific Issues](#mobile-specific-issues)

## 🔧 Installation Issues

### Node.js Version Errors

**Problem**: `Error: Node.js version not supported`

**Solution**:
```bash
# Check your Node.js version
node --version

# Install Node.js v16+ from nodejs.org
# Or use nvm to manage versions
nvm install 16
nvm use 16
```

### Yarn Installation Issues

**Problem**: `yarn: command not found`

**Solution**:
```bash
# Install Yarn globally
npm install -g yarn

# Verify installation
yarn --version
```

### Dependency Installation Failures

**Problem**: `yarn install` fails with network errors

**Solutions**:
```bash
# Clear yarn cache
yarn cache clean

# Use different registry
yarn install --registry https://registry.npmjs.org/

# Delete node_modules and reinstall
rm -rf node_modules yarn.lock
yarn install
```

### Permission Errors

**Problem**: Permission denied during installation

**Solution**:
```bash
# Fix npm permissions (macOS/Linux)
sudo chown -R $(whoami) ~/.npm

# Or use nvm to avoid permission issues
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

## 🚀 Development Server Issues

### Port Already in Use

**Problem**: `Error: listen EADDRINUSE: address already in use :::3000`

**Solutions**:
```bash
# Find and kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
yarn start --port 3001
```

### Hot Reload Not Working

**Problem**: Changes not reflecting in browser

**Solutions**:
1. **Check file watchers limit (Linux)**:
   ```bash
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

2. **Clear browser cache**: Hard refresh (Ctrl+Shift+R)

3. **Restart development server**:
   ```bash
   yarn clean
   yarn start
   ```

### Module Resolution Errors

**Problem**: `Module not found: Can't resolve '@/components/...'`

**Solutions**:
1. **Check tsconfig.json paths**:
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@/*": ["./src/*"]
       }
     }
   }
   ```

2. **Restart TypeScript server** in VS Code: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

## 📱 Zalo Mini App Platform Issues

### Login Issues

**Problem**: `yarn login` fails

**Solutions**:
```bash
# Clear Zalo CLI cache
rm -rf ~/.zmp

# Reinstall Zalo CLI
npm uninstall -g zmp-cli
npm install -g zmp-cli

# Login again
yarn login
```

### App Configuration Errors

**Problem**: App not loading in Zalo

**Solutions**:
1. **Check app-config.json**:
   ```json
   {
     "template": {
       "oaID": "your-correct-oa-id"
     }
   }
   ```

2. **Verify Official Account ID** in Zalo OA platform

3. **Check app permissions** in Zalo Developer Console

### Deployment Failures

**Problem**: `yarn deploy` fails

**Solutions**:
```bash
# Check deployment status
zmp status

# Clear deployment cache
zmp clean

# Redeploy
yarn deploy --force
```

## 🌐 API and Network Issues

### WordPress API Connection Errors

**Problem**: API requests failing with CORS or network errors

**Solutions**:
1. **Check environment variables**:
   ```bash
   # .env.local
   WORDPRESS_API_URL=https://your-correct-api-url.com/wp-json/wp/v2
   ```

2. **Test API endpoint**:
   ```bash
   curl https://your-api-url.com/wp-json/wp/v2/posts
   ```

3. **Check CORS configuration** on WordPress server

### Cache Issues

**Problem**: Stale data or cache errors

**Solutions**:
```bash
# Clear application cache
yarn clean

# Clear browser cache and storage
# In DevTools: Application → Storage → Clear storage
```

### Network Timeout Errors

**Problem**: API requests timing out

**Solutions**:
1. **Increase timeout in config**:
   ```typescript
   // src/services/api.ts
   const apiClient = axios.create({
     timeout: 15000, // Increase from 10000
   });
   ```

2. **Check network connection**
3. **Verify API server status**

## 🏗️ Build and Deployment Issues

### TypeScript Compilation Errors

**Problem**: Build fails with TypeScript errors

**Solutions**:
```bash
# Run type checking
yarn type-check

# Fix common issues
# 1. Add missing type definitions
# 2. Update import statements
# 3. Fix type annotations
```

### Bundle Size Issues

**Problem**: Bundle too large for Zalo platform

**Solutions**:
1. **Analyze bundle**:
   ```bash
   yarn build --analyze
   ```

2. **Optimize imports**:
   ```typescript
   // Instead of
   import * as _ from 'lodash';
   
   // Use
   import { debounce } from 'lodash';
   ```

3. **Enable code splitting** in vite.config.mts

### Build Memory Issues

**Problem**: Build fails with out of memory errors

**Solutions**:
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
yarn build

# Or add to package.json scripts
"build": "NODE_OPTIONS='--max-old-space-size=4096' vite build"
```

## 📝 TypeScript Issues

### Path Mapping Not Working

**Problem**: `@/` imports not resolving

**Solutions**:
1. **Check tsconfig.json**:
   ```json
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@/*": ["./src/*"]
       }
     }
   }
   ```

2. **Update vite.config.mts**:
   ```typescript
   export default defineConfig({
     resolve: {
       alias: {
         '@': path.resolve(__dirname, './src'),
       },
     },
   });
   ```

### Type Definition Errors

**Problem**: Missing type definitions for packages

**Solutions**:
```bash
# Install type definitions
yarn add -D @types/package-name

# For packages without types, create custom definitions
# src/types/custom.d.ts
declare module 'package-name' {
  export function someFunction(): void;
}
```

## ⚡ Performance Issues

### Slow Development Server

**Solutions**:
1. **Exclude unnecessary files** from TypeScript compilation
2. **Use SWC instead of Babel** (already configured)
3. **Reduce file watchers**:
   ```bash
   # Add to .gitignore
   node_modules/
   dist/
   .cache/
   ```

### Memory Leaks

**Problem**: Application consuming too much memory

**Solutions**:
1. **Check for memory leaks** in React DevTools Profiler
2. **Clean up event listeners** in useEffect cleanup
3. **Optimize image loading** with lazy loading

### Slow API Responses

**Solutions**:
1. **Implement caching** (already implemented)
2. **Use pagination** for large datasets
3. **Optimize database queries** on backend

## 📱 Mobile-Specific Issues

### iOS Safari Issues

**Problem**: App not working correctly on iOS

**Solutions**:
1. **iOS scroll fixes** (already implemented):
   ```css
   /* src/styles/ios-scroll-fixes.css */
   -webkit-overflow-scrolling: touch;
   ```

2. **Check viewport meta tag**:
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
   ```

### Android WebView Issues

**Problem**: Features not working in Android WebView

**Solutions**:
1. **Enable JavaScript** in WebView settings
2. **Check for polyfills** for missing features
3. **Test on different Android versions**

### Touch Events Not Working

**Problem**: Touch interactions not responsive

**Solutions**:
1. **Use proper touch targets** (minimum 44px)
2. **Add touch-action CSS**:
   ```css
   .interactive-element {
     touch-action: manipulation;
   }
   ```

## 🔍 Debugging Techniques

### Browser DevTools

1. **Console**: Check for JavaScript errors
2. **Network**: Monitor API requests and responses
3. **Application**: Inspect localStorage and sessionStorage
4. **Performance**: Profile rendering performance

### React DevTools

1. **Components**: Inspect component props and state
2. **Profiler**: Identify performance bottlenecks
3. **Hooks**: Debug custom hooks

### Zalo Mini App DevTools

1. **Zalo DevTools**: Use Zalo's debugging tools
2. **Remote debugging**: Debug on actual devices
3. **Logging**: Add comprehensive logging for debugging

## 🆘 Getting Additional Help

### Resources

- [Zalo Mini App Documentation](https://mini.zalo.me/docs/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/)

### Support Channels

- **GitHub Issues**: Report bugs and request features
- **Team Documentation**: Internal troubleshooting guides
- **Code Reviews**: Get help from team members

### Emergency Contacts

For critical production issues:
1. Check system status dashboard
2. Contact on-call developer
3. Follow incident response procedures

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Maintainer**: Zalo Healthcare Development Team
