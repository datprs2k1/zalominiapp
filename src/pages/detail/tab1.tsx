import { useContext } from 'react';
import { DetailPageContext } from './context';
import TransitionLink from '@/components/transition-link';

export default function Tab1() {
  const { tab1 } = useContext(DetailPageContext);

  return (
    <div className="p-6 sm:p-8">
      <div
        className="prose prose-teal max-w-none prose-headings:text-teal-900 prose-headings:font-bold prose-p:text-gray-700 prose-a:text-teal-600 prose-img:rounded-lg"
        dangerouslySetInnerHTML={{ __html: tab1.htmlContent }}
      />

      {/* Call to action */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Bạn cần tư vấn thêm?</h3>
        <p className="text-sm text-gray-600 mb-4">
          Các bác sĩ của chúng tôi sẵn sàng giải đáp thắc mắc của bạn về chuyên khoa này
        </p>
        <div className="flex flex-wrap gap-3">
          <TransitionLink to="/booking" className="w-full">
            <button className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 transition flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Đặt lịch hẹn
            </button>
          </TransitionLink>
        </div>
      </div>
    </div>
  );
}
