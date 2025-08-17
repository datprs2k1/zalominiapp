import React from 'react';

interface MedicalLogoProps {
  className?: string;
  size?: number;
}

export function MedicalLogo({ className = '', size = 32 }: MedicalLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Medical Logo"
    >
      {/* Modern medical cross with rounded corners */}
      <rect
        x="12"
        y="4"
        width="8"
        height="24"
        rx="4"
        fill="currentColor"
      />
      <rect
        x="4"
        y="12"
        width="24"
        height="8"
        rx="4"
        fill="currentColor"
      />
      {/* Subtle highlight for depth */}
      <rect
        x="14"
        y="6"
        width="4"
        height="20"
        rx="2"
        fill="rgba(255, 255, 255, 0.2)"
      />
      <rect
        x="6"
        y="14"
        width="20"
        height="4"
        rx="2"
        fill="rgba(255, 255, 255, 0.2)"
      />
    </svg>
  );
}

export default MedicalLogo;
