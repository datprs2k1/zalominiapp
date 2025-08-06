/**
 * Enhanced Optimized Image Component
 * Provides lazy loading, responsive images, and performance optimization
 */

import React, { useRef, useEffect, useState, forwardRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useMobilePerformance } from '@/utils/mobile-performance-optimizer';
import { useEnhancedMobile } from '@/hooks/use-enhanced-mobile';

// Types
interface EnhancedOptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  lazy?: boolean;
  responsive?: boolean;
  placeholder?: string;
  blurDataURL?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

// Enhanced Optimized Image Component
export const EnhancedOptimizedImage = forwardRef<HTMLImageElement, EnhancedOptimizedImageProps>(
  (
    {
      src,
      alt,
      width,
      height,
      className = '',
      style,
      lazy = true,
      responsive = true,
      placeholder,
      blurDataURL,
      priority = false,
      quality = 80,
      sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
      onLoad,
      onError,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const imageRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { optimizer, observeElement, unobserveElement, preloadImage } = useMobilePerformance();
    const { deviceInfo, getPlatformClasses } = useEnhancedMobile();
    const prefersReducedMotion = useReducedMotion();

    const [isLoaded, setIsLoaded] = useState(false);
    const [isError, setIsError] = useState(false);
    const [currentSrc, setCurrentSrc] = useState(placeholder || blurDataURL || '');

    // Generate optimized source URLs
    const generateSrcSet = () => {
      if (!responsive) return undefined;

      const breakpoints = [640, 1024, 1920];
      return breakpoints
        .map((width) => {
          const optimizedSrc = getOptimizedSrc(src, { width, quality });
          return `${optimizedSrc} ${width}w`;
        })
        .join(', ');
    };

    // Get optimized source URL
    const getOptimizedSrc = (originalSrc: string, options: { width?: number; quality?: number } = {}) => {
      const url = new URL(originalSrc, window.location.origin);
      
      if (options.width) {
        url.searchParams.set('w', options.width.toString());
      }
      
      url.searchParams.set('q', (options.quality || quality).toString());
      
      // Use WebP if supported
      if (supportsWebP()) {
        url.searchParams.set('f', 'webp');
      }

      return url.toString();
    };

    // Check WebP support
    const supportsWebP = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    };

    // Handle image load
    const handleLoad = () => {
      setIsLoaded(true);
      setIsError(false);
      onLoad?.();
    };

    // Handle image error
    const handleError = () => {
      setIsError(true);
      setIsLoaded(false);
      onError?.();
    };

    // Load image
    const loadImage = async () => {
      try {
        const optimizedSrc = getOptimizedSrc(src, { quality });
        await preloadImage(optimizedSrc);
        setCurrentSrc(optimizedSrc);
      } catch (error) {
        console.error('Failed to load optimized image:', error);
        setCurrentSrc(src); // Fallback to original
      }
    };

    // Setup lazy loading
    useEffect(() => {
      if (!lazy || priority) {
        loadImage();
        return;
      }

      if (containerRef.current) {
        observeElement(containerRef.current);
      }

      return () => {
        if (containerRef.current) {
          unobserveElement(containerRef.current);
        }
      };
    }, [lazy, priority, src]);

    // Handle intersection (for lazy loading)
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              loadImage();
              observer.unobserve(container);
            }
          });
        },
        {
          rootMargin: '50px',
          threshold: 0.1,
        }
      );

      if (lazy && !priority) {
        observer.observe(container);
      }

      return () => {
        observer.disconnect();
      };
    }, [lazy, priority]);

    // Get responsive dimensions
    const getResponsiveDimensions = () => {
      if (!responsive || !width || !height) {
        return { width, height };
      }

      const { screenSize } = deviceInfo;
      const scaleFactor = {
        small: 0.8,
        medium: 1.0,
        large: 1.2,
      };

      return {
        width: width * scaleFactor[screenSize],
        height: height * scaleFactor[screenSize],
      };
    };

    const dimensions = getResponsiveDimensions();

    // Animation variants
    const imageVariants = {
      hidden: { opacity: 0, scale: 1.1 },
      visible: { opacity: 1, scale: 1 },
    };

    const placeholderVariants = {
      visible: { opacity: 1 },
      hidden: { opacity: 0 },
    };

    return (
      <div
        ref={containerRef}
        className={getPlatformClasses(`enhanced-optimized-image-container ${className}`)}
        style={{
          position: 'relative',
          overflow: 'hidden',
          width: dimensions.width,
          height: dimensions.height,
          ...style,
        }}
        {...props}
      >
        {/* Placeholder/Blur image */}
        {(placeholder || blurDataURL) && !isLoaded && (
          <motion.img
            className="enhanced-optimized-image-placeholder"
            src={placeholder || blurDataURL}
            alt=""
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: blurDataURL ? 'blur(10px)' : 'none',
            }}
            variants={prefersReducedMotion ? {} : placeholderVariants}
            initial="visible"
            animate={isLoaded ? "hidden" : "visible"}
            transition={{ duration: 0.3 }}
            aria-hidden="true"
          />
        )}

        {/* Loading skeleton */}
        {!isLoaded && !placeholder && !blurDataURL && (
          <div
            className="enhanced-optimized-image-skeleton"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
            }}
          />
        )}

        {/* Main image */}
        <motion.img
          ref={(node) => {
            imageRef.current = node;
            if (ref) {
              if (typeof ref === 'function') {
                ref(node);
              } else {
                ref.current = node;
              }
            }
          }}
          className={`enhanced-optimized-image ${isLoaded ? 'loaded' : ''} ${isError ? 'error' : ''}`}
          src={currentSrc}
          srcSet={responsive ? generateSrcSet() : undefined}
          sizes={responsive ? sizes : undefined}
          alt={alt}
          width={dimensions.width}
          height={dimensions.height}
          onLoad={handleLoad}
          onError={handleError}
          loading={lazy && !priority ? 'lazy' : 'eager'}
          decoding="async"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
          variants={prefersReducedMotion ? {} : imageVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
        />

        {/* Error state */}
        {isError && (
          <div
            className="enhanced-optimized-image-error"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f5f5f5',
              color: '#666',
              fontSize: '14px',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>📷</div>
              <div>Image failed to load</div>
            </div>
          </div>
        )}

        {/* CSS for shimmer animation */}
        <style jsx>{`
          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
        `}</style>
      </div>
    );
  }
);

EnhancedOptimizedImage.displayName = 'EnhancedOptimizedImage';

export default EnhancedOptimizedImage;
