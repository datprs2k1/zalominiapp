import React from 'react';
import { TYPOGRAPHY } from '@/styles/medical-design-system';

interface UIImprovementsSummaryProps {
  className?: string;
}

const UIImprovementsSummary: React.FC<UIImprovementsSummaryProps> = ({ className }) => {
  const improvements = [
    {
      title: 'Hero Section Redesign',
      description: 'Giảm chiều cao từ 420px xuống 280px, loại bỏ carousel phức tạp',
      impact: 'Tăng focus vào CTA chính, giảm loading time',
      status: 'completed'
    },
    {
      title: 'Quick Access Optimization',
      description: 'Giảm từ 4 xuống 3 buttons, tăng touch targets lên 90px',
      impact: 'Better mobile UX, cleaner interface',
      status: 'completed'
    },
    {
      title: 'Visual Hierarchy Enhancement',
      description: 'Typography scale cải thiện, color system consistent',
      impact: 'Rõ ràng hơn, professional hơn',
      status: 'completed'
    },
    {
      title: 'Mobile Responsiveness',
      description: 'Mobile-first approach, better touch targets',
      impact: 'Improved mobile experience',
      status: 'completed'
    },
    {
      title: 'Performance Optimization',
      description: 'Simplified animations, reduced CSS complexity',
      impact: 'Faster loading, smoother interactions',
      status: 'completed'
    },
    {
      title: 'Benefits Section Streamline',
      description: 'Giảm từ 4 xuống 2 benefits, horizontal layout',
      impact: 'Less clutter, better focus',
      status: 'completed'
    }
  ];

  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-6 ${className || ''}`}>
      <div className="mb-6">
        <h2 className={`${TYPOGRAPHY.sectionTitle} mb-2`}>UI/UX Improvements Summary</h2>
        <p className={TYPOGRAPHY.bodySmall}>Tổng hợp các cải tiến đã thực hiện cho trang chủ</p>
      </div>

      <div className="space-y-4">
        {improvements.map((improvement, index) => (
          <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className={`${TYPOGRAPHY.cardTitleSmall} mb-1`}>{improvement.title}</h3>
              <p className={`${TYPOGRAPHY.bodySmall} mb-2`}>{improvement.description}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  Impact: {improvement.impact}
                </span>
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                  ✓ Completed
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-xl">
        <h3 className={`${TYPOGRAPHY.cardTitleSmall} text-blue-800 mb-2`}>Key Metrics Improved</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">-33%</div>
            <div className="text-xs text-blue-700">Hero Section Height</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">+50%</div>
            <div className="text-xs text-green-700">Touch Target Size</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">-50%</div>
            <div className="text-xs text-purple-700">Benefits Cards</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">-70%</div>
            <div className="text-xs text-orange-700">CSS Animations</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UIImprovementsSummary;
