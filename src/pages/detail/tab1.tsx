import { useContext } from 'react';
import { DetailPageContext } from './context';
import TransitionLink from '@/components/transition-link';

export default function Tab1() {
  const { tab1 } = useContext(DetailPageContext);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Content Section */}
      <div className="bg-white rounded-medical-lg p-6 shadow-card-medical border border-medical-100">
        <div
          className="prose prose-medical max-w-none
            prose-headings:text-medical-800 prose-headings:font-bold prose-headings:mb-4
            prose-p:text-neutral-700 prose-p:leading-relaxed prose-p:mb-4
            prose-a:text-medical-600 prose-a:font-medium prose-a:no-underline hover:prose-a:text-medical-700
            prose-img:rounded-medical prose-img:shadow-subtle
            prose-ul:text-neutral-700 prose-li:mb-2
            prose-strong:text-medical-800 prose-strong:font-semibold"
          dangerouslySetInnerHTML={{ __html: tab1.htmlContent }}
        />
      </div>

      {/* Enhanced Call to Action Card */}
      <div className="bg-gradient-to-br from-medical-50 via-medical-100/50 to-medical-200/30 rounded-medical-xl p-6 border border-medical-200/50 shadow-card-medical backdrop-blur-sm">
        {/* Header with Icon */}
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-medical-500 rounded-medical flex items-center justify-center shadow-button-medical">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-medical-heading text-medical-800 font-bold">Bạn cần tư vấn thêm?</h3>
            <p className="text-medical-body text-medical-600 mt-1">Đội ngũ bác sĩ chuyên khoa</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-medical-body text-neutral-700 mb-6 leading-relaxed">
          Các bác sĩ chuyên khoa của chúng tôi sẵn sàng giải đáp mọi thắc mắc và tư vấn chi tiết về tình trạng sức khỏe
          của bạn.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <TransitionLink to="/booking" className="flex-1">
            <button className="btn-medical-primary w-full group">
              <svg
                className="w-5 h-5 group-hover:scale-110 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>Đặt lịch hẹn</span>
            </button>
          </TransitionLink>

          <button className="btn-medical-secondary flex-1 group">
            <svg
              className="w-5 h-5 group-hover:scale-110 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span>Gọi tư vấn</span>
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-6 pt-4 border-t border-medical-200/50">
          <div className="flex items-center justify-center space-x-6 text-xs text-medical-600">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-success-500 rounded-full mr-2"></div>
              <span>Bác sĩ chuyên khoa</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-success-500 rounded-full mr-2"></div>
              <span>Tư vấn miễn phí</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-success-500 rounded-full mr-2"></div>
              <span>24/7 hỗ trợ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
