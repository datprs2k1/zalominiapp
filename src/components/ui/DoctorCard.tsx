/**
 * Doctor Card Component
 * Specialized card for displaying doctor information
 */

import React from 'react';
import { DoctorCardProps } from './types';
import Card from './Card';
import StatusBadge from './StatusBadge';
import { cn } from '@/utils/cn';

const DoctorCard: React.FC<DoctorCardProps> = ({
  doctor,
  onSelect,
  showAvailability = true,
  compact = false,
  className,
  testId,
  ...props
}) => {
  const handleClick = () => {
    if (onSelect) {
      onSelect(doctor);
    }
  };

  const renderRating = () => {
    if (!doctor.rating) return null;

    return (
      <div className="flex items-center gap-1">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={cn('w-4 h-4', i < Math.floor(doctor.rating!) ? 'text-accent-500' : 'text-neutral-300')}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="text-sm text-neutral-600">{doctor.rating.toFixed(1)}</span>
      </div>
    );
  };

  if (compact) {
    return (
      <Card
        variant="hover"
        padding="sm"
        className={cn('flex items-center gap-3', className)}
        onClick={handleClick}
        testId={testId}
        {...props}
      >
        <div className="flex-shrink-0">
          {doctor.avatar ? (
            <img src={doctor.avatar} alt={doctor.name} className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-medical-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-medical-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-neutral-900 truncate">{doctor.name}</h3>
          <p className="text-sm text-neutral-600 truncate">{doctor.specialty}</p>
          {doctor.experience && <p className="text-xs text-neutral-500">{doctor.experience} years experience</p>}
        </div>

        <div className="flex-shrink-0 flex flex-col items-end gap-1">
          {showAvailability && doctor.availability && <StatusBadge status={doctor.availability} size="sm" />}
          {renderRating()}
        </div>
      </Card>
    );
  }

  return (
    <Card variant="doctor" className={cn('space-y-4', className)} onClick={handleClick} testId={testId} {...props}>
      <div className="flex flex-col items-center">
        {doctor.avatar ? (
          <img src={doctor.avatar} alt={doctor.name} className="w-20 h-20 rounded-full object-cover mb-3" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-medical-100 flex items-center justify-center mb-3">
            <svg className="w-10 h-10 text-medical-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        )}

        <h3 className="font-semibold text-lg text-neutral-900 text-center">{doctor.name}</h3>

        <p className="text-medical-600 font-medium text-center">{doctor.specialty}</p>

        {doctor.experience && (
          <p className="text-sm text-neutral-500 text-center">{doctor.experience} years experience</p>
        )}
      </div>

      <div className="flex items-center justify-between w-full">
        {renderRating()}
        {showAvailability && doctor.availability && <StatusBadge status={doctor.availability} />}
      </div>

      {doctor.bio && <p className="text-sm text-neutral-600 text-center line-clamp-2">{doctor.bio}</p>}
    </Card>
  );
};

export default DoctorCard;
