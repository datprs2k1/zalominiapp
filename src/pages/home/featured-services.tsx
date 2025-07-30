import Section from '@/components/section';
import { useEffect, useRef, useState } from 'react';
import TransitionLink from '@/components/transition-link';
import { getServices } from '@/services/services';
import { WPPage } from '@/services/wp-types';
import { BORDER_RADIUS, MEDICAL_COLORS, ACCESSIBILITY, combineClasses } from '@/styles/medical-design-system';
import { motion } from 'framer-motion';

const FeaturedServices = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
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

  return (
    <motion.div
      className={combineClasses(
        'relative',
        'bg-gradient-to-br from-[#FAFBFC] via-white to-[#FAFBFC]', // Enhanced medical white gradient
        'border border-[#2563EB]/15', // Softer medical blue border
        BORDER_RADIUS.cardLarge,
        'overflow-hidden',
        'shadow-lg shadow-[#2563EB]/8' // Subtle medical blue shadow
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Enhanced Medical Background Pattern with Trust Colors */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0 bg-repeat"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232563EB' fill-opacity='0.08'%3E%3Cpath d='M40 40h-8v8h-3v-8h-8v-3h8v-8h3v8h8v3z'/%3E%3C/g%3E%3Cg fill='%2310B981' fill-opacity='0.04'%3E%3Ccircle cx='40' cy='40' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
        {/* Additional healing accent pattern */}
        <div
          className="absolute inset-0 bg-repeat opacity-50"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230891B2' fill-opacity='0.02'%3E%3Ccircle cx='60' cy='60' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <Section
        title="Dịch vụ y tế"
        viewMore="/services"
        accentColor="blue"
        className="relative z-10"
        spacing="compact"
        icon={
          <motion.div
            className="relative flex items-center justify-center"
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
            {/* Primary medical cross icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-label={ACCESSIBILITY.medicalAria.service}
              role="img"
              className="relative z-10"
            >
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill={MEDICAL_COLORS.primary.blue} />
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke={MEDICAL_COLORS.primary.blue}
                strokeWidth="1.5"
                fill="none"
                opacity="0.15"
              />
            </svg>
            {/* Healing accent ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-[#10B981]/20"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.5,
              }}
            />
            {/* Trust cyan pulse */}
            <motion.div
              className="absolute inset-0 rounded-full border border-[#0891B2]/15"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1,
              }}
            />
          </motion.div>
        }
      >
        {/* Optimized Compact Horizontal scroll container with enhanced density */}
        <div
          className={combineClasses(
            'relative',
            'px-2 md:px-3 lg:px-4', // Responsive compact padding
            'py-1', // Reduced vertical padding for density
            'medical-services-container'
          )}
        >
          <motion.div
            ref={scrollRef}
            className={combineClasses(
              'flex overflow-x-auto snap-x snap-mandatory scrollbar-hide',
              'px-1 py-1', // Minimal padding for maximum density
              'gap-2 md:gap-3', // Responsive gap - tighter on mobile
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
                        // Simplified loading card dimensions
                        'w-[240px] sm:w-[260px] md:w-[280px] lg:w-[300px]',
                        'h-[180px] sm:h-[190px] md:h-[200px]',
                        BORDER_RADIUS.cardLarge,
                        'bg-gradient-to-br from-[#FAFBFC] to-white overflow-hidden',
                        'border border-[#2563EB]/20',
                        'shadow-lg shadow-[#2563EB]/10',
                        'medical-loading-card',
                        'backdrop-blur-sm'
                      )}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        // Subtle breathing animation for loading state
                        boxShadow: [
                          '0 4px 6px rgba(37, 99, 235, 0.1)',
                          '0 8px 15px rgba(37, 99, 235, 0.15)',
                          '0 4px 6px rgba(37, 99, 235, 0.1)',
                        ],
                      }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.1,
                        ease: [0.25, 0.46, 0.45, 0.94],
                        boxShadow: {
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        },
                      }}
                    >
                      {/* Loading Background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/20 via-[#FAFBFC] to-[#10B981]/20 medical-shimmer" />

                      {/* Loading Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />

                      {/* Loading Medical Icon */}
                      <div className="absolute top-4 right-4">
                        <div className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-[#2563EB]/20">
                          <motion.div
                            className="w-4 h-4 text-blue-400/80"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                          >
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                            </svg>
                          </motion.div>
                        </div>
                      </div>

                      {/* Loading Content */}
                      <div className="relative z-10 flex flex-col justify-between h-full p-6">
                        {/* Loading Service Name - Prominent Style */}
                        <div className="flex-1 flex items-center justify-center px-2">
                          <div className="text-center relative">
                            {/* Loading background highlight */}
                            <div className="absolute inset-x-4 top-1/2 transform -translate-y-1/2 bg-black/40 backdrop-blur-sm rounded-lg border border-white/20 h-16" />

                            <div className="relative z-10 space-y-3 py-4">
                              <div className="h-8 bg-white/40 rounded-lg w-40 medical-shimmer mx-auto"></div>
                              <div className="h-6 bg-white/30 rounded-lg w-32 medical-shimmer mx-auto"></div>
                            </div>
                          </div>
                        </div>

                        {/* Loading Button */}
                        <div className="flex justify-center mt-4">
                          <div className="h-11 bg-white/90 rounded-full w-24 medical-shimmer"></div>
                        </div>
                      </div>
                    </motion.div>
                  ))
              : services.map((service: WPPage, index) => {
                  const title = service.title.rendered;
                  const featuredMedia = service._embedded?.['wp:featuredmedia']?.[0]?.source_url;

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
                        scale: 1.03,
                        boxShadow: '0 25px 50px rgba(37, 99, 235, 0.2)',
                        transition: {
                          duration: 0.3,
                          ease: 'easeOut',
                        },
                      }}
                      whileTap={{
                        scale: 0.98,
                        transition: { duration: 0.1 },
                      }}
                      className="snap-start flex-none"
                    >
                      <TransitionLink
                        to={`/service/${service.id}`}
                        className={combineClasses(
                          'group relative overflow-hidden block cursor-pointer',
                          // Card dimensions
                          'w-[240px] sm:w-[260px] md:w-[280px] lg:w-[300px]',
                          'h-[180px] sm:h-[190px] md:h-[200px]',
                          BORDER_RADIUS.cardLarge,
                          'border border-[#2563EB]/20',
                          'hover:border-[#2563EB]/40',
                          'hover:shadow-xl hover:shadow-[#2563EB]/15',
                          'transition-all duration-300 ease-out',
                          'medical-service-card',
                          'focus:ring-2 focus:ring-[#2563EB]/40 focus:ring-offset-2',
                          'focus:border-[#2563EB]/60',
                          'focus:outline-none'
                        )}
                        role="article"
                        aria-label={`Xem chi tiết dịch vụ: ${title.replace(/<[^>]*>/g, '')}`}
                      >
                        {/* Background Image */}
                        <div
                          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                          style={{
                            backgroundImage: `url(${featuredMedia || 'https://placehold.co/600x400/2563EB/FFFFFF?text=Y+Tế'})`,
                          }}
                        />

                        {/* Overlay for better text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent group-hover:from-black/80 group-hover:via-black/40 transition-all duration-300" />
                        {/* Medical Icon Overlay */}
                        <div className="absolute top-4 right-4">
                          <div className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-[#2563EB]/20">
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#2563EB"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="#2563EB" />
                            </svg>
                          </div>
                        </div>
                        {/* Simplified Content Area - Only Service Name and Details Button */}
                        <div className="relative z-10 flex flex-col justify-between h-full p-6">
                          {/* Service Name - Optimized and Prominent */}
                          <div className="flex-1 flex items-center justify-center px-2">
                            <div className="text-center">
                              {/* Background highlight for better prominence */}
                              <div className="absolute inset-x-4 top-1/2 transform -translate-y-1/2 bg-black/40 backdrop-blur-sm rounded-lg border border-white/20 group-hover:bg-black/50 transition-all duration-300" />

                              <h3
                                className={combineClasses(
                                  'relative z-10 text-center font-black leading-tight tracking-wider',
                                  // Enhanced typography for maximum prominence
                                  'text-xl sm:text-2xl md:text-3xl lg:text-4xl',
                                  // Uppercase transformation
                                  'uppercase',
                                  // Enhanced white text with stronger shadows
                                  'text-white drop-shadow-2xl',
                                  'group-hover:text-[#FAFBFC] group-hover:drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]',
                                  // Enhanced transitions and effects
                                  'transition-all duration-300 ease-out',
                                  'group-hover:scale-110 group-hover:tracking-widest',
                                  // Text stroke effect for better visibility
                                  'text-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]',
                                  // Medical professional styling
                                  'medical-service-title',
                                  'line-clamp-2',
                                  // Enhanced spacing
                                  'py-4 px-2'
                                )}
                                dangerouslySetInnerHTML={{ __html: title.toUpperCase() }}
                                role="heading"
                                aria-level={3}
                                aria-label={`Dịch vụ y tế: ${title.replace(/<[^>]*>/g, '').toUpperCase()}`}
                              />
                            </div>
                          </div>

                          {/* Details Button */}
                          <div className="flex justify-center mt-4">
                            <div
                              className={combineClasses(
                                'inline-flex items-center gap-2',
                                'min-h-[44px] px-6 py-3',
                                'font-semibold text-[#2563EB]',
                                'bg-white/95 backdrop-blur-sm',
                                'hover:bg-white hover:shadow-lg hover:shadow-white/30',
                                'group-hover:scale-105',
                                'border border-white/20',
                                BORDER_RADIUS.pill,
                                'transition-all duration-300',
                                'text-sm tracking-wide'
                              )}
                            >
                              <span>Chi tiết</span>
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                aria-hidden="true"
                              >
                                <path d="M5 12h14M12 5l7 7-7 7" />
                              </svg>
                            </div>
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

        /* Enhanced Medical Service Title Styling - Optimized for Maximum Prominence */
        .medical-service-title {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
          font-feature-settings: 'kern' 1, 'liga' 1, 'calt' 1, 'case' 1;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          position: relative;
          z-index: 2;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          /* Enhanced text shadow for maximum visibility */
          text-shadow:
            2px 2px 4px rgba(0, 0, 0, 0.8),
            0 0 8px rgba(0, 0, 0, 0.6),
            0 0 16px rgba(0, 0, 0, 0.4);
          /* Text stroke for better definition */
          -webkit-text-stroke: 1px rgba(0, 0, 0, 0.3);
          /* Letter spacing for uppercase readability */
          letter-spacing: 0.1em;
        }

        /* Enhanced underline effect for service names */
        .medical-service-title::after {
          content: '';
          position: absolute;
          bottom: -3px;
          left: 0;
          width: 0;
          height: 3px;
          background: linear-gradient(90deg, #2563EB, #10B981);
          border-radius: 2px;
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
        }

        /* Enhanced hover state for prominent service names */
        .group:hover .medical-service-title {
          text-shadow:
            3px 3px 6px rgba(0, 0, 0, 0.9),
            0 0 12px rgba(0, 0, 0, 0.7),
            0 0 24px rgba(0, 0, 0, 0.5),
            0 0 2px rgba(255, 255, 255, 0.3);
          transform: translateY(-2px) scale(1.05);
          letter-spacing: 0.15em;
          -webkit-text-stroke: 1.5px rgba(0, 0, 0, 0.4);
        }

        .group:hover .medical-service-title::after {
          width: 100%;
          box-shadow: 0 4px 8px rgba(37, 99, 235, 0.4);
          height: 4px;
        }

        /* Focus state for service names */
        .group:focus-within .medical-service-title {
          text-shadow: 0 1px 3px rgba(30, 64, 175, 0.15);
          transform: translateY(-1px);
        }

        .group:focus-within .medical-service-title::after {
          width: 100%;
          background: linear-gradient(90deg, #1E40AF, #059669);
          box-shadow: 0 3px 8px rgba(30, 64, 175, 0.4);
        }

        /* Active state for service names */
        .group:active .medical-service-title {
          transform: translateY(0);
          transition: transform 0.1s ease-out;
        }

        /* Enhanced glow effect on hover */
        .medical-service-title::before {
          content: '';
          position: absolute;
          inset: -4px;
          background: radial-gradient(
            circle at center,
            rgba(37, 99, 235, 0.08) 0%,
            transparent 70%
          );
          border-radius: 8px;
          opacity: 0;
          transition: opacity 0.3s ease-out;
          z-index: -1;
        }

        .group:hover .medical-service-title::before {
          opacity: 1;
        }

        .group:focus-within .medical-service-title::before {
          opacity: 1;
          background: radial-gradient(
            circle at center,
            rgba(30, 64, 175, 0.12) 0%,
            transparent 70%
          );
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

        /* Enhanced Medical service card hover effects with service name focus */
        .medical-service-card {
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          cursor: pointer;
        }

        .medical-service-card:hover {
          border-color: rgba(37, 99, 235, 0.3);
          box-shadow: 0 8px 25px rgba(37, 99, 235, 0.15);
        }

        /* Subtle shimmer effect that doesn't compete with service name */
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
            rgba(37, 99, 235, 0.02),
            rgba(37, 99, 235, 0.05),
            rgba(37, 99, 235, 0.02),
            transparent
          );
          transition: left 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          z-index: 1;
        }

        .medical-service-card:hover::before {
          left: 100%;
        }

        /* Enhanced background glow on hover */
        .medical-service-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at center,
            rgba(37, 99, 235, 0.03) 0%,
            transparent 70%
          );
          opacity: 0;
          transition: opacity 0.3s ease-out;
          z-index: 1;
        }

        .medical-service-card:hover::after {
          opacity: 1;
        }

        /* Focus state for entire card */
        .medical-service-card:focus-within {
          border-color: rgba(37, 99, 235, 0.4);
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1), 0 8px 25px rgba(37, 99, 235, 0.2);
          outline: none;
        }

        .medical-service-card:focus-within::after {
          opacity: 1;
          background: radial-gradient(
            circle at center,
            rgba(30, 64, 175, 0.05) 0%,
            transparent 70%
          );
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

        /* Optimized Compact Responsive Design with Service Name Prominence */

        /* Extra small devices (phones, 320px and up) - Enhanced mobile experience */
        @media (max-width: 480px) {
          .medical-service-card {
            min-width: 240px;
            max-width: 240px;
            height: 180px; /* Updated height for new design */
          }

          .medical-service-title {
            font-size: 1rem !important; /* 16px - Prominent on mobile */
            line-height: 1.2;
            font-weight: 900;
            letter-spacing: 0.08em;
            margin-bottom: 4px;
            text-shadow:
              2px 2px 4px rgba(0, 0, 0, 0.9),
              0 0 6px rgba(0, 0, 0, 0.7);
          }

          .medical-services-container {
            padding-left: 6px;
            padding-right: 6px;
          }

          /* Enhanced touch targets for mobile */
          button {
            min-height: 44px !important;
            min-width: 44px !important;
            padding: 8px 12px !important;
          }

          /* Adjust quality indicator for mobile */
          .medical-service-title + div svg {
            width: 10px;
            height: 10px;
          }

          .medical-service-title + div span {
            font-size: 8px;
          }

          /* Mobile-specific trust indicators */
          .trust-indicators {
            flex-direction: column;
            space-y: 1;
          }

          .trust-indicators > div {
            font-size: 9px;
          }
        }

        /* Small devices (landscape phones, 481px and up) - Enhanced tablet experience */
        @media (min-width: 481px) and (max-width: 768px) {
          .medical-service-card {
            min-width: 260px;
            max-width: 260px;
            height: 190px; /* Updated height for new design */
          }

          .medical-service-title {
            font-size: 1.25rem !important; /* 20px - More prominent on tablet */
            line-height: 1.2;
            font-weight: 900;
            letter-spacing: 0.1em;
            margin-bottom: 6px;
            text-shadow:
              2px 2px 4px rgba(0, 0, 0, 0.8),
              0 0 8px rgba(0, 0, 0, 0.6);
          }

          .medical-services-container {
            padding-left: 8px;
            padding-right: 8px;
          }

          /* Tablet-optimized touch targets */
          button {
            min-height: 44px !important;
            padding: 6px 10px !important;
          }
        }

        /* Medium devices (tablets, 769px and up) - Using unified width system */
        @media (min-width: 769px) and (max-width: 1024px) {
          .medical-service-card {
            min-width: 280px;
            max-width: 280px;
            height: 200px; /* Updated height for new design */
          }

          .medical-service-title {
            font-size: 1.5rem !important; /* 24px - Very prominent on tablets */
            line-height: 1.2;
            font-weight: 900;
            letter-spacing: 0.12em;
            margin-bottom: 10px;
            text-shadow:
              3px 3px 6px rgba(0, 0, 0, 0.8),
              0 0 10px rgba(0, 0, 0, 0.6),
              0 0 20px rgba(0, 0, 0, 0.4);
          }

          .medical-services-container {
            padding-left: 12px;
            padding-right: 12px;
          }
        }

        /* Large devices (desktops, 1025px and up) - Using unified width system */
        @media (min-width: 1025px) and (max-width: 1440px) {
          .medical-service-card {
            width: 300px;
            height: 200px; /* Updated height for new design */
          }

          .medical-service-title {
            font-size: 1.75rem !important; /* 28px - Maximum prominence on desktop */
            line-height: 1.1;
            font-weight: 900;
            letter-spacing: 0.15em;
            margin-bottom: 12px;
            text-shadow:
              3px 3px 6px rgba(0, 0, 0, 0.9),
              0 0 12px rgba(0, 0, 0, 0.7),
              0 0 24px rgba(0, 0, 0, 0.5);
          }

          .medical-services-container {
            padding-left: 16px;
            padding-right: 16px;
          }
        }

        /* Extra large devices (large desktops, 1441px and up) - Using unified width system */
        @media (min-width: 1441px) {
          .medical-service-card {
            width: 300px;
            height: 200px; /* Updated height for new design */
          }

          .medical-service-title {
            font-size: 2rem !important; /* 32px - Ultimate prominence on large screens */
            line-height: 1.1;
            font-weight: 900;
            letter-spacing: 0.18em;
            margin-bottom: 14px;
            text-shadow:
              4px 4px 8px rgba(0, 0, 0, 0.9),
              0 0 16px rgba(0, 0, 0, 0.7),
              0 0 32px rgba(0, 0, 0, 0.5),
              0 0 4px rgba(255, 255, 255, 0.2);
          }

          .medical-services-container {
            padding-left: 18px;
            padding-right: 18px;
          }
        }

        /* Responsive adjustments for service name underline effect */
        @media (max-width: 480px) {
          .medical-service-title::after {
            height: 2px;
            bottom: -2px;
          }
        }

        @media (min-width: 1025px) {
          .medical-service-title::after {
            height: 4px;
            bottom: -4px;
          }
        }

        /* Responsive focus indicators */
        @media (max-width: 768px) {
          .medical-service-title:focus {
            outline-width: 2px;
            outline-offset: 1px;
          }
        }

        @media (min-width: 1025px) {
          .medical-service-title:focus {
            outline-width: 3px;
            outline-offset: 3px;
          }
        }

        /* Enhanced High contrast mode support for service name prominence */
        @media (prefers-contrast: high) {
          .medical-service-card {
            border-width: 3px;
            border-color: #2563EB;
            background-color: #FFFFFF;
          }

          .medical-service-title {
            color: #1E40AF !important;
            font-weight: 800 !important;
            text-shadow: none !important;
          }

          .medical-service-title::after {
            background: #2563EB !important;
            height: 4px !important;
          }

          .group:hover .medical-service-title,
          .group:focus-within .medical-service-title {
            color: #1E40AF !important;
          }

          .medical-nav-button {
            border-width: 2px;
            border-color: #2563EB;
          }
        }

        /* Enhanced Reduced motion support with accessibility focus */
        @media (prefers-reduced-motion: reduce) {
          .medical-shimmer,
          .medical-loading-card,
          .medical-icon-pulse,
          .medical-nav-button::after,
          .medical-service-title,
          .medical-service-card {
            animation: none !important;
            transition: opacity 0.2s ease, color 0.2s ease !important;
          }

          .medical-service-title::after,
          .medical-service-title::before,
          .medical-service-card::before,
          .medical-service-card::after {
            transition: opacity 0.2s ease !important;
          }

          .group:hover .medical-service-title,
          .group:focus-within .medical-service-title {
            transform: none !important;
            color: #1E40AF !important;
          }

          /* Maintain focus indicators for accessibility */
          .medical-service-card:focus-within {
            outline: 3px solid #2563EB !important;
            outline-offset: 2px !important;
          }

          /* Ensure button interactions remain accessible */
          button:focus {
            outline: 3px solid #2563EB !important;
            outline-offset: 2px !important;
          }
        }

        /* Enhanced focus indicators for keyboard navigation */
        @media (prefers-reduced-motion: no-preference) {
          .medical-service-title:focus {
            outline: 3px solid #2563EB;
            outline-offset: 2px;
            border-radius: 4px;
          }
        }

        /* Screen reader only content */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
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
