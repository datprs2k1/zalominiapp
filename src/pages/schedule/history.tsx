import { useAtomValue } from 'jotai';
import { ScheduleItem } from './schedule-item';
import { schedulesState } from '@/state';
import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { getColorToken } from '@/styles/unified-color-system';

function ScheduleHistoryPage() {
  const schedules = useAtomValue(schedulesState);
  const prefersReducedMotion = useReducedMotion();
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredSchedules = schedules.filter((schedule) => {
    if (filterStatus === 'all') return true;
    return schedule.status.toLowerCase().includes(filterStatus);
  });

  const statusOptions = [
    { value: 'all', label: 'Tất cả', count: schedules.length },
    {
      value: 'hoàn thành',
      label: 'Hoàn thành',
      count: schedules.filter((s) => s.status.toLowerCase().includes('hoàn thành')).length,
    },
    { value: 'đã hủy', label: 'Đã hủy', count: schedules.filter((s) => s.status.toLowerCase().includes('hủy')).length },
    {
      value: 'sắp tới',
      label: 'Sắp tới',
      count: schedules.filter((s) => s.status.toLowerCase().includes('sắp tới')).length,
    },
  ];

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
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold">Lịch sử khám bệnh</h1>
            <p className="text-blue-100 text-sm">Theo dõi các lần khám và điều trị</p>
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilterStatus(option.value)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
                ${filterStatus === option.value ? 'bg-white text-blue-600' : 'bg-white/20 text-white hover:bg-white/30'}
              `}
            >
              <span>{option.label}</span>
              <span
                className={`
                px-2 py-0.5 rounded-full text-xs
                ${filterStatus === option.value ? 'bg-blue-100 text-blue-600' : 'bg-white/20 text-white'}
              `}
              >
                {option.count}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Enhanced Schedule List */}
      <motion.div
        className="px-4 py-6 space-y-4"
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {filteredSchedules.length === 0 ? (
          <motion.div
            className="text-center py-12"
            initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không có lịch khám</h3>
            <p className="text-gray-500 mb-6">Chưa có lịch khám nào với bộ lọc này</p>
            <button
              onClick={() => setFilterStatus('all')}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors"
            >
              Xem tất cả
            </button>
          </motion.div>
        ) : (
          filteredSchedules.map((item, index) => (
            <motion.div
              key={index}
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
            >
              <ScheduleItem schedule={item} />
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
}

export default ScheduleHistoryPage;
