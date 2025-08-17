import { SVGProps } from 'react';

interface HealthIconProps extends SVGProps<SVGSVGElement> {
  active?: boolean;
}

export default function HealthIcon({ active, ...props }: HealthIconProps) {
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
      <g clipPath="url(#clip0_health)">
        {/* Heart shape */}
        <path
          d="M13 22.5C13 22.5 4.5 17 4.5 10.5C4.5 8.5 6 6.5 8.5 6.5C10.5 6.5 12 8 13 9C14 8 15.5 6.5 17.5 6.5C20 6.5 21.5 8.5 21.5 10.5C21.5 17 13 22.5 13 22.5Z"
          fill={active ? 'url(#paint0_linear_health)' : 'none'}
          stroke={active ? 'url(#paint0_linear_health)' : '#DADADA'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Medical cross inside heart */}
        <path
          d="M13 11V15M11 13H15"
          stroke={active ? '#FFFFFF' : '#DADADA'}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Pulse line */}
        <path
          d="M6 4L8 6L10 2L12 8L14 4L16 6L18 4"
          stroke={active ? 'url(#paint0_linear_health)' : '#DADADA'}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>

      <defs>
        <linearGradient
          id="paint0_linear_health"
          x1="-1.82418"
          y1="11.6563"
          x2="10.121"
          y2="29.6963"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--primary-gradient)" />
          <stop offset="1" stopColor="var(--primary)" />
        </linearGradient>
        <clipPath id="clip0_health">
          <rect width="26" height="26" fill="white" transform="translate(0.5)" />
        </clipPath>
      </defs>
    </svg>
  );
}
