import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { useParams } from 'react-router-dom';
import NotFound from '../404';
import DetailPageTemplate from './template';
import { serviceAtom } from '@/services/post';
import normalizeHtml from '@/utils/normalHTML';
function ServiceDetailPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const data = useAtomValue(serviceAtom(Number(id)));

  useEffect(() => {
    if (data === undefined) {
      setLoading(true);
    } else {
      setLoading(false);
      setError(!data);
    }
  }, [data]);

  if (loading) {
    return (
      <div className="flex flex-col w-full min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
        {/* Hero Section Skeleton - Mobile Optimized */}
        <div className="relative w-full h-[180px] sm:h-[220px] overflow-hidden bg-gradient-to-r from-primary/20 to-primary-dark/20 animate-pulse">
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 z-20">
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-12 h-4 bg-white/30 rounded-full animate-pulse"></div>
              <div className="w-10 h-4 bg-white/30 rounded-full animate-pulse"></div>
            </div>
            <div className="w-3/4 h-6 sm:h-7 bg-white/40 rounded-lg animate-pulse mb-1"></div>
            <div className="w-1/2 h-3 sm:h-4 bg-white/30 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Breadcrumb Skeleton */}
        <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="w-16 h-3 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="w-12 h-3 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="w-20 h-3 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Content Skeleton - Mobile Optimized */}
        <div className="flex-1 w-full max-w-4xl mx-auto mt-2 mb-16 px-3 sm:px-4">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden">
            {/* Single Tab Content Skeleton - No tabs for mobile */}
            <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
              {/* Header skeleton */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-blue-200 rounded-lg animate-pulse"></div>
                <div className="w-32 h-5 bg-gray-200 rounded animate-pulse"></div>
              </div>

              {/* Content skeleton */}
              <div className="space-y-2 sm:space-y-3">
                <div className="w-full h-5 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-5/6 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-4/5 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>

              {/* Action buttons skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                <div className="h-10 bg-primary/20 rounded-lg animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>

              {/* Additional content blocks */}
              <div className="space-y-3 mt-6">
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="h-16 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="h-16 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="h-16 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading Indicator - Mobile Optimized */}
        <div className="fixed bottom-4 right-4 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-secondary/20 to-secondary-dark/20 flex items-center justify-center animate-pulse">
          <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <NotFound />;
  }

  // data là object với các trường title, content, department (theo WP REST API)
  const service = data as {
    title?: { rendered?: string };
    content?: { rendered?: string };
    department?: any;
    [key: string]: any;
  };

  return (
    <DetailPageTemplate
      title={service.title?.rendered || 'Dịch vụ'}
      subtitle="Dịch vụ y tế chuyên nghiệp với đội ngũ bác sĩ giàu kinh nghiệm"
      imageUrl={service._embedded?.['wp:featuredmedia']?.[0]?.source_url}
      category="Dịch vụ y tế"
      status="available"
      hideTabs={true} // Hide tabs 2 and 3 for mobile optimization
      // Remove stats for mobile optimization
      tab1={{
        htmlContent: normalizeHtml(service.content?.rendered || ''),
      }}
    />
  );
}

export default ServiceDetailPage;
