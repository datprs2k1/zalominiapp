import Section from '@/components/section';
import TransitionLink from '@/components/transition-link';
import book from '@/static/book.svg';
import history from '@/static/history.svg';
import { To } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getColorToken } from '@/styles/unified-color-system';

interface QuickActionProps {
  to: To;
  icon: string;
  title: string;
  subtitle: string;
  color?: string;
  gradient?: string;
  priority?: 'high' | 'medium' | 'low';
  isEmergency?: boolean;
  ariaLabel?: string;
}

const QuickAction = ({
  icon,
  title,
  subtitle,
  to,
  color = 'blue',
  gradient,
  priority = 'medium',
  isEmergency = false,
  ariaLabel,
}: QuickActionProps) => {
  const isExternal = typeof to === 'string' && (to.startsWith('tel:') || to.startsWith('http'));

  const ActionContent = (
    <motion.div
      whileHover={{
        y: -4,
        scale: 1.02,
        transition: { duration: 0.2, ease: 'easeOut' },
      }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative flex flex-col items-center justify-center gap-3 rounded-2xl bg-white p-5
        shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100
        medical-focus hover:border-gray-200
        ${priority === 'high' ? 'ring-2 ring-blue-200 ring-opacity-50' : ''}
        ${isEmergency ? 'medical-pulse border-red-200 bg-red-50' : ''}
      `}
    >
      {/* Priority Indicator */}
      {priority === 'high' && !isEmergency && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full border-2 border-white"></div>
      )}

      {/* Emergency Badge */}
      {isEmergency && (
        <div className="absolute top-2 right-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            24/7
          </span>
        </div>
      )}

      <div
        className={`h-14 w-14 rounded-full flex items-center justify-center ${
          gradient ? gradient : `bg-${color}-50`
        } shadow-sm transition-transform duration-200 hover:scale-110`}
      >
        <img src={icon} className="h-7 w-7" alt={title} />
      </div>
      <div className="flex flex-col items-center text-center">
        <div className={`text-base font-semibold ${isEmergency ? 'text-red-800' : 'text-gray-800'}`}>{title}</div>
        <div className={`text-xs mt-0.5 ${isEmergency ? 'text-red-600' : 'text-gray-500'}`}>{subtitle}</div>
      </div>
    </motion.div>
  );

  if (isExternal) {
    return (
      <a href={to as string} className="block" aria-label={ariaLabel || `${title} - ${subtitle}`} role="button">
        {ActionContent}
      </a>
    );
  }

  return (
    <TransitionLink to={to} className="block" aria-label={ariaLabel || `${title} - ${subtitle}`}>
      {ActionContent}
    </TransitionLink>
  );
};

const QuickActions = () => {
  return (
    <motion.div
      className="px-4 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-blue-600 mr-3"
          >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
          </svg>
          Dịch vụ nhanh
        </h2>
        <p className="text-sm text-gray-600 ml-9">Truy cập nhanh các dịch vụ y tế quan trọng</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <QuickAction
          to="/booking"
          icon={book}
          title="Đặt lịch khám"
          subtitle="Đặt khám nhanh"
          gradient="bg-gradient-to-br from-blue-50 to-blue-100"
          priority="high"
          ariaLabel="Đặt lịch khám bệnh với bác sĩ chuyên khoa"
        />
        <QuickAction
          to="/doctor"
          icon={history}
          title="Tìm bác sĩ"
          subtitle="Đội ngũ chuyên gia"
          gradient="bg-gradient-to-br from-green-50 to-green-100"
          priority="high"
          ariaLabel="Tìm kiếm bác sĩ theo chuyên khoa"
        />
        <QuickAction
          to="/departments"
          icon={book}
          title="Khoa & Dịch vụ"
          subtitle="Tìm khoa phù hợp"
          gradient="bg-gradient-to-br from-cyan-50 to-cyan-100"
          ariaLabel="Xem các khoa và dịch vụ y tế"
        />
        <QuickAction
          to="/schedule"
          icon={history}
          title="Lịch sử khám"
          subtitle="Theo dõi hồ sơ"
          gradient="bg-gradient-to-br from-purple-50 to-purple-100"
          ariaLabel="Xem lịch sử khám bệnh và hồ sơ sức khỏe"
        />
      </div>

      {/* Emergency Contact Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-red-900">Cấp cứu 24/7</p>
              <p className="text-xs text-red-700">Gọi ngay khi cần hỗ trợ khẩn cấp</p>
            </div>
          </div>
          <a
            href="tel:115"
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors medical-focus"
            aria-label="Gọi cấp cứu 115"
          >
            Gọi 115
          </a>
        </div>
      </motion.div>

      {/* View All Services Button */}
      <div className="mt-3 flex justify-center">
        <TransitionLink
          to="/services"
          className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:text-blue-700 px-4 py-2 rounded-full active:bg-blue-50 transition-colors"
        >
          Xem tất cả dịch vụ
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </TransitionLink>
      </div>
    </motion.div>
  );
};

export default QuickActions;
