import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LoadingSpinner, LoadingOverlay, Skeleton, ProgressiveLoader } from '@/components/loading-states';
import { RouteLoading } from '@/components/route-loading';
import { useRouteTransition, useTransitionLoading, usePageLoading } from '@/hooks/use-route-transition';

// Demo data
const demoItems = [
  { id: 1, title: 'Khám tim mạch', description: 'Dịch vụ khám và điều trị các bệnh về tim mạch' },
  { id: 2, title: 'Khám nội khoa', description: 'Khám tổng quát và điều trị các bệnh nội khoa' },
  { id: 3, title: 'Khám nhi khoa', description: 'Chăm sóc sức khỏe trẻ em từ 0-16 tuổi' },
  { id: 4, title: 'Khám phụ khoa', description: 'Khám và điều trị các bệnh phụ khoa' },
];

export default function TransitionsDemo() {
  const navigate = useNavigate();
  const routeTransition = useRouteTransition();
  const { isLoading, loadingMessage, startLoading, stopLoading } = useTransitionLoading();
  const pageLoading = usePageLoading('demo');

  const [showOverlay, setShowOverlay] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [showProgressiveLoader, setShowProgressiveLoader] = useState(false);
  const [progressiveItems, setProgressiveItems] = useState<typeof demoItems>([]);
  const [showRouteLoading, setShowRouteLoading] = useState(false);
  const [routeLoadingVariant, setRouteLoadingVariant] = useState<'overlay' | 'minimal' | 'inline'>('overlay');

  // Demo functions
  const handleLoadingDemo = () => {
    startLoading('Đang xử lý yêu cầu...', 2000);
  };

  const handleOverlayDemo = () => {
    setShowOverlay(true);
    setTimeout(() => setShowOverlay(false), 3000);
  };

  const handleSkeletonDemo = () => {
    setShowSkeleton(true);
    setTimeout(() => setShowSkeleton(false), 2000);
  };

  const handleProgressiveDemo = () => {
    setShowProgressiveLoader(true);
    setProgressiveItems([]);

    // Simulate progressive loading
    setTimeout(() => {
      setProgressiveItems(demoItems);
      setShowProgressiveLoader(false);
    }, 2000);
  };

  const handlePageLoadingDemo = (key: string) => {
    pageLoading.setLoading(key, true);
    setTimeout(() => pageLoading.setLoading(key, false), 1500);
  };

  const handleNavigation = (path: string) => {
    startLoading('Đang chuyển trang...', 500);
    setTimeout(() => {
      navigate(path);
      stopLoading();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Demo: Page Transitions & Loading States</h1>
          <p className="text-gray-600">Showcase các hiệu ứng chuyển trang và trạng thái loading</p>
        </motion.div>

        {/* Route Transition Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold mb-4">Route Transition Status</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Current Path:</span> {routeTransition.currentPath}
            </div>
            <div>
              <span className="font-medium">Previous Path:</span> {routeTransition.previousPath || 'None'}
            </div>
            <div>
              <span className="font-medium">Direction:</span> {routeTransition.direction}
            </div>
            <div>
              <span className="font-medium">Is Transitioning:</span> {routeTransition.isTransitioning ? 'Yes' : 'No'}
            </div>
          </div>
        </motion.div>

        {/* Navigation Demo */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold mb-4">Page Navigation Demo</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => handleNavigation('/')}
              className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Trang chủ
            </button>
            <button
              onClick={() => handleNavigation('/services')}
              className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Dịch vụ
            </button>
            <button
              onClick={() => handleNavigation('/departments')}
              className="p-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Khoa
            </button>
            <button
              onClick={() => handleNavigation('/booking')}
              className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Đặt lịch
            </button>
          </div>
        </motion.div>

        {/* Loading States Demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold mb-4">Loading States Demo</h2>

          <div className="space-y-6">
            {/* Basic Loading Spinners */}
            <div>
              <h3 className="font-medium mb-3">Loading Spinners</h3>
              <div className="flex flex-wrap gap-4">
                <div className="text-center">
                  <LoadingSpinner size="sm" variant="minimal" />
                  <p className="text-xs mt-2">Small Minimal</p>
                </div>
                <div className="text-center">
                  <LoadingSpinner size="md" variant="default" />
                  <p className="text-xs mt-2">Medium Default</p>
                </div>
                <div className="text-center">
                  <LoadingSpinner size="lg" variant="medical" />
                  <p className="text-xs mt-2">Large Medical</p>
                </div>
              </div>
            </div>

            {/* Interactive Loading Demo */}
            <div>
              <h3 className="font-medium mb-3">Interactive Loading</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleLoadingDemo}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {isLoading ? 'Loading...' : 'Start Loading'}
                </button>
                <button
                  onClick={handleOverlayDemo}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Show Overlay
                </button>
                <button
                  onClick={handleSkeletonDemo}
                  className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                >
                  Show Skeleton
                </button>
                <button
                  onClick={handleProgressiveDemo}
                  className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                >
                  Progressive Loading
                </button>
              </div>

              {isLoading && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <LoadingSpinner variant="medical" message={loadingMessage} />
                </div>
              )}
            </div>

            {/* Page-specific Loading */}
            <div>
              <h3 className="font-medium mb-3">Page-specific Loading</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handlePageLoadingDemo('section1')}
                  className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                >
                  Load Section 1
                </button>
                <button
                  onClick={() => handlePageLoadingDemo('section2')}
                  className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
                >
                  Load Section 2
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Section 1</h4>
                  {pageLoading.isLoading('section1') ? (
                    <Skeleton variant="text" lines={3} />
                  ) : (
                    <p className="text-gray-600">Content for section 1 loaded successfully!</p>
                  )}
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Section 2</h4>
                  {pageLoading.isLoading('section2') ? (
                    <Skeleton variant="card" />
                  ) : (
                    <p className="text-gray-600">Content for section 2 loaded successfully!</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Skeleton Demo */}
        {showSkeleton && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-4">Skeleton Loading Demo</h2>
            <div className="space-y-4">
              <Skeleton variant="text" lines={1} />
              <Skeleton variant="text" lines={3} />
              <div className="flex items-center space-x-3">
                <Skeleton variant="avatar" />
                <div className="flex-1">
                  <Skeleton variant="text" lines={2} />
                </div>
              </div>
              <Skeleton variant="button" />
            </div>
          </motion.div>
        )}

        {/* Progressive Loader Demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold mb-4">Progressive Loading Demo</h2>
          <ProgressiveLoader
            items={progressiveItems}
            isLoading={showProgressiveLoader}
            renderItem={(item, index) => (
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{item.description}</p>
              </div>
            )}
            skeletonCount={4}
          />
        </motion.div>

        {/* Back Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center py-8"
        >
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
          >
            ← Quay về trang chủ
          </Link>
        </motion.div>
      </div>

      {/* Loading Overlay */}
      <LoadingOverlay isVisible={showOverlay} message="Đang xử lý yêu cầu của bạn..." variant="blur" />
    </div>
  );
}
