/**
 * iOS Debug Script
 * 
 * Copy and paste this script into the browser console on iOS Safari
 * to diagnose and fix iOS touch/scroll issues
 */

(function() {
  'use strict';

  // iOS Detection
  function isIOSDevice() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }

  function isIOSSafari() {
    return isIOSDevice() && /Safari/.test(navigator.userAgent) && !/CriOS|FxiOS/.test(navigator.userAgent);
  }

  // Debug Information
  function debugIOSInfo() {
    console.log('🍎 iOS Debug Information:');
    console.log('- User Agent:', navigator.userAgent);
    console.log('- Platform:', navigator.platform);
    console.log('- Max Touch Points:', navigator.maxTouchPoints);
    console.log('- Is iOS Device:', isIOSDevice());
    console.log('- Is iOS Safari:', isIOSSafari());
    console.log('- Screen Size:', `${screen.width}x${screen.height}`);
    console.log('- Viewport Size:', `${window.innerWidth}x${window.innerHeight}`);
    console.log('- Device Pixel Ratio:', window.devicePixelRatio);
  }

  // Check for problematic elements
  function findProblematicElements() {
    console.log('🔍 Searching for problematic elements...');
    
    const problematicSelectors = [
      '[style*="translateZ"]',
      '[style*="translate3d"]',
      '[style*="backface-visibility: hidden"]',
      '[style*="will-change: transform"]',
      '.toast-container',
      '[style*="z-index"]'
    ];

    let totalFound = 0;
    
    problematicSelectors.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          console.log(`- Found ${elements.length} elements with selector: ${selector}`);
          totalFound += elements.length;
          
          // Show first few elements
          Array.from(elements).slice(0, 3).forEach((el, index) => {
            const element = el as HTMLElement;
            console.log(`  Element ${index + 1}:`, {
              tagName: element.tagName,
              className: element.className,
              id: element.id,
              style: element.style.cssText,
              computedTransform: window.getComputedStyle(element).transform,
              computedPointerEvents: window.getComputedStyle(element).pointerEvents
            });
          });
        }
      } catch (error) {
        console.warn(`Error checking selector ${selector}:`, error);
      }
    });

    console.log(`📊 Total problematic elements found: ${totalFound}`);
    return totalFound;
  }

  // Force fix all problematic elements
  function forceFixAllElements() {
    if (!isIOSDevice()) {
      console.log('⚠️ Not an iOS device - fixes may not be necessary');
      return;
    }

    console.log('🔧 Applying force fixes to all problematic elements...');
    let fixedCount = 0;

    // Fix all elements with inline transforms
    const allElements = document.querySelectorAll('*');
    allElements.forEach(element => {
      const htmlElement = element as HTMLElement;
      const style = htmlElement.style;
      let elementFixed = false;

      // Fix problematic transforms
      if (style.transform && (style.transform.includes('translateZ') || style.transform.includes('translate3d'))) {
        style.transform = 'none';
        style.webkitTransform = 'none';
        elementFixed = true;
      }

      // Fix backface-visibility
      if (style.backfaceVisibility === 'hidden') {
        style.backfaceVisibility = 'visible';
        elementFixed = true;
      }

      // Fix will-change
      if (style.willChange && style.willChange.includes('transform')) {
        style.willChange = 'auto';
        elementFixed = true;
      }

      // Fix high z-index elements
      if (style.zIndex && parseInt(style.zIndex) > 1000) {
        style.transform = 'none';
        style.webkitTransform = 'none';
        style.backfaceVisibility = 'visible';
        style.willChange = 'auto';
        elementFixed = true;
      }

      if (elementFixed) {
        fixedCount++;
      }
    });

    // Fix toast containers specifically
    const toastContainers = document.querySelectorAll('.toast-container');
    toastContainers.forEach(container => {
      const element = container as HTMLElement;
      element.style.pointerEvents = 'none';
      element.style.transform = 'none';
      element.style.webkitTransform = 'none';
      element.style.willChange = 'auto';
      element.style.backfaceVisibility = 'visible';

      // Fix individual toasts
      const toasts = container.querySelectorAll('div');
      toasts.forEach(toast => {
        const toastElement = toast as HTMLElement;
        toastElement.style.pointerEvents = 'auto';
        toastElement.style.touchAction = 'manipulation';
        toastElement.style.transform = 'none';
        toastElement.style.webkitTransform = 'none';
      });
    });

    console.log(`✅ Fixed ${fixedCount} elements for iOS compatibility`);
  }

  // Fix body and document for iOS scrolling
  function fixIOSScrolling() {
    console.log('📜 Fixing iOS scrolling...');
    
    // Fix body
    document.body.style.webkitOverflowScrolling = 'touch';
    document.body.style.overscrollBehaviorX = 'none';
    document.body.style.overscrollBehaviorY = 'auto';
    document.body.style.touchAction = 'pan-y';

    // Fix main content
    const main = document.querySelector('main');
    if (main) {
      main.style.webkitOverflowScrolling = 'touch';
      main.style.overscrollBehavior = 'contain';
      main.style.touchAction = 'pan-y';
    }

    // Fix scrollable containers
    const scrollableElements = document.querySelectorAll('.overflow-auto, .overflow-y-auto, .overflow-scroll');
    scrollableElements.forEach(element => {
      const htmlElement = element as HTMLElement;
      htmlElement.style.webkitOverflowScrolling = 'touch';
      htmlElement.style.overscrollBehavior = 'contain';
      htmlElement.style.touchAction = 'pan-y';
    });

    console.log('✅ iOS scrolling fixes applied');
  }

  // Fix form inputs for iOS
  function fixIOSFormInputs() {
    console.log('📝 Fixing iOS form inputs...');
    
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      const element = input as HTMLElement;
      
      // Prevent zoom on focus
      if (!element.style.fontSize || parseInt(element.style.fontSize) < 16) {
        element.style.fontSize = '16px';
      }
      
      element.style.touchAction = 'manipulation';
      element.style.webkitAppearance = 'none';
      element.style.webkitTouchCallout = 'none';
    });

    // Fix viewport to prevent zoom
    let viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.name = 'viewport';
      document.head.appendChild(viewport);
    }
    
    viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
    
    console.log('✅ iOS form input fixes applied');
  }

  // Test touch events
  function testTouchEvents() {
    console.log('👆 Testing touch events...');
    
    let touchCount = 0;
    const testElement = document.createElement('div');
    testElement.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      width: 100px;
      height: 50px;
      background: #007AFF;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      font-size: 12px;
      z-index: 9999;
      touch-action: manipulation;
    `;
    testElement.textContent = 'Touch Test';
    
    testElement.addEventListener('touchstart', () => {
      touchCount++;
      testElement.textContent = `Touches: ${touchCount}`;
      testElement.style.background = '#34C759';
      setTimeout(() => {
        testElement.style.background = '#007AFF';
      }, 200);
    });
    
    document.body.appendChild(testElement);
    
    setTimeout(() => {
      document.body.removeChild(testElement);
      console.log(`✅ Touch test completed. Total touches: ${touchCount}`);
    }, 10000);
    
    console.log('Touch test element added for 10 seconds. Try tapping it!');
  }

  // Main execution
  console.log('🚀 Starting iOS Debug and Fix Script...');
  
  if (!isIOSDevice()) {
    console.log('⚠️ This script is designed for iOS devices. Current device may not benefit from these fixes.');
  }

  // Run all diagnostics and fixes
  debugIOSInfo();
  const problematicCount = findProblematicElements();
  
  if (problematicCount > 0 || isIOSDevice()) {
    forceFixAllElements();
    fixIOSScrolling();
    fixIOSFormInputs();
    
    console.log('✅ All iOS fixes applied!');
    console.log('📱 Try scrolling, tapping buttons, and using form inputs now.');
    
    // Optional: Run touch test
    if (confirm('Run touch event test? (10 second test element will appear)')) {
      testTouchEvents();
    }
  } else {
    console.log('✅ No problematic elements found. Your page should work fine on iOS!');
  }

  // Expose functions globally for manual use
  window.iOSDebug = {
    debugInfo: debugIOSInfo,
    findProblematic: findProblematicElements,
    forceFixAll: forceFixAllElements,
    fixScrolling: fixIOSScrolling,
    fixFormInputs: fixIOSFormInputs,
    testTouch: testTouchEvents,
    isIOS: isIOSDevice(),
    isSafari: isIOSSafari()
  };

  console.log('🔧 Functions available in window.iOSDebug for manual use');
})();
