import { useEffect, useState, useCallback, useMemo, Suspense } from 'react';
import Tabs from '@/components/tabs';
import Tab1 from './tab1';
import Tab2 from './tab2';
import Tab3 from './tab3';
import { useSearchParams } from 'react-router-dom';
import { DetailPageContext, DetailPageTemplateProps } from './context';
import { useAtom } from 'jotai';
import { customTitleState } from '@/state';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { MedicalIcon, MedicalStatusIndicator } from '@/components/medical/MedicalServiceComponents';
import ModernBreadcrumb from '@/components/modern-breadcrumb';
import { MedicalSpinner } from '@/components/medical-animations';
import {
  MEDICAL_COLORS,
  SPACING,
  ANIMATIONS,
  ACCESSIBILITY,
  MEDICAL_SKELETON_COLORS,
  MEDICAL_PRESETS,
  BREAKPOINTS,
} from '@/styles/medical-design-system';

function DetailPageTemplate(props: DetailPageTemplateProps) {
  const [query] = useSearchParams();
  const tab = query.get('tab');
  const [activeTab, setActiveTab] = useState(Number(tab) || 0);
  const [customTitle, setCustomTitle] = useAtom(customTitleState);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isContentLoaded, setIsContentLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Performance and accessibility optimizations
  const shouldReduceMotion = useReducedMotion();
  const animationDuration = shouldReduceMotion ? 0.15 : 0.3; // Faster, more responsive

  // Medical-specific color scheme
  const medicalColors = useMemo(
    () => ({
      primary: MEDICAL_COLORS.primary.blue,
      primaryDark: MEDICAL_COLORS.primary.blueDark,
      secondary: MEDICAL_COLORS.secondary.green,
      accent: MEDICAL_COLORS.accent.cyan,
      background: MEDICAL_COLORS.white.soft,
      surface: MEDICAL_COLORS.white.pure,
    }),
    []
  );

  // Compact spacing configuration for healthcare UI
  const compactSpacing = useMemo(
    () => ({
      hero: 'h-[160px] sm:h-[200px] md:h-[240px]', // Reduced height for compact design
      padding: 'p-2 sm:p-3 md:p-4', // Tighter padding
      margin: 'mb-3 sm:mb-4', // Reduced margins
      gap: 'gap-2 sm:gap-3', // Smaller gaps
    }),
    []
  );

  // Optimized animation variants for medical UI
  const pageVariants = useMemo(
    () => ({
      initial: {
        opacity: 0,
        y: shouldReduceMotion ? 0 : 15, // Reduced movement for faster perception
        scale: shouldReduceMotion ? 1 : 0.99, // Subtle scale for premium feel
      },
      animate: {
        opacity: 1,
        y: 0,
        scale: 1,
      },
      exit: {
        opacity: 0,
        y: shouldReduceMotion ? 0 : -8, // Minimal exit movement
      },
    }),
    [shouldReduceMotion]
  );

  const pageTransition = useMemo(
    () => ({
      duration: animationDuration,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    }),
    [animationDuration]
  );

  // Medical-themed staggered animation delays (reduced for better performance)
  const staggerDelays = useMemo(
    () => ({
      hero: 0,
      badges: 0.1,
      title: 0.15,
      subtitle: 0.2,
      trust: 0.25,
      breadcrumb: 0.3,
      content: 0.35,
    }),
    []
  );

  // Enhanced image loading with error handling
  const handleImageLoad = useCallback(() => {
    setIsImageLoaded(true);
    setImageError(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setIsImageLoaded(false);
  }, []);

  // Progressive content loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsContentLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Intersection observer for visibility-based animations
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const oldTitle = customTitle;
    setCustomTitle(props.title);
    return () => {
      setCustomTitle(oldTitle);
    };
  }, [props.title, customTitle, setCustomTitle]);

  return (
    <motion.div
      className="flex flex-col w-full min-h-screen"
      style={{
        background: `linear-gradient(135deg, ${medicalColors.background} 0%, ${medicalColors.surface} 50%, ${medicalColors.background} 100%)`,
      }}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      role="main"
      aria-label={`Chi tiết ${props.title}`}
    >
      {/* Enhanced Medical Hero Banner - Compact Design */}
      <motion.div
        className={`relative w-full ${compactSpacing.hero} overflow-hidden`}
        initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: animationDuration * 1.5, ease: 'easeOut', delay: staggerDelays.hero }}
        role="banner"
        aria-label={`Banner cho ${props.title}`}
      >
        {/* Medical-themed background gradient */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: props.imageUrl
              ? `linear-gradient(135deg, ${medicalColors.primary} 0%, ${medicalColors.primaryDark} 100%)`
              : `linear-gradient(135deg, ${medicalColors.primary} 0%, ${medicalColors.accent} 50%, ${medicalColors.secondary} 100%)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: animationDuration, delay: staggerDelays.hero }}
        />

        {/* Enhanced Medical Iconography Pattern */}
        {!shouldReduceMotion && (
          <motion.div
            className="absolute inset-0 opacity-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.08 }}
            transition={{ duration: animationDuration * 2, delay: staggerDelays.hero + 0.1 }}
          >
            <div className="absolute inset-0 overflow-hidden">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <defs>
                  <pattern id="medical-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                    {/* Medical cross */}
                    <g fill="white" fillOpacity="0.06">
                      <rect x="35" y="25" width="10" height="30" rx="2" />
                      <rect x="25" y="35" width="30" height="10" rx="2" />
                    </g>
                    {/* Heartbeat line */}
                    <path
                      d="M10 60 L20 60 L25 50 L30 70 L35 40 L40 60 L70 60"
                      stroke="white"
                      strokeOpacity="0.04"
                      strokeWidth="2"
                      fill="none"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#medical-pattern)" />
              </svg>
            </div>
          </motion.div>
        )}

        {/* No-image fallback with prominent medical iconography */}
        {!props.imageUrl && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: animationDuration * 1.2, delay: staggerDelays.hero + 0.2 }}
          >
            <div className="text-center text-white">
              <motion.div
                className="mb-4"
                animate={
                  shouldReduceMotion
                    ? {}
                    : {
                        scale: [1, 1.05, 1],
                        rotate: [0, 2, -2, 0],
                      }
                }
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <MedicalIcon
                  type={props.category?.includes('tim') ? 'heart' : 'stethoscope'}
                  size="lg"
                  className="text-white opacity-90 w-16 h-16 mx-auto"
                />
              </motion.div>
              <motion.div
                className="text-sm font-medium opacity-75"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0.75, y: 0 }}
                transition={{ duration: animationDuration, delay: staggerDelays.hero + 0.4 }}
              >
                Dịch vụ y tế chuyên nghiệp
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Enhanced Image with Loading States and Error Handling */}
        {props.imageUrl && (
          <>
            {/* Overlay gradient for better text readability */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: animationDuration * 1.5, delay: 0.3 }}
            />

            {/* Image container with enhanced loading */}
            <motion.div
              className="absolute inset-0 z-5"
              initial={{ scale: shouldReduceMotion ? 1 : 1.1, opacity: 0 }}
              animate={{
                scale: isImageLoaded ? 1 : shouldReduceMotion ? 1 : 1.1,
                opacity: isImageLoaded && !imageError ? 0.85 : 0,
              }}
              transition={{
                duration: shouldReduceMotion ? 0.2 : 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <img
                src={props.imageUrl}
                alt={props.title}
                className="w-full h-full object-cover"
                onLoad={handleImageLoad}
                onError={handleImageError}
                loading="lazy"
                decoding="async"
                role="img"
                aria-describedby="hero-image-description"
              />
            </motion.div>

            {/* Enhanced Medical Loading Skeleton */}
            <AnimatePresence>
              {!isImageLoaded && !imageError && (
                <motion.div
                  className="absolute inset-0 z-5"
                  style={{
                    background: `linear-gradient(135deg, ${MEDICAL_SKELETON_COLORS.primary.base} 0%, ${MEDICAL_SKELETON_COLORS.primary.shimmer} 100%)`,
                  }}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: animationDuration }}
                >
                  {/* Medical-themed shimmer effect */}
                  <div
                    className="absolute inset-0 animate-shimmer"
                    style={{
                      background: MEDICAL_SKELETON_COLORS.gradients.medicalBlue,
                      backgroundSize: '200% 100%',
                    }}
                  />

                  {/* Medical loading indicator with context */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <MedicalSpinner size="md" color="primary" />
                    <motion.p
                      className="mt-3 text-sm font-medium opacity-70"
                      style={{ color: medicalColors.primary }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.7 }}
                      transition={{ delay: 0.5, duration: animationDuration }}
                    >
                      Đang tải hình ảnh y tế...
                    </motion.p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Enhanced Medical Error State */}
            {imageError && (
              <motion.div
                className="absolute inset-0 z-5 flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${MEDICAL_SKELETON_COLORS.neutral.base} 0%, ${MEDICAL_SKELETON_COLORS.neutral.shimmer} 100%)`,
                }}
                initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: animationDuration }}
              >
                <div className="text-center" style={{ color: medicalColors.primary }}>
                  <motion.div
                    className="mb-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: animationDuration, delay: 0.1 }}
                  >
                    <MedicalIcon type="cross" size="lg" className="mx-auto opacity-60" />
                  </motion.div>
                  <motion.p
                    className="text-sm font-medium mb-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: animationDuration, delay: 0.2 }}
                  >
                    Hình ảnh tạm thời không khả dụng
                  </motion.p>
                  <motion.p
                    className="text-xs opacity-70"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    transition={{ duration: animationDuration, delay: 0.3 }}
                  >
                    Thông tin dịch vụ vẫn đầy đủ bên dưới
                  </motion.p>
                </div>
              </motion.div>
            )}

            {/* Hidden description for screen readers */}
            <span id="hero-image-description" className="sr-only">
              Hình ảnh minh họa cho {props.title}
            </span>
          </>
        )}

        {/* Enhanced Medical Content Overlay - Compact Design */}
        <motion.div
          className="absolute inset-0 z-20 flex flex-col justify-end"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: animationDuration * 1.5, delay: staggerDelays.badges }}
        >
          <div
            className={`bg-gradient-to-t from-black/90 via-black/60 to-transparent ${compactSpacing.padding}`}
            style={{
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          >
            {/* Compact Medical Badges */}
            <motion.div
              className={`flex flex-wrap items-center ${compactSpacing.gap} ${compactSpacing.margin}`}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: staggerDelays.badges, duration: animationDuration }}
            >
              {props.category && (
                <motion.span
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white rounded-full border transition-all duration-200"
                  style={{
                    backgroundColor: `${medicalColors.accent}20`,
                    borderColor: `${medicalColors.accent}40`,
                    backdropFilter: 'blur(12px)',
                  }}
                  initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: staggerDelays.badges + 0.05, duration: animationDuration }}
                  whileHover={
                    shouldReduceMotion
                      ? {}
                      : {
                          scale: 1.03,
                          backgroundColor: `${medicalColors.accent}30`,
                        }
                  }
                  whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                  role="badge"
                  aria-label={`Danh mục: ${props.category}`}
                >
                  <MedicalIcon type="stethoscope" size="sm" className="text-white" aria-hidden="true" />
                  <span>{props.category.length > 10 ? `${props.category.slice(0, 10)}...` : props.category}</span>
                </motion.span>
              )}
              {props.status && (
                <motion.div
                  initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: staggerDelays.badges + 0.1, duration: animationDuration }}
                  whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                  role="status"
                  aria-label={`Trạng thái: ${props.status}`}
                >
                  <div
                    className="px-2.5 py-1 rounded-full border text-xs font-semibold transition-all duration-200"
                    style={{
                      backgroundColor: `${medicalColors.secondary}20`,
                      borderColor: `${medicalColors.secondary}40`,
                      backdropFilter: 'blur(12px)',
                    }}
                  >
                    <MedicalStatusIndicator
                      status={props.status === 'emergency' ? 'emergency' : 'available'}
                      showLabel={true}
                      className="text-white"
                    />
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Compact Medical Title */}
            <motion.h1
              className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight"
              style={{
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                marginBottom: compactSpacing.margin.replace('mb-', '').replace(' sm:mb-', ''),
              }}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: animationDuration,
                delay: staggerDelays.title,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              role="heading"
              aria-level={1}
              tabIndex={0}
            >
              {props.title}
            </motion.h1>

            {props.subtitle && (
              <motion.p
                className="text-white/95 text-xs sm:text-sm font-medium max-w-2xl line-clamp-2"
                style={{
                  textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                  marginBottom: '0.75rem',
                }}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: animationDuration,
                  delay: staggerDelays.subtitle,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                role="text"
                aria-describedby="subtitle-description"
              >
                {props.subtitle}
                <span id="subtitle-description" className="sr-only">
                  Mô tả chi tiết về {props.title}
                </span>
              </motion.p>
            )}

            {/* Compact Medical Trust Indicators */}
            <motion.div
              className={`flex flex-wrap items-center ${compactSpacing.gap}`}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: animationDuration,
                delay: staggerDelays.trust,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              role="list"
              aria-label="Các ưu điểm nổi bật"
            >
              {[
                {
                  icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
                  text: 'Chất lượng',
                  color: medicalColors.accent,
                },
                {
                  icon: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z',
                  text: 'An toàn',
                  color: medicalColors.secondary,
                },
                {
                  icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
                  text: 'Chuyên gia',
                  color: medicalColors.primary,
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium text-white/95 transition-all duration-200 cursor-default"
                  style={{
                    backgroundColor: `${item.color}15`,
                    border: `1px solid ${item.color}25`,
                    backdropFilter: 'blur(8px)',
                    textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                  }}
                  initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: animationDuration,
                    delay: staggerDelays.trust + index * 0.05,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  whileHover={
                    shouldReduceMotion
                      ? {}
                      : {
                          scale: 1.02,
                          backgroundColor: `${item.color}20`,
                          transition: { duration: 0.15 },
                        }
                  }
                  role="listitem"
                  aria-label={item.text}
                >
                  <motion.svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    style={{ color: item.color }}
                    whileHover={
                      shouldReduceMotion
                        ? {}
                        : {
                            rotate: [0, -3, 3, 0],
                            transition: { duration: 0.3 },
                          }
                    }
                  >
                    <path d={item.icon} />
                  </motion.svg>
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Compact Medical Breadcrumb Navigation */}
      <motion.div
        className={`w-full max-w-4xl mx-auto ${compactSpacing.padding} py-1.5`}
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: animationDuration,
          delay: staggerDelays.breadcrumb,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        <Suspense
          fallback={
            <div className="flex items-center space-x-2 text-xs animate-pulse">
              {[16, 1, 12, 1, 20].map((width, index) => (
                <div
                  key={index}
                  className={`h-3 rounded`}
                  style={{
                    width: `${width * 4}px`,
                    backgroundColor: MEDICAL_SKELETON_COLORS.neutral.shimmer,
                  }}
                />
              ))}
            </div>
          }
        >
          <ModernBreadcrumb
            items={[
              { label: 'Trang chủ', href: '/', icon: 'home' },
              { label: 'Dịch vụ', href: '/services', icon: 'stethoscope' },
              {
                label: props.title.length > 18 ? `${props.title.slice(0, 18)}...` : props.title,
              },
            ]}
            className="text-xs font-medium"
          />
        </Suspense>
      </motion.div>

      {/* Compact Medical Tabs Content */}
      <motion.div
        className={`flex-1 w-full max-w-4xl mx-auto ${compactSpacing.padding}`}
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: animationDuration,
          delay: staggerDelays.content,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        <DetailPageContext.Provider value={props}>
          {props.hideTabs ? (
            // Show only Tab1 content without tabs - Mobile optimized with loading state
            <Suspense
              fallback={
                <motion.div
                  className={`${compactSpacing.margin} mb-12 sm:mb-16 rounded-lg shadow-md overflow-hidden border`}
                  style={{
                    backgroundColor: medicalColors.surface,
                    borderColor: `${medicalColors.primary}20`,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: animationDuration }}
                >
                  <div className={`${compactSpacing.padding} space-y-3`}>
                    {/* Medical header skeleton */}
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-10 h-10 rounded-xl"
                        style={{ backgroundColor: MEDICAL_SKELETON_COLORS.primary.base }}
                      />
                      <div className="flex-1 space-y-2">
                        <div
                          className="h-5 rounded w-3/4"
                          style={{ backgroundColor: MEDICAL_SKELETON_COLORS.primary.shimmer }}
                        />
                        <div
                          className="h-3 rounded w-1/2"
                          style={{ backgroundColor: MEDICAL_SKELETON_COLORS.neutral.shimmer }}
                        />
                      </div>
                    </div>
                    {/* Content skeleton */}
                    <div className="space-y-2">
                      {[1, 0.9, 0.7].map((width, index) => (
                        <div
                          key={index}
                          className="h-4 rounded"
                          style={{
                            width: `${width * 100}%`,
                            backgroundColor: MEDICAL_SKELETON_COLORS.neutral.base,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              }
            >
              <motion.div
                className={`${compactSpacing.margin} mb-12 sm:mb-16 rounded-lg shadow-md overflow-hidden border`}
                style={{
                  backgroundColor: medicalColors.surface,
                  borderColor: `${medicalColors.primary}15`,
                  boxShadow: `0 4px 6px -1px ${medicalColors.primary}10, 0 2px 4px -1px ${medicalColors.primary}06`,
                }}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: animationDuration,
                  delay: staggerDelays.content + 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                role="main"
                aria-label="Nội dung chi tiết"
              >
                <Tab1 />
              </motion.div>
            </Suspense>
          ) : (
            <Suspense
              fallback={
                <motion.div
                  className={`${compactSpacing.margin} mb-12 sm:mb-16 rounded-lg shadow-md overflow-hidden border`}
                  style={{
                    backgroundColor: medicalColors.surface,
                    borderColor: `${medicalColors.primary}20`,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: animationDuration }}
                >
                  {/* Medical Tab skeleton */}
                  <div
                    className={`flex border-b ${compactSpacing.padding} space-x-3`}
                    style={{ borderColor: `${medicalColors.primary}15` }}
                  >
                    {['Giới thiệu', 'Bác sĩ', 'Tư vấn'].map((name, i) => (
                      <div key={i} className="flex flex-col items-center space-y-1">
                        <div
                          className="w-6 h-6 rounded"
                          style={{ backgroundColor: MEDICAL_SKELETON_COLORS.primary.base }}
                        />
                        <div
                          className="h-3 rounded"
                          style={{
                            width: `${name.length * 8}px`,
                            backgroundColor: MEDICAL_SKELETON_COLORS.neutral.shimmer,
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  {/* Medical Content skeleton */}
                  <div className={`${compactSpacing.padding} space-y-3`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-10 h-10 rounded-xl"
                        style={{ backgroundColor: MEDICAL_SKELETON_COLORS.secondary.base }}
                      />
                      <div className="flex-1 space-y-2">
                        <div
                          className="h-5 rounded w-3/4"
                          style={{ backgroundColor: MEDICAL_SKELETON_COLORS.primary.shimmer }}
                        />
                        <div
                          className="h-3 rounded w-1/2"
                          style={{ backgroundColor: MEDICAL_SKELETON_COLORS.neutral.shimmer }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      {[1, 0.85, 0.65].map((width, index) => (
                        <div
                          key={index}
                          className="h-4 rounded"
                          style={{
                            width: `${width * 100}%`,
                            backgroundColor: MEDICAL_SKELETON_COLORS.neutral.base,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              }
            >
              <motion.div
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: animationDuration,
                  delay: staggerDelays.content + 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                <Tabs
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  tabs={[
                    {
                      name: 'Giới thiệu',
                      content: Tab1,
                      icon: 'stethoscope',
                      ariaLabel: 'Tab giới thiệu về dịch vụ y tế',
                    },
                    {
                      name: 'Bác sĩ',
                      content: Tab2,
                      icon: 'heartbeat',
                      ariaLabel: 'Tab thông tin bác sĩ',
                    },
                    {
                      name: 'Tư vấn',
                      content: Tab3,
                      icon: 'pill',
                      ariaLabel: 'Tab tư vấn y tế',
                    },
                  ]}
                  className={`${compactSpacing.margin} mb-12 sm:mb-16 rounded-lg shadow-md overflow-hidden border border-blue-100 bg-white`}
                  ariaLabel="Thông tin chi tiết về dịch vụ y tế"
                />
              </motion.div>
            </Suspense>
          )}
        </DetailPageContext.Provider>
      </motion.div>
    </motion.div>
  );
}

export default DetailPageTemplate;
