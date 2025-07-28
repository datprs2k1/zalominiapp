import FabForm from '@/components/form/fab-form';
import SuccessIcon from '@/components/icons/success';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';

function QuestionSentSuccessfully() {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className="flex-1 bg-gradient-to-br from-green-50/30 via-white to-blue-50/30 min-h-screen"
      initial={prefersReducedMotion ? {} : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <FabForm
        fab={{
          children: 'Về trang chủ',
          onClick() {
            navigate('/', {
              viewTransition: true,
            });
          },
        }}
      >
        <div className="h-full flex justify-center items-center flex-col gap-6 text-center px-6">
          {/* Enhanced Success Animation */}
          <motion.div
            className="relative"
            initial={prefersReducedMotion ? {} : { scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.2,
              type: 'spring',
              stiffness: 200,
              damping: 15,
            }}
          >
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            {/* Animated rings */}
            <div className="absolute inset-0 rounded-full border-4 border-green-300 animate-ping opacity-75"></div>
            <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-pulse"></div>
          </motion.div>

          {/* Enhanced Success Message */}
          <motion.div
            className="space-y-4"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h1 className="text-2xl font-bold text-gray-900">Gửi câu hỏi thành công!</h1>
            <p className="text-gray-600 leading-relaxed max-w-md">
              Câu hỏi của bạn đã được gửi tới đội ngũ bác sĩ chuyên khoa. Chúng tôi sẽ phản hồi trong vòng{' '}
              <span className="font-semibold text-blue-600">24 giờ</span>.
            </p>
          </motion.div>

          {/* Enhanced Information Cards */}
          <motion.div
            className="grid grid-cols-1 gap-4 w-full max-w-md"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-blue-900">Thời gian phản hồi</h3>
                  <p className="text-sm text-blue-700">Trong vòng 24 giờ</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-green-900">Bác sĩ chuyên khoa</h3>
                  <p className="text-sm text-green-700">Tư vấn chuyên nghiệp</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-purple-900">Bảo mật thông tin</h3>
                  <p className="text-sm text-purple-700">An toàn tuyệt đối</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Additional Actions */}
          <motion.div
            className="flex flex-col gap-3 w-full max-w-md"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <button
              onClick={() => navigate('/ask')}
              className="w-full bg-white border-2 border-blue-600 text-blue-600 py-3 rounded-xl font-medium hover:bg-blue-50 transition-colors"
            >
              Đặt câu hỏi khác
            </button>
          </motion.div>
        </div>
      </FabForm>
    </motion.div>
  );
}

export default QuestionSentSuccessfully;
