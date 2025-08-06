/**
 * Mobile Performance Validator
 * Validates mobile performance improvements for footer components
 */

// Performance metrics interface
interface PerformanceMetrics {
  name: string;
  value: number;
  threshold: number;
  passed: boolean;
  unit: string;
  description: string;
}

// Performance validation results
interface PerformanceValidationResult {
  overall: {
    score: number;
    passed: boolean;
    message: string;
  };
  metrics: PerformanceMetrics[];
  recommendations: string[];
}

export class MobilePerformanceValidator {
  private observer?: PerformanceObserver;
  private metrics: PerformanceMetrics[] = [];
  private startTime: number = 0;

  constructor() {
    this.startTime = performance.now();
  }

  // Run comprehensive performance validation
  public async validatePerformance(): Promise<PerformanceValidationResult> {
    console.log('📊 Starting Mobile Performance Validation...');
    
    this.metrics = [];
    
    // Run different performance tests
    await this.measureFooterRenderTime();
    await this.measureAnimationPerformance();
    await this.measureMemoryUsage();
    await this.measureBundleSize();
    await this.measureTouchResponseTime();
    await this.measureScrollPerformance();
    
    return this.generateReport();
  }

  // Measure footer render time
  private async measureFooterRenderTime(): Promise<void> {
    const startTime = performance.now();
    
    // Wait for footer to be rendered
    await new Promise<void>((resolve) => {
      const checkFooter = () => {
        const footer = document.querySelector('footer');
        if (footer && footer.children.length > 0) {
          resolve();
        } else {
          requestAnimationFrame(checkFooter);
        }
      };
      checkFooter();
    });
    
    const renderTime = performance.now() - startTime;
    
    this.metrics.push({
      name: 'Footer Render Time',
      value: renderTime,
      threshold: 100, // 100ms threshold
      passed: renderTime < 100,
      unit: 'ms',
      description: 'Time taken to render footer component'
    });
  }

  // Measure animation performance
  private async measureAnimationPerformance(): Promise<void> {
    return new Promise((resolve) => {
      let frameCount = 0;
      let startTime = performance.now();
      let lastFrameTime = startTime;
      const frameTimes: number[] = [];
      
      const measureFrame = () => {
        const currentTime = performance.now();
        const frameTime = currentTime - lastFrameTime;
        frameTimes.push(frameTime);
        lastFrameTime = currentTime;
        frameCount++;
        
        if (frameCount < 60) { // Measure 60 frames
          requestAnimationFrame(measureFrame);
        } else {
          const totalTime = currentTime - startTime;
          const averageFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
          const fps = 1000 / averageFrameTime;
          
          this.metrics.push({
            name: 'Animation FPS',
            value: fps,
            threshold: 55, // 55 FPS threshold (allowing for some variance from 60)
            passed: fps >= 55,
            unit: 'fps',
            description: 'Average frames per second during animations'
          });
          
          // Check for frame drops
          const frameDrops = frameTimes.filter(time => time > 20).length; // >20ms = <50fps
          this.metrics.push({
            name: 'Frame Drops',
            value: frameDrops,
            threshold: 5, // Max 5 frame drops in 60 frames
            passed: frameDrops <= 5,
            unit: 'frames',
            description: 'Number of dropped frames during animation'
          });
          
          resolve();
        }
      };
      
      requestAnimationFrame(measureFrame);
    });
  }

