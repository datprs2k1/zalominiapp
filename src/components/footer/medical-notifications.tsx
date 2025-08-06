/**
 * Medical Notification System
 * iOS Hospital App-inspired notification badges and alerts for footer navigation
 * 
 * @version 1.0.0
 * @author Medical Development Team
 * @since 2024-08-06
 * 
 * @features
 * - Medical notification badges with hospital context
 * - Appointment reminders and emergency alerts
 * - Health status updates and medical workflow integration
 * - iOS-style notification patterns with medical theming
 * - Real-time medical notification management
 */

import React, { memo, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MEDICAL_FOOTER_THEME } from './medical-theme';
import { medicalHaptics } from './medical-haptics';

// Medical Notification Types
export type MedicalNotificationType = 
  | 'appointment'        // Appointment reminders
  | 'emergency'          // Emergency alerts
  | 'urgent'             // Urgent medical notifications
  | 'medication'         // Medication reminders
  | 'test_result'        // Test result notifications
  | 'consultation'       // Consultation updates
  | 'health_status'      // Health status changes
  | 'system'             // System notifications
  | 'trust'              // Trust and security updates
  | 'reminder';          // General medical reminders

// Medical Notification Priority
export type MedicalNotificationPriority = 'low' | 'medium' | 'high' | 'critical';

// Medical Notification Interface
export interface MedicalNotification {
  id: string;
  type: MedicalNotificationType;
  priority: MedicalNotificationPriority;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionRequired?: boolean;
  medicalContext?: {
    patientId?: string;
    appointmentId?: string;
    doctorId?: string;
    medicationId?: string;
    testId?: string;
  };
  expiresAt?: Date;
  category?: 'emergency' | 'urgent' | 'routine' | 'consultation';
}

