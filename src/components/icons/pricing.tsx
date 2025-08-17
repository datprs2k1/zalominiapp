import { SVGProps } from "react";

interface PricingIconProps extends SVGProps<SVGSVGElement> {
  active?: boolean;
}

export default function PricingIcon({ active, ...props }: PricingIconProps) {
  return (
    <svg
      width="100%"
      height="100%"
      preserveAspectRatio="none"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: "visible" }}
      {...props}
    >
      <g clipPath="url(#clip0_pricing)">
        {/* Price tag shape */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.5 4.5C4.5 3.67157 5.17157 3 6 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L22.7071 12.7071C23.0976 13.0976 23.0976 13.7308 22.7071 14.1213L14.1213 22.7071C13.7308 23.0976 13.0976 23.0976 12.7071 22.7071L3.29289 13.2929C3.10536 13.1054 3 12.851 3 12.5858V6C3 5.17157 3.67157 4.5 4.5 4.5Z"
          fill={active ? "url(#paint0_linear_pricing)" : "#DADADA"}
        />
        {/* Dollar sign */}
        <path
          d="M9.5 7.5V8.5H8.5C8.22386 8.5 8 8.72386 8 9C8 9.27614 8.22386 9.5 8.5 9.5H10.5C10.7761 9.5 11 9.72386 11 10C11 10.2761 10.7761 10.5 10.5 10.5H8.5C7.67157 10.5 7 11.1716 7 12C7 12.8284 7.67157 13.5 8.5 13.5H9.5V14.5C9.5 14.7761 9.72386 15 10 15C10.2761 15 10.5 14.7761 10.5 14.5V13.5H11.5C12.3284 13.5 13 12.8284 13 12C13 11.1716 12.3284 10.5 11.5 10.5H9.5C9.22386 10.5 9 10.2761 9 10C9 9.72386 9.22386 9.5 9.5 9.5H11.5C11.7761 9.5 12 9.27614 12 9C12 8.72386 11.7761 8.5 11.5 8.5H10.5V7.5C10.5 7.22386 10.2761 7 10 7C9.72386 7 9.5 7.22386 9.5 7.5Z"
          fill={active ? "#FFFFFF" : "#666666"}
        />
        {/* Small circle for tag hole */}
        <circle
          cx="8"
          cy="8"
          r="1"
          fill={active ? "#FFFFFF" : "#666666"}
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_pricing"
          x1="-1.82418"
          y1="11.6563"
          x2="10.121"
          y2="29.6963"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--primary-gradient)" />
          <stop offset="1" stopColor="var(--primary)" />
        </linearGradient>
        <clipPath id="clip0_pricing">
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
