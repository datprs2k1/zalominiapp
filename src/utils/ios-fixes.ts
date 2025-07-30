/**
 * iOS-Specific Fixes and Optimizations
 *
 * This utility provides comprehensive iOS Safari fixes for touch events,
 * scrolling behavior, form inputs, and button interactions.
 *
 * Key Issues Addressed:
 * 1. Touch events not working correctly on iOS Safari
 * 2. Form inputs not focusing or accepting input on iOS devices
 * 3. Buttons or interactive elements not responding to taps
 * 4. Scroll behavior problems on iOS
 * 5. iOS-specific CSS and JavaScript compatibility issues
 */

/**
 * Detects if the current device is running iOS
 * Includes detection for iPad Pro with desktop user agent
 */
export const isIOSDevice = (): boolean => {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
};

/**
 * Detects if the current browser is iOS Safari
 */
export const isIOSSafari = (): boolean => {
  return isIOSDevice() && /Safari/.test(navigator.userAgent) && !/CriOS|FxiOS/.test(navigator.userAgent);
};

/**
 * Fixes iOS form input issues
 * - Prevents zoom on focus
 * - Ensures proper keyboard behavior
 * - Fixes input focus and blur events
 */
export const fixIOSFormInputs = (): void => {
  if (!isIOSDevice()) return;

  // Prevent zoom on input focus
  const inputs = document.querySelectorAll('input, textarea, select');
  inputs.forEach((input) => {
    const element = input as HTMLElement;

    // Ensure minimum font size to prevent zoom
    if (element.style.fontSize === '' || parseInt(element.style.fontSize) < 16) {
      element.style.fontSize = '16px';
    }

    // Optimize touch interactions
    element.style.touchAction = 'manipulation';

    // Remove iOS default styling that can interfere
    element.style.webkitAppearance = 'none';
    element.style.appearance = 'none';

    // Prevent callouts and text selection issues
    element.style.webkitTouchCallout = 'none';
  });

  // Fix viewport meta tag to prevent zoom
  let viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) {
    viewport = document.createElement('meta');
    viewport.setAttribute('name', 'viewport');
    document.head.appendChild(viewport);
  }

  viewport.setAttribute(
    'content',
    'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
  );
};

/**
 * Fixes iOS button and interactive element issues
 * - Ensures proper touch targets
 * - Fixes tap delays and responsiveness
 * - Optimizes touch feedback
 */
export const fixIOSButtons = (): void => {
  if (!isIOSDevice()) return;

  const interactiveElements = document.querySelectorAll('button, a, [role="button"], [tabindex]');

  interactiveElements.forEach((element) => {
    const htmlElement = element as HTMLElement;

    // Ensure minimum touch target size (44px for iOS)
    const computedStyle = window.getComputedStyle(htmlElement);
    const minSize = 44;

    if (parseInt(computedStyle.minHeight) < minSize) {
      htmlElement.style.minHeight = `${minSize}px`;
    }
    if (parseInt(computedStyle.minWidth) < minSize) {
      htmlElement.style.minWidth = `${minSize}px`;
    }

    // Optimize touch interactions
    htmlElement.style.touchAction = 'manipulation';

    // Remove tap highlight color (we'll use our own feedback)
    htmlElement.style.webkitTapHighlightColor = 'transparent';

    // Prevent callouts on long press
    htmlElement.style.webkitTouchCallout = 'none';

    // Ensure proper cursor for interactive elements
    if (htmlElement.style.cursor === '') {
      htmlElement.style.cursor = 'pointer';
    }
  });
};

/**
 * Fixes iOS scroll behavior issues
 * - Enables momentum scrolling
 * - Fixes scroll blocking by fixed elements
 * - Optimizes overscroll behavior
 */
export const fixIOSScrolling = (): void => {
  if (!isIOSDevice()) return;

  // Enable momentum scrolling on body
  document.body.style.webkitOverflowScrolling = 'touch';
  document.body.style.overscrollBehaviorX = 'none';
  document.body.style.overscrollBehaviorY = 'auto';
  document.body.style.touchAction = 'pan-y';

  // Fix scrollable containers
  const scrollableElements = document.querySelectorAll(
    '.overflow-auto, .overflow-y-auto, .overflow-scroll, [style*="overflow: auto"], [style*="overflow-y: auto"]'
  );

  scrollableElements.forEach((element) => {
    const htmlElement = element as HTMLElement;
    htmlElement.style.webkitOverflowScrolling = 'touch';
    htmlElement.style.overscrollBehavior = 'contain';
    htmlElement.style.touchAction = 'pan-y';
  });

  // Fix main content area
  const main = document.querySelector('main');
  if (main) {
    main.style.webkitOverflowScrolling = 'touch';
    main.style.overscrollBehavior = 'contain';
    main.style.touchAction = 'pan-y';
  }
};

