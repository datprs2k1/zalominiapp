import Layout from '@/components/layout';
import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ErrorBoundary } from './components/error-boundary';
import { LoadingSpinner } from './components/loading-states';

// Immediate load for critical pages
import HomePage from '@/pages/home';
import NotFound from './pages/404';

// Lazy load non-critical pages for better performance
const ServicesPage = lazy(() => import('./pages/services'));
const CategoriesPage = lazy(() => import('./pages/categories'));
const ExplorePage = lazy(() => import('./pages/explore'));
const ServiceDetailPage = lazy(() => import('./pages/detail/service'));
const BookingPage = lazy(() => import('./pages/booking'));
const ScheduleHistoryPage = lazy(() => import('./pages/schedule/history'));
const ScheduleDetailPage = lazy(() => import('./pages/schedule/detail'));
const ProfilePage = lazy(() => import('./pages/profile'));
const InvoicesPage = lazy(() => import('./pages/invoices'));
const AskPage = lazy(() => import('./pages/ask'));
const FeedbackPage = lazy(() => import('./pages/feedback'));
const SearchResultPage = lazy(() => import('./pages/search'));
const DepartmentDetailPage = lazy(() => import('./pages/detail/department'));
const NewsPage = lazy(() => import('./pages/news'));
const AboutPage = lazy(() => import('./pages/about'));
const DoctorPage = lazy(() => import('./pages/doctor'));
const DepartmentsPage = lazy(() => import('./pages/departments'));
const DoctorDetailPage = lazy(() => import('./pages/detail/doctor'));
const ServicePricesPage = lazy(() => import('./pages/services/prices'));
const TransitionsDemoPage = lazy(() => import('./pages/demo/transitions'));
const UIShowcasePage = lazy(() => import('./pages/demo/ui-showcase'));
const InformationCardsPage = lazy(() => import('./pages/demo/information-cards'));
const EnhancedFormsPage = lazy(() => import('./pages/demo/enhanced-forms'));
const DoctorCardsPage = lazy(() => import('./pages/demo/doctor-cards'));
const ScrollRestorationDemoPage = lazy(() => import('./pages/demo/scroll-restoration'));
const IOSScrollTestPage = lazy(() => import('./pages/ios-scroll-test'));

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          path: '/',
          element: <HomePage />,
        },
        {
          path: '/about',
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <AboutPage />
            </Suspense>
          ),
        },
        {
          path: '/search',
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <SearchResultPage />
            </Suspense>
          ),
        },
        {
          path: '/categories',
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <CategoriesPage />
            </Suspense>
          ),
          handle: {
            back: true,
            title: 'Danh mục',
            noScroll: true,
          },
        },
        {
          path: '/explore',
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <ExplorePage />
            </Suspense>
          ),
        },
        {
          path: '/services',
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <ServicesPage />
            </Suspense>
          ),
          handle: {
            back: true,
            title: 'Tất cả dịch vụ',
          },
        },
        {
          path: '/departments',
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <DepartmentsPage />
            </Suspense>
          ),
          handle: {
            back: true,
            title: 'Tất cả khoa',
          },
        },
        {
          /**
           * Accepted params:
           * - `tab`: to change to default tab (this page has 3 tabs). For example, to visit the doctor tab, navigate to /service/1?tab=2
           * - `doctor`: to default pick a doctor. For example: /service/1?tab=2&doctor=1
           */
          path: '/service/:id',
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <ServiceDetailPage />
            </Suspense>
          ),
          handle: {
            back: true,
            title: 'custom',
          },
        },
        {
          /**
           * Accepted params like above
           */
          path: '/department/:id',
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <DepartmentDetailPage />
            </Suspense>
          ),
          handle: {
            back: true,
            title: 'custom',
          },
        },
        {
          path: '/booking/:step?',
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <BookingPage />
            </Suspense>
          ),
          handle: {
            back: true,
            title: 'Đặt lịch khám',
          },
        },
        {
          path: '/ask',
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <AskPage />
            </Suspense>
          ),
          handle: {
            back: true,
            title: 'Gửi câu hỏi',
          },
        },
        {
          path: '/feedback',
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <FeedbackPage />
            </Suspense>
          ),
          handle: {
            back: true,
            title: 'Gửi phản ảnh',
          },
        },
        {
          path: '/schedule',
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <ScheduleHistoryPage />
            </Suspense>
          ),
        },
        {
          path: '/schedule/:id',
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <ScheduleDetailPage />
            </Suspense>
          ),
          handle: {
            back: true,
            title: 'Chi tiết',
          },
        },
        {
          path: '/profile',
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <ProfilePage />
            </Suspense>
          ),
          handle: {
            profile: true,
          },
        },
        {
          path: '/news/:id',
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <NewsPage />
            </Suspense>
          ),
          handle: {
            back: true,
            title: 'Tin tức',
          },
        },
        {
          path: '/invoices',
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <InvoicesPage />
            </Suspense>
          ),
          handle: {
            back: true,
            title: 'Hóa đơn',
          },
        },
        {
          path: '/doctor',
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <DoctorPage />
            </Suspense>
          ),
          handle: {
            back: true,
            title: 'Bác sĩ',
          },
        },
        {
          path: '/doctor/:id',
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <DoctorDetailPage />
            </Suspense>
          ),
          handle: {
            back: true,
            title: 'Chi tiết bác sĩ',
          },
        },
        {
          path: '/service-prices',
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <ServicePricesPage />
            </Suspense>
          ),
          handle: {
            back: true,
            title: 'Giá dịch vụ',
          },
        },
        {
          path: '/demo/transitions',
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <TransitionsDemoPage />
            </Suspense>
          ),
          handle: {
            back: true,
            title: 'Demo Transitions',
          },
        },
        {
          path: '/demo/ui-showcase',
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <UIShowcasePage />
            </Suspense>
          ),
          handle: {
            back: true,
            title: 'UI Showcase',
          },
        },
        {
          path: '/demo/enhanced-forms',
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <EnhancedFormsPage />
            </Suspense>
          ),
          handle: {
            back: true,
            title: 'Enhanced Forms',
          },
        },
        {
          path: '/demo/scroll-restoration',
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <ScrollRestorationDemoPage />
            </Suspense>
          ),
          handle: {
            back: true,
            title: 'Scroll Restoration Demo',
          },
        },
        {
          path: '/ios-scroll-test',
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <IOSScrollTestPage />
            </Suspense>
          ),
          handle: {
            back: true,
            title: 'iOS Scroll Test',
          },
        },
        {
          path: '*',
          element: <NotFound />,
        },
      ],
      ErrorBoundary,
    },
  ],
  { basename: getBasePath() }
);

export function getBasePath() {
  const urlParams = new URLSearchParams(window.location.search);
  const appEnv = urlParams.get('env');

  if (import.meta.env.PROD || appEnv === 'TESTING_LOCAL' || appEnv === 'TESTING' || appEnv === 'DEVELOPMENT') {
    return `/zapps/${window.APP_ID}`;
  }

  return window.BASE_PATH || '';
}

export default router;
