/**
 * Lazy Loading Image Component
 * Optimized image loading for better performance
 */

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  fallback?: string;
  threshold?: number;
  className?: string;
  containerClassName?: string;
  showSkeleton?: boolean;
  aspectRatio?: 'square' | '16/9' | '4/3' | '3/2' | 'auto';
  onLoad?: () => void;
  onError?: () => void;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholder,
  fallback,
  threshold = 0.1,
  className,
  containerClassName,
  showSkeleton = true,
  aspectRatio = 'auto',
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  // Handle image error
  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Aspect ratio classes
  const aspectRatioClasses = {
    square: 'aspect-square',
    '16/9': 'aspect-video',
    '4/3': 'aspect-[4/3]',
    '3/2': 'aspect-[3/2]',
    auto: '',
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden bg-neutral-100',
        aspectRatio !== 'auto' && aspectRatioClasses[aspectRatio],
        containerClassName
      )}
    >
      {/* Skeleton loader */}
      {showSkeleton && !isLoaded && !hasError && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-[length:200%_100%] animate-shimmer" />
      )}

      {/* Placeholder image */}
      {placeholder && !isInView && !hasError && (
        <img
          src={placeholder}
          alt=""
          className={cn(
            'absolute inset-0 w-full h-full object-cover filter blur-sm scale-110',
            className
          )}
          aria-hidden="true"
        />
      )}

      {/* Main image */}
      {isInView && !hasError && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0',
            className
          )}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          {...props}
        />
      )}

      {/* Fallback image */}
      {hasError && fallback && (
        <img
          src={fallback}
          alt={alt}
          className={cn('w-full h-full object-cover', className)}
          {...props}
        />
      )}

      {/* Error state */}
      {hasError && !fallback && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
          <div className="text-center text-neutral-500">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">Không thể tải ảnh</p>
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {isInView && !isLoaded && !hasError && !showSkeleton && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
          <div className="w-8 h-8 border-2 border-medical-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

// Progressive Image Component with multiple sources
interface ProgressiveImageProps extends Omit<LazyImageProps, 'src'> {
  sources: Array<{
    src: string;
    media?: string;
    type?: string;
  }>;
  fallbackSrc: string;
}

export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  sources,
  fallbackSrc,
  alt,
  className,
  ...props
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>(fallbackSrc);

  useEffect(() => {
    // Find the best source based on media queries
    const findBestSource = () => {
      for (const source of sources) {
        if (source.media && window.matchMedia(source.media).matches) {
          return source.src;
        }
      }
      return sources[0]?.src || fallbackSrc;
    };

    setCurrentSrc(findBestSource());

    // Listen for media query changes
    const mediaQueries = sources
      .filter(source => source.media)
      .map(source => window.matchMedia(source.media!));

    const handleMediaChange = () => {
      setCurrentSrc(findBestSource());
    };

    mediaQueries.forEach(mq => mq.addEventListener('change', handleMediaChange));

    return () => {
      mediaQueries.forEach(mq => mq.removeEventListener('change', handleMediaChange));
    };
  }, [sources, fallbackSrc]);

  return (
    <LazyImage
      src={currentSrc}
      alt={alt}
      className={className}
      {...props}
    />
  );
};

// Image Gallery with lazy loading
interface ImageGalleryProps {
  images: Array<{
    src: string;
    alt: string;
    thumbnail?: string;
  }>;
  columns?: number;
  gap?: 'sm' | 'md' | 'lg';
  aspectRatio?: 'square' | '16/9' | '4/3' | '3/2';
  className?: string;
  onImageClick?: (index: number) => void;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  columns = 3,
  gap = 'md',
  aspectRatio = 'square',
  className,
  onImageClick,
}) => {
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  };

  return (
    <div
      className={cn(
        'grid',
        `grid-cols-${columns}`,
        gapClasses[gap],
        className
      )}
    >
      {images.map((image, index) => (
        <div
          key={index}
          className={cn(
            'cursor-pointer transition-transform duration-200 hover:scale-105',
            onImageClick && 'hover:shadow-card-hover'
          )}
          onClick={() => onImageClick?.(index)}
        >
          <LazyImage
            src={image.src}
            alt={image.alt}
            placeholder={image.thumbnail}
            aspectRatio={aspectRatio}
            className="rounded-medical"
          />
        </div>
      ))}
    </div>
  );
};

export default LazyImage;
