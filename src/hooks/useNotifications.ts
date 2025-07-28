import { useState, useEffect, useCallback } from 'react';
import { MedicalNotification } from '@/components/notifications/NotificationSystem';

interface NotificationOptions {
  enableRealTime?: boolean;
  maxNotifications?: number;
  autoMarkAsRead?: boolean;
  persistToStorage?: boolean;
}

export const useNotifications = (options: NotificationOptions = {}) => {
  const {
    enableRealTime = true,
    maxNotifications = 50,
    autoMarkAsRead = false,
    persistToStorage = true
  } = options;

  const [notifications, setNotifications] = useState<MedicalNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load notifications from storage on mount
  useEffect(() => {
    if (persistToStorage) {
      const stored = localStorage.getItem('medical-notifications');
      if (stored) {
        try {
          const parsed = JSON.parse(stored).map((n: any) => ({
            ...n,
            timestamp: new Date(n.timestamp)
          }));
          setNotifications(parsed);
        } catch (error) {
          console.error('Failed to load notifications from storage:', error);
        }
      }
    }
  }, [persistToStorage]);

  // Save notifications to storage when they change
  useEffect(() => {
    if (persistToStorage && notifications.length > 0) {
      localStorage.setItem('medical-notifications', JSON.stringify(notifications));
    }
  }, [notifications, persistToStorage]);

  // Mock real-time notification simulation
  useEffect(() => {
    if (!enableRealTime) return;

    const interval = setInterval(() => {
      // Simulate receiving a random notification
      if (Math.random() < 0.1) { // 10% chance every 30 seconds
        const mockNotifications: Omit<MedicalNotification, 'id' | 'timestamp' | 'read'>[] = [
          {
            type: 'appointment',
            title: 'Nhắc nhở lịch khám',
            message: 'Bạn có lịch khám với BS. Nguyễn Văn A vào 14:00 ngày mai',
            priority: 'medium',
            actionUrl: '/schedule',
            actionLabel: 'Xem lịch'
          },
          {
            type: 'result',
            title: 'Kết quả xét nghiệm',
            message: 'Kết quả xét nghiệm máu của bạn đã có. Vui lòng kiểm tra.',
            priority: 'high',
            actionUrl: '/schedule/1',
            actionLabel: 'Xem kết quả'
          },
          {
            type: 'payment',
            title: 'Hóa đơn cần thanh toán',
            message: 'Bạn có 1 hóa đơn chưa thanh toán. Hạn thanh toán: 3 ngày.',
            priority: 'medium',
            actionUrl: '/invoices',
            actionLabel: 'Thanh toán'
          },
          {
            type: 'reminder',
            title: 'Uống thuốc',
            message: 'Đã đến giờ uống thuốc theo đơn của bác sĩ',
            priority: 'high',
            actionUrl: '/schedule',
            actionLabel: 'Xem đơn thuốc'
          }
        ];

        const randomNotification = mockNotifications[Math.floor(Math.random() * mockNotifications.length)];
        addNotification(randomNotification);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [enableRealTime]);

  const addNotification = useCallback((notification: Omit<MedicalNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: MedicalNotification = {
      ...notification,
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      // Keep only the latest notifications
      return updated.slice(0, maxNotifications);
    });

    // Show browser notification if permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/medical-icon.png',
        badge: '/medical-badge.png',
        tag: newNotification.id
      });
    }

    return newNotification.id;
  }, [maxNotifications]);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    if (persistToStorage) {
      localStorage.removeItem('medical-notifications');
    }
  }, [persistToStorage]);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }, []);

  // Get notification counts
  const unreadCount = notifications.filter(n => !n.read).length;
  const totalCount = notifications.length;

  // Get notifications by type
  const getNotificationsByType = useCallback((type: MedicalNotification['type']) => {
    return notifications.filter(n => n.type === type);
  }, [notifications]);

  // Get notifications by priority
  const getNotificationsByPriority = useCallback((priority: MedicalNotification['priority']) => {
    return notifications.filter(n => n.priority === priority);
  }, [notifications]);

  // Auto-mark as read when viewed
  useEffect(() => {
    if (autoMarkAsRead && notifications.length > 0) {
      const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
      if (unreadIds.length > 0) {
        setTimeout(() => {
          unreadIds.forEach(markAsRead);
        }, 2000); // Mark as read after 2 seconds
      }
    }
  }, [notifications, autoMarkAsRead, markAsRead]);

  return {
    notifications,
    unreadCount,
    totalCount,
    isLoading,
    addNotification,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    clearAllNotifications,
    requestNotificationPermission,
    getNotificationsByType,
    getNotificationsByPriority
  };
};

// Predefined notification templates for common medical scenarios
export const createAppointmentReminder = (doctorName: string, time: string): Omit<MedicalNotification, 'id' | 'timestamp' | 'read'> => ({
  type: 'appointment',
  title: 'Nhắc nhở lịch khám',
  message: `Bạn có lịch khám với ${doctorName} vào ${time}`,
  priority: 'medium',
  actionUrl: '/schedule',
  actionLabel: 'Xem lịch'
});

export const createTestResultNotification = (testType: string): Omit<MedicalNotification, 'id' | 'timestamp' | 'read'> => ({
  type: 'result',
  title: 'Kết quả xét nghiệm',
  message: `Kết quả ${testType} của bạn đã có. Vui lòng kiểm tra.`,
  priority: 'high',
  actionUrl: '/schedule',
  actionLabel: 'Xem kết quả'
});

export const createPaymentReminder = (amount: string, dueDate: string): Omit<MedicalNotification, 'id' | 'timestamp' | 'read'> => ({
  type: 'payment',
  title: 'Hóa đơn cần thanh toán',
  message: `Bạn có hóa đơn ${amount} cần thanh toán trước ${dueDate}`,
  priority: 'medium',
  actionUrl: '/invoices',
  actionLabel: 'Thanh toán'
});

export const createMedicationReminder = (medicationName: string): Omit<MedicalNotification, 'id' | 'timestamp' | 'read'> => ({
  type: 'reminder',
  title: 'Nhắc nhở uống thuốc',
  message: `Đã đến giờ uống ${medicationName} theo đơn của bác sĩ`,
  priority: 'high',
  actionUrl: '/schedule',
  actionLabel: 'Xem đơn thuốc'
});

export const createEmergencyAlert = (message: string): Omit<MedicalNotification, 'id' | 'timestamp' | 'read'> => ({
  type: 'emergency',
  title: 'Cảnh báo khẩn cấp',
  message,
  priority: 'critical',
  actionUrl: '/emergency',
  actionLabel: 'Xem chi tiết'
});
