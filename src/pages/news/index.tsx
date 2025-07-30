import React from 'react';
import { useAtomValue } from 'jotai';
import { useParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import NotFound from '../404';
import { postAtomFamily } from '@/services/post';
import normalizeHtml from '@/utils/normalHTML';
import { getColorToken } from '@/styles/unified-color-system';
import {
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  TYPOGRAPHY,
  TOUCH_TARGETS,
  combineClasses,
} from '@/styles/medical-design-system';
import { decodeHTML } from '@/utils/decodeHTML';

function NewsPage() {
  const { id } = useParams();
  const news = useAtomValue(postAtomFamily(Number(id)));
  const prefersReducedMotion = useReducedMotion();

  // Enhanced Performance: Track loading state with retry mechanism
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);
  const [imageRetryCount, setImageRetryCount] = React.useState(0);
  const [authorAvatarError, setAuthorAvatarError] = React.useState(false);
  const [contentError, setContentError] = React.useState(false);

  // Content organization: Reading progress and navigation
  const [readingProgress, setReadingProgress] = React.useState(0);
  const [showFloatingTOC, setShowFloatingTOC] = React.useState(false);

  // Mobile experience: Touch interactions
  const [isMobile, setIsMobile] = React.useState(false);
  const [touchStartY, setTouchStartY] = React.useState(0);

  // Enhanced content organization: Reading progress and floating TOC tracking
  React.useEffect(() => {
    const updateReadingProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(100, Math.max(0, progress)));

      // Show floating TOC after scrolling past compact hero section
      const heroHeight = window.innerHeight * 0.5; // 50vh hero height
      setShowFloatingTOC(scrollTop > heroHeight);
    };

    window.addEventListener('scroll', updateReadingProgress, { passive: true });
    return () => window.removeEventListener('scroll', updateReadingProgress);
  }, []);

  // Enhanced accessibility: Set document title for screen readers
  React.useEffect(() => {
    if (news && (news as any).title?.rendered) {
      const title = decodeHTML((news as any).title.rendered);
      document.title = `${title} - Tin tức y tế | Bệnh viện`;
    }
  }, [news]);

  // Enhanced Mobile optimization: Detect mobile and handle touch interactions
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';
      document.head.appendChild(meta);
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mobile touch interactions for better UX
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    const touchDiff = touchStartY - touchEndY;

    // Implement smooth scrolling for mobile swipe gestures
    if (Math.abs(touchDiff) > 50) {
      if (touchDiff > 0) {
        // Swipe up - scroll down smoothly
        window.scrollBy({ top: 200, behavior: 'smooth' });
      } else {
        // Swipe down - scroll up smoothly
        window.scrollBy({ top: -200, behavior: 'smooth' });
      }
    }
  };

  // Enhanced Performance: Preload critical content with retry mechanism
  React.useEffect(() => {
    if (news) {
      const post = (news as any).data ? (news as any).data : news;
      if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]?.source_url) {
        const preloadImage = (src: string, retryCount = 0) => {
          const img = new Image();
          img.onload = () => {
            setImageLoaded(true);
            setImageError(false);
          };
          img.onerror = () => {
            if (retryCount < 2) {
              // Retry up to 2 times with exponential backoff
              setTimeout(
                () => {
                  setImageRetryCount(retryCount + 1);
                  preloadImage(src, retryCount + 1);
                },
                Math.pow(2, retryCount) * 1000
              );
            } else {
              setImageError(true);
              setContentError(true);
            }
          };
          img.src = src;
        };

        preloadImage(post._embedded['wp:featuredmedia'][0].source_url);
      }
    }
  }, [news]);

  if (news === undefined) {
    // Enhanced Loading Skeleton with realistic content structure
    return (
      <motion.div
        className="min-h-screen"
        style={{
          background: `linear-gradient(135deg, ${getColorToken('primary-50')} 0%, ${getColorToken('background')} 35%, ${getColorToken('secondary-50')} 100%)`,
        }}
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        role="status"
        aria-live="polite"
        aria-label="Đang tải nội dung bài viết"
      >
        {/* Skip Link for Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-blue-600 text-white px-4 py-2 rounded-md font-medium"
        >
          Bỏ qua đến nội dung chính
        </a>

        {/* Loading Progress Bar */}
        <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-40">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-600 to-green-600"
            initial={{ width: '0%' }}
            animate={{ width: '70%' }}
            transition={{ duration: 2, ease: 'easeOut' }}
          />
        </div>

        {/* Hero Header Skeleton */}
        <div className="relative overflow-hidden min-h-[60vh] md:min-h-[70vh] flex items-end">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 animate-pulse"
              style={{
                background: `linear-gradient(135deg, ${getColorToken('primary')} 0%, ${getColorToken('primary-hover')} 50%, ${getColorToken('secondary')} 100%)`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>
          </div>

          {/* Header Content Skeleton */}
          <div className="relative z-10 w-full">
            <div className={combineClasses('max-w-4xl mx-auto', SPACING.padding.section, 'pb-12 pt-8')}>
              {/* Category Badge Skeleton */}
              <motion.div
                className="mb-6"
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={combineClasses('h-8 w-32 bg-white/20 animate-pulse', BORDER_RADIUS.pill)} />
                </div>
              </motion.div>

              {/* Title Skeleton */}
              <motion.div
                className="mb-6"
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className="space-y-3">
                  <div className="h-12 md:h-16 bg-white/20 animate-pulse rounded-lg w-full" />
                  <div className="h-12 md:h-16 bg-white/20 animate-pulse rounded-lg w-4/5" />
                  <div className="h-12 md:h-16 bg-white/20 animate-pulse rounded-lg w-3/5" />
                </div>
              </motion.div>

              {/* Author Meta Skeleton */}
              <motion.div
                className="flex flex-wrap items-center gap-4"
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 animate-pulse rounded-full" />
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-white/20 animate-pulse rounded" />
                    <div className="h-3 w-20 bg-white/20 animate-pulse rounded" />
                  </div>
                </div>
                <div className="hidden sm:block w-1 h-8 bg-white/20 rounded-full" />
                <div className="flex items-center gap-4">
                  <div className="h-4 w-20 bg-white/20 animate-pulse rounded" />
                  <div className="h-4 w-16 bg-white/20 animate-pulse rounded" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <motion.main
          id="main-content"
          className={combineClasses('max-w-4xl mx-auto', SPACING.padding.section, 'py-6')}
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <article
            className={combineClasses(
              'bg-white overflow-hidden',
              BORDER_RADIUS.cardLarge,
              SHADOWS.card,
              'border border-blue-100/50'
            )}
          >
            <div className={combineClasses(SPACING.padding.cardLarge, 'md:p-8')}>
              {/* Table of Contents Skeleton */}
              <div
                className={combineClasses(
                  'mb-8 p-4 bg-blue-50/50 border border-blue-100 animate-pulse',
                  BORDER_RADIUS.button
                )}
              >
                <div className="h-5 w-32 bg-blue-200 rounded mb-3" />
                <div className="space-y-2">
                  <div className="h-3 w-48 bg-blue-200 rounded" />
                  <div className="h-3 w-36 bg-blue-200 rounded" />
                  <div className="h-3 w-40 bg-blue-200 rounded" />
                </div>
              </div>

              {/* Content Skeleton */}
              <div className="space-y-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-full" />
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-11/12" />
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-4/5" />
                  </div>
                ))}
              </div>
            </div>
          </article>

          {/* CTA Skeleton */}
          <div
            className={combineClasses(
              'mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 animate-pulse',
              BORDER_RADIUS.cardLarge
            )}
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-green-200 rounded-full" />
              <div className="flex-1 space-y-3">
                <div className="h-5 w-48 bg-green-200 rounded" />
                <div className="h-4 w-full bg-green-200 rounded" />
                <div className="flex gap-3">
                  <div className="h-10 w-32 bg-blue-200 rounded-xl" />
                  <div className="h-10 w-40 bg-gray-200 rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </motion.main>
      </motion.div>
    );
  }

  if (!news) {
    return <NotFound />;
  }

  // Handle potential data wrapper from axios interceptor
  const post = (news as any).data ? (news as any).data : news;
  const title = decodeHTML(post.title?.rendered || '');
  const date = post.date
    ? new Date(post.date).toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  let featuredImage = '';
  let category = 'Tin tức y tế';
  let authorInfo = {
    name: 'Đội ngũ y tế',
    avatar: '',
    id: 0,
  };

  if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]?.source_url) {
    featuredImage = post._embedded['wp:featuredmedia'][0].source_url;
  }

  // Extract category
  if (post._embedded && post._embedded['wp:term'] && post._embedded['wp:term'][0] && post._embedded['wp:term'][0][0]) {
    category = post._embedded['wp:term'][0][0].name;
  }

  // Extract author information
  if (post._embedded && post._embedded['wp:author'] && post._embedded['wp:author'][0]) {
    const author = post._embedded['wp:author'][0];
    authorInfo = {
      name: author.name || 'Đội ngũ y tế',
      avatar: author.avatar_urls?.['96'] || author.avatar_urls?.['48'] || '',
      id: author.id || 0,
    };
  }

  return (
    <motion.div
      className="min-h-screen"
      style={{
        background: `linear-gradient(135deg, ${getColorToken('primary-50')} 0%, ${getColorToken('background')} 35%, ${getColorToken('secondary-50')} 100%)`,
      }}
      initial={prefersReducedMotion ? {} : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      onTouchStart={isMobile ? handleTouchStart : undefined}
      onTouchEnd={isMobile ? handleTouchEnd : undefined}
    >
      {/* Skip Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-blue-600 text-white px-4 py-2 rounded-md font-medium"
      >
        Bỏ qua đến nội dung chính
      </a>

      {/* Reading Progress Indicator */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-40">
        <div
          className="h-full bg-gradient-to-r from-blue-600 to-green-600 transition-all duration-150 ease-out"
          style={{ width: `${readingProgress}%` }}
          role="progressbar"
          aria-label="Tiến độ đọc bài viết"
          aria-valuenow={Math.round(readingProgress)}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      {/* Floating Table of Contents */}
      {showFloatingTOC && (
        <motion.div
          className="fixed right-6 top-1/2 transform -translate-y-1/2 z-30 hidden lg:block"
          initial={prefersReducedMotion ? {} : { opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className={combineClasses(
              'bg-white/95 backdrop-blur-md border border-blue-100/60',
              'shadow-lg rounded-xl p-4 max-w-xs',
              'hover:shadow-xl transition-shadow duration-300'
            )}
          >
            <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 9h14V7H3v2zm0 4h14v-2H3v2zm0 4h14v-2H3v2zm16 0h2v-2h-2v2zm0-10v2h2V7h-2zm0 6h2v-2h-2v2z" />
              </svg>
              Nội dung
            </h3>
            <div className="space-y-2">
              <button
                className="w-full text-left text-xs text-gray-600 hover:text-blue-600 transition-colors duration-200 p-2 rounded hover:bg-blue-50"
                onClick={() => document.getElementById('main-content')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Nội dung chính
              </button>
              <div className="flex items-center gap-2 text-xs text-gray-500 px-2">
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div
                    className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${readingProgress}%` }}
                  />
                </div>
                <span className="text-xs font-medium">{Math.round(readingProgress)}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      {/* Optimized Compact Hero Header */}
      <motion.header
        className="relative overflow-hidden min-h-[45vh] md:min-h-[50vh] flex items-end"
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        role="banner"
      >
        {/* Enhanced Background - Works with or without featured image */}
        <div className="absolute inset-0">
          {/* Medical Pattern Background */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${getColorToken('primary')} 0%, ${getColorToken('primary-hover')} 50%, ${getColorToken('secondary')} 100%)`,
            }}
          >
            {/* Medical Pattern Overlay */}
            <div className="absolute inset-0 opacity-8">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
                <defs>
                  <pattern id="medical-pattern" x="0" y="0" width="25" height="25" patternUnits="userSpaceOnUse">
                    <rect width="25" height="25" fill="none" />
                    {/* Medical cross */}
                    <path d="M12.5 8v9M8 12.5h9" stroke="white" strokeWidth="0.8" opacity="0.4" />
                    {/* Heart pulse line */}
                    <path d="M3 20h4l2-4 2 8 2-12 2 4h4" stroke="white" strokeWidth="0.6" opacity="0.3" fill="none" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#medical-pattern)" />
              </svg>
            </div>

            {/* Floating Medical Icons */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {/* Stethoscope Icon */}
              <motion.div
                className="absolute top-20 right-20 opacity-5"
                animate={
                  prefersReducedMotion
                    ? {}
                    : {
                        y: [0, -10, 0],
                        rotate: [0, 5, 0],
                      }
                }
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.1 12.3c2-1.25 2-3.55 0-4.8s-5.27-1.25-7.27 0c-2 1.25-2 3.55 0 4.8s5.27 1.25 7.27 0zM12 14c-4 0-8 .5-8 4v2h16v-2c0-3.5-4-4-8-4z" />
                </svg>
              </motion.div>

              {/* Heart Icon */}
              <motion.div
                className="absolute top-32 left-16 opacity-4"
                animate={
                  prefersReducedMotion
                    ? {}
                    : {
                        scale: [1, 1.1, 1],
                        opacity: [0.04, 0.08, 0.04],
                      }
                }
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </motion.div>

              {/* Medical Shield Icon */}
              <motion.div
                className="absolute bottom-32 right-12 opacity-6"
                animate={
                  prefersReducedMotion
                    ? {}
                    : {
                        y: [0, 8, 0],
                        x: [0, -5, 0],
                      }
                }
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5H16.3V16H7.7V11.5H9.2V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,10V11.5H13.5V10C13.5,8.7 12.8,8.2 12,8.2Z" />
                </svg>
              </motion.div>
            </div>

            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
          </div>

          {/* Featured Image Overlay (if available) */}
          {featuredImage && (
            <div className="absolute inset-0">
              {/* Loading placeholder */}
              {!imageLoaded && !imageError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="w-12 h-12 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              )}

              {/* Featured Image */}
              {!imageError && (
                <img
                  src={featuredImage}
                  alt={`Hình ảnh minh họa cho bài viết: ${title}`}
                  className={combineClasses(
                    'w-full h-full object-cover transition-all duration-700',
                    imageLoaded ? 'opacity-60' : 'opacity-0'
                  )}
                  loading="eager"
                  itemProp="image"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                />
              )}

              {/* Additional overlay for featured image */}
              {imageLoaded && !imageError && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
              )}
            </div>
          )}
        </div>

        {/* Compact Header Content Container */}
        <div className="relative z-10 w-full">
          <div className={combineClasses('max-w-4xl mx-auto', SPACING.padding.section, 'pb-8 pt-6')}>
            {/* Compact Category Badge */}
            <motion.div
              className="mb-4"
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div
                className={combineClasses(
                  'inline-flex items-center gap-2',
                  'bg-white/15 backdrop-blur-md border border-white/25',
                  BORDER_RADIUS.pill,
                  'px-3 py-1.5'
                )}
              >
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                </svg>
                <span className="text-xs font-semibold text-white tracking-wide">{category}</span>
              </div>
            </motion.div>

            {/* Compact Article Title */}
            <motion.div
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h1
                className={combineClasses(
                  'text-2xl md:text-3xl lg:text-4xl font-bold mb-5',
                  'text-white leading-[1.2] tracking-tight',
                  'drop-shadow-xl',
                  'max-w-4xl'
                )}
                itemProp="headline"
                style={{
                  textShadow: '0 3px 6px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.3)',
                }}
              >
                {title}
              </h1>
            </motion.div>

            {/* Compact Author and Meta Information */}
            <motion.div
              className="flex flex-wrap items-center gap-3 text-white/90"
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {/* Compact Author Information */}
              <div className="flex items-center gap-2">
                {authorInfo.avatar && !authorAvatarError ? (
                  <img
                    src={authorInfo.avatar}
                    alt={`Ảnh đại diện của ${authorInfo.name}`}
                    className={combineClasses(
                      'w-8 h-8 rounded-full object-cover',
                      'ring-2 ring-white/25 shadow-md',
                      'border border-white/20'
                    )}
                    loading="lazy"
                    onError={() => setAuthorAvatarError(true)}
                  />
                ) : (
                  <div
                    className={combineClasses(
                      'w-8 h-8 rounded-full flex items-center justify-center',
                      'bg-white/15 backdrop-blur-sm border border-white/25'
                    )}
                  >
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-white" itemProp="author">
                    {authorInfo.name}
                  </span>
                  <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-1.5 h-1.5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Compact Divider */}
              <div className="w-1 h-4 bg-white/25 rounded-full" />

              {/* Compact Meta Information */}
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <time dateTime={post.date} itemProp="datePublished">
                    {date}
                  </time>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>5 phút đọc</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Article Content */}
      <motion.main
        id="main-content"
        className={combineClasses('max-w-4xl mx-auto', SPACING.padding.section, 'py-6')}
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        role="main"
      >
        <article
          className={combineClasses(
            'bg-white overflow-hidden',
            BORDER_RADIUS.cardLarge,
            SHADOWS.card,
            'border border-blue-100/50'
          )}
          itemScope
          itemType="https://schema.org/NewsArticle"
        >
          {/* Article Header - Simplified since title moved to hero header */}
          <motion.header
            className={combineClasses(SPACING.padding.cardLarge, 'md:p-8')}
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {/* Enhanced Table of Contents with Better Visual Hierarchy */}
            <motion.nav
              className={combineClasses(
                'mb-8 overflow-hidden',
                BORDER_RADIUS.cardLarge,
                'bg-gradient-to-r from-blue-50/80 via-white to-green-50/80',
                'border border-blue-100/60 shadow-sm backdrop-blur-sm'
              )}
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.45 }}
              aria-labelledby="toc-heading"
            >
              <div className="p-6">
                <h2
                  id="toc-heading"
                  className={combineClasses(
                    'text-lg font-bold text-blue-900 mb-4 flex items-center gap-3',
                    'border-b border-blue-100 pb-3'
                  )}
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M3 9h14V7H3v2zm0 4h14v-2H3v2zm0 4h14v-2H3v2zm16 0h2v-2h-2v2zm0-10v2h2V7h-2zm0 6h2v-2h-2v2z" />
                    </svg>
                  </div>
                  <span>Thông tin bài viết</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-blue-100/40">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Chất lượng</div>
                      <div className="text-sm font-semibold text-green-700">Đã kiểm duyệt y khoa</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-blue-100/40">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Thời gian đọc</div>
                      <div className="text-sm font-semibold text-blue-700">5 phút</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-blue-100/40">
                    <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-cyan-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Cập nhật</div>
                      <div className="text-sm font-semibold text-cyan-700">{date}</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.nav>

            {/* Enhanced Article Content with Accessibility */}
            <motion.div
              className={combineClasses(
                'prose prose-lg max-w-none leading-relaxed',
                'text-gray-800 prose-headings:text-gray-900',
                'prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline focus:prose-a:underline',
                'prose-strong:text-gray-900 prose-strong:font-semibold',
                'focus-within:outline-none'
              )}
              initial={prefersReducedMotion ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              dangerouslySetInnerHTML={{ __html: normalizeHtml(post.content?.rendered || '') }}
              itemProp="articleBody"
              role="article"
              aria-label="Nội dung bài viết chính"
              tabIndex={0}
            />
          </motion.header>
        </article>

        {/* Enhanced Call-to-Action Section with Accessibility */}
        <motion.section
          className={combineClasses(
            'mt-8 overflow-hidden',
            BORDER_RADIUS.cardLarge,
            SPACING.padding.cardLarge,
            'border border-green-200/60',
            'focus-within:ring-4 focus-within:ring-green-200/50'
          )}
          style={{
            background: `linear-gradient(135deg, ${getColorToken('secondary-50')} 0%, ${getColorToken('primary-50')} 100%)`,
          }}
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          aria-labelledby="consultation-heading"
          role="complementary"
          aria-describedby="consultation-description"
        >
          <div className="flex items-start gap-4">
            <div
              className={combineClasses(
                'w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0',
                'bg-gradient-to-br from-green-100 to-green-50 border border-green-200/50'
              )}
            >
              <svg className="w-7 h-7 text-green-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 id="consultation-heading" className={combineClasses(TYPOGRAPHY.cardTitle, 'mb-3')}>
                Cần tư vấn thêm từ chuyên gia?
              </h3>
              <p id="consultation-description" className={combineClasses(TYPOGRAPHY.body, 'text-gray-700 mb-5')}>
                Đội ngũ bác sĩ chuyên khoa của chúng tôi sẵn sàng tư vấn và hỗ trợ bạn 24/7 với dịch vụ tư vấn y tế
                chuyên nghiệp.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <motion.button
                  className={combineClasses(
                    'group relative overflow-hidden text-white font-semibold px-6 py-3',
                    'transition-all duration-300 ease-out',
                    BORDER_RADIUS.button,
                    TOUCH_TARGETS.interactive,
                    'focus:outline-none focus:ring-4 focus:ring-blue-200/50',
                    'shadow-lg hover:shadow-xl',
                    'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent',
                    'before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700'
                  )}
                  style={{
                    backgroundColor: getColorToken('primary'),
                    backgroundImage: `linear-gradient(135deg, ${getColorToken('primary')} 0%, ${getColorToken('primary-hover')} 100%)`,
                  }}
                  whileHover={
                    prefersReducedMotion
                      ? {}
                      : {
                          scale: 1.02,
                          y: -2,
                          boxShadow: '0 10px 25px rgba(37, 99, 235, 0.3)',
                        }
                  }
                  whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  aria-label="Đặt lịch tư vấn với bác sĩ chuyên khoa"
                  onFocus={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(37, 99, 235, 0.3)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.transform = '';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <motion.svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      whileHover={prefersReducedMotion ? {} : { rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </motion.svg>
                    Đặt lịch tư vấn
                  </span>
                </motion.button>

                <motion.button
                  className={combineClasses(
                    'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300',
                    'font-semibold px-6 py-3 transition-all duration-200',
                    BORDER_RADIUS.button,
                    TOUCH_TARGETS.interactive,
                    'focus:outline-none focus:ring-4 focus:ring-gray-200',
                    'transform hover:scale-105 active:scale-95'
                  )}
                  whileHover={prefersReducedMotion ? {} : { scale: 1.02, y: -1 }}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  aria-label="Gọi hotline tư vấn y tế"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    Gọi hotline: 1900 1234
                  </span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.section>
      </motion.main>
    </motion.div>
  );
}

export default NewsPage;
