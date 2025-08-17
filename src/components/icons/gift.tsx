import { SVGProps } from 'react';

interface GiftIconProps extends SVGProps<SVGSVGElement> {
  active?: boolean;
}

export default function GiftIcon({ active, ...props }: GiftIconProps) {
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
      <g clipPath="url(#clip0_gift)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.5 8.5C6.67157 8.5 6 9.17157 6 10V11.5H20V10C20 9.17157 19.3284 8.5 18.5 8.5H15.5C15.5 7.39543 14.6046 6.5 13.5 6.5C12.9477 6.5 12.4523 6.77614 12.1464 7.20711L11.5 8H10.5L9.85355 7.20711C9.54772 6.77614 9.05228 6.5 8.5 6.5C7.39543 6.5 6.5 7.39543 6.5 8.5H7.5ZM8.5 8.5C8.77614 8.5 9 8.27614 9 8C9 7.72386 8.77614 7.5 8.5 7.5C8.22386 7.5 8 7.72386 8 8C8 8.27614 8.22386 8.5 8.5 8.5ZM13.5 8.5C13.7761 8.5 14 8.27614 14 8C14 7.72386 13.7761 7.5 13.5 7.5C13.2239 7.5 13 7.72386 13 8C13 8.27614 13.2239 8.5 13.5 8.5ZM6 13H12V19.5H7.5C6.67157 19.5 6 18.8284 6 18V13ZM14 13H20V18C20 18.8284 19.3284 19.5 18.5 19.5H14V13Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_gift">
          <rect width="26" height="26" fill="white" transform="translate(0.5)" />
        </clipPath>
      </defs>
    </svg>
  );
}
