/**
 * Mobile Performance Optimizer
 * Advanced performance optimizations for mobile devices
 */

// Types
interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  networkSpeed: 'slow' | 'fast';
  deviceType: 'low-end' | 'mid-range' | 'high-end';
}

interface OptimizationConfig {
  enableLazyLoading: boolean;
  enableImageOptimization: boolean;
  enableCodeSplitting: boolean;
  enableServiceWorker: boolean;
  maxImageSize: number;
  compressionQuality: number;
}

// Default configuration
const DEFAULT_CONFIG: OptimizationConfig = {
  enableLazyLoading: true,
  enableImageOptimization: true,
  enableCodeSplitting: true,
  enableServiceWorker: true,
  maxImageSize: 1920,
  compressionQuality: 0.8,
};

// Mobile Performance Optimizer Class
export class MobilePerformanceOptimizer {
  private config: OptimizationConfig;
  private metrics: PerformanceMetrics;
  private observer: IntersectionObserver | null = null;
  private imageCache: Map<string, HTMLImageElement> = new Map();

  constructor(config: Partial<OptimizationConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.metrics = this.detectDeviceCapabilities();
    this.initialize();
  }

  // Initialize optimizer
  private initialize() {
    this.setupLazyLoading();
    this.setupImageOptimization();
    this.setupMemoryManagement();
    this.setupNetworkOptimization();
  }

  // Detect device capabilities
  private detectDeviceCapabilities(): PerformanceMetrics {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    // Detect network speed
    const networkSpeed = connection?.effectiveType === 'slow-2g' || connection?.effectiveType === '2g' ? 'slow' : 'fast';
    
    // Detect device type based on memory and cores
    const memory = (navigator as any).deviceMemory || 4;
    const cores = navigator.hardwareConcurrency || 4;
    
    let deviceType: 'low-end' | 'mid-range' | 'high-end' = 'mid-range';
    if (memory <= 2 || cores <= 2) {
      deviceType = 'low-end';
    } else if (memory >= 8 && cores >= 8) {
      deviceType = 'high-end';
    }

    return {
      loadTime: 0,
      renderTime: 0,
      memoryUsage: (performance as any).memory?.usedJSHeapSize || 0,
      networkSpeed,
      deviceType,
    };
  }

