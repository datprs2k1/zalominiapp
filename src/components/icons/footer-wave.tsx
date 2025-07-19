import { SVGProps } from 'react';

function FooterWave(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="100%"
      preserveAspectRatio="none"
      viewBox="0 0 375 99"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M375 99V20H244.44C231.46 20 225.56 18.95 215.57 13.98C215.57 13.98 200.59 4 188.3 4C176.01 4 170.91 7.96 159.19 13.98C147.47 20 129.64 20 129.64 20H0V99H375Z"
        fill="white"
        stroke="rgb(243 244 246)"
        strokeWidth="1"
      />
    </svg>
  );
}

export default FooterWave;