// Medical Notification Badge Props
interface MedicalNotificationBadgeProps {
  count: number;
  type: MedicalNotificationType;
  priority: MedicalNotificationPriority;
  hasUnread?: boolean;
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

// Medical Notification Badge Component
export const MedicalNotificationBadge: React.FC<MedicalNotificationBadgeProps> = memo(({
  count,
  type,
  priority,
  hasUnread = false,
  animated = true,
  size = 'md',
  onClick
}) => {
  const [isVisible, setIsVisible] = useState(count > 0);
  const [isPulsing, setIsPulsing] = useState(false);

  // Update visibility when count changes
  useEffect(() => {
    if (count > 0 && !isVisible) {
      setIsVisible(true);
      if (priority === 'critical' || type === 'emergency') {
        medicalHaptics.emergency();
        setIsPulsing(true);
        setTimeout(() => setIsPulsing(false), 2000);
      } else if (priority === 'high' || type === 'urgent') {
        medicalHaptics.urgent();
      } else {
        medicalHaptics.select();
      }
    } else if (count === 0) {
      setIsVisible(false);
      setIsPulsing(false);
    }
  }, [count, isVisible, priority, type]);

  // Get badge color based on type and priority
  const getBadgeColor = () => {
    if (type === 'emergency' || priority === 'critical') {
      return MEDICAL_FOOTER_THEME.colors.status.emergency;
    } else if (type === 'urgent' || priority === 'high') {
      return MEDICAL_FOOTER_THEME.colors.status.urgent;
    } else if (type === 'appointment' || type === 'consultation') {
      return MEDICAL_FOOTER_THEME.colors.status.consultation;
    } else if (type === 'medication' || type === 'reminder') {
      return MEDICAL_FOOTER_THEME.colors.badges.reminder;
    } else if (type === 'test_result') {
      return MEDICAL_FOOTER_THEME.colors.badges.completed;
    }
    return MEDICAL_FOOTER_THEME.colors.badges.pending;
  };

  // Get badge size
  const getBadgeSize = () => {
    switch (size) {
      case 'sm': return { width: 14, height: 14, fontSize: '8px' };
      case 'lg': return { width: 20, height: 20, fontSize: '12px' };
      default: return { width: 16, height: 16, fontSize: '10px' };
    }
  };

  const badgeSize = getBadgeSize();
  const badgeColor = getBadgeColor();

  // Animation variants
  const badgeVariants = {
    hidden: { 
      scale: 0, 
      opacity: 0,
      transition: { duration: 0.2 }
    },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: 'spring',
        stiffness: 500,
        damping: 30
      }
    },
    pulse: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  const handleClick = useCallback(() => {
    if (onClick) {
      if (type === 'emergency') {
        medicalHaptics.emergency();
      } else if (type === 'urgent') {
        medicalHaptics.urgent();
      } else {
        medicalHaptics.select();
      }
      onClick();
    }
  }, [onClick, type]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="medical-notification-badge"
        variants={badgeVariants}
        initial="hidden"
        animate={isPulsing ? 'pulse' : 'visible'}
        exit="hidden"
        onClick={handleClick}
        style={{
          position: 'absolute',
          top: -2,
          right: -2,
          width: badgeSize.width,
          height: badgeSize.height,
          backgroundColor: badgeColor,
          color: 'white',
          borderRadius: badgeSize.width / 2,
          fontSize: badgeSize.fontSize,
          fontWeight: 600,
          fontFamily: MEDICAL_FOOTER_THEME.typography.fontFamily.primary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: count > 99 ? '0 2px' : '0',
          boxShadow: `0 2px 8px ${badgeColor}40, 0 1px 3px rgba(0, 0, 0, 0.3)`,
          cursor: onClick ? 'pointer' : 'default',
          zIndex: 10,
          userSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
        }}
        role="status"
        aria-label={`${count} ${type} notifications, priority: ${priority}`}
        aria-live={priority === 'critical' ? 'assertive' : 'polite'}
      >
        {count > 999 ? '999+' : count > 99 ? '99+' : count}
        
        {/* Unread indicator */}
        {hasUnread && (
          <motion.div
            style={{
              position: 'absolute',
              top: -1,
              right: -1,
              width: 4,
              height: 4,
              backgroundColor: '#FFFFFF',
              borderRadius: 2,
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
});

MedicalNotificationBadge.displayName = 'MedicalNotificationBadge';

// Medical Notification Manager
export class MedicalNotificationManager {
  private notifications: MedicalNotification[] = [];
  private listeners: ((notifications: MedicalNotification[]) => void)[] = [];

  // Add notification
  addNotification(notification: Omit<MedicalNotification, 'id' | 'timestamp' | 'read'>): string {
    const newNotification: MedicalNotification = {
      ...notification,
      id: `med_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false,
    };

    this.notifications.unshift(newNotification);
    this.notifyListeners();

    // Trigger appropriate haptic feedback
    if (notification.priority === 'critical' || notification.type === 'emergency') {
      medicalHaptics.emergency();
    } else if (notification.priority === 'high' || notification.type === 'urgent') {
      medicalHaptics.urgent();
    } else if (notification.type === 'appointment') {
      medicalHaptics.appointment();
    } else {
      medicalHaptics.select();
    }

    return newNotification.id;
  }

  // Remove notification
  removeNotification(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notifyListeners();
  }

  // Mark as read
  markAsRead(id: string): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.notifyListeners();
    }
  }

  // Mark all as read
  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
    this.notifyListeners();
  }

  // Get notifications by type
  getNotificationsByType(type: MedicalNotificationType): MedicalNotification[] {
    return this.notifications.filter(n => n.type === type);
  }

  // Get unread count by type
  getUnreadCountByType(type: MedicalNotificationType): number {
    return this.notifications.filter(n => n.type === type && !n.read).length;
  }

  // Get total unread count
  getTotalUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  // Get emergency notifications
  getEmergencyNotifications(): MedicalNotification[] {
    return this.notifications.filter(n => 
      n.type === 'emergency' || n.priority === 'critical'
    );
  }

  // Subscribe to notifications
  subscribe(listener: (notifications: MedicalNotification[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notify listeners
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }

  // Clear expired notifications
  clearExpiredNotifications(): void {
    const now = new Date();
    this.notifications = this.notifications.filter(n => 
      !n.expiresAt || n.expiresAt > now
    );
    this.notifyListeners();
  }

  // Get all notifications
  getAllNotifications(): MedicalNotification[] {
    return [...this.notifications];
  }
}

// Singleton notification manager
export const medicalNotificationManager = new MedicalNotificationManager();

// Hook for using medical notifications
export const useMedicalNotifications = (type?: MedicalNotificationType) => {
  const [notifications, setNotifications] = useState<MedicalNotification[]>([]);

  useEffect(() => {
    const unsubscribe = medicalNotificationManager.subscribe((allNotifications) => {
      if (type) {
        setNotifications(allNotifications.filter(n => n.type === type));
      } else {
        setNotifications(allNotifications);
      }
    });

    return unsubscribe;
  }, [type]);

  const addNotification = useCallback((notification: Omit<MedicalNotification, 'id' | 'timestamp' | 'read'>) => {
    return medicalNotificationManager.addNotification(notification);
  }, []);

  const removeNotification = useCallback((id: string) => {
    medicalNotificationManager.removeNotification(id);
  }, []);

  const markAsRead = useCallback((id: string) => {
    medicalNotificationManager.markAsRead(id);
  }, []);

  const getUnreadCount = useCallback(() => {
    if (type) {
      return medicalNotificationManager.getUnreadCountByType(type);
    }
    return medicalNotificationManager.getTotalUnreadCount();
  }, [type]);

  return {
    notifications,
    addNotification,
    removeNotification,
    markAsRead,
    unreadCount: getUnreadCount(),
  };
};

export default {
  MedicalNotificationBadge,
  MedicalNotificationManager,
  medicalNotificationManager,
  useMedicalNotifications,
};
