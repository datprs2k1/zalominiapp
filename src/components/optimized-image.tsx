import { useState, useRef, useEffect } from 'react';
import { BORDER_RADIUS, SHADOWS, combineClasses } from '@/styles/medical-design-system';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
  sizes?: string;
  quality?: number;
  medicalContext?: 'doctor' | 'department' | 'service' | 'general';
}

export default function OptimizedImage({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  placeholder = 'blur',
  blurDataURL,
  onLoad,
  onError,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 75,
  medicalContext = 'general',
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before the image enters viewport
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  // Medical-themed placeholder based on context
  const getMedicalPlaceholder = () => {
    const baseClasses = combineClasses(
      'flex items-center justify-center bg-gray-100 text-gray-400',
      BORDER_RADIUS.card,
      className
    );

    const icons = {
      doctor: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 4L13.5 7H10.5L9 4L3 7V9H21ZM21 10H3V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V10Z"/>
        </svg>
      ),
      department: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 7V10H22V7L12 2ZM4 11V19C4 20.1 4.9 21 6 21H18C19.1 21 20 20.1 20 19V11H4ZM7 13H9V17H7V13ZM11 13H13V17H11V13ZM15 13H17V17H15V13Z"/>
        </svg>
      ),
      service: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM17 12H15V10H17V12ZM13 12H11V10H13V12ZM9 12H7V10H9V12ZM17 16H15V14H17V16ZM13 16H11V14H13V16ZM9 16H7V14H9V16Z"/>
        </svg>
      ),
      general: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.5L14.5 12L19 18H5L8.5 13.5Z"/>
        </svg>
      ),
    };

    return (
      <div className={baseClasses} style={{ width, height }}>
        {icons[medicalContext]}
      </div>
    );
  };

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

  // Generate optimized src with quality and format
  const getOptimizedSrc = (originalSrc: string) => {
    // If it's already a data URL or external URL, return as is
    if (originalSrc.startsWith('data:') || originalSrc.startsWith('http')) {
      return originalSrc;
    }

    // For local images, you could implement WebP conversion or other optimizations
    return originalSrc;
  };

  // Show error placeholder if image failed to load
  if (hasError) {
    return getMedicalPlaceholder();
  }

  // Show placeholder while not in view (for lazy loading)
  if (!isInView) {
    return (
      <div ref={imgRef} className={combineClasses('bg-gray-100', BORDER_RADIUS.card, className)} style={{ width, height }}>
        {placeholder === 'blur' && getMedicalPlaceholder()}
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden" style={{ width, height }}>
      {/* Blur placeholder */}
      {!isLoaded && placeholder === 'blur' && (
        <div className={combineClasses(
          'absolute inset-0 bg-gray-100 animate-pulse',
          BORDER_RADIUS.card
        )}>
          {getMedicalPlaceholder()}
        </div>
      )}

      {/* Actual image */}
      <img
        ref={imgRef}
        src={getOptimizedSrc(src)}
        alt={alt}
        className={combineClasses(
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          BORDER_RADIUS.card,
          className
        )}
        style={{ width, height }}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        sizes={sizes}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
}

// Medical-specific image presets
export const MedicalImagePresets = {
  doctorAvatar: {
    width: 64,
    height: 64,
    medicalContext: 'doctor' as const,
    className: 'rounded-full object-cover',
  },
  departmentCard: {
    width: 280,
    height: 160,
    medicalContext: 'department' as const,
    className: 'object-cover',
  },
  serviceCard: {
    width: 280,
    height: 200,
    medicalContext: 'service' as const,
    className: 'object-cover',
  },
  heroImage: {
    priority: true,
    medicalContext: 'general' as const,
    className: 'object-cover w-full h-full',
  },
};
