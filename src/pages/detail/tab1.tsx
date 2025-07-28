import { useContext } from 'react';
import { DetailPageContext } from './context';
import TransitionLink from '@/components/transition-link';
import { motion } from 'framer-motion';
import { MedicalIcon } from '@/components/medical/MedicalServiceComponents';

export default function Tab1() {
  const { tab1 } = useContext(DetailPageContext);

  return (
    <div>
      {/* Main Content Area - Mobile Optimized */}
      <motion.div
        className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-2xl shadow-md border border-gray-100"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="p-2 sm:p-3 bg-blue-200 rounded-lg">
            <MedicalIcon type="heart" size="sm" className="text-blue-800" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">Thông tin chi tiết</h3>
        </div>

        <div
          className="prose prose-blue max-w-none text-sm sm:text-base prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-800 prose-p:font-medium prose-a:text-primary prose-a:font-semibold prose-img:rounded-lg prose-li:text-gray-800 prose-li:font-medium prose-strong:text-gray-900 prose-strong:font-bold"
          dangerouslySetInnerHTML={{ __html: tab1.htmlContent }}
        />
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