/**
 * Fixes iOS toast and notification issues
 * - Ensures toasts don't block scrolling
 * - Fixes pointer events on toast containers
 * - Removes problematic transforms
 */
export const fixIOSToasts = (): void => {
  if (!isIOSDevice()) return;

  const fixToastContainer = (container: Element) => {
    const element = container as HTMLElement;

    // Container should not block touch events
    element.style.pointerEvents = 'none';

    // Remove problematic transforms
    element.style.transform = 'none';
    element.style.webkitTransform = 'none';
    element.style.willChange = 'auto';
    element.style.backfaceVisibility = 'visible';
    element.style.contain = 'none';
    element.style.isolation = 'auto';

    // Fix individual toasts within container
    const toasts = container.querySelectorAll('div, .medical-toast, [data-testid*="toast"]');
    toasts.forEach((toast) => {
      const toastElement = toast as HTMLElement;
      toastElement.style.pointerEvents = 'auto';
      toastElement.style.touchAction = 'manipulation';
      toastElement.style.transform = 'none';
      toastElement.style.webkitTransform = 'none';
      toastElement.style.willChange = 'auto';
      toastElement.style.backfaceVisibility = 'visible';
    });
  };

  // Fix existing toast containers
  const toastContainers = document.querySelectorAll('.toast-container');
  toastContainers.forEach(fixToastContainer);

  // Monitor for dynamically added toast containers
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element;

          // Check if the added element is a toast container
          if (element.classList.contains('toast-container')) {
            fixToastContainer(element);
          }

          // Check for toast containers within the added element
          const nestedContainers = element.querySelectorAll('.toast-container');
          nestedContainers.forEach(fixToastContainer);
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
};

/**
 * Fixes iOS high z-index element issues
 * - Removes problematic transforms from high z-index elements
 * - Ensures they don't block touch events
 */
export const fixIOSHighZIndexElements = (): void => {
  if (!isIOSDevice()) return;

  const highZElements = document.querySelectorAll('[style*="z-index"]');
  highZElements.forEach((element) => {
    const htmlElement = element as HTMLElement;
    const zIndex = parseInt(htmlElement.style.zIndex || '0');

    if (zIndex > 1000) {
      // Remove problematic transforms
      htmlElement.style.transform = 'none';
      htmlElement.style.webkitTransform = 'none';
      htmlElement.style.backfaceVisibility = 'visible';
      htmlElement.style.willChange = 'auto';
    }
  });
};

/**
 * Comprehensive fix for all problematic elements
 * - Removes transforms from all elements that might block iOS touch events
 * - Fixes medical cards, doctor cards, and other interactive elements
 */
export const fixIOSProblematicElements = (): void => {
  if (!isIOSDevice()) return;

  // Selectors for elements that commonly have problematic transforms
  const problematicSelectors = [
    '[style*="translateZ"]',
    '[style*="translate3d"]',
    '[style*="backface-visibility: hidden"]',
    '.doctor-card-mobile',
    '.medical-card-enhanced',
    '.medical-department-card',
    '.medical-hospital-dashboard',
    '.medical-search-section',
    '.medical-hero-section',
    '.medical-services-section',
    '.medical-departments-section',
    '.medical-news-section',
    '.doctor-item-touch',
    '.pagination-button',
    '.medical-badge',
    '.skeleton-optimized',
    '[class*="medical-"]',
    '[class*="doctor-"]',
    '[class*="department-"]',
  ];

  problematicSelectors.forEach((selector) => {
    try {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        const htmlElement = element as HTMLElement;

        // Remove problematic transforms
        htmlElement.style.transform = 'none';
        htmlElement.style.webkitTransform = 'none';
        htmlElement.style.backfaceVisibility = 'visible';
        htmlElement.style.willChange = 'auto';

        // Optimize touch interactions
        htmlElement.style.touchAction = 'manipulation';

        // Ensure minimum touch targets for interactive elements
        if (htmlElement.matches('button, a, [role="button"], [tabindex], .medical-card, .doctor-card')) {
          const computedStyle = window.getComputedStyle(htmlElement);
          if (parseInt(computedStyle.minHeight) < 44) {
            htmlElement.style.minHeight = '44px';
          }
          if (parseInt(computedStyle.minWidth) < 44) {
            htmlElement.style.minWidth = '44px';
          }
        }
      });
    } catch (error) {
      console.warn(`Error fixing elements with selector ${selector}:`, error);
    }
  });
};

/**
 * Comprehensive iOS fixes initialization
 * Call this function when the app starts to apply all iOS fixes
 */
