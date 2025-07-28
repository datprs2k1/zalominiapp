import Section from '@/components/section';
import TransitionLink from '@/components/transition-link';
import { useState, useEffect } from 'react';
import { getPosts } from '@/services/post';
import { WPPost } from '@/services/wp-types';
import {
  CARD_DIMENSIONS,
  IMAGE_DIMENSIONS,
  SPACING,
  BORDER_RADIUS,
  TYPOGRAPHY,
  combineClasses,
} from '@/styles/medical-design-system';
import { getColorToken } from '@/styles/unified-color-system';

const NewsCard = ({ news }: { news: WPPost }) => {
  // Extract featured image URL
  const featuredImageUrl =
    news._embedded && news._embedded['wp:featuredmedia'] && news._embedded['wp:featuredmedia'][0]
      ? news._embedded['wp:featuredmedia'][0].source_url
      : 'https://benhvienhoabinh.vn/wp-content/uploads/2024/06/default-news.jpg'; // fallback image

  // Extract category
  const category =
    news._embedded && news._embedded['wp:term'] && news._embedded['wp:term'][0] && news._embedded['wp:term'][0][0]
      ? news._embedded['wp:term'][0][0].name
      : 'Tin tức';

  // Format date
  const formattedDate = new Date(news.date).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  // Extract and clean excerpt
  const excerpt = news.excerpt?.rendered
    ? news.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, '') // Remove HTML tags
    : '';

  return (
    <TransitionLink to={`/news/${news.id}`} className="block group">
      <div
        className={combineClasses(
          'bg-white',
          BORDER_RADIUS.cardLarge,
          'overflow-hidden',
          'shadow-sm',
          'border border-gray-100',
          'hover:shadow-md',
          'hover:border-gray-200',
          'hover:-translate-y-1 hover:scale-[1.01]',
          'active:scale-[0.99]',
          'transition-all duration-300 ease-out',
          CARD_DIMENSIONS.vertical.minHeight,
          'medical-news-card'
        )}
      >
        <div
          className={combineClasses(
            'relative',
            IMAGE_DIMENSIONS.large,
            'overflow-hidden',
            'group-hover:scale-105 transition-transform duration-300'
          )}
        >
          <img
            src={featuredImageUrl}
            alt={news.title.rendered}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />

          {/* Medical overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Enhanced category badge */}
          <div
            className={combineClasses(
              'absolute top-3 left-3',
              'bg-gradient-to-r from-blue-600 to-blue-700 text-white',
              'backdrop-blur-sm',
              TYPOGRAPHY.bodySmall,
              'font-semibold py-2 px-3',
              'rounded-full',
              'shadow-lg shadow-blue-500/30',
              'flex items-center gap-1.5'
            )}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
            {category}
          </div>

          {/* Medical health indicator */}
          <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-white"
            >
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
          </div>
        </div>
        <div className={combineClasses(SPACING.padding.content, 'space-y-3')}>
          <h3
            className={combineClasses(
              TYPOGRAPHY.cardTitleSmall,
              'text-gray-800 group-hover:text-blue-700',
              'transition-colors duration-200',
              'line-clamp-2 leading-snug font-bold'
            )}
            dangerouslySetInnerHTML={{ __html: news.title.rendered }}
          />

          <p className={combineClasses(TYPOGRAPHY.bodySmall, 'text-gray-600 line-clamp-2 leading-relaxed')}>
            {excerpt}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-gray-400"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12,6 12,12 16,14" />
              </svg>
              <span className={combineClasses(TYPOGRAPHY.bodySmall, 'text-gray-500 font-medium')}>{formattedDate}</span>
            </div>

            <div
              className={combineClasses(
                'flex items-center gap-1.5 px-3 py-1.5',
                'bg-blue-50 text-blue-700 rounded-full',
                'group-hover:bg-blue-100 group-hover:text-blue-800',
                'transition-all duration-200',
                'min-h-[32px]' // Touch target consideration
              )}
            >
              <span className={combineClasses(TYPOGRAPHY.bodySmall, 'font-semibold')}>Đọc tiếp</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              >
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </TransitionLink>
  );
};

