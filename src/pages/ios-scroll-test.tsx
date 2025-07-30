/**
 * iOS Scroll Test Page
 *
 * A dedicated page for testing iOS scrolling fixes.
 * Access this page to validate that the iOS scroll issues have been resolved.
 *
 * URL: /ios-scroll-test
 */

import React from 'react';
import { IOSScrollTest, useIOSScrollValidation } from '@/components/ios-scroll-test';
import {
  isIOSDevice,
  isIOSSafari,
  debugIOSFixes,
  forceFixIOSInlineStyles,
  initializeIOSFixes,
} from '@/utils/ios-fixes';
import toast from 'react-hot-toast';

const IOSScrollTestPage: React.FC = () => {
  const { isValid, isIOS } = useIOSScrollValidation();
  const isIOSDeviceDetected = isIOSDevice();
  const isIOSSafariDetected = isIOSSafari();

  React.useEffect(() => {
    // Show initial status toast
    if (isIOSDeviceDetected) {
      if (isValid === true) {
        toast.success('✅ iOS scroll fixes appear to be working correctly!');
      } else if (isValid === false) {
        toast.error('❌ iOS scroll issues detected. Check console for details.');
        // Run debug to help identify issues
        debugIOSFixes();
      }
    } else {
      toast('ℹ️ Use iOS Safari for accurate testing', { duration: 3000 });
    }
  }, [isValid, isIOSDeviceDetected]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">iOS Scroll Test</h1>
              <p className="mt-1 text-sm text-gray-500">
                Validate iOS Safari scrolling behavior and toast functionality
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {isIOS && (
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isValid === true
                      ? 'bg-green-100 text-green-800'
                      : isValid === false
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {isValid === true ? '✅ Scroll OK' : isValid === false ? '❌ Issues Found' : '⏳ Checking...'}
                </div>
              )}
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isIOS ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                }`}
              >
                {isIOS ? '📱 iOS Device' : '💻 Non-iOS Device'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">🧪 Testing Instructions</h2>
          <div className="text-blue-800 space-y-2">
            <p>
              <strong>1. Test Toast + Scroll:</strong> Click the toast button and try scrolling while toasts are visible
            </p>
            <p>
              <strong>2. Test Smooth Scrolling:</strong> Use the scroll buttons to test programmatic scrolling
            </p>
            <p>
              <strong>3. Manual Scroll Test:</strong> Scroll through the content below using finger swipes
            </p>
            <p>
              <strong>4. Automated Tests:</strong> Run automated checks to validate technical implementation
            </p>
            <p>
              <strong>5. Force Fix:</strong> If issues persist, try the force fix button below
            </p>
          </div>
        </div>

        {/* iOS Fix Controls */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-orange-900 mb-3">🔧 iOS Fix Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => {
                debugIOSFixes();
                toast.success('Debug info logged to console');
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              🔍 Debug iOS Issues
            </button>

            <button
              onClick={() => {
                forceFixIOSInlineStyles();
                toast.success('Force fix applied to all elements');
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              ⚡ Force Fix Inline Styles
            </button>

            <button
              onClick={() => {
                initializeIOSFixes();
                toast.success('iOS fixes re-initialized');
              }}
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              🔄 Re-initialize Fixes
            </button>
          </div>
        </div>

        {/* Expected Behavior */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-green-900 mb-3">✅ Expected Behavior (After Fixes)</h2>
          <div className="text-green-800 space-y-2">
            <p>• Page scrolls smoothly without lag or blocking</p>
            <p>• Toast notifications remain visible and clickable</p>
            <p>• No interference between fixed elements and scrolling</p>
            <p>• Momentum scrolling works as expected on iOS</p>
            <p>• Touch events are properly handled</p>
          </div>
        </div>

        {/* Previous Issues */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-red-900 mb-3">❌ Previous Issues (Should be Fixed)</h2>
          <div className="text-red-800 space-y-2">
            <p>
              • Toast container with <code>pointer-events: none</code> blocking scroll events
            </p>
            <p>
              • <code>transform: translateZ(0)</code> creating problematic stacking contexts
            </p>
            <p>• High z-index elements (999999) interfering with touch events</p>
            <p>• Fixed position elements preventing native iOS scroll behavior</p>
            <p>• Hardware acceleration properties blocking touch interactions</p>
          </div>
        </div>

        {/* iOS Form Input Test */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">📱 iOS Form Input Test</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text Input (should not zoom on focus)
              </label>
              <input
                type="text"
                placeholder="Tap to test input focus"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Input</label>
              <input
                type="email"
                placeholder="test@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Textarea</label>
              <textarea
                placeholder="Type your message here..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => toast.success('Button tap successful!')}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors min-h-[44px]"
              >
                Test Button
              </button>
              <button
                onClick={() => toast.error('Error button works!')}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-lg transition-colors min-h-[44px]"
              >
                Error Button
              </button>
            </div>
          </div>
        </div>

        {/* Test Component */}
        <IOSScrollTest showDebug={true} mode="manual" />

        {/* Technical Details */}
        <div className="mt-12 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">🔧 Technical Fixes Applied</h2>
          <div className="text-gray-700 space-y-3">
            <div>
              <h3 className="font-medium">1. Toast Container Fixes:</h3>
              <ul className="ml-4 mt-1 space-y-1 text-sm">
                <li>
                  • Container: <code>pointer-events: none</code>
                </li>
                <li>
                  • Individual toasts: <code>pointer-events: auto</code>
                </li>
                <li>
                  • Removed problematic <code>transform: translateZ(0)</code>
                </li>
                <li>
                  • Added <code>touch-action: manipulation</code>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium">2. Hardware Acceleration Optimization:</h3>
              <ul className="ml-4 mt-1 space-y-1 text-sm">
                <li>
                  • Removed <code>backfaceVisibility: hidden</code>
                </li>
                <li>
                  • Reduced <code>will-change</code> scope to <code>opacity</code>
                </li>
                <li>• Eliminated vendor-specific transforms</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium">3. iOS-Specific Optimizations:</h3>
              <ul className="ml-4 mt-1 space-y-1 text-sm">
                <li>
                  • Added <code>-webkit-overflow-scrolling: touch</code>
                </li>
                <li>
                  • Set <code>overscroll-behavior: contain</code>
                </li>
                <li>
                  • Implemented <code>touch-action: pan-y</code>
                </li>
                <li>• Added mutation observer for dynamic elements</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IOSScrollTestPage;
