import React from 'react';

const AppointmentScheduleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Calendar base */}
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      
      {/* Medical cross in center */}
      <line x1="12" y1="14" x2="12" y2="18" />
      <line x1="10" y1="16" x2="14" y2="16" />
      
      {/* Clock indicator */}
      <circle cx="17" cy="17" r="3" />
      <line x1="17" y1="15" x2="17" y2="17" />
      <line x1="17" y1="17" x2="18" y2="18" />
    </svg>
  );
};

export default AppointmentScheduleIcon;
