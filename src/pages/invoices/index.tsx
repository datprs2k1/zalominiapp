import { Button } from '@/components/button';
import { DashedDivider } from '@/components/dashed-divider';
import PolarizedList from '@/components/polarized-list';
import { invoicesState, userState } from '@/state';
import { useAtomValue } from 'jotai';
import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { getColorToken } from '@/styles/unified-color-system';

function InvoicesPage() {
  const { userInfo } = useAtomValue(userState);
  const invoices = useAtomValue(invoicesState);
  const prefersReducedMotion = useReducedMotion();
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredInvoices = invoices.filter((invoice) => {
    if (filterStatus === 'all') return true;
    // Add status filtering logic here based on invoice status
    return true;
  });

  const getInvoiceStatus = (invoice: any) => {
    // Mock status logic - in real app this would come from invoice data
    const statuses = ['Đã thanh toán', 'Chờ thanh toán', 'Quá hạn'];
    return statuses[invoice.id % 3];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Đã thanh toán':
        return 'green';
      case 'Chờ thanh toán':
        return 'blue';
      case 'Quá hạn':
        return 'red';
      default:
        return 'gray';
    }
  };

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
              <path d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold">Hóa đơn y tế</h1>
            <p className="text-blue-100 text-sm">Quản lý thanh toán và hóa đơn khám bệnh</p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold mb-1">{invoices.length}</div>
            <div className="text-xs text-blue-100">Tổng hóa đơn</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold mb-1 text-green-300">2</div>
            <div className="text-xs text-blue-100">Đã thanh toán</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold mb-1 text-orange-300">1</div>
            <div className="text-xs text-blue-100">Chờ thanh toán</div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Invoice List */}
      <motion.div
        className="px-4 py-6 space-y-4"
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {filteredInvoices.length === 0 ? (
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có hóa đơn</h3>
            <p className="text-gray-500">Bạn chưa có hóa đơn y tế nào</p>
          </motion.div>
        ) : (
          filteredInvoices.map((invoice, index) => {
            const status = getInvoiceStatus(invoice);
            const statusColor = getStatusColor(status);

            return (
              <motion.div
                key={invoice.id}
                className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden"
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                whileHover={prefersReducedMotion ? {} : { y: -2, scale: 1.01 }}
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 border-b border-blue-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{invoice.booking.department.name}</h3>
                        <p className="text-sm text-blue-600">Hóa đơn #{invoice.id.toString().padStart(6, '0')}</p>
                      </div>
                    </div>

                    <div
                      className={`
                      flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium
                      ${statusColor === 'green' ? 'bg-green-100 text-green-700' : ''}
                      ${statusColor === 'blue' ? 'bg-blue-100 text-blue-700' : ''}
                      ${statusColor === 'red' ? 'bg-red-100 text-red-700' : ''}
                    `}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          statusColor === 'green'
                            ? 'bg-green-500'
                            : statusColor === 'blue'
                              ? 'bg-blue-500'
                              : statusColor === 'red'
                                ? 'bg-red-500'
                                : 'bg-gray-500'
                        }`}
                      ></div>
                      <span>{status}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <PolarizedList
                    items={[
                      ['Bệnh nhân', userInfo.name],
                      ['Bệnh viện', 'Bệnh viện Quốc tế Gia Hội Thượng Hải'],
                      ['Khoa khám', invoice.booking.department.name],
                      ['Thời gian', '2022.02.16 Thứ Tư 09:00-09:30'],
                      ['Loại khám', 'Khám bệnh - Khám lần đầu'],
                      ['Tổng tiền', '500.000 VNĐ'],
                    ]}
                  />
                </div>

                {/* Actions */}
                <div className="p-6 pt-0">
                  {status === 'Chờ thanh toán' ? (
                    <div className="flex gap-3">
                      <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">Thanh toán ngay</Button>
                      <button className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors">
                        Xem chi tiết
                      </button>
                    </div>
                  ) : status === 'Đã thanh toán' ? (
                    <div className="flex gap-3">
                      <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition-colors">
                        Tải hóa đơn
                      </button>
                      <button className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors">
                        Xem chi tiết
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white">Thanh toán quá hạn</Button>
                      <button className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors">
                        Liên hệ hỗ trợ
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </motion.div>
    </motion.div>
  );
}

export default InvoicesPage;
