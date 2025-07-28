import React, { useState } from 'react';
import SearchBarComponent from './search-bar-component';

/**
 * Demo component to showcase the enhanced focus states and accessibility features
 * This demonstrates WCAG 2.1 AA compliance and medical context variations
 */
export default function FocusStatesDemo() {
  const [currentContext, setCurrentContext] = useState<'general' | 'emergency' | 'appointment' | 'doctor' | 'service'>('general');
  const [showInstructions, setShowInstructions] = useState(true);

  const contexts = [
    { value: 'general', label: 'General', color: 'bg-blue-500', description: 'Standard medical search with primary blue focus' },
    { value: 'emergency', label: 'Emergency', color: 'bg-red-500', description: 'Emergency context with red focus indicators' },
    { value: 'appointment', label: 'Appointment', color: 'bg-blue-600', description: 'Appointment booking with enhanced blue focus' },
    { value: 'doctor', label: 'Doctor', color: 'bg-green-500', description: 'Doctor search with healing green focus' },
    { value: 'service', label: 'Service', color: 'bg-cyan-500', description: 'Service search with cyan focus indicators' },
  ] as const;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Enhanced Focus States Demo
          </h1>
          <p className="text-gray-600 mb-4">
            WCAG 2.1 AA compliant focus indicators with medical context variations
          </p>
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="text-blue-600 hover:text-blue-800 underline text-sm"
          >
            {showInstructions ? 'Hide' : 'Show'} Keyboard Instructions
          </button>
        </div>

        {/* Keyboard Instructions */}
        {showInstructions && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Keyboard Navigation Instructions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
              <div>
                <strong>Search Input:</strong>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Tab to focus the search input</li>
                  <li>Type to show suggestions</li>
                  <li>Arrow Down/Up to navigate suggestions</li>
                  <li>Enter to select suggestion</li>
                  <li>Escape to close suggestions</li>
                </ul>
              </div>
              <div>
                <strong>Interactive Elements:</strong>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Tab through quick category buttons</li>
                  <li>Tab to clear button (when visible)</li>
                  <li>All elements have 2px+ focus indicators</li>
                  <li>Focus states meet 3:1 contrast ratio</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Context Selector */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Medical Context Variations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
            {contexts.map((context) => (
              <button
                key={context.value}
                onClick={() => setCurrentContext(context.value)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                  currentContext === context.value
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-3 h-3 rounded-full ${context.color}`}></div>
                  <span className="font-medium text-gray-800">{context.label}</span>
                </div>
                <p className="text-xs text-gray-600">{context.description}</p>
              </button>
            ))}
          </div>

          {/* Active Search Bar */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
            <SearchBarComponent
              medicalContext={currentContext}
              placeholder={`Tìm kiếm trong ngữ cảnh ${contexts.find(c => c.value === currentContext)?.label.toLowerCase()}...`}
              showQuickCategories={true}
            />
          </div>
        </div>

        {/* Focus State Examples */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Focus State Examples
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Input Example */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">Search Input</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-500 rounded bg-blue-50"></div>
                  <span>2px blue focus ring</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border border-blue-300 rounded bg-blue-25"></div>
                  <span>4px outer glow</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-600 rounded"></div>
                  <span>Outline for keyboard</span>
                </div>
              </div>
            </div>

            {/* Clear Button Example */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">Clear Button</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-500 rounded-full bg-blue-100"></div>
                  <span>Enhanced visibility</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border border-blue-400 rounded-full bg-blue-50"></div>
                  <span>Background highlight</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-600 rounded-full"></div>
                  <span>Keyboard outline</span>
                </div>
              </div>
            </div>

            {/* Category Button Example */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">Category Buttons</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white rounded-full bg-gradient-to-r from-blue-500 to-green-500"></div>
                  <span>White ring on gradient</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border border-white/50 rounded-full bg-gradient-to-r from-blue-400 to-green-400"></div>
                  <span>Soft outer glow</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white rounded-full bg-blue-500"></div>
                  <span>High contrast outline</span>
                </div>
              </div>
            </div>

            {/* Suggestion Item Example */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">Suggestions</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-500 rounded bg-blue-50"></div>
                  <span>Selected state</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border border-blue-300 rounded bg-blue-25"></div>
                  <span>Hover state</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-l-4 border-blue-600 bg-blue-100"></div>
                  <span>Keyboard selection</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Accessibility Features */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Accessibility Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">✅ WCAG 2.1 AA Compliant</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• 3:1 contrast ratio for focus indicators</li>
                <li>• 2px minimum focus indicator width</li>
                <li>• Keyboard navigation support</li>
                <li>• Screen reader compatibility</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">🎨 Visual Enhancements</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• High contrast mode support</li>
                <li>• Dark mode compatibility</li>
                <li>• Reduced motion preferences</li>
                <li>• Medical color integration</li>
              </ul>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">⌨️ Keyboard Features</h3>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Arrow key navigation</li>
                <li>• Enter key selection</li>
                <li>• Escape key dismissal</li>
                <li>• Tab order management</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Testing Instructions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Testing Instructions
          </h2>
          <div className="prose text-gray-600">
            <ol className="list-decimal list-inside space-y-2">
              <li>Use Tab key to navigate through all interactive elements</li>
              <li>Verify focus indicators are clearly visible on all backgrounds</li>
              <li>Test keyboard navigation in the suggestions dropdown</li>
              <li>Try different medical contexts to see focus color variations</li>
              <li>Test with screen reader to verify ARIA announcements</li>
              <li>Check high contrast mode compatibility</li>
              <li>Verify touch interactions work alongside focus states</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
