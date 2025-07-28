import DoctorItem from '@/components/items/doctor';
import PolarizedList from '@/components/polarized-list';
import { bookingFormState, scheduleByIdState } from '@/state';
import { useAtomValue, useSetAtom } from 'jotai';
import { useNavigate, useParams } from 'react-router-dom';
import NotFound from '../404';
import { TestResult } from './test-result';
import FabForm from '@/components/form/fab-form';
import { formatDayName, formatFullDate } from '@/utils/format';
import { motion, useReducedMotion } from 'framer-motion';
import { getColorToken } from '@/styles/unified-color-system';
import { combineClasses } from '@/utils/combine-classes';

function ScheduleDetailPage() {
  const { id } = useParams();
  const schedule = useAtomValue(scheduleByIdState(Number(id)));
  const navigate = useNavigate();
  const setBookingData = useSetAtom(bookingFormState);
  const prefersReducedMotion = useReducedMotion();

  if (!schedule) {
    return <NotFound />;
  }

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('hoàn thành')) return 'green';
    if (statusLower.includes('hủy')) return 'red';
    if (statusLower.includes('sắp tới')) return 'blue';
    return 'gray';
  };

  const statusColor = getStatusColor(schedule.status);

  return (
    <motion.div
      className="flex-1 bg-gradient-to-br from-blue-50/30 via-white to-green-50/30 min-h-screen"
      initial={prefersReducedMotion ? {} : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Enhanced Medical Header */}
      <motion.div
        className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white"
        initial={prefersReducedMotion ? {} : { opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold">Chi tiết lịch khám</h1>
            <p className="text-blue-100 text-sm">Thông tin chi tiết về cuộc hẹn khám bệnh</p>
          </div>
        </div>

        {/* Status Badge */}
        <div
          className={`
          inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
          ${statusColor === 'green' ? 'bg-green-500/20 text-green-100 border border-green-400/30' : ''}
          ${statusColor === 'red' ? 'bg-red-500/20 text-red-100 border border-red-400/30' : ''}
          ${statusColor === 'blue' ? 'bg-blue-500/20 text-blue-100 border border-blue-400/30' : ''}
          ${statusColor === 'gray' ? 'bg-gray-500/20 text-gray-100 border border-gray-400/30' : ''}
        `}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              statusColor === 'green'
                ? 'bg-green-400'
                : statusColor === 'red'
                  ? 'bg-red-400'
                  : statusColor === 'blue'
                    ? 'bg-blue-400'
                    : 'bg-gray-400'
            } animate-pulse`}
          ></div>
          <span>{schedule.status}</span>
        </div>
      </motion.div>

      <FabForm
        fab={{
          children: schedule.status.toLowerCase().includes('hoàn thành') ? 'Tái khám' : 'Chỉnh sửa',
          onClick() {
            setBookingData((prev) => ({
              ...prev,
              ...schedule,
            }));
            navigate('/booking', {
              viewTransition: true,
            });
          },
        }}
      >
        <motion.div
          className="px-4 py-6 space-y-6"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Enhanced Appointment Overview */}
          <motion.div
            className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 border-b border-blue-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{schedule.department.title}</h2>
                    <p className="text-sm text-blue-600">Thông tin cuộc hẹn khám bệnh</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Doctor Information */}
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Bác sĩ phụ trách
              </h3>
              <DoctorItem doctor={schedule.doctor} />
            </div>

            {/* Appointment Details */}
            <div className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Thông tin chi tiết
              </h3>
              <div className="bg-gray-50 rounded-xl p-4">
                <PolarizedList
                  items={[
                    ['Họ tên bệnh nhân', schedule.patientName],
                    ['Khoa khám', schedule.department.title],
                    [
                      'Thời gian khám',
                      `${formatFullDate(schedule.schedule.date)} - ${formatDayName(schedule.schedule.date)}`,
                    ],
                    ['Loại khám bệnh', 'Ngoại trú - Khám lần đầu'],
                    ['Phương thức thanh toán', 'Tự chi trả'],
                    ['Mã số hẹn', `#${schedule.id.toString().padStart(6, '0')}`],
                  ]}
                />
              </div>
            </div>
          </motion.div>
          {/* Enhanced Medical Records Section */}
          <motion.div
            className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 border-b border-green-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Hồ sơ y tế & Kết quả</h3>
                  <p className="text-sm text-green-600">Chi tiết khám bệnh và xét nghiệm</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <TestResult
                testType="Xét nghiệm hình ảnh"
                testName="X-Quang ngực"
                description="Kết quả X-Quang cho thấy phổi bình thường, không có dấu hiệu bất thường. Nhân viên tiếp đón của bệnh viện rất nhiệt tình, dịch vụ rất chu đáo, đây là bệnh viện có dịch vụ tốt nhất mà tôi đã từng đến."
              />
              <TestResult
                testType="Xét nghiệm máu"
                testName="Công thức máu & Sinh hóa"
                description="Các chỉ số máu trong giới hạn bình thường. Dịch vụ của bệnh viện rất tận tâm, bác sĩ cũng rất tốt bụng và hiền hòa, tay nghề của bác sĩ rất cao."
              />
              <TestResult
                testType="Đánh giá tổng quan"
                testName="Kết luận của bác sĩ"
                description="Tình trạng sức khỏe tổng quát tốt. Điều kiện vệ sinh của bệnh viện rất tốt, trong nhà vệ sinh có thể tắm. Cần cải thiện nhà ăn, ba bữa không giống nhau, cố gắng để mọi người ăn ngon và no."
              />
            </div>
          </motion.div>

          {/* Additional Actions */}
          {schedule.status.toLowerCase().includes('hoàn thành') && (
            <motion.div
              className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200"
              initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900">Đặt lịch tái khám</h4>
                    <p className="text-sm text-blue-700">Tiếp tục theo dõi sức khỏe với bác sĩ</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setBookingData((prev) => ({
                      ...prev,
                      ...schedule,
                    }));
                    navigate('/booking', { viewTransition: true });
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                >
                  Đặt ngay
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </FabForm>
    </motion.div>
  );
}

export default ScheduleDetailPage;
