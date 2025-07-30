import React from 'react';

// ===== SKELETON DEBUGGING UTILITIES =====

interface SkeletonDebugInfo {
  componentName: string;
  renderCount: number;
  lastRenderTime: number;
  isVisible: boolean;
  hasError: boolean;
  errorMessage?: string;
  props: Record<string, any>;
  domElement?: HTMLElement;
}

interface SkeletonHealthCheck {
  totalSkeletons: number;
  healthySkeletons: number;
  errorSkeletons: number;
  hiddenSkeletons: number;
  performanceIssues: string[];
  recommendations: string[];
}

class SkeletonDebugger {
  private skeletons: Map<string, SkeletonDebugInfo> = new Map();
  private isEnabled = false;

  constructor() {
    this.isEnabled = import.meta.env.DEV;
    if (this.isEnabled) {
      this.setupGlobalDebugger();
    }
  }

  /**
   * Setup global debugging interface
   */
  private setupGlobalDebugger() {
    if (typeof window !== 'undefined') {
      (window as any).__SKELETON_DEBUGGER__ = {
        getSkeletons: () => Array.from(this.skeletons.values()),
        getHealthCheck: () => this.performHealthCheck(),
        findSkeleton: (name: string) => this.skeletons.get(name),
        clearErrors: () => this.clearErrors(),
        enableVerboseLogging: () => this.enableVerboseLogging(),
        disableVerboseLogging: () => this.disableVerboseLogging(),
      };

      console.log('🏥 Skeleton Debugger initialized. Use window.__SKELETON_DEBUGGER__ for debugging.');
    }
  }

  /**
   * Register a skeleton component
   */
  registerSkeleton(componentName: string, props: Record<string, any>, domElement?: HTMLElement) {
    if (!this.isEnabled) return;

    const existing = this.skeletons.get(componentName);
    const now = performance.now();

    this.skeletons.set(componentName, {
      componentName,
      renderCount: existing ? existing.renderCount + 1 : 1,
      lastRenderTime: now,
      isVisible: this.isElementVisible(domElement),
      hasError: false,
      props,
      domElement,
    });

    this.logSkeletonEvent('registered', componentName, { props });
  }

  /**
   * Report skeleton error
   */
  reportError(componentName: string, error: Error) {
    if (!this.isEnabled) return;

    const skeleton = this.skeletons.get(componentName);
    if (skeleton) {
      skeleton.hasError = true;
      skeleton.errorMessage = error.message;
      this.skeletons.set(componentName, skeleton);
    }

    this.logSkeletonEvent('error', componentName, { error: error.message });
    console.error(`🏥 Skeleton Error [${componentName}]:`, error);
  }

  /**
   * Update skeleton visibility
   */
  updateVisibility(componentName: string, isVisible: boolean) {
    if (!this.isEnabled) return;

    const skeleton = this.skeletons.get(componentName);
    if (skeleton) {
      skeleton.isVisible = isVisible;
      this.skeletons.set(componentName, skeleton);
    }
  }

  /**
   * Perform comprehensive health check
   */
  performHealthCheck(): SkeletonHealthCheck {
    const skeletons = Array.from(this.skeletons.values());
    const totalSkeletons = skeletons.length;
    const healthySkeletons = skeletons.filter((s) => !s.hasError && s.isVisible).length;
    const errorSkeletons = skeletons.filter((s) => s.hasError).length;
    const hiddenSkeletons = skeletons.filter((s) => !s.isVisible).length;

    const performanceIssues: string[] = [];
    const recommendations: string[] = [];

    // Check for performance issues
    skeletons.forEach((skeleton) => {
      if (skeleton.renderCount > 10) {
        performanceIssues.push(`${skeleton.componentName} has ${skeleton.renderCount} renders`);
      }
    });

    // Check for error patterns
    if (errorSkeletons > 0) {
      performanceIssues.push(`${errorSkeletons} skeletons have errors`);
      recommendations.push('Check console for skeleton error details');
    }

    // Check for hidden skeletons
    if (hiddenSkeletons > totalSkeletons * 0.5) {
      performanceIssues.push('More than 50% of skeletons are hidden');
      recommendations.push('Consider lazy loading or virtualization');
    }

    // General recommendations
    if (totalSkeletons > 50) {
      recommendations.push('Consider implementing skeleton virtualization');
    }

    if (performanceIssues.length === 0) {
      recommendations.push('Skeleton performance is optimal');
    }

    return {
      totalSkeletons,
      healthySkeletons,
      errorSkeletons,
      hiddenSkeletons,
      performanceIssues,
      recommendations,
    };
  }

  /**
   * Clear all errors
   */
  clearErrors() {
    this.skeletons.forEach((skeleton) => {
      skeleton.hasError = false;
      skeleton.errorMessage = undefined;
    });
    console.log('🏥 All skeleton errors cleared');
  }