  // Setup lazy loading
  private setupLazyLoading() {
    if (!this.config.enableLazyLoading || !('IntersectionObserver' in window)) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            this.loadElement(element);
            this.observer?.unobserve(element);
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    );
  }

  // Load element (image, component, etc.)
  private loadElement(element: HTMLElement) {
    if (element.tagName === 'IMG') {
      this.loadImage(element as HTMLImageElement);
    } else if (element.dataset.component) {
      this.loadComponent(element);
    }
  }

  // Load image with optimization
  private loadImage(img: HTMLImageElement) {
    const src = img.dataset.src;
    if (!src) return;

    // Check cache first
    if (this.imageCache.has(src)) {
      const cachedImg = this.imageCache.get(src)!;
      img.src = cachedImg.src;
      img.classList.add('loaded');
      return;
    }

    // Create optimized image
    const optimizedSrc = this.getOptimizedImageSrc(src);
    
    const tempImg = new Image();
    tempImg.onload = () => {
      img.src = optimizedSrc;
      img.classList.add('loaded');
      this.imageCache.set(src, tempImg);
    };
    tempImg.onerror = () => {
      // Fallback to original image
      img.src = src;
      img.classList.add('loaded');
    };
    tempImg.src = optimizedSrc;
  }

  // Get optimized image source
  private getOptimizedImageSrc(src: string): string {
    if (!this.config.enableImageOptimization) return src;

    const { deviceType, networkSpeed } = this.metrics;
    
    // Adjust quality based on device and network
    let quality = this.config.compressionQuality;
    let maxWidth = this.config.maxImageSize;

    if (deviceType === 'low-end' || networkSpeed === 'slow') {
      quality = 0.6;
      maxWidth = 1280;
    } else if (deviceType === 'high-end' && networkSpeed === 'fast') {
      quality = 0.9;
      maxWidth = 2560;
    }

    // Add optimization parameters (this would work with a CDN or image service)
    const url = new URL(src, window.location.origin);
    url.searchParams.set('w', maxWidth.toString());
    url.searchParams.set('q', Math.round(quality * 100).toString());
    url.searchParams.set('f', 'webp');

    return url.toString();
  }

  // Load component dynamically
  private async loadComponent(element: HTMLElement) {
    const componentName = element.dataset.component;
    if (!componentName) return;

    try {
      // Dynamic import based on component name
      const module = await import(`../components/${componentName}.tsx`);
      const Component = module.default;
      
      // This would require a React renderer setup
      // For now, just mark as loaded
      element.classList.add('loaded');
    } catch (error) {
      console.error(`Failed to load component: ${componentName}`, error);
    }
  }

  // Setup image optimization
  private setupImageOptimization() {
    if (!this.config.enableImageOptimization) return;

    // Convert images to WebP if supported
    if (this.supportsWebP()) {
      this.convertImagesToWebP();
    }

    // Setup responsive images
    this.setupResponsiveImages();
  }

  // Check WebP support
  private supportsWebP(): boolean {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  // Convert images to WebP
  private convertImagesToWebP() {
    const images = document.querySelectorAll('img[src$=".jpg"], img[src$=".jpeg"], img[src$=".png"]');
    images.forEach((img) => {
      const htmlImg = img as HTMLImageElement;
      const webpSrc = htmlImg.src.replace(/\.(jpg|jpeg|png)$/, '.webp');
      
      // Test if WebP version exists
      const testImg = new Image();
      testImg.onload = () => {
        htmlImg.src = webpSrc;
      };
      testImg.src = webpSrc;
    });
  }

  // Setup responsive images
  private setupResponsiveImages() {
    const images = document.querySelectorAll('img[data-responsive]');
    images.forEach((img) => {
      const htmlImg = img as HTMLImageElement;
      this.makeImageResponsive(htmlImg);
    });
  }

  // Make image responsive
  private makeImageResponsive(img: HTMLImageElement) {
    const baseSrc = img.dataset.src || img.src;
    const sizes = img.dataset.sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
    
    // Generate srcset for different screen densities
    const srcset = [
      `${this.getOptimizedImageSrc(baseSrc)}?w=640 640w`,
      `${this.getOptimizedImageSrc(baseSrc)}?w=1024 1024w`,
      `${this.getOptimizedImageSrc(baseSrc)}?w=1920 1920w`,
    ].join(', ');

    img.srcset = srcset;
    img.sizes = sizes;
  }

  // Setup memory management
  private setupMemoryManagement() {
    // Clean up image cache periodically
    setInterval(() => {
      if (this.imageCache.size > 50) {
        // Remove oldest entries
        const entries = Array.from(this.imageCache.entries());
        const toRemove = entries.slice(0, 10);
        toRemove.forEach(([key]) => {
          this.imageCache.delete(key);
        });
      }
    }, 60000); // Every minute

    // Monitor memory usage
    if ('memory' in performance) {
      setInterval(() => {
        const memInfo = (performance as any).memory;
        this.metrics.memoryUsage = memInfo.usedJSHeapSize;
        
        // Trigger garbage collection if memory usage is high
        if (memInfo.usedJSHeapSize > memInfo.totalJSHeapSize * 0.8) {
          this.triggerGarbageCollection();
        }
      }, 30000); // Every 30 seconds
    }
  }

  // Trigger garbage collection
  private triggerGarbageCollection() {
    // Clear caches
    this.imageCache.clear();
    
    // Force garbage collection (if available)
    if ('gc' in window) {
      (window as any).gc();
    }
  }

  // Setup network optimization
  private setupNetworkOptimization() {
    // Preload critical resources
    this.preloadCriticalResources();
    
    // Setup service worker for caching
    if (this.config.enableServiceWorker && 'serviceWorker' in navigator) {
      this.setupServiceWorker();
    }
  }

  // Preload critical resources
  private preloadCriticalResources() {
    const criticalResources = [
      '/fonts/inter.woff2',
      '/icons/medical-icons.svg',
    ];

    criticalResources.forEach((resource) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = resource.endsWith('.woff2') ? 'font' : 'image';
      if (link.as === 'font') {
        link.crossOrigin = 'anonymous';
      }
      document.head.appendChild(link);
    });
  }

  // Setup service worker
  private async setupServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  // Public methods
  public observeElement(element: HTMLElement) {
    if (this.observer) {
      this.observer.observe(element);
    }
  }

  public unobserveElement(element: HTMLElement) {
    if (this.observer) {
      this.observer.unobserve(element);
    }
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public updateConfig(newConfig: Partial<OptimizationConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  public preloadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      if (this.imageCache.has(src)) {
        resolve(this.imageCache.get(src)!);
        return;
      }

      const img = new Image();
      img.onload = () => {
        this.imageCache.set(src, img);
        resolve(img);
      };
      img.onerror = reject;
      img.src = this.getOptimizedImageSrc(src);
    });
  }

  public clearCache() {
    this.imageCache.clear();
  }

  public destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.clearCache();
  }
}

// Create global instance
export const mobilePerformanceOptimizer = new MobilePerformanceOptimizer();

// React hook for performance optimization
export const useMobilePerformance = () => {
  return {
    optimizer: mobilePerformanceOptimizer,
    observeElement: mobilePerformanceOptimizer.observeElement.bind(mobilePerformanceOptimizer),
    unobserveElement: mobilePerformanceOptimizer.unobserveElement.bind(mobilePerformanceOptimizer),
    preloadImage: mobilePerformanceOptimizer.preloadImage.bind(mobilePerformanceOptimizer),
    getMetrics: mobilePerformanceOptimizer.getMetrics.bind(mobilePerformanceOptimizer),
  };
};
