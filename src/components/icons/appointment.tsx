import { SVGProps } from 'react';

interface AppointmentIconProps extends SVGProps<SVGSVGElement> {
  active?: boolean;
}

export default function AppointmentIcon({ active, ...props }: AppointmentIconProps) {
  return (
    <svg
      width="100%"
      height="100%"
      preserveAspectRatio="none"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
      {...props}
    >
      <g clipPath="url(#clip0_appointment)">
        {/* Calendar base */}
        <rect
          x="4"
          y="6"
          width="18"
          height="16"
          rx="2"
          stroke={active ? 'url(#paint0_linear_appointment)' : '#DADADA'}
          strokeWidth="2"
          fill={active ? 'url(#paint1_linear_appointment)' : 'none'}
        />
        
        {/* Calendar header */}
        <rect
          x="4"
          y="6"
          width="18"
          height="4"
          rx="2"
          fill={active ? 'url(#paint0_linear_appointment)' : '#DADADA'}
        />
        
        {/* Calendar rings */}
        <rect
          x="8"
          y="3"
          width="2"
          height="6"
          rx="1"
          fill={active ? 'url(#paint0_linear_appointment)' : '#DADADA'}
        />
        <rect
          x="16"
          y="3"
          width="2"
          height="6"
          rx="1"
          fill={active ? 'url(#paint0_linear_appointment)' : '#DADADA'}
        />
        
        {/* Calendar grid dots */}
        <circle
          cx="8"
          cy="14"
          r="1"
          fill={active ? 'url(#paint0_linear_appointment)' : '#DADADA'}
        />
        <circle
          cx="13"
          cy="14"
          r="1"
          fill={active ? 'url(#paint0_linear_appointment)' : '#DADADA'}
        />
        <circle
          cx="18"
          cy="14"
          r="1"
          fill={active ? 'url(#paint0_linear_appointment)' : '#DADADA'}
        />
        <circle
          cx="8"
          cy="18"
          r="1"
          fill={active ? 'url(#paint0_linear_appointment)' : '#DADADA'}
        />
        
        {/* Highlighted appointment date */}
        <circle
          cx="13"
          cy="18"
          r="2"
          fill={active ? '#FFFFFF' : '#666666'}
          stroke={active ? 'url(#paint0_linear_appointment)' : '#DADADA'}
          strokeWidth="1"
        />
        
        <circle
          cx="18"
          cy="18"
          r="1"
          fill={active ? 'url(#paint0_linear_appointment)' : '#DADADA'}
        />
      </g>
      
      <defs>
        <linearGradient
          id="paint0_linear_appointment"
          x1="-1.82418"
          y1="11.6563"
          x2="10.121"
          y2="29.6963"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--primary-gradient)" />
          <stop offset="1" stopColor="var(--primary)" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_appointment"
          x1="4"
          y1="6"
          x2="22"
          y2="22"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="rgba(14, 165, 233, 0.1)" />
          <stop offset="1" stopColor="rgba(14, 165, 233, 0.05)" />
        </linearGradient>
        <clipPath id="clip0_appointment">
          <rect
            width="26"
            height="26"
            fill="white"
            transform="translate(0.5)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
