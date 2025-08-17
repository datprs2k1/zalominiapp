import { SVGProps } from "react";

interface DoctorIconProps extends SVGProps<SVGSVGElement> {
  active?: boolean;
}

export default function DoctorIcon({ active, ...props }: DoctorIconProps) {
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
      <g clipPath="url(#clip0_doctor)">
        {/* Stethoscope head */}
        <circle
          cx="7"
          cy="7"
          r="3"
          stroke={active ? "url(#paint0_linear_doctor)" : "#DADADA"}
          strokeWidth="2"
          fill="none"
        />
        {/* Stethoscope tube */}
        <path
          d="M7 10C7 12 8 14 10 16C12 18 14 19 16 19"
          stroke={active ? "url(#paint0_linear_doctor)" : "#DADADA"}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        {/* Earpieces */}
        <path
          d="M4 7C2.5 7 2 6 2 5C2 4 2.5 3 4 3"
          stroke={active ? "url(#paint0_linear_doctor)" : "#DADADA"}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M10 7C11.5 7 12 6 12 5C12 4 11.5 3 10 3"
          stroke={active ? "url(#paint0_linear_doctor)" : "#DADADA"}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        {/* Chest piece */}
        <circle
          cx="16"
          cy="19"
          r="3"
          fill={active ? "url(#paint0_linear_doctor)" : "#DADADA"}
        />
        <circle
          cx="16"
          cy="19"
          r="1.5"
          fill={active ? "#FFFFFF" : "#666666"}
        />
        {/* Medical cross on chest piece */}
        <rect
          x="15.2"
          y="17.5"
          width="1.6"
          height="3"
          rx="0.8"
          fill={active ? "url(#paint0_linear_doctor)" : "#DADADA"}
        />
        <rect
          x="14.5"
          y="18.2"
          width="3"
          height="1.6"
          rx="0.8"
          fill={active ? "url(#paint0_linear_doctor)" : "#DADADA"}
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_doctor"
          x1="-1.82418"
          y1="11.6563"
          x2="10.121"
          y2="29.6963"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--primary-gradient)" />
          <stop offset="1" stopColor="var(--primary)" />
        </linearGradient>
        <clipPath id="clip0_doctor">
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
