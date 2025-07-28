/**
 * Optimized Posts List Component
 * 
 * Example implementation showcasing all performance optimizations:
 * - Optimized API hooks
 * - Network-aware loading
 * - Enhanced loading states with Framer Motion
 * - Virtual scrolling and pagination
 * - Performance monitoring
 * 
 * @version 1.0.0
 * @author Medical Development Team
 * @since 2024-07-23
 */

import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useOptimizedPosts, useInfiniteAPI } from '@/hooks/use-optimized-api';
import { OptimizedLoadingSpinner, ProgressiveLoading } from './optimized-loading-states';
import { InfiniteScroll, LazyImage } from './optimized-pagination';
import { getNetworkStatus, optimizeQueryParams } from '@/utils/network-aware-optimizations';
import { recordRenderTime } from '@/utils/enhanced-performance-monitor';
import { WPPost } from '@/services/wp-types';

interface OptimizedPostsListProps {
  category?: string;
  searchTerm?: string;
  itemsPerPage?: number;
  enableInfiniteScroll?: boolean;
  className?: string;
}

/**
 * Individual post item component with performance optimizations
 */
const PostItem = memo<{ post: WPPost; index: number }>(({ post, index }) => {
  const renderStart = performance.now();

  useEffect(() => {
    const renderTime = performance.now() - renderStart;
    recordRenderTime('PostItem', renderTime);
  }, [renderStart]);

  const networkStatus = getNetworkStatus();
  const imageQuality = networkStatus.networkInfo?.effectiveType === 'slow-2g' ? 'low' : 'medium';

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="flex">
        {/* Featured Image with lazy loading */}
        <div className="w-24 h-24 flex-shrink-0">
          <LazyImage
            src={post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/placeholder-medical.jpg'}
            alt={post.title.rendered}
            className="w-full h-full object-cover"
            placeholder={`data:image/svg+xml;base64,${btoa(`
              <svg width="96" height="96" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#f3f4f6"/>
                <text x="50%" y="50%" font-size="12" text-anchor="middle" dy=".3em" fill="#9ca3af">
                  Loading...
                </text>
              </svg>
            `)}`}
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          <h3 
            className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
          
          {post.excerpt?.rendered && (
            <div 
              className="text-gray-600 text-sm line-clamp-2 mb-2"
              dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
            />
          )}

          <div className="flex items-center justify-between text-xs text-gray-500">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('vi-VN')}
            </time>
            
            {/* Reading time estimate */}
            <span>
              {Math.max(1, Math.ceil((post.content?.rendered?.length || 0) / 1000))} phút đọc
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
});

PostItem.displayName = 'PostItem';

/**
 * Skeleton component for loading states
 */
const PostSkeleton = memo(() => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
    <div className="flex">
      <div className="w-24 h-24 bg-gray-200 flex-shrink-0" />
      <div className="flex-1 p-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
        <div className="flex justify-between">
          <div className="h-3 bg-gray-200 rounded w-20" />
          <div className="h-3 bg-gray-200 rounded w-16" />
        </div>
      </div>
    </div>
  </div>
));

PostSkeleton.displayName = 'PostSkeleton';

/**
 * Main optimized posts list component
 */
export const OptimizedPostsList = memo<OptimizedPostsListProps>(({
  category,
  searchTerm,
  itemsPerPage = 10,
  enableInfiniteScroll = true,
  className = '',
}) => {
  const renderStart = performance.now();

  // Optimize query parameters based on network conditions
  const baseParams = useMemo(() => {
    const params = {
      per_page: itemsPerPage,
      ...(category && { categories: category }),
      ...(searchTerm && { search: searchTerm }),
      _fields: 'id,title,excerpt,date,content,_links',
    };

    return optimizeQueryParams(params);
  }, [category, searchTerm, itemsPerPage]);

  // Use infinite scroll or regular API hook based on preference
  const {
    data: posts,
    isLoading,
    isError,
    error,
    isLoadingMore,
    hasNextPage,
    loadMore,
    refetch,
  } = enableInfiniteScroll
    ? useInfiniteAPI<WPPost>('/wp-json/wp/v2/posts', baseParams, {
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      })
    : {
        ...useOptimizedPosts(baseParams, {
          staleTime: 5 * 60 * 1000,
          refetchOnWindowFocus: false,
          refetchOnReconnect: true,
        }),
        isLoadingMore: false,
        hasNextPage: false,
        loadMore: () => {},
      };

  // Record render performance
  useEffect(() => {
    const renderTime = performance.now() - renderStart;
    recordRenderTime('OptimizedPostsList', renderTime);
  }, [renderStart]);

  // Handle retry on error
  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  // Error state
  if (isError) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Không thể tải bài viết
        </h3>
        <p className="text-gray-600 mb-4">
          {error?.message || 'Đã xảy ra lỗi khi tải dữ liệu'}
        </p>
        <button
          onClick={handleRetry}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Thử lại
        </button>
      </div>
    );
  }

  // Empty state
  if (!isLoading && (!posts || posts.length === 0)) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-6xl mb-4">📄</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Không có bài viết
        </h3>
        <p className="text-gray-600">
          {searchTerm 
            ? `Không tìm thấy bài viết nào cho "${searchTerm}"`
            : 'Chưa có bài viết nào được đăng tải'
          }
        </p>
      </div>
    );
  }

  // Render with infinite scroll or progressive loading
  if (enableInfiniteScroll) {
    return (
      <InfiniteScroll
        items={posts || []}
        renderItem={(post, index) => <PostItem key={post.id} post={post} index={index} />}
        renderSkeleton={() => <PostSkeleton />}
        hasNextPage={hasNextPage}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        onLoadMore={loadMore}
        className={`space-y-4 ${className}`}
        emptyMessage={
          searchTerm 
            ? `Không tìm thấy bài viết nào cho "${searchTerm}"`
            : 'Chưa có bài viết nào được đăng tải'
        }
      />
    );
  }

  // Regular progressive loading
  return (
    <ProgressiveLoading
      items={posts || []}
      renderItem={(post, index) => <PostItem key={post.id} post={post} index={index} />}
      renderSkeleton={() => <PostSkeleton />}
      isLoading={isLoading}
      className={`space-y-4 ${className}`}
      ariaLabel={
        searchTerm 
          ? `Kết quả tìm kiếm cho "${searchTerm}"`
          : 'Danh sách bài viết y tế'
      }
    />
  );
});

OptimizedPostsList.displayName = 'OptimizedPostsList';

/**
 * Network status indicator component
 */
export const NetworkStatusIndicator = memo(() => {
  const networkStatus = getNetworkStatus();

  if (!networkStatus.networkInfo) return null;

  const getStatusColor = () => {
    if (!networkStatus.isOnline) return 'bg-red-500';
    
    switch (networkStatus.networkInfo?.effectiveType) {
      case 'slow-2g':
      case '2g':
        return 'bg-orange-500';
      case '3g':
        return 'bg-yellow-500';
      case '4g':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    if (!networkStatus.isOnline) return 'Offline';
    return networkStatus.networkInfo?.effectiveType?.toUpperCase() || 'Unknown';
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex items-center space-x-2 bg-white rounded-full shadow-lg px-3 py-2 text-sm">
        <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
        <span className="text-gray-700">{getStatusText()}</span>
        {networkStatus.offlineQueueSize > 0 && (
          <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
            {networkStatus.offlineQueueSize} pending
          </span>
        )}
      </div>
    </div>
  );
});

NetworkStatusIndicator.displayName = 'NetworkStatusIndicator';

export default OptimizedPostsList;
