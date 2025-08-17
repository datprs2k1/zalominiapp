/**
 * Medical Notification Component
 * Toast notifications for hospital application
 */

import React, { useEffect, useState } from 'react';
import { NotificationProps } from './types';
import { cn } from '@/utils/cn';

const Notification: React.FC<NotificationProps> = ({
  type,
  title,
  message,
  duration = 5000,
  onClose,
  actions,
  className,
  testId,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 200);
  };

  if (!isVisible) return null;

  // Type-specific styling
  const typeClasses = {
    success: {
      container: 'bg-success-50 border-success-200 text-success-800',
      icon: 'text-success-500',
      iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    warning: {
      container: 'bg-warning-50 border-warning-200 text-warning-800',
      icon: 'text-warning-500',
      iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z',
    },
    error: {
      container: 'bg-danger-50 border-danger-200 text-danger-800',
      icon: 'text-danger-500',
      iconPath: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    info: {
      container: 'bg-medical-50 border-medical-200 text-medical-800',
      icon: 'text-medical-500',
      iconPath: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    },
  };

  const currentType = typeClasses[type];

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-50 max-w-sm w-full',
        'transform transition-all duration-200 ease-out',
        isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100',
        className
      )}
      data-testid={testId}
      {...props}
    >
      <div
        className={cn(
          'rounded-medical-lg border shadow-card-hover p-4',
          currentType.container
        )}
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0">
            <svg
              className={cn('w-6 h-6', currentType.icon)}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={currentType.iconPath}
              />
            </svg>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-medical-body leading-tight">
              {title}
            </h4>
            {message && (
              <p className="text-medical-label mt-1 leading-relaxed">
                {message}
              </p>
            )}

            {/* Actions */}
            {actions && actions.length > 0 && (
              <div className="flex gap-2 mt-3">
                {actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className={cn(
                      'px-3 py-1.5 text-xs font-medium rounded-medical transition-colors duration-200',
                      action.variant === 'primary'
                        ? 'bg-white text-current hover:bg-opacity-90'
                        : 'bg-transparent border border-current hover:bg-white hover:bg-opacity-20'
                    )}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 rounded-medical hover:bg-white hover:bg-opacity-20 transition-colors duration-200"
            aria-label="Đóng thông báo"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress bar for timed notifications */}
        {duration > 0 && (
          <div className="mt-3 h-1 bg-white bg-opacity-30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white bg-opacity-60 rounded-full transition-all ease-linear"
              style={{
                width: '100%',
                animation: `shrink ${duration}ms linear`,
              }}
            />
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

// Notification Manager Hook
export const useNotification = () => {
  const [notifications, setNotifications] = useState<Array<NotificationProps & { id: string }>>([]);

  const addNotification = (notification: Omit<NotificationProps, 'onClose'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = {
      ...notification,
      id,
      onClose: () => removeNotification(id),
    };

    setNotifications(prev => [...prev, newNotification]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const NotificationContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map(notification => (
        <Notification key={notification.id} {...notification} />
      ))}
    </div>
  );

  return {
    addNotification,
    removeNotification,
    NotificationContainer,
    notifications,
  };
};

export default Notification;
