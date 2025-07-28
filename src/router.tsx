import Layout from '@/components/layout';
import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ErrorBoundary } from './components/error-boundary';
import { LoadingSpinner } from './components/loading-states';
import PageErrorBoundary from './components/page-error-boundary';
import {
  ServicesPageSkeleton,
  CategoriesPageSkeleton,
  DetailPageSkeleton,
  BookingPageSkeleton,
  ListPageSkeleton,
  SearchResultsSkeleton,
  ProfilePageSkeleton,
  GenericPageSkeleton,
} from './components/route-skeletons';

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
const DoctorCardsPage = lazy(() => import('./pages/demo/doctor-cards'));

// Wrapper components with skeleton fallbacks
const withSkeleton = (
  Component: React.ComponentType,
  SkeletonComponent: React.ComponentType<{ className?: string; animated?: boolean }>
) => {
  return (props: any) => (
    <Suspense fallback={<SkeletonComponent className="w-full h-full" animated={true} />}>
      <Component {...props} />
    </Suspense>
  );
};

// Create wrapped components with appropriate skeletons
const ServicesPageWithSkeleton = withSkeleton(ServicesPage, ServicesPageSkeleton);
const CategoriesPageWithSkeleton = withSkeleton(CategoriesPage, CategoriesPageSkeleton);
const ServiceDetailPageWithSkeleton = withSkeleton(ServiceDetailPage, DetailPageSkeleton);
const DepartmentDetailPageWithSkeleton = withSkeleton(DepartmentDetailPage, DetailPageSkeleton);
const DoctorDetailPageWithSkeleton = withSkeleton(DoctorDetailPage, DetailPageSkeleton);
const BookingPageWithSkeleton = withSkeleton(BookingPage, BookingPageSkeleton);
const ProfilePageWithSkeleton = withSkeleton(ProfilePage, ProfilePageSkeleton);
const DepartmentsPageWithSkeleton = withSkeleton(DepartmentsPage, ListPageSkeleton);
const DoctorPageWithSkeleton = withSkeleton(DoctorPage, ListPageSkeleton);
const ScheduleHistoryPageWithSkeleton = withSkeleton(ScheduleHistoryPage, ListPageSkeleton);
const ScheduleDetailPageWithSkeleton = withSkeleton(ScheduleDetailPage, DetailPageSkeleton);
const InvoicesPageWithSkeleton = withSkeleton(InvoicesPage, ListPageSkeleton);
const SearchResultPageWithSkeleton = withSkeleton(SearchResultPage, SearchResultsSkeleton);
const NewsPageWithSkeleton = withSkeleton(NewsPage, ListPageSkeleton);
const ServicePricesPageWithSkeleton = withSkeleton(ServicePricesPage, ListPageSkeleton);

// Generic skeleton for simple pages
const ExplorePageWithSkeleton = withSkeleton(ExplorePage, GenericPageSkeleton);
const AskPageWithSkeleton = withSkeleton(AskPage, GenericPageSkeleton);
const FeedbackPageWithSkeleton = withSkeleton(FeedbackPage, GenericPageSkeleton);
const AboutPageWithSkeleton = withSkeleton(AboutPage, GenericPageSkeleton);
const TransitionsDemoPageWithSkeleton = withSkeleton(TransitionsDemoPage, GenericPageSkeleton);
const UIShowcasePageWithSkeleton = withSkeleton(UIShowcasePage, GenericPageSkeleton);
const InformationCardsPageWithSkeleton = withSkeleton(InformationCardsPage, GenericPageSkeleton);

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
          element: <AboutPageWithSkeleton />,
        },
        {
          path: '/search',
          element: <SearchResultPageWithSkeleton />,
        },
        {
          path: '/categories',
          element: <CategoriesPageWithSkeleton />,
          handle: {
            back: true,
            title: 'Danh mục',
            noScroll: true,
          },
        },
        {
          path: '/explore',
          element: <ExplorePageWithSkeleton />,
        },
        {
          path: '/services',
          element: <ServicesPageWithSkeleton />,
          handle: {
            back: true,
            title: 'Tất cả dịch vụ',
          },
        },
        {
          path: '/departments',
          element: <DepartmentsPageWithSkeleton />,
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
          element: <ServiceDetailPageWithSkeleton />,
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
          element: <DepartmentDetailPageWithSkeleton />,
          handle: {
            back: true,
            title: 'custom',
          },
        },
        {
          path: '/booking/:step?',
          element: <BookingPageWithSkeleton />,
          handle: {
            back: true,
            title: 'Đặt lịch khám',
          },
        },
        {
          path: '/ask',
          element: <AskPageWithSkeleton />,
          handle: {
            back: true,
            title: 'Gửi câu hỏi',
          },
        },
        {
          path: '/feedback',
          element: <FeedbackPageWithSkeleton />,
          handle: {
            back: true,
            title: 'Gửi phản ảnh',
          },
        },
        {
          path: '/schedule',
          element: <ScheduleHistoryPageWithSkeleton />,
        },
        {
          path: '/schedule/:id',
          element: <ScheduleDetailPageWithSkeleton />,
          handle: {
            back: true,
            title: 'Chi tiết',
          },
        },
        {
          path: '/profile',
          element: <ProfilePageWithSkeleton />,
          handle: {
            profile: true,
          },
        },
        {
          path: '/news/:id',
          element: <NewsPageWithSkeleton />,
          handle: {
            back: true,
            title: 'Tin tức',
          },
        },
        {
          path: '/invoices',
          element: <InvoicesPageWithSkeleton />,
          handle: {
            back: true,
            title: 'Hóa đơn',
          },
        },
        {
          path: '/doctor',
          element: <DoctorPageWithSkeleton />,
          handle: {
            back: true,
            title: 'Bác sĩ',
          },
        },
        {
          path: '/doctor/:id',
          element: <DoctorDetailPageWithSkeleton />,
          handle: {
            back: true,
            title: 'Bác sĩ',
          },
        },
        {
          path: '/service-prices',
          element: <ServicePricesPageWithSkeleton />,
          handle: {
            back: true,
            title: 'Giá dịch vụ',
          },
        },
        {
          path: '/demo/transitions',
          element: <TransitionsDemoPageWithSkeleton />,
          handle: {
            back: true,
            title: 'Demo Transitions',
          },
        },
        {
          path: '/demo/ui-showcase',
          element: <UIShowcasePageWithSkeleton />,
          handle: {
            back: true,
            title: 'UI Showcase',
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
