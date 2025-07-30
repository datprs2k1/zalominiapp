import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ScrollRestorationDemo = () => {
  const generateContent = (count: number) => {
    return Array.from({ length: count }, (_, i) => (
      <motion.div
        key={i}
        className="p-6 mb-4 bg-white rounded-lg shadow-md border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.05 }}
      >
        <h3 className="text-lg font-semibold text-blue-600 mb-2">
          Content Block {i + 1}
        </h3>
        <p className="text-gray-700 mb-3">
          This is a test content block to demonstrate scroll restoration functionality. 
          Scroll down, navigate to another page, then come back to see if your scroll 
          position is restored.
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            Block #{i + 1}
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            Position: {i * 100}px
          </span>
        </div>
      </motion.div>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Scroll Restoration Demo
          </h1>
          <p className="text-gray-600 text-sm">
            Test scroll position restoration by scrolling down and navigating between pages
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <h2 className="text-lg font-semibold mb-3">Test Navigation</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Home Page
            </Link>
            <Link
              to="/services"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Services
            </Link>
            <Link
              to="/departments"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Departments
            </Link>
            <Link
              to="/demo/ui-showcase"
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              UI Showcase
            </Link>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            How to Test Scroll Restoration
          </h3>
          <ol className="list-decimal list-inside text-yellow-700 space-y-1">
            <li>Scroll down to any position on this page</li>
            <li>Click on one of the navigation links above</li>
            <li>Use the browser back button or navigate back to this demo page</li>
            <li>Your scroll position should be restored to where you left off</li>
            <li>Check the browser console for scroll restoration logs</li>
          </ol>
        </div>

        {/* Scroll Position Indicator */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            Current Scroll Position
          </h3>
          <div className="text-blue-700">
            <span id="scroll-position">Scroll to see position updates</span>
          </div>
        </div>

        {/* Content Blocks */}
        <div className="space-y-4">
          {generateContent(50)}
        </div>

        {/* Bottom Navigation */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-3">End of Content</h3>
          <p className="text-gray-600 mb-4">
            You've reached the bottom! Now test the scroll restoration by navigating away and back.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Go to Home
            </Link>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Scroll to Top
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Position Tracker Script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            let lastScrollY = 0;
            const updateScrollPosition = () => {
              const scrollY = window.scrollY;
              const element = document.getElementById('scroll-position');
              if (element && Math.abs(scrollY - lastScrollY) > 10) {
                element.textContent = \`Scroll Y: \${scrollY}px\`;
                lastScrollY = scrollY;
              }
            };
            
            window.addEventListener('scroll', updateScrollPosition, { passive: true });
            updateScrollPosition();
          `,
        }}
      />
    </div>
  );
};

export default ScrollRestorationDemo;
