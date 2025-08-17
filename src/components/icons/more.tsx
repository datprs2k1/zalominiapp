import { SVGProps } from 'react';

interface MoreIconProps extends SVGProps<SVGSVGElement> {
  active?: boolean;
}

export default function MoreIcon({ active, ...props }: MoreIconProps) {
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
      <g clipPath="url(#clip0_more)">
        {/* Grid of dots representing "more" */}
        <circle
          cx="8"
          cy="8"
          r="1.5"
          fill={active ? 'url(#paint0_linear_more)' : '#DADADA'}
        />
        <circle
          cx="13"
          cy="8"
          r="1.5"
          fill={active ? 'url(#paint0_linear_more)' : '#DADADA'}
        />
        <circle
          cx="18"
          cy="8"
          r="1.5"
          fill={active ? 'url(#paint0_linear_more)' : '#DADADA'}
        />
        
        <circle
          cx="8"
          cy="13"
          r="1.5"
          fill={active ? 'url(#paint0_linear_more)' : '#DADADA'}
        />
        <circle
          cx="13"
          cy="13"
          r="1.5"
          fill={active ? 'url(#paint0_linear_more)' : '#DADADA'}
        />
        <circle
          cx="18"
          cy="13"
          r="1.5"
          fill={active ? 'url(#paint0_linear_more)' : '#DADADA'}
        />
        
        <circle
          cx="8"
          cy="18"
          r="1.5"
          fill={active ? 'url(#paint0_linear_more)' : '#DADADA'}
        />
        <circle
          cx="13"
          cy="18"
          r="1.5"
          fill={active ? 'url(#paint0_linear_more)' : '#DADADA'}
        />
        <circle
          cx="18"
          cy="18"
          r="1.5"
          fill={active ? 'url(#paint0_linear_more)' : '#DADADA'}
        />
      </g>
      
      <defs>
        <linearGradient
          id="paint0_linear_more"
          x1="-1.82418"
          y1="11.6563"
          x2="10.121"
          y2="29.6963"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--primary-gradient)" />
          <stop offset="1" stopColor="var(--primary)" />
        </linearGradient>
        <clipPath id="clip0_more">
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
