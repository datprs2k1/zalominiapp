import React from 'react';

interface BackModernProps {
  className?: string;
  size?: number;
}

export function BackModern({ className = '', size = 24 }: BackModernProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Go back"
    >
      {/* Modern arrow with rounded line caps */}
      <path
        d="M15 18L9 12L15 6"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default BackModern;