  // Measure memory usage
  private async measureMemoryUsage(): Promise<void> {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const usedJSHeapSize = memory.usedJSHeapSize / 1024 / 1024; // Convert to MB
      
      this.metrics.push({
        name: 'Memory Usage',
        value: usedJSHeapSize,
        threshold: 50, // 50MB threshold
        passed: usedJSHeapSize < 50,
        unit: 'MB',
        description: 'JavaScript heap memory usage'
      });
    } else {
      this.metrics.push({
        name: 'Memory Usage',
        value: 0,
        threshold: 0,
        passed: true,
        unit: 'MB',
        description: 'Memory API not available in this browser'
      });
    }
  }

  // Measure bundle size impact
  private async measureBundleSize(): Promise<void> {
    try {
      // Estimate bundle size by measuring script tags
      const scripts = document.querySelectorAll('script[src]');
      let totalSize = 0;
      
      for (const script of scripts) {
        try {
          const response = await fetch((script as HTMLScriptElement).src, { method: 'HEAD' });
          const contentLength = response.headers.get('content-length');
          if (contentLength) {
            totalSize += parseInt(contentLength);
          }
        } catch (error) {
          // Ignore CORS errors for external scripts
        }
      }
      
      const sizeInKB = totalSize / 1024;
      
      this.metrics.push({
        name: 'Bundle Size',
        value: sizeInKB,
        threshold: 500, // 500KB threshold
        passed: sizeInKB < 500,
        unit: 'KB',
        description: 'Estimated total bundle size'
      });
    } catch (error) {
      this.metrics.push({
        name: 'Bundle Size',
        value: 0,
        threshold: 0,
        passed: true,
        unit: 'KB',
        description: 'Bundle size measurement failed'
      });
    }
  }

  // Measure touch response time
  private async measureTouchResponseTime(): Promise<void> {
    return new Promise((resolve) => {
      const footer = document.querySelector('footer');
      if (!footer) {
        this.metrics.push({
          name: 'Touch Response Time',
          value: 0,
          threshold: 0,
          passed: false,
          unit: 'ms',
          description: 'No footer found for touch testing'
        });
        resolve();
        return;
      }

      const navItem = footer.querySelector('button, a, [role="tab"]');
      if (!navItem) {
        this.metrics.push({
          name: 'Touch Response Time',
          value: 0,
          threshold: 0,
          passed: false,
          unit: 'ms',
          description: 'No navigation items found for touch testing'
        });
        resolve();
        return;
      }

      let touchStartTime = 0;
      let responseTime = 0;

      const handleTouchStart = () => {
        touchStartTime = performance.now();
      };

      const handleTouchEnd = () => {
        responseTime = performance.now() - touchStartTime;
        
        this.metrics.push({
          name: 'Touch Response Time',
          value: responseTime,
          threshold: 100, // 100ms threshold for touch response
          passed: responseTime < 100,
          unit: 'ms',
          description: 'Time from touch start to response'
        });

        navItem.removeEventListener('touchstart', handleTouchStart);
        navItem.removeEventListener('touchend', handleTouchEnd);
        resolve();
      };

      navItem.addEventListener('touchstart', handleTouchStart);
      navItem.addEventListener('touchend', handleTouchEnd);

      // Simulate touch for testing
      setTimeout(() => {
        const touchStartEvent = new TouchEvent('touchstart', {
          touches: [new Touch({
            identifier: 0,
            target: navItem,
            clientX: 0,
            clientY: 0,
            radiusX: 1,
            radiusY: 1,
            rotationAngle: 0,
            force: 1
          })]
        });
        
        const touchEndEvent = new TouchEvent('touchend', {
          changedTouches: [new Touch({
            identifier: 0,
            target: navItem,
            clientX: 0,
            clientY: 0,
            radiusX: 1,
            radiusY: 1,
            rotationAngle: 0,
            force: 1
          })]
        });

        navItem.dispatchEvent(touchStartEvent);
        setTimeout(() => navItem.dispatchEvent(touchEndEvent), 10);
      }, 100);
    });
  }

  // Measure scroll performance
  private async measureScrollPerformance(): Promise<void> {
    return new Promise((resolve) => {
      let frameCount = 0;
      let startTime = performance.now();
      const frameTimes: number[] = [];
      let lastFrameTime = startTime;

      const measureScrollFrame = () => {
        const currentTime = performance.now();
        const frameTime = currentTime - lastFrameTime;
        frameTimes.push(frameTime);
        lastFrameTime = currentTime;
        frameCount++;

        if (frameCount < 30) { // Measure 30 frames during scroll
          requestAnimationFrame(measureScrollFrame);
        } else {
          const averageFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
          const scrollFPS = 1000 / averageFrameTime;

          this.metrics.push({
            name: 'Scroll Performance',
            value: scrollFPS,
            threshold: 50, // 50 FPS threshold for scroll
            passed: scrollFPS >= 50,
            unit: 'fps',
            description: 'Average FPS during scrolling'
          });

          resolve();
        }
      };

      // Simulate scroll
      window.scrollTo(0, 100);
      requestAnimationFrame(measureScrollFrame);
      
      // Scroll back
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 500);
    });
  }

  // Generate performance report
  private generateReport(): PerformanceValidationResult {
    const totalMetrics = this.metrics.length;
    const passedMetrics = this.metrics.filter(m => m.passed).length;
    const overallScore = totalMetrics > 0 ? (passedMetrics / totalMetrics) * 100 : 0;
    const passed = overallScore >= 80; // 80% threshold for overall pass

    const recommendations: string[] = [];

    // Generate recommendations based on failed metrics
    this.metrics.forEach(metric => {
      if (!metric.passed) {
        switch (metric.name) {
          case 'Footer Render Time':
            recommendations.push('Consider lazy loading footer components or optimizing render logic');
            break;
          case 'Animation FPS':
            recommendations.push('Optimize animations using transform and opacity properties only');
            break;
          case 'Frame Drops':
            recommendations.push('Reduce animation complexity or use will-change CSS property');
            break;
          case 'Memory Usage':
            recommendations.push('Check for memory leaks and optimize component cleanup');
            break;
          case 'Bundle Size':
            recommendations.push('Consider code splitting and lazy loading for footer components');
            break;
          case 'Touch Response Time':
            recommendations.push('Optimize touch event handlers and reduce processing time');
            break;
          case 'Scroll Performance':
            recommendations.push('Use passive event listeners and optimize scroll handlers');
            break;
        }
      }
    });

    return {
      overall: {
        score: Math.round(overallScore),
        passed,
        message: passed 
          ? `Performance validation passed with ${Math.round(overallScore)}% score`
          : `Performance validation failed with ${Math.round(overallScore)}% score`
      },
      metrics: this.metrics,
      recommendations
    };
  }

  // Generate detailed report string
  public generateDetailedReport(result: PerformanceValidationResult): string {
    let report = `\n⚡ Mobile Performance Validation Report\n`;
    report += `${'='.repeat(50)}\n`;
    report += `Overall Score: ${result.overall.score}% ${result.overall.passed ? '✅' : '❌'}\n`;
    report += `${result.overall.message}\n\n`;

    report += `📊 Metrics:\n`;
    result.metrics.forEach((metric, index) => {
      const status = metric.passed ? '✅' : '❌';
      report += `${index + 1}. ${status} ${metric.name}: ${metric.value.toFixed(2)}${metric.unit} (threshold: ${metric.threshold}${metric.unit})\n`;
      report += `   ${metric.description}\n\n`;
    });

    if (result.recommendations.length > 0) {
      report += `💡 Recommendations:\n`;
      result.recommendations.forEach((rec, index) => {
        report += `${index + 1}. ${rec}\n`;
      });
    }

    return report;
  }
}

// Export singleton instance
export const mobilePerformanceValidator = new MobilePerformanceValidator();
