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

// ZaUI stylesheet
import 'zmp-ui/zaui.min.css';
// Tailwind stylesheet
import '@/css/tailwind.scss';
// Your stylesheet
import '@/css/app.scss';

// Expose app configuration
import appConfig from '../app-config.json';

if (!window.APP_CONFIG) {
  window.APP_CONFIG = appConfig;
}

// Initialize skeleton performance utilities
initializeSkeletonPerformance();

// Mount the app with ThemeProvider and AnimationProvider contexts
const root = createRoot(document.getElementById('app')!);
root.render(
  createElement(ThemeProvider, null, createElement(AnimationProvider, null, createElement(RouterProvider, { router })))
);
