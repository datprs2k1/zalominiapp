import { ReactNode, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface NotificationProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'emergency';
  title: string;
  message: string;
  duration?: number;
  persistent?: boolean;
  icon?: ReactNode;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  }>;
  onClose?: () => void;
}

const notificationStyles = {
  success: {
    bg: 'bg-success-light',
    border: 'border-success',
    text: 'text-success',
    icon: 'text-success',
  },
  error: {
    bg: 'bg-error-light',
    border: 'border-error',
    text: 'text-error',
    icon: 'text-error',
  },
  warning: {
    bg: 'bg-warning-light',
    border: 'border-warning',
    text: 'text-warning',
    icon: 'text-warning',
  },
  info: {
    bg: 'bg-info-light',
    border: 'border-info',
    text: 'text-info',
    icon: 'text-info',
  },
  emergency: {
    bg: 'bg-medical-emergency/10',
    border: 'border-medical-emergency',
    text: 'text-medical-emergency',
    icon: 'text-medical-emergency',
  },
};

const defaultIcons = {
  success: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
    </svg>
  ),
  emergency: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
};

export const MedicalNotification = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  persistent = false,
  icon,
  actions,
  onClose,
}: NotificationProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  const styles = notificationStyles[type];
  const defaultIcon = defaultIcons[type];

  useEffect(() => {
    if (!persistent && duration > 0) {
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev - (100 / (duration / 100));
          return newProgress <= 0 ? 0 : newProgress;
        });
      }, 100);

      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => {
        clearInterval(progressInterval);
        clearTimeout(timer);
      };
    }
  }, [duration, persistent]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <motion.div
      className={`relative overflow-hidden rounded-lg border-l-4 p-4 shadow-notification ${styles.bg} ${styles.border}`}
      initial={{ opacity: 0, x: 300, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      layout
    >
      {/* Progress Bar */}
      {!persistent && duration > 0 && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-black/10">
          <motion.div
            className={`h-full ${styles.text.replace('text-', 'bg-')}`}
            initial={{ width: '100%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1, ease: 'linear' }}
          />
        </div>
      )}

      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`flex-shrink-0 ${styles.icon}`}>
          {icon || defaultIcon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold text-sm ${styles.text}`}>{title}</h4>
          <p className="text-sm text-text-secondary mt-1 leading-relaxed">{message}</p>

          {/* Actions */}
          {actions && actions.length > 0 && (
            <div className="flex gap-2 mt-3">
              {actions.map((action, index) => (
                <motion.button
                  key={index}
                  onClick={action.onClick}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors medical-focus ${
                    action.variant === 'primary'
                      ? `${styles.text.replace('text-', 'bg-')} text-white hover:opacity-90`
                      : `${styles.text} hover:${styles.bg}`
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {action.label}
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* Close Button */}
        <motion.button
          onClick={handleClose}
          className="flex-shrink-0 p-1 rounded-full hover:bg-black/10 transition-colors medical-focus"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Đóng thông báo"
        >
          <svg className="w-4 h-4 text-text-muted" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </motion.button>
      </div>

      {/* Emergency pulse effect */}
      {type === 'emergency' && (
        <motion.div
          className="absolute inset-0 bg-medical-emergency/20 rounded-lg pointer-events-none"
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </motion.div>
  );
};

// Notification Container Component
export const NotificationContainer = ({
  notifications,
  position = 'top-right',
}: {
  notifications: NotificationProps[];
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center';
}) => {
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
  };

  return (
    <div className={`fixed z-50 max-w-sm w-full ${positionClasses[position]}`}>
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            className="mb-3"
            layout
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <MedicalNotification {...notification} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Hook for managing notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  const addNotification = (notification: Omit<NotificationProps, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = { ...notification, id };
    
    setNotifications((prev) => [...prev, newNotification]);
    
    return id;
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  // Convenience methods for different types
  const success = (title: string, message: string, options?: Partial<NotificationProps>) =>
    addNotification({ type: 'success', title, message, ...options });

  const error = (title: string, message: string, options?: Partial<NotificationProps>) =>
    addNotification({ type: 'error', title, message, ...options });

  const warning = (title: string, message: string, options?: Partial<NotificationProps>) =>
    addNotification({ type: 'warning', title, message, ...options });

  const info = (title: string, message: string, options?: Partial<NotificationProps>) =>
    addNotification({ type: 'info', title, message, ...options });

  const emergency = (title: string, message: string, options?: Partial<NotificationProps>) =>
    addNotification({ type: 'emergency', title, message, persistent: true, ...options });

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info,
    emergency,
  };
};