const HealthNews = () => {
  const [newsItems, setNewsItems] = useState<WPPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        const posts = await getPosts({ per_page: 3 });
        setNewsItems(posts);
      } catch (error) {
        console.error('Error fetching news posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="relative">
      <Section
        className="mt-4"
        title="Tin tức sức khỏe"
        viewMore="/news"
        accentColor="blue"
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="medical-icon-pulse"
            aria-label="Tin tức sức khỏe và y tế"
            role="img"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        }
      >
        <div className={combineClasses(SPACING.component.md, 'medical-news-container')}>
          {isLoading
            ? // Enhanced loading skeleton with medical styling
              Array(3)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className={combineClasses(
                      'bg-white',
                      BORDER_RADIUS.cardLarge,
                      'overflow-hidden',
                      'shadow-lg shadow-blue-500/10',
                      'border-2 border-blue-100/50',
                      CARD_DIMENSIONS.vertical.minHeight,
                      'medical-news-loading'
                    )}
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div
                      className={combineClasses(
                        IMAGE_DIMENSIONS.large,
                        'bg-gradient-to-br from-blue-100 to-blue-200',
                        'medical-shimmer relative'
                      )}
                    >
                      {/* Medical loading indicator */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-blue-400 animate-spin"
                        >
                          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                        </svg>
                      </div>
                    </div>
                    <div className={combineClasses(SPACING.padding.content, 'space-y-3')}>
                      <div className="h-5 bg-gradient-to-r from-blue-200 to-blue-300 rounded-lg medical-shimmer"></div>
                      <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded medical-shimmer"></div>
                      <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4 medical-shimmer"></div>
                      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                        <div className="h-3 w-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded medical-shimmer"></div>
                        <div className="h-3 w-16 bg-gradient-to-r from-blue-200 to-blue-300 rounded medical-shimmer"></div>
                      </div>
                    </div>
                  </div>
                ))
            : newsItems.map((news, index) => (
                <div key={news.id} className="medical-news-item" style={{ animationDelay: `${index * 100}ms` }}>
                  <NewsCard news={news} />
                </div>
              ))}
        </div>

        {/* Enhanced Medical News Styling */}
        <style>{`
        /* Medical news container animation */
        .medical-news-container {
          opacity: 0;
          animation: medicalNewsContainerFadeIn 0.6s ease-out 0.3s forwards;
        }

        @keyframes medicalNewsContainerFadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Medical news item staggered animation */
        .medical-news-item {
          opacity: 0;
          transform: translateY(15px);
          animation: medicalNewsItemSlideIn 0.4s ease-out forwards;
        }

        @keyframes medicalNewsItemSlideIn {
          from {
            opacity: 0;
            transform: translateY(15px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Medical news loading animation */
        .medical-news-loading {
          opacity: 0;
          transform: translateY(10px);
          animation: medicalNewsLoadingPulse 0.5s ease-out forwards;
        }

        @keyframes medicalNewsLoadingPulse {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Medical shimmer animation for loading states */
        @keyframes medicalNewsShimmer {
          0% { background-position: -200px 0; }
          100% { background-position: calc(200px + 100%) 0; }
        }

        .medical-shimmer {
          background: linear-gradient(90deg, transparent, rgba(20, 184, 166, 0.1), transparent);
          background-size: 200px 100%;
          animation: medicalNewsShimmer 1.5s infinite;
        }

        /* Medical news card hover effects */
        .medical-news-card {
          position: relative;
          overflow: hidden;
        }

        .medical-news-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(20, 184, 166, 0.05), transparent);
          transition: left 0.6s ease-out;
          z-index: 1;
        }

        .medical-news-card:hover::before {
          left: 100%;
        }

        /* Medical news icon animation */
        .medical-news-icon {
          animation: medicalNewsIconPulse 2s ease-in-out infinite;
        }

        @keyframes medicalNewsIconPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }

        /* Medical news view more button animation */
        .medical-news-view-more {
          position: relative;
          overflow: hidden;
        }

        .medical-news-view-more::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(20, 184, 166, 0.1), transparent);
          transition: left 0.5s ease-out;
        }

        .medical-news-view-more:hover::before {
          left: 100%;
        }

        /* Line clamp utility */
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .medical-news-item {
            margin-bottom: 1rem;
          }

          .medical-news-card {
            min-height: 200px;
          }
        }

        /* Accessibility enhancements */
        @media (prefers-reduced-motion: reduce) {
          .medical-news-container,
          .medical-news-item,
          .medical-news-loading,
          .medical-news-icon {
            animation: none;
            opacity: 1;
            transform: none;
          }
        }

        /* Focus states for accessibility */
        .medical-news-card:focus-within {
          outline: 2px solid ${getColorToken('accent')};
          outline-offset: 2px;
        }
        `}</style>
      </Section>
    </div>
  );
};

export default HealthNews;
