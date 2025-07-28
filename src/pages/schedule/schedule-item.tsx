import DoctorItem from '@/components/items/doctor';
import TransitionLink from '@/components/transition-link';
import { Booking } from '@/types';
import { formatDayName, formatFullDate, formatShortDate } from '@/utils/format';
import { motion } from 'framer-motion';
import { getColorToken } from '@/styles/unified-color-system';

export interface ScheduleItemProps {
  schedule: Booking;
}

const getStatusColor = (status: string) => {
  const statusLower = status.toLowerCase();
  if (statusLower.includes('hoàn thành')) return 'green';
  if (statusLower.includes('hủy')) return 'red';
  if (statusLower.includes('sắp tới')) return 'blue';
  return 'gray';
};

const getStatusIcon = (status: string) => {
  const statusLower = status.toLowerCase();
  if (statusLower.includes('hoàn thành')) {
    return (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }
  if (statusLower.includes('hủy')) {
    return (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }
  if (statusLower.includes('sắp tới')) {
    return (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
};

export function ScheduleItem({ schedule }: ScheduleItemProps) {
  const statusColor = getStatusColor(schedule.status);
  const statusIcon = getStatusIcon(schedule.status);

  return (
    <TransitionLink to={`/schedule/${schedule.id}`}>
      <motion.div
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-200 medical-focus"
        whileHover={{ y: -2, scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        {/* Header with Department and Status */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{schedule.department.title}</h3>
              <p className="text-sm text-gray-500">Khám bệnh</p>
            </div>
          </div>

          <div
            className={`
            flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium
            ${statusColor === 'green' ? 'bg-green-100 text-green-700' : ''}
            ${statusColor === 'red' ? 'bg-red-100 text-red-700' : ''}
            ${statusColor === 'blue' ? 'bg-blue-100 text-blue-700' : ''}
            ${statusColor === 'gray' ? 'bg-gray-100 text-gray-700' : ''}
          `}
          >
            {statusIcon}
            <span>{schedule.status}</span>
          </div>
        </div>

        {/* Doctor Information */}
        <div className="mb-4">
          <DoctorItem doctor={schedule.doctor} />
        </div>

        {/* Appointment Details */}
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Bệnh nhân:</span>
              <p className="font-medium text-gray-900">{schedule.patientName}</p>
            </div>
            <div>
              <span className="text-gray-500">Ngày khám:</span>
              <p className="font-medium text-gray-900">{formatDayName(schedule.schedule.date)}</p>
              <p className="text-xs text-gray-500">{formatFullDate(schedule.schedule.date)}</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span>Xem chi tiết</span>
          </div>

          {schedule.status.toLowerCase().includes('hoàn thành') && (
            <button className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition-colors">
              Tái khám
            </button>
          )}
        </div>
      </motion.div>
    </TransitionLink>
  );
}
