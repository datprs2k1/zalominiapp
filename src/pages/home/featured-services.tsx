import Section from '@/components/section';
import { useEffect, useRef, useState } from 'react';
import TransitionLink from '@/components/transition-link';
import { getServices } from '@/services/services';
import { WPPage } from '@/services/wp-types';
import {
  CARD_DIMENSIONS,
  IMAGE_DIMENSIONS,
  SPACING,
  BORDER_RADIUS,
  TYPOGRAPHY,
  ANIMATIONS,
  TOUCH_TARGETS,
  SHADOWS,
  combineClasses,
} from '@/styles/medical-design-system';
import { motion } from 'framer-motion';

const FeaturedServices = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [services, setServices] = useState<WPPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch services on component mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        const result = await getServices({ per_page: 8 });
        setServices(result || []);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Check scroll position to show/hide navigation arrows
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 20);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
    return;
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  // Extract price information from content if available
  const extractPriceInfo = (content: string) => {
    // This is a simple regex extraction - you might need to adjust based on actual content structure
    const priceMatch = content.match(/(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{1,2})?)[\s]*₫/);
    const oldPriceMatch = content.match(/giá gốc:[\s]*(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{1,2})?)[\s]*₫/i);
    const discountMatch = content.match(/giảm:[\s]*(-?\d{1,2}%)/i);

    return {
      price: priceMatch ? priceMatch[0] : '',
      oldPrice: oldPriceMatch ? `${oldPriceMatch[1]}₫` : '',
      discount: discountMatch ? discountMatch[1] : '',
    };
  };

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Section
        title="Dịch vụ nổi bật"
        viewMore="/services"
        accentColor="blue"
        className="mt-4"
        icon={
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-label="Dịch vụ y tế chuyên nghiệp"
            role="img"
            className="medical-icon-pulse"
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 2, -2, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3" />
          </motion.svg>
        }
      >
        {/* Enhanced Horizontal scroll container - Clean design without arrows */}
        <div className={combineClasses('relative', SPACING.padding.section, 'medical-services-container')}>
          {/* Clean scroll container without navigation arrows */}

          <motion.div
            ref={scrollRef}
            className={combineClasses(
              'flex overflow-x-auto snap-x snap-mandatory scrollbar-hide',
              'px-4 py-3', // Enhanced padding
              'gap-5', // Increased gap for better spacing
              'medical-scroll-container'
            )}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              scrollBehavior: 'smooth',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {isLoading
              ? // Enhanced loading placeholders with medical styling and staggered animations
                Array(4)
                  .fill(0)
                  .map((_, index) => (
                    <motion.div
                      key={`loading-${index}`}
                      className={combineClasses(
                        'snap-start flex-none',
                        CARD_DIMENSIONS.horizontal.width,
                        CARD_DIMENSIONS.horizontal.height,
                        BORDER_RADIUS.cardLarge,
                        'bg-white overflow-hidden',
                        'border border-blue-100/50',
                        'shadow-lg shadow-blue-500/5',
                        'medical-loading-card'
                      )}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.1,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }}
                    >
                      <div
                        className={combineClasses(
                          IMAGE_DIMENSIONS.small,
                          'bg-white' /* Changed from gradient to white */,
                          'medical-shimmer relative overflow-hidden'
                        )}
                      >
                        {/* Medical cross loading indicator */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.div
                            className="w-8 h-8 text-blue-300"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                          >
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                            </svg>
                          </motion.div>
                        </div>
                      </div>
                      <div className={combineClasses(SPACING.padding.content, 'space-y-3')}>
                        <div className="h-5 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg w-3/4 medical-shimmer"></div>
                        <div className="h-4 bg-white rounded w-full medical-shimmer"></div>
                        <div className="h-4 bg-white rounded w-2/3 medical-shimmer"></div>
                        <div className="flex justify-between items-center mt-3">
                          <div className="h-4 bg-gradient-to-r from-blue-100 to-blue-200 rounded w-16 medical-shimmer"></div>
                          <div className="h-8 bg-gradient-to-r from-blue-200 to-blue-300 rounded-full w-20 medical-shimmer"></div>
                        </div>
                      </div>
                    </motion.div>
                  ))
              : services.map((service: WPPage, index) => {
                  const title = service.title.rendered;
                  const featuredMedia = service._embedded?.['wp:featuredmedia']?.[0]?.source_url;
                  const excerpt = service.excerpt?.rendered;
                  const { price, oldPrice, discount } = extractPriceInfo(service.content.rendered);

                  return (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 30, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.1,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }}
                      whileHover={{
                        y: -8,
                        scale: 1.02,
                        transition: { duration: 0.2, ease: 'easeOut' },
                      }}
                      className="snap-start flex-none"
                    >
                      <TransitionLink
                        to={`/service/${service.id}`}
                        className={combineClasses(
                          'block group',
                          CARD_DIMENSIONS.horizontal.width,
                          BORDER_RADIUS.cardLarge,
                          'bg-white overflow-hidden',
                          'border border-blue-100/50',
                          'hover:border-blue-200/70',
                          'transition-all duration-300 ease-out',
                          'medical-service-card relative'
                        )}
                      >
                        <div
                          className={combineClasses(
                            'relative',
                            IMAGE_DIMENSIONS.small,
                            'overflow-hidden',
                            'group-hover:scale-102 transition-transform duration-200'
                          )}
                        >
                          <img
                            src={featuredMedia || 'https://placehold.co/600x400?text=No+Image'}
                            alt={title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            loading="lazy"
                          />

                          {/* Medical overlay gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                          {/* Medical service indicator */}
                          <div className="absolute top-2 left-2 bg-blue-600/90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className="mr-1"
                            >
                              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                            </svg>
                            Y tế
                          </div>

                          {discount && (
                            <div
                              className={combineClasses(
                                'absolute top-2 right-2',
                                'bg-gradient-to-r from-red-500 to-red-600 text-white',
                                TYPOGRAPHY.bodySmall,
                                'font-bold px-2.5 py-1.5',
                                BORDER_RADIUS.pill,
                                'shadow-lg shadow-red-500/30',
                                'animate-pulse'
                              )}
                            >
                              {discount}
                            </div>
                          )}
                        </div>
                        <div className={combineClasses(SPACING.padding.content, 'space-y-3')}>
                          <h3
                            className={combineClasses(
                              TYPOGRAPHY.cardTitleSmall,
                              'text-gray-800 group-hover:text-blue-700',
                              'transition-colors duration-200',
                              'line-clamp-2 leading-snug'
                            )}
                            dangerouslySetInnerHTML={{ __html: title }}
                          ></h3>

                          <p
                            className={combineClasses(
                              TYPOGRAPHY.bodySmall,
                              'text-gray-600 line-clamp-2 leading-relaxed'
                            )}
                            dangerouslySetInnerHTML={{ __html: excerpt }}
                          ></p>

                          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            <div className="flex flex-col">
                              <span className="font-bold text-blue-600 text-sm">{price || 'Liên hệ'}</span>
                              {oldPrice && (
                                <span className={combineClasses('text-xs text-gray-400 line-through')}>{oldPrice}</span>
                              )}
                            </div>

                            <button
                              className={combineClasses(
                                'min-h-[44px] px-4 py-2', // 44px touch target
                                'font-medium text-white',
                                'bg-gradient-to-r from-blue-500 to-blue-600',
                                'hover:from-blue-600 hover:to-blue-700',
                                'active:scale-95',
                                BORDER_RADIUS.pill,
                                'transition-all duration-200',
                                'flex items-center gap-1.5',
                                'text-xs'
                              )}
                            >
                              <span>Chi tiết</span>
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M5 12h14M12 5l7 7-7 7" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </TransitionLink>
                    </motion.div>
                  );
                })}
          </motion.div>

          {/* Removing both left and right arrow buttons */}
        </div>

        {/* Enhanced Medical Styling */}
        <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        /* Enhanced Medical shimmer animation for loading states */
        @keyframes medicalShimmer {
          0% {
            background-position: -200px 0;
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
          100% {
            background-position: calc(200px + 100%) 0;
            opacity: 0.6;
          }
        }

        .medical-shimmer {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(0, 102, 204, 0.08),
            rgba(0, 102, 204, 0.15),
            rgba(0, 102, 204, 0.08),
            transparent
          );
          background-size: 200px 100%;
          animation: medicalShimmer 2s ease-in-out infinite;
        }

        /* Enhanced Medical loading card animation */
        @keyframes medicalLoadingPulse {
          0%, 100% {
            opacity: 0.9;
            transform: scale(1) translateY(0px);
          }
          50% {
            opacity: 1;
            transform: scale(1.005) translateY(-1px);
          }
        }

        .medical-loading-card {
          animation: medicalLoadingPulse 3s ease-in-out infinite;
          border: 1px solid rgba(0, 102, 204, 0.1);
        }

        /* Enhanced Medical service card hover effects */
        .medical-service-card {
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .medical-service-card:hover {
          border-color: rgba(0, 102, 204, 0.2);
        }

        .medical-service-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(0, 102, 204, 0.03),
            rgba(0, 102, 204, 0.08),
            rgba(0, 102, 204, 0.03),
            transparent
          );
          transition: left 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          z-index: 1;
        }

        .medical-service-card:hover::before {
          left: 100%;
        }

        .medical-service-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at center,
            rgba(0, 102, 204, 0.02) 0%,
            transparent 70%
          );
          opacity: 0;
          transition: opacity 0.3s ease-out;
          z-index: 1;
        }

        .medical-service-card:hover::after {
          opacity: 1;
        }

        /* Enhanced Medical navigation button effects */
        .medical-nav-button {
          position: relative;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(0, 102, 204, 0.1);
        }

        .medical-nav-button::after {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 50%;
          background: linear-gradient(
            45deg,
            rgba(0, 102, 204, 0.1),
            rgba(0, 102, 204, 0.05),
            rgba(0, 102, 204, 0.1)
          );
          transform: scale(0);
          transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          z-index: -1;
        }

        .medical-nav-button:hover::after {
          transform: scale(1.1);
          animation: medicalNavPulse 2s ease-in-out infinite;
        }

        @keyframes medicalNavPulse {
          0%, 100% {
            transform: scale(1.1);
            opacity: 0.4;
          }
          50% {
            transform: scale(1.3);
            opacity: 0.1;
          }
        }

        /* Medical navigation button glow effect */
        .medical-nav-button:focus-visible {
          outline: 2px solid rgba(0, 102, 204, 0.5);
          outline-offset: 2px;
        }

        /* Disabled state for navigation buttons */
        .medical-nav-button:disabled {
          cursor: not-allowed;
          opacity: 0.4;
          transform: none !important;
        }

        .medical-nav-button:disabled:hover {
          background: rgba(255, 255, 255, 0.95) !important;
          border-color: rgba(0, 102, 204, 0.1) !important;
          box-shadow: 0 4px 12px rgba(0, 102, 204, 0.05) !important;
        }

        .medical-nav-button:disabled::after {
          display: none;
        }

        /* Enhanced Medical icon pulse animation */
        .medical-icon-pulse {
          animation: medicalIconPulse 3s ease-in-out infinite;
        }

        @keyframes medicalIconPulse {
          0%, 100% {
            transform: scale(1) rotate(0deg);
            filter: drop-shadow(0 0 0 rgba(0, 102, 204, 0));
          }
          50% {
            transform: scale(1.08) rotate(2deg);
            filter: drop-shadow(0 2px 4px rgba(0, 102, 204, 0.2));
          }
        }

        /* Enhanced scroll container with smooth scrolling */
        .medical-scroll-container {
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .medical-scroll-container::-webkit-scrollbar {
          display: none;
        }

        /* Enhanced Line clamp utility */
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Enhanced Responsive adjustments */
        @media (max-width: 768px) {
          .medical-service-card {
            min-width: 280px;
            max-width: 300px;
          }

          .medical-nav-button {
            height: 44px;
            width: 44px;
          }

          .medical-services-container {
            padding-left: 12px;
            padding-right: 12px;
          }
        }

        @media (max-width: 480px) {
          .medical-service-card {
            min-width: 260px;
            max-width: 280px;
          }

          .medical-nav-button {
            height: 40px;
            width: 40px;
          }
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .medical-service-card {
            border-width: 2px;
            border-color: #0066CC;
          }

          .medical-nav-button {
            border-width: 2px;
            border-color: #0066CC;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .medical-shimmer,
          .medical-loading-card,
          .medical-icon-pulse,
          .medical-nav-button::after {
            animation: none;
          }

          .medical-service-card {
            transition: none;
          }
        }

        /* Dark mode support (if needed) */
        @media (prefers-color-scheme: dark) {
          .medical-service-card {
            background: rgba(255, 255, 255, 0.95);
            border-color: rgba(0, 102, 204, 0.3);
          }

          .medical-nav-button {
            background: rgba(255, 255, 255, 0.95);
            border-color: rgba(0, 102, 204, 0.3);
          }
        }
      `}</style>
      </Section>
    </motion.div>
  );
};

export default FeaturedServices;
