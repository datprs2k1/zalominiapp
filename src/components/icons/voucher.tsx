import { SVGProps } from 'react';

interface VoucherIconProps extends SVGProps<SVGSVGElement> {
  active?: boolean;
}

export default function VoucherIcon({ active, ...props }: VoucherIconProps) {
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
      <g clipPath="url(#clip0_voucher)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.5 6C4.5 5.17157 5.17157 4.5 6 4.5H20C20.8284 4.5 21.5 5.17157 21.5 6V9.5C20.6716 9.5 20 10.1716 20 11C20 11.8284 20.6716 12.5 21.5 12.5V16C21.5 16.8284 20.8284 17.5 20 17.5H6C5.17157 17.5 4.5 16.8284 4.5 16V12.5C5.32843 12.5 6 11.8284 6 11C6 10.1716 5.32843 9.5 4.5 9.5V6ZM9 8.5C8.72386 8.5 8.5 8.72386 8.5 9C8.5 9.27614 8.72386 9.5 9 9.5H11C11.2761 9.5 11.5 9.27614 11.5 9C11.5 8.72386 11.2761 8.5 11 8.5H9ZM9 12.5C8.72386 12.5 8.5 12.7239 8.5 13C8.5 13.2761 8.72386 13.5 9 13.5H13C13.2761 13.5 13.5 13.2761 13.5 13C13.5 12.7239 13.2761 12.5 13 12.5H9Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_voucher">
          <rect width="26" height="26" fill="white" transform="translate(0.5)" />
        </clipPath>
      </defs>
    </svg>
  );
}