export const initializeIOSFixes = (): void => {
  if (!isIOSDevice()) {
    console.log('🍎 Non-iOS device detected - skipping iOS-specific fixes');
    return;
  }

  console.log('🍎 iOS device detected - applying iOS-specific fixes...');

  try {
    // Apply all iOS fixes
    fixIOSFormInputs();
    fixIOSButtons();
    fixIOSScrolling();
    fixIOSToasts();
    fixIOSHighZIndexElements();
    fixIOSProblematicElements();

    // Apply fixes again after DOM is fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
          fixIOSFormInputs();
          fixIOSButtons();
          fixIOSScrolling();
          fixIOSToasts();
          fixIOSHighZIndexElements();
          fixIOSProblematicElements();
          forceFixIOSInlineStyles();
        }, 100);
      });
    } else {
      // DOM is already loaded, apply force fix immediately
      setTimeout(() => {
        forceFixIOSInlineStyles();
      }, 500);
    }

    // Apply fixes when new content is added
    const observer = new MutationObserver(() => {
      fixIOSFormInputs();
      fixIOSButtons();
      fixIOSHighZIndexElements();
      fixIOSProblematicElements();
      // Use debounced force fix to avoid performance issues
      setTimeout(() => forceFixIOSInlineStyles(), 50);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    console.log('✅ iOS fixes applied successfully');
  } catch (error) {
    console.error('❌ Error applying iOS fixes:', error);
  }
};

/**
 * Force fix all inline styles that might cause iOS issues
 * This is a more aggressive approach for stubborn elements
 */
export const forceFixIOSInlineStyles = (): void => {
  if (!isIOSDevice()) return;

  // Find all elements with inline transforms
  const allElements = document.querySelectorAll('*');
  let fixedCount = 0;

  allElements.forEach((element) => {
    const htmlElement = element as HTMLElement;
    const inlineStyle = htmlElement.style;

    // Check for problematic inline styles
    if (
      inlineStyle.transform &&
      (inlineStyle.transform.includes('translateZ') || inlineStyle.transform.includes('translate3d'))
    ) {
      inlineStyle.transform = 'none';
      inlineStyle.webkitTransform = 'none';
      fixedCount++;
    }

    if (inlineStyle.backfaceVisibility === 'hidden') {
      inlineStyle.backfaceVisibility = 'visible';
      fixedCount++;
    }

    if (inlineStyle.willChange && inlineStyle.willChange.includes('transform')) {
      inlineStyle.willChange = 'auto';
      fixedCount++;
    }

    // Fix elements with high z-index that might block touch
    if (inlineStyle.zIndex && parseInt(inlineStyle.zIndex) > 1000) {
      inlineStyle.transform = 'none';
      inlineStyle.webkitTransform = 'none';
      inlineStyle.backfaceVisibility = 'visible';
      inlineStyle.willChange = 'auto';
      fixedCount++;
    }
  });

  if (fixedCount > 0) {
    console.log(`🍎 Force fixed ${fixedCount} inline style issues for iOS`);
  }
};

/**
 * Debug utility to check iOS fix status
 * Use this in development to verify fixes are working
 */
export const debugIOSFixes = (): void => {
  if (!isIOSDevice()) {
    console.log('🍎 Debug: Non-iOS device - no fixes needed');
    return;
  }

  console.log('🍎 iOS Debug Information:');
  console.log('- Device:', navigator.userAgent);
  console.log('- Platform:', navigator.platform);
  console.log('- Touch points:', navigator.maxTouchPoints);
  console.log('- Is iOS Safari:', isIOSSafari());

  // Check toast containers
  const toastContainers = document.querySelectorAll('.toast-container');
  console.log(`- Toast containers found: ${toastContainers.length}`);

  toastContainers.forEach((container, index) => {
    const element = container as HTMLElement;
    const style = window.getComputedStyle(element);
    console.log(`  Container ${index + 1}:`, {
      pointerEvents: style.pointerEvents,
      transform: style.transform,
      willChange: style.willChange,
      backfaceVisibility: style.backfaceVisibility,
    });
  });

  // Check for problematic elements
  const problematicElements = document.querySelectorAll(
    '[style*="translateZ"], [style*="translate3d"], [style*="backface-visibility: hidden"]'
  );
  console.log(`- Problematic elements found: ${problematicElements.length}`);

  if (problematicElements.length > 0) {
    console.log(
      '- Problematic elements:',
      Array.from(problematicElements).map((el) => ({
        tagName: el.tagName,
        className: el.className,
        style: (el as HTMLElement).style.cssText,
      }))
    );
  }

  // Check body scroll properties
  const bodyStyle = window.getComputedStyle(document.body);
  console.log('- Body scroll properties:', {
    overflowY: bodyStyle.overflowY,
    touchAction: bodyStyle.touchAction,
    webkitOverflowScrolling: (document.body.style as any).webkitOverflowScrolling,
    overscrollBehavior: bodyStyle.overscrollBehavior,
  });
};
