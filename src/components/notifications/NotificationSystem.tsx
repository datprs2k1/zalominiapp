import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { getColorToken } from '@/styles/unified-color-system';

export interface MedicalNotification {
  id: string;
  type: 'appointment' | 'emergency' | 'reminder' | 'result' | 'payment' | 'general';
  title: string;
  message: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  patientId?: string;
  doctorId?: string;
  appointmentId?: string;
}

interface NotificationSystemProps {
  notifications: MedicalNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDismiss: (id: string) => void;
  onAction: (notification: MedicalNotification) => void;
  maxVisible?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDismiss,
  onAction,
  maxVisible = 5,
  position = 'top-right'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  
  const unreadCount = notifications.filter(n => !n.read).length;
  const visibleNotifications = notifications.slice(0, maxVisible);

  const getNotificationIcon = (type: MedicalNotification['type']) => {
    switch (type) {
      case 'appointment':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
          </svg>
        );
      case 'emergency':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        );
      case 'reminder':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        );
      case 'result':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
          </svg>
        );
      case 'payment':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        );
    }
  };

  const getNotificationColor = (type: MedicalNotification['type'], priority: MedicalNotification['priority']) => {
    if (priority === 'critical') return 'red';
    
    switch (type) {
      case 'appointment': return 'blue';
      case 'emergency': return 'red';
      case 'reminder': return 'orange';
      case 'result': return 'green';
      case 'payment': return 'purple';
      default: return 'gray';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    return `${days} ngày trước`;
  };

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50 max-w-sm w-full`}>
      {/* Notification Bell/Toggle */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mb-4 ml-auto flex items-center gap-2 bg-white rounded-full shadow-lg border border-blue-100 px-4 py-2 hover:shadow-xl transition-all"
        whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
        whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
      >
        <div className="relative">
          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
          </svg>
          {unreadCount > 0 && (
            <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">{unreadCount > 9 ? '9+' : unreadCount}</span>
            </div>
          )}
        </div>
        <span className="text-sm font-medium text-gray-700">Thông báo</span>
      </motion.button>

      {/* Notifications Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? {} : { opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl border border-blue-100 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 border-b border-blue-100">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Thông báo y tế</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Đánh dấu tất cả đã đọc
                  </button>
                )}
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {visibleNotifications.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 7H4l5-5v5z"/>
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500">Không có thông báo mới</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {visibleNotifications.map((notification, index) => {
                    const color = getNotificationColor(notification.type, notification.priority);
                    const icon = getNotificationIcon(notification.type);
                    
                    return (
                      <motion.div
                        key={notification.id}
                        initial={prefersReducedMotion ? {} : { opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className={`p-4 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50/50' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                            ${color === 'blue' ? 'bg-blue-100 text-blue-600' : ''}
                            ${color === 'red' ? 'bg-red-100 text-red-600' : ''}
                            ${color === 'green' ? 'bg-green-100 text-green-600' : ''}
                            ${color === 'orange' ? 'bg-orange-100 text-orange-600' : ''}
                            ${color === 'purple' ? 'bg-purple-100 text-purple-600' : ''}
                            ${color === 'gray' ? 'bg-gray-100 text-gray-600' : ''}
                          `}>
                            {icon}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <h4 className="text-sm font-medium text-gray-900 truncate">{notification.title}</h4>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2 mt-1"></div>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-gray-400">{formatTimeAgo(notification.timestamp)}</span>
                              <div className="flex items-center gap-2">
                                {notification.actionUrl && (
                                  <button
                                    onClick={() => onAction(notification)}
                                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                  >
                                    {notification.actionLabel || 'Xem'}
                                  </button>
                                )}
                                <button
                                  onClick={() => onDismiss(notification.id)}
                                  className="text-xs text-gray-400 hover:text-gray-600"
                                >
                                  Ẩn
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > maxVisible && (
              <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
                <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                  Xem tất cả ({notifications.length} thông báo)
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationSystem;