  /**
   * Enable verbose logging
   */
  enableVerboseLogging() {
    this.isEnabled = true;
    console.log('🏥 Skeleton verbose logging enabled');
  }

  /**
   * Disable verbose logging
   */
  disableVerboseLogging() {
    this.isEnabled = false;
    console.log('🏥 Skeleton verbose logging disabled');
  }

  /**
   * Check if DOM element is visible
   */
  private isElementVisible(element?: HTMLElement): boolean {
    if (!element) return false;

    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && rect.top < window.innerHeight && rect.bottom > 0;
  }

  /**
   * Log skeleton events
   */
  private logSkeletonEvent(event: string, componentName: string, data?: any) {
    if (!this.isEnabled) return;

    console.log(`🏥 Skeleton [${componentName}] ${event}:`, data);
  }

  /**
   * Generate debug report
   */
  generateDebugReport(): string {
    const healthCheck = this.performHealthCheck();
    const skeletons = Array.from(this.skeletons.values());

    let report = '🏥 SKELETON DEBUG REPORT\n';
    report += '========================\n\n';

    report += `Total Skeletons: ${healthCheck.totalSkeletons}\n`;
    report += `Healthy: ${healthCheck.healthySkeletons}\n`;
    report += `Errors: ${healthCheck.errorSkeletons}\n`;
    report += `Hidden: ${healthCheck.hiddenSkeletons}\n\n`;

    if (healthCheck.performanceIssues.length > 0) {
      report += 'PERFORMANCE ISSUES:\n';
      healthCheck.performanceIssues.forEach((issue) => {
        report += `- ${issue}\n`;
      });
      report += '\n';
    }

    if (healthCheck.recommendations.length > 0) {
      report += 'RECOMMENDATIONS:\n';
      healthCheck.recommendations.forEach((rec) => {
        report += `- ${rec}\n`;
      });
      report += '\n';
    }

    report += 'SKELETON DETAILS:\n';
    skeletons.forEach((skeleton) => {
      report += `- ${skeleton.componentName}: `;
      report += `renders=${skeleton.renderCount}, `;
      report += `visible=${skeleton.isVisible}, `;
      report += `error=${skeleton.hasError}`;
      if (skeleton.errorMessage) {
        report += ` (${skeleton.errorMessage})`;
      }
      report += '\n';
    });

    return report;
  }
}

// ===== SINGLETON INSTANCE =====

export const skeletonDebugger = new SkeletonDebugger();

// ===== UTILITY FUNCTIONS =====

/**
 * Debug hook for skeleton components
 */
export function useSkeletonDebug(componentName: string, props: Record<string, any>) {
  const elementRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    skeletonDebugger.registerSkeleton(componentName, props, elementRef.current || undefined);
  }, [componentName, props]);

  React.useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        skeletonDebugger.updateVisibility(componentName, entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [componentName]);

  const reportError = React.useCallback(
    (error: Error) => {
      skeletonDebugger.reportError(componentName, error);
    },
    [componentName]
  );

  return {
    elementRef,
    reportError,
  };
}

/**
 * Console command helpers
 */
export const skeletonDebugCommands = {
  /**
   * Get all skeleton information
   */
  list: () => {
    if (typeof window !== 'undefined' && (window as any).__SKELETON_DEBUGGER__) {
      return (window as any).__SKELETON_DEBUGGER__.getSkeletons();
    }
    return [];
  },

  /**
   * Get health check report
   */
  health: () => {
    if (typeof window !== 'undefined' && (window as any).__SKELETON_DEBUGGER__) {
      const health = (window as any).__SKELETON_DEBUGGER__.getHealthCheck();
      console.table(health);
      return health;
    }
    return null;
  },

  /**
   * Find specific skeleton
   */
  find: (name: string) => {
    if (typeof window !== 'undefined' && (window as any).__SKELETON_DEBUGGER__) {
      return (window as any).__SKELETON_DEBUGGER__.findSkeleton(name);
    }
    return null;
  },

  /**
   * Clear all errors
   */
  clearErrors: () => {
    if (typeof window !== 'undefined' && (window as any).__SKELETON_DEBUGGER__) {
      (window as any).__SKELETON_DEBUGGER__.clearErrors();
    }
  },

  /**
   * Generate full debug report
   */
  report: () => {
    const report = skeletonDebugger.generateDebugReport();
    console.log(report);
    return report;
  },
};

// Make debug commands available globally in development
if (import.meta.env.DEV && typeof window !== 'undefined') {
  (window as any).__SKELETON_DEBUG__ = skeletonDebugCommands;
  console.log('🏥 Skeleton debug commands available at window.__SKELETON_DEBUG__');
}

export default skeletonDebugger;
