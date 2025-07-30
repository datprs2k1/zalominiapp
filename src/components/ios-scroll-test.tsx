/**
 * iOS Scroll Test Component
 * 
 * This component provides a comprehensive test suite for validating
 * iOS scrolling behavior and toast functionality after applying fixes.
 * 
 * Usage: Import and render this component to test iOS scroll fixes
 */

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface ScrollTestProps {
  /** Whether to show debug information */
  showDebug?: boolean;
  /** Test mode - 'manual' for user testing, 'auto' for automated checks */
  mode?: 'manual' | 'auto';
}

/**
 * iOS Scroll Test Component
 * Tests various scrolling scenarios that commonly fail on iOS
 */
export const IOSScrollTest: React.FC<ScrollTestProps> = ({ 
  showDebug = false, 
  mode = 'manual' 
}) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [touchEvents, setTouchEvents] = useState<string[]>([]);
  const [isIOSDevice, setIsIOSDevice] = useState(false);

  // Detect iOS device
  useEffect(() => {
    const detectIOS = () => {
      return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
             (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    };
    
    setIsIOSDevice(detectIOS());
  }, []);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track touch events for debugging
  useEffect(() => {
    if (!showDebug) return;

    const logTouchEvent = (eventType: string) => (e: TouchEvent) => {
      setTouchEvents(prev => [
        ...prev.slice(-4), // Keep only last 5 events
        `${eventType}: ${e.touches.length} touches at ${Date.now()}`
      ]);
    };

    document.addEventListener('touchstart', logTouchEvent('touchstart'), { passive: true });
    document.addEventListener('touchmove', logTouchEvent('touchmove'), { passive: true });
    document.addEventListener('touchend', logTouchEvent('touchend'), { passive: true });

    return () => {
      document.removeEventListener('touchstart', logTouchEvent('touchstart'));
      document.removeEventListener('touchmove', logTouchEvent('touchmove'));
      document.removeEventListener('touchend', logTouchEvent('touchend'));
    };
  }, [showDebug]);

  // Test functions
  const testToastFunctionality = () => {
    toast.success('✅ Success toast - Can you scroll while this is visible?');
    setTimeout(() => {
      toast.error('❌ Error toast - Scrolling should still work');
    }, 1000);
    setTimeout(() => {
      toast.loading('⏳ Loading toast - Test scrolling now');
    }, 2000);
  };

  const testScrollToPosition = (position: number) => {
    window.scrollTo({ top: position, behavior: 'smooth' });
  };

  const runAutomatedTests = () => {
    const results: string[] = [];
    
    // Test 1: Check if toast containers have correct pointer events
    const toastContainers = document.querySelectorAll('.toast-container');
    toastContainers.forEach((container, index) => {
      const element = container as HTMLElement;
      const pointerEvents = window.getComputedStyle(element).pointerEvents;
      results.push(`Toast Container ${index + 1}: pointer-events = ${pointerEvents}`);
    });

    // Test 2: Check for problematic transforms
    const elementsWithTransform = document.querySelectorAll('[style*="translateZ"]');
    results.push(`Elements with translateZ: ${elementsWithTransform.length}`);

    // Test 3: Check body scroll properties
    const bodyStyle = window.getComputedStyle(document.body);
    results.push(`Body overflow-y: ${bodyStyle.overflowY}`);
    results.push(`Body touch-action: ${bodyStyle.touchAction}`);

    // Display results
    console.log('iOS Scroll Test Results:', results);
    toast.success(`Automated tests completed. Check console for ${results.length} results.`);
  };

  return (
    <div className="ios-scroll-test p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">
          🧪 iOS Scroll Test Suite
        </h2>
        
        {isIOSDevice && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            ✅ iOS device detected - Tests are relevant
          </div>
        )}

        {!isIOSDevice && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            ⚠️ Non-iOS device - Use iOS Safari for accurate testing
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={testToastFunctionality}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            🍞 Test Toast + Scroll
          </button>

          <button
            onClick={() => testScrollToPosition(1000)}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            📜 Scroll to 1000px
          </button>

          <button
            onClick={() => testScrollToPosition(0)}
            className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            🔝 Scroll to Top
          </button>

          <button
            onClick={runAutomatedTests}
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            🤖 Run Auto Tests
          </button>
        </div>

        {showDebug && (
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Debug Information</h3>
            <p>Current scroll position: {scrollPosition}px</p>
            <div className="mt-2">
              <h4 className="font-medium">Recent touch events:</h4>
              <ul className="text-sm text-gray-600">
                {touchEvents.map((event, index) => (
                  <li key={index}>{event}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Scrollable content for testing */}
      <div className="space-y-6">
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Test Section {i + 1}
            </h3>
            <p className="text-gray-600 mb-4">
              This is test content section {i + 1}. Try scrolling through this content
              while toasts are visible. On iOS, scrolling should work smoothly without
              being blocked by fixed position elements or high z-index toast containers.
            </p>
            <div className="bg-blue-50 p-4 rounded">
              <h4 className="font-medium text-blue-800 mb-2">iOS Scroll Test Checklist:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>✓ Page scrolls smoothly with finger swipes</li>
                <li>✓ Toasts remain visible and clickable</li>
                <li>✓ No scroll blocking or lag</li>
                <li>✓ Momentum scrolling works properly</li>
                <li>✓ Touch events are not intercepted</li>
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Fixed position test element */}
      <div 
        className="fixed bottom-4 right-4 bg-red-500 text-white p-3 rounded-lg shadow-lg"
        style={{ zIndex: 1000 }}
      >
        Fixed Element Test
      </div>
    </div>
  );
};

/**
 * Quick iOS scroll validation hook
 * Use this in any component to quickly check if iOS scroll fixes are working
 */
export const useIOSScrollValidation = () => {
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    const validateScrolling = () => {
      // Check if we're on iOS
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      
      if (!isIOS) {
        setIsValid(true);
        return;
      }

      // Check for common iOS scroll blocking issues
      const toastContainers = document.querySelectorAll('.toast-container');
      let hasIssues = false;

      toastContainers.forEach(container => {
        const element = container as HTMLElement;
        const style = window.getComputedStyle(element);
        
        // Check if container blocks pointer events
        if (style.pointerEvents !== 'none') {
          hasIssues = true;
        }
        
        // Check for problematic transforms
        if (style.transform.includes('translateZ')) {
          hasIssues = true;
        }
      });

      setIsValid(!hasIssues);
    };

    // Run validation after a short delay to ensure DOM is ready
    const timer = setTimeout(validateScrolling, 500);
    return () => clearTimeout(timer);
  }, []);

  return { isValid, isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent) };
};

export default IOSScrollTest;
