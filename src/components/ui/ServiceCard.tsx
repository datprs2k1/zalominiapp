/**
 * Service Card Component
 * Specialized card for displaying medical service information
 */

import React from 'react';
import { ServiceCardProps } from './types';
import Card from './Card';
import { cn } from '@/utils/cn';

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onSelect,
  showPrice = true,
  className,
  testId,
  ...props
}) => {
  const handleClick = () => {
    if (onSelect) {
      onSelect(service);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDuration = (duration: number) => {
    if (duration < 60) {
      return `${duration} phút`;
    }
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  };

  return (
    <Card
      variant="hover"
      className={cn('space-y-4', className)}
      onClick={handleClick}
      testId={testId}
      {...props}
    >
      {/* Service icon and availability */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {service.icon ? (
            <img
              src={service.icon}
              alt={service.name}
              className="w-12 h-12 object-contain"
            />
          ) : (
            <div className="w-12 h-12 rounded-medical bg-medical-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-medical-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-neutral-900 leading-tight">
              {service.name}
            </h3>
            <p className="text-sm text-medical-600 font-medium">
              {service.category}
            </p>
          </div>
        </div>
        
        {/* Availability indicator */}
        <div className={cn(
          'w-3 h-3 rounded-full flex-shrink-0',
          service.available ? 'bg-success-500' : 'bg-danger-500'
        )} />
      </div>

      {/* Description */}
      <p className="text-neutral-600 text-sm leading-relaxed line-clamp-2">
        {service.description}
      </p>

      {/* Service details */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          {service.duration && (
            <div className="flex items-center gap-1 text-neutral-500">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span>{formatDuration(service.duration)}</span>
            </div>
          )}
          
          <div className={cn(
            'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
            service.available 
              ? 'bg-success-50 text-success-700' 
              : 'bg-danger-50 text-danger-700'
          )}>
            <div className={cn(
              'w-2 h-2 rounded-full',
              service.available ? 'bg-success-500' : 'bg-danger-500'
            )} />
            <span>{service.available ? 'Có sẵn' : 'Không có sẵn'}</span>
          </div>
        </div>

        {/* Price */}
        {showPrice && service.price && (
          <div className="text-right">
            <span className="text-lg font-bold text-medical-600">
              {formatPrice(service.price)}
            </span>
          </div>
        )}
      </div>

      {/* Action button */}
      <div className="pt-2">
        <button
          className={cn(
            'w-full btn-medical-primary text-sm py-2',
            !service.available && 'opacity-50 cursor-not-allowed'
          )}
          disabled={!service.available}
          onClick={(e) => {
            e.stopPropagation();
            if (service.available && onSelect) {
              onSelect(service);
            }
          }}
        >
          {service.available ? 'Đặt lịch ngay' : 'Không có sẵn'}
        </button>
      </div>
    </Card>
  );
};

export default ServiceCard;
