import React from 'react';
import { MEDICAL_WIDTHS, CARD_DIMENSIONS } from '@/styles/medical-design-system';

/**
 * Test component to verify the unified width system implementation
 * This component demonstrates the consistent width styling across medical components
 */
const TestWidthSystem = () => {
  return (
    <div className="p-4 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Medical Width System Test</h1>
      
      {/* Test Main Container Widths */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Container Widths</h2>
        
        <div className={`${MEDICAL_WIDTHS.container.narrow} mx-auto bg-blue-100 p-4 rounded-lg`}>
          <p className="text-sm">Narrow Container (max-w-md): {MEDICAL_WIDTHS.container.narrow}</p>
        </div>
        
        <div className={`${MEDICAL_WIDTHS.container.standard} mx-auto bg-green-100 p-4 rounded-lg`}>
          <p className="text-sm">Standard Container (max-w-2xl): {MEDICAL_WIDTHS.container.standard}</p>
        </div>
        
        <div className={`${MEDICAL_WIDTHS.container.wide} mx-auto bg-purple-100 p-4 rounded-lg`}>
          <p className="text-sm">Wide Container (max-w-4xl): {MEDICAL_WIDTHS.container.wide}</p>
        </div>
      </section>

      {/* Test Service Card Widths */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Service Card Widths (Horizontal Scroll)</h2>
        
        <div className="flex gap-4 overflow-x-auto pb-4">
          <div className={`${CARD_DIMENSIONS.horizontal.width} ${CARD_DIMENSIONS.horizontal.height} bg-blue-200 rounded-lg flex items-center justify-center flex-shrink-0`}>
            <p className="text-xs text-center px-2">
              Service Card<br/>
              {CARD_DIMENSIONS.horizontal.width}<br/>
              {CARD_DIMENSIONS.horizontal.height}
            </p>
          </div>
          <div className={`${CARD_DIMENSIONS.horizontal.width} ${CARD_DIMENSIONS.horizontal.height} bg-blue-200 rounded-lg flex items-center justify-center flex-shrink-0`}>
            <p className="text-xs text-center px-2">
              Service Card<br/>
              Responsive Width
            </p>
          </div>
          <div className={`${CARD_DIMENSIONS.horizontal.width} ${CARD_DIMENSIONS.horizontal.height} bg-blue-200 rounded-lg flex items-center justify-center flex-shrink-0`}>
            <p className="text-xs text-center px-2">
              Service Card<br/>
              Unified System
            </p>
          </div>
        </div>
      </section>

      {/* Test Section Spacing */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Section Spacing</h2>
        
        <div className={`${MEDICAL_WIDTHS.section.padding} ${MEDICAL_WIDTHS.section.margin} bg-yellow-100 rounded-lg`}>
          <p className="text-sm">
            Section with unified padding: {MEDICAL_WIDTHS.section.padding}<br/>
            Section with unified margin: {MEDICAL_WIDTHS.section.margin}
          </p>
        </div>
      </section>

      {/* Test Grid Cards */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Grid Cards (Departments & News)</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className={`${CARD_DIMENSIONS.grid.width} ${CARD_DIMENSIONS.grid.height} bg-green-200 rounded-lg flex items-center justify-center`}>
            <p className="text-xs text-center">
              Department Card<br/>
              {CARD_DIMENSIONS.grid.width}<br/>
              {CARD_DIMENSIONS.grid.height}
            </p>
          </div>
          <div className={`${CARD_DIMENSIONS.vertical.width} ${CARD_DIMENSIONS.vertical.minHeight} bg-purple-200 rounded-lg flex items-center justify-center`}>
            <p className="text-xs text-center">
              News Card<br/>
              {CARD_DIMENSIONS.vertical.width}<br/>
              {CARD_DIMENSIONS.vertical.minHeight}
            </p>
          </div>
        </div>
      </section>

      {/* Responsive Test Instructions */}
      <section className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Responsive Test Instructions</h2>
        <ul className="text-sm space-y-1 text-gray-600">
          <li>• Resize browser window to test responsive behavior</li>
          <li>• Service cards should be: 260px (mobile) → 280px (tablet) → 300px (desktop)</li>
          <li>• Container should expand from narrow to standard width</li>
          <li>• All components should maintain visual harmony</li>
          <li>• Check WCAG 2.1 AA compliance with sufficient contrast</li>
        </ul>
      </section>
    </div>
  );
};

export default TestWidthSystem;
