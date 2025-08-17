/**
 * Appointment Card Component
 * Specialized card for displaying appointment information
 */

import React from 'react';
import { AppointmentCardProps } from './types';
import Card from './Card';
import StatusBadge from './StatusBadge';
import { cn } from '@/utils/cn';

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onReschedule,
  onCancel,
  onViewDetails,
  className,
  testId,
  ...props
}) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'available';
      case 'completed':
        return 'available';
      case 'cancelled':
        return 'unavailable';
      case 'rescheduled':
        return 'busy';
      default:
        return 'available';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Đã đặt lịch';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      case 'rescheduled':
        return 'Đã dời lịch';
      default:
        return status;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'emergency':
        return (
          <svg className="w-5 h-5 text-danger-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'follow-up':
        return (
          <svg className="w-5 h-5 text-medical-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-wellness-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  return (
    <Card
      variant={appointment.type === 'emergency' ? 'emergency' : 'appointment'}
      className={cn('space-y-4', className)}
      testId={testId}
      {...props}
    >
      {/* Header with status and type */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getTypeIcon(appointment.type)}
          <span className="text-sm font-medium text-neutral-600 capitalize">
            {appointment.type === 'consultation'
              ? 'Khám bệnh'
              : appointment.type === 'follow-up'
                ? 'Tái khám'
                : 'Cấp cứu'}
          </span>
        </div>
        <StatusBadge status={getStatusVariant(appointment.status)} text={getStatusText(appointment.status)} size="sm" />
      </div>

      {/* Doctor and specialty */}
      <div>
        <h3 className="font-semibold text-lg text-neutral-900">{appointment.doctorName}</h3>
        <p className="text-medical-600 font-medium">{appointment.specialty}</p>
      </div>

      {/* Date and time */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-neutral-700">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm">{formatDate(appointment.date)}</span>
        </div>
        <div className="flex items-center gap-2 text-neutral-700">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm">{formatTime(appointment.time)}</span>
        </div>
      </div>

      {/* Notes */}
      {appointment.notes && (
        <div className="p-3 bg-neutral-50 rounded-medical">
          <p className="text-sm text-neutral-600">
            <span className="font-medium">Ghi chú:</span> {appointment.notes}
          </p>
        </div>
      )}

      {/* Action buttons */}
      {appointment.status === 'scheduled' && (
        <div className="flex gap-2 pt-2">
          {onViewDetails && (
            <button onClick={() => onViewDetails(appointment)} className="flex-1 btn-medical-secondary text-sm py-2">
              Chi tiết
            </button>
          )}
          {onReschedule && (
            <button onClick={() => onReschedule(appointment)} className="flex-1 btn-medical-ghost text-sm py-2">
              Dời lịch
            </button>
          )}
          {onCancel && (
            <button onClick={() => onCancel(appointment)} className="flex-1 btn-medical-danger text-sm py-2">
              Hủy
            </button>
          )}
        </div>
      )}
    </Card>
  );
};

export default AppointmentCard;
