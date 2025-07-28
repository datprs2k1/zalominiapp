import { useContext } from 'react';
import { DetailPageContext } from './context';
import TransitionLink from '@/components/transition-link';
import { motion } from 'framer-motion';
import { MedicalIcon } from '@/components/medical/MedicalServiceComponents';

export default function Tab1() {
  const { tab1 } = useContext(DetailPageContext);

  return (
    <div>
      {/* Enhanced Medical Content Area */}
      <motion.div
        className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-blue-100"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
            <MedicalIcon type="heart" size="md" className="text-blue-700" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Thông tin chi tiết</h3>
            <p className="text-sm text-blue-600">Tìm hiểu về dịch vụ y tế chuyên nghiệp</p>
          </div>
        </div>

        {/* Enhanced Medical Content */}
        <div
          className="prose prose-blue max-w-none text-base prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:font-semibold prose-img:rounded-xl prose-img:shadow-md prose-li:text-gray-700 prose-strong:text-gray-900 prose-strong:font-bold prose-ul:space-y-2 prose-ol:space-y-2"
          dangerouslySetInnerHTML={{ __html: tab1.htmlContent }}
        />

        {/* Medical Service Features */}
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-100">
          <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Ưu điểm nổi bật
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Đội ngũ bác sĩ chuyên gia</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Trang thiết bị hiện đại</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Dịch vụ 24/7</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Tư vấn chuyên nghiệp</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Call to Action - Mobile Optimized */}
      <motion.div
        className="bg-gradient-to-br from-primary/5 via-blue-50 to-primary/10 p-4 sm:p-6 rounded-lg sm:rounded-2xl border border-primary/20"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="p-2 sm:p-3 bg-primary rounded-lg sm:rounded-xl shadow-lg">
            <MedicalIcon type="heart" size="sm" className="text-white" animate />
          </div>
          <div className="flex-1">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Cần hỗ trợ tư vấn?</h3>
            <p className="text-sm sm:text-base text-gray-800 mb-4 sm:mb-6 font-medium">
              Đội ngũ bác sĩ chuyên khoa giàu kinh nghiệm sẵn sàng tư vấn và hỗ trợ bạn 24/7
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <TransitionLink to="/booking">
                <motion.button
                  className="w-full bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg sm:rounded-xl px-4 sm:px-6 py-3 sm:py-4 font-semibold shadow-lg flex items-center justify-center gap-2 sm:gap-3 group text-sm sm:text-base"
                  whileHover={{ scale: 1.01, y: -1 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <MedicalIcon type="stethoscope" size="sm" className="text-white group-hover:animate-pulse" />
                  Đặt lịch khám
                </motion.button>
              </TransitionLink>

              <TransitionLink to="/ask">
                <motion.button
                  className="w-full bg-white border-2 border-primary text-primary rounded-lg sm:rounded-xl px-4 sm:px-6 py-3 sm:py-4 font-semibold shadow-lg flex items-center justify-center gap-2 sm:gap-3 group hover:bg-primary/5 text-sm sm:text-base"
                  whileHover={{ scale: 1.01, y: -1 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 group-hover:animate-bounce"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  Tư vấn trực tuyến
                </motion.button>
              </TransitionLink>
            </div>

            {/* Quick Contact Info - Mobile Optimized */}
            <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-white/90 rounded-lg sm:rounded-xl border border-white/80 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-800 font-medium">Trực tuyến 24/7</span>
                </div>
                <div className="flex items-center gap-2 text-primary font-bold">
                  <MedicalIcon type="cross" size="sm" />
                  <span>Hotline: 1900-xxxx</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Related Content - Mobile Optimized */}
      <motion.div
        className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-2xl shadow-md border border-gray-100"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="p-2 sm:p-3 bg-green-200 rounded-lg">
            <MedicalIcon type="pill" size="sm" className="text-green-800" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">Thông tin hữu ích</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {[
            {
              title: 'Hướng dẫn chuẩn bị khám',
              description: 'Những điều cần lưu ý trước khi đến khám',
              icon: 'stethoscope',
              bgColor: 'bg-blue-50',
              borderColor: 'border-blue-200',
              iconBg: 'bg-blue-100',
              iconColor: 'text-blue-700',
              hoverBg: 'hover:bg-blue-100',
            },
            {
              title: 'Quy trình khám bệnh',
              description: 'Tìm hiểu quy trình khám tại chuyên khoa',
              icon: 'heart',
              bgColor: 'bg-red-50',
              borderColor: 'border-red-200',
              iconBg: 'bg-red-100',
              iconColor: 'text-red-700',
              hoverBg: 'hover:bg-red-100',
            },
            {
              title: 'Câu hỏi thường gặp',
              description: 'Giải đáp các thắc mắc phổ biến',
              icon: 'pill',
              bgColor: 'bg-green-50',
              borderColor: 'border-green-200',
              iconBg: 'bg-green-100',
              iconColor: 'text-green-700',
              hoverBg: 'hover:bg-green-100',
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 ${item.borderColor} ${item.bgColor} ${item.hoverBg} cursor-pointer group transition-colors duration-200`}
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: 0.2 }}
            >
              <div className={`p-1.5 sm:p-2 ${item.iconBg} rounded-lg w-fit mb-2 sm:mb-3 transition-colors`}>
                <MedicalIcon type={item.icon as any} size="sm" className={item.iconColor} />
              </div>
              <h4 className="font-bold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">{item.title}</h4>
              <p className="text-xs sm:text-sm text-gray-800 font-medium">{item.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Tips - Mobile Optimized */}
        <div className="mt-4 sm:mt-6 p-3 sm:p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl border-2 border-blue-200 shadow-sm">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-blue-200 rounded-lg">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-blue-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Lưu ý quan trọng</h4>
              <ul className="text-xs sm:text-sm text-gray-800 space-y-1.5 sm:space-y-2 font-medium">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Mang theo các kết quả xét nghiệm gần nhất (nếu có)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Chuẩn bị danh sách thuốc đang sử dụng</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Đến sớm 15 phút để làm thủ tục</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Liên hệ trước nếu cần hủy/đổi lịch hẹn</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
