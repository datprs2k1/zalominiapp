import React from 'react';
import SearchBarComponent from './search-bar-component';

/**
 * Demo component to showcase the compact search bar design
 * This demonstrates the space efficiency improvements while maintaining functionality
 */
export default function SearchBarDemo() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Compact Search Bar Design
          </h1>
          <p className="text-gray-600">
            Redesigned for better space efficiency while maintaining healthcare aesthetics
          </p>
        </div>

        {/* Compact Design Showcase */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            ✨ New Compact Design
          </h2>
          <div className="space-y-4">
            <SearchBarComponent
              medicalContext="general"
              placeholder="Tìm kiếm dịch vụ y tế, bác sĩ, chuyên khoa..."
              ariaLabel="Tìm kiếm dịch vụ y tế"
              showQuickCategories={true}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Space Optimizations</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Reduced padding: p-2.5 (was p-4)</li>
                  <li>• Compact input: py-3 (was py-5)</li>
                  <li>• Smaller icons: w-4 h-4 (was w-5 h-5)</li>
                  <li>• Tighter spacing: gap-1.5 (was gap-2)</li>
                  <li>• Reduced shadows and borders</li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Preserved Features</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• ✅ WCAG 2.1 AA compliance</li>
                  <li>• ✅ 44px+ touch targets</li>
                  <li>• ✅ Medical color scheme</li>
                  <li>• ✅ Smooth animations</li>
                  <li>• ✅ All functionality intact</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Different Contexts */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Medical Context Variations
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Emergency Context</h3>
              <SearchBarComponent
                medicalContext="emergency"
                priority="critical"
                placeholder="Tìm kiếm khẩn cấp..."
                showQuickCategories={false}
              />
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Doctor Search</h3>
              <SearchBarComponent
                medicalContext="doctor"
                placeholder="Tìm bác sĩ, chuyên khoa..."
                showQuickCategories={true}
              />
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Appointment Booking</h3>
              <SearchBarComponent
                medicalContext="appointment"
                placeholder="Tìm lịch hẹn..."
                showQuickCategories={false}
              />
            </div>
          </div>
        </div>

        {/* Responsive Design */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Responsive & Mobile-Optimized
          </h2>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-3">
                The compact design is especially beneficial on mobile devices where screen real estate is precious.
              </p>
              <div className="max-w-sm mx-auto">
                <SearchBarComponent
                  medicalContext="general"
                  placeholder="Mobile-optimized search..."
                  showQuickCategories={true}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Technical Improvements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">Performance</h3>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Faster animations (0.2s vs 0.4s)</li>
                <li>• Reduced DOM complexity</li>
                <li>• Optimized re-renders</li>
              </ul>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-800 mb-2">Accessibility</h3>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• Maintained focus indicators</li>
                <li>• Preserved ARIA labels</li>
                <li>• Touch-friendly targets</li>
              </ul>
            </div>
            
            <div className="bg-teal-50 p-4 rounded-lg">
              <h3 className="font-semibold text-teal-800 mb-2">Visual Design</h3>
              <ul className="text-sm text-teal-700 space-y-1">
                <li>• Medical color palette</li>
                <li>• Subtle micro-animations</li>
                <li>• Clean modern aesthetic</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
