import { SVGProps } from 'react';

interface DealIconProps extends SVGProps<SVGSVGElement> {
  active?: boolean;
}

export default function DealIcon({ active, ...props }: DealIconProps) {
  return (
    <svg
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
        fill="currentColor"
        strokeWidth="0"
      />
    </svg>
  );
}
