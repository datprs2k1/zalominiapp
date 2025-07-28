import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { SkipToContent } from '@/components/accessibility/AccessibilityEnhancements';
import ErrorBoundary from '@/components/error/ErrorBoundary';
import { LoadingOverlay } from '@/components/loading/AdvancedLoadingStates';

interface ConsistentLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  showNavigation?: boolean;
  pageTitle?: string;
  pageDescription?: string;
  className?: string;
}

// Global Layout Context
interface LayoutContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  pageTitle: string;
  setPageTitle: (title: string) => void;
  breadcrumbs: BreadcrumbItem[];
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void;
}

interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

const LayoutContext = React.createContext<LayoutContextType | null>(null);

export const useLayout = () => {
  const context = React.useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};

// Consistent Header Component
const ConsistentHeader: React.FC<{ title: string; breadcrumbs: BreadcrumbItem[] }> = ({
  title,
  breadcrumbs
}) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.header
      className="bg-white border-b border-gray-200 sticky top-0 z-40"
      initial={prefersReducedMotion ? {} : { y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          </div>

          {/* Navigation Actions */}
          <div className="flex items-center gap-3">
            <button
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Thông báo"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 7H4l5-5v5z" />
              </svg>
            </button>
            <button
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Cài đặt"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <nav className="flex pb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              {breadcrumbs.map((item, index) => (
                <li key={index} className="flex items-center">
                  {index > 0 && (
                    <svg className="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  {item.href && !item.isActive ? (
                    <a
                      href={item.href}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span className={`text-sm ${item.isActive ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                      {item.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
      </div>
    </motion.header>
  );
};

// Consistent Footer Component
const ConsistentFooter: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.footer
      className="bg-gray-50 border-t border-gray-200 mt-auto"
      initial={prefersReducedMotion ? {} : { y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Hospital Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Bệnh viện Đa khoa Hòa Bình</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Địa chỉ: 123 Đường ABC, Quận XYZ, TP. Hải Phòng</p>
              <p>Điện thoại: (0225) 123 4567</p>
              <p>Email: info@hoabinhhosp.vn</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Liên kết nhanh</h3>
            <div className="space-y-2">
              {[
                { label: 'Đặt lịch khám', href: '/booking' },
                { label: 'Tra cứu kết quả', href: '/schedule' },
                { label: 'Dịch vụ y tế', href: '/services' },
                { label: 'Liên hệ', href: '/contact' }
              ].map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Emergency Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Liên hệ khẩn cấp</h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span className="text-sm font-medium text-red-900">Cấp cứu 24/7</span>
              </div>
              <p className="text-sm text-red-800 font-semibold">Hotline: 115</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-500">
            © 2024 Bệnh viện Đa khoa Hòa Bình. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

// Page Transition Component
const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={prefersReducedMotion ? {} : { opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Main Layout Component
const ConsistentLayout: React.FC<ConsistentLayoutProps> = ({
  children,
  showHeader = true,
  showFooter = true,
  showNavigation = true,
  pageTitle = 'Bệnh viện Đa khoa Hòa Bình',
  pageDescription = 'Hệ thống quản lý y tế',
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPageTitle, setPageTitle] = useState(pageTitle);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const location = useLocation();

  // Update page title and meta tags
  useEffect(() => {
    document.title = `${currentPageTitle} | Bệnh viện Đa khoa Hòa Bình`;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', pageDescription);
    }
  }, [currentPageTitle, pageDescription]);

  // Auto-generate breadcrumbs based on route
  useEffect(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const routeMap: Record<string, string> = {
      'booking': 'Đặt lịch khám',
      'schedule': 'Lịch khám',
      'doctors': 'Bác sĩ',
      'services': 'Dịch vụ',
      'profile': 'Hồ sơ',
      'search': 'Tìm kiếm',
      'feedback': 'Phản hồi',
      'invoices': 'Hóa đơn',
      'about': 'Giới thiệu'
    };

    const newBreadcrumbs: BreadcrumbItem[] = [
      { label: 'Trang chủ', href: '/' }
    ];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      newBreadcrumbs.push({
        label: routeMap[segment] || segment,
        href: isLast ? undefined : currentPath,
        isActive: isLast
      });
    });

    if (newBreadcrumbs.length > 1) {
      setBreadcrumbs(newBreadcrumbs);
    }
  }, [location.pathname]);

  const layoutContextValue: LayoutContextType = {
    isLoading,
    setIsLoading,
    pageTitle: currentPageTitle,
    setPageTitle,
    breadcrumbs,
    setBreadcrumbs
  };

  return (
    <LayoutContext.Provider value={layoutContextValue}>
      <ErrorBoundary>
        <div className={`min-h-screen flex flex-col bg-gray-50 ${className}`}>
          <SkipToContent />
          
          {showHeader && (
            <ConsistentHeader title={currentPageTitle} breadcrumbs={breadcrumbs} />
          )}

          <main id="main-content" className="flex-1 flex flex-col">
            <PageTransition>
              {children}
            </PageTransition>
          </main>

          {showFooter && <ConsistentFooter />}

          <LoadingOverlay
            isVisible={isLoading}
            message="Đang tải..."
            variant="spinner"
          />
        </div>
      </ErrorBoundary>
    </LayoutContext.Provider>
  );
};

export default ConsistentLayout;
