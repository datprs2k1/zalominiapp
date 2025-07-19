// React core
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AnimationProvider } from './contexts/animation-context';

// Router
import router from '@/router';

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

// Mount the app with AnimationProvider context
const root = createRoot(document.getElementById('app')!);
root.render(createElement(AnimationProvider, null, createElement(RouterProvider, { router })));
