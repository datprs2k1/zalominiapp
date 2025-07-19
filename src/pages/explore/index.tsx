import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { getPosts, postsAtomFamily } from '@/services/post';
import ExploreNewsItem from './NewsItem';
import './mobile.css';

function ExplorePage() {
  const [page, setPage] = useState(1);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMorePages, setHasMorePages] = useState(true);

  // Fetch posts for the current page
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (page === 1) {
          setIsLoading(true);
        } else {
          setIsLoadingMore(true);
        }

        const newPosts = await getPosts({ type: 'post', per_page: 10, page });

        if (Array.isArray(newPosts)) {
          if (newPosts.length === 0) {
            setHasMorePages(false);
          } else {
            if (page === 1) {
              setAllPosts(newPosts);
            } else {
              setAllPosts((prevPosts) => [...prevPosts, ...newPosts]);
            }
          }
        } else {
          // If the response is not an array, there might be an error
          console.error('Unexpected response format:', newPosts);
          setHasMorePages(false);
        }
      } catch (error: any) {
        console.error('Error fetching posts:', error);

        // Check for the specific WordPress error
        if (error.response?.data?.code === 'rest_post_invalid_page_number') {
          setHasMorePages(false);
        }
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    };

    fetchPosts();
  }, [page]);

  // Handle load more
  const handleLoadMore = () => {
    if (hasMorePages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  // Render loading skeletons
  const renderSkeletons = () => {
    return Array.from({ length: 4 }).map((_, index) => (
      <div
        key={`skeleton-${index}`}
        className="flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 animate-pulse overflow-hidden h-full"
      >
        <div className="h-[180px] bg-gray-200 w-full"></div>
        <div className="p-4">
          <div className="h-5 bg-gray-200 rounded w-1/4 mb-3"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4 mt-auto"></div>
        </div>
      </div>
    ));
  };

  return (
    <div className="explore-page">
      <div className="explore-content">
        {isLoading ? (
          <div className="news-items-grid">{renderSkeletons()}</div>
        ) : (
          <div className="news-items-grid">
            {allPosts.map((item, index) => (
              <div key={`post-${item.id}-${index}`} className="news-item-wrapper">
                <ExploreNewsItem {...item} />
              </div>
            ))}
          </div>
        )}

        {!isLoading && allPosts.length > 0 && hasMorePages && (
          <div className="load-more-container">
            <button className="load-more-button" onClick={handleLoadMore} disabled={isLoadingMore}>
              {isLoadingMore ? 'Đang tải...' : 'Xem thêm'}
            </button>
          </div>
        )}

        {!isLoading && !hasMorePages && allPosts.length > 0 && (
          <div className="load-more-container">
            <p className="text-gray-500 text-center py-2">Không có bài viết nào nữa</p>
          </div>
        )}

        {!isLoading && allPosts.length === 0 && (
          <div className="no-results">
            <div className="empty-state-icon">📰</div>
            <p>Không tìm thấy bài viết</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExplorePage;
