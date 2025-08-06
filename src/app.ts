// React core
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AnimationProvider } from './contexts/animation-context';
import { ThemeProvider } from './components/theme-provider';

// Router
import router from '@/router';

// Skeleton performance utilities
import { initializeSkeletonPerformance } from './components/skeleton-performance-utils';

// iOS-specific fixes
import { initializeIOSFixes } from './utils/ios-fixes';

// ZaUI stylesheet
import 'zmp-ui/zaui.min.css';
// Tailwind stylesheet
import '@/css/tailwind.scss';
// Enhanced mobile styles (must be loaded early)
import '@/styles/enhanced-mobile.css';
// Safe area utilities (must be loaded early for proper safe area support)
import '@/styles/safe-area-utilities.css';
// Performance optimizations (must be loaded early for optimal performance)
import '@/styles/performance-optimizations.css';
// Accessibility enhancements (must be loaded early for proper a11y support)
import '@/styles/accessibility-enhancements.css';
// Simplified footer styles
import '@/styles/simplified-footer.css';
// iOS-specific scroll fixes (must be loaded before app.scss)
import '@/styles/ios-scroll-fixes.css';
// Your stylesheet
import '@/css/app.scss';

// Expose app configuration
import appConfig from '../app-config.json';

if (!window.APP_CONFIG) {
  window.APP_CONFIG = appConfig;
}

// Initialize skeleton performance utilities
initializeSkeletonPerformance();

// Initialize iOS-specific fixes
initializeIOSFixes();

// Initialize mobile footer tests in development
if (import.meta.env.DEV) {
  import('./utils/test-runner');
}

// Mount the app with ThemeProvider and AnimationProvider contexts
const root = createRoot(document.getElementById('app')!);
root.render(
  createElement(ThemeProvider, null, createElement(AnimationProvider, null, createElement(RouterProvider, { router })))
);
