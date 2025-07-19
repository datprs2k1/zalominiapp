import { SVGProps } from 'react';

function DotsPattern({ color = '#10b981', ...props }: SVGProps<SVGSVGElement> & { color?: string }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="10" cy="10" r="2" fill={color} opacity="0.2" />
      <circle cx="30" cy="10" r="2" fill={color} opacity="0.3" />
      <circle cx="50" cy="10" r="2" fill={color} opacity="0.2" />
      <circle cx="70" cy="10" r="2" fill={color} opacity="0.3" />
      <circle cx="90" cy="10" r="2" fill={color} opacity="0.2" />

      <circle cx="10" cy="30" r="2" fill={color} opacity="0.3" />
      <circle cx="30" cy="30" r="2" fill={color} opacity="0.2" />
      <circle cx="50" cy="30" r="2" fill={color} opacity="0.3" />
      <circle cx="70" cy="30" r="2" fill={color} opacity="0.2" />
      <circle cx="90" cy="30" r="2" fill={color} opacity="0.3" />

      <circle cx="10" cy="50" r="2" fill={color} opacity="0.2" />
      <circle cx="30" cy="50" r="2" fill={color} opacity="0.3" />
      <circle cx="50" cy="50" r="2" fill={color} opacity="0.2" />
      <circle cx="70" cy="50" r="2" fill={color} opacity="0.3" />
      <circle cx="90" cy="50" r="2" fill={color} opacity="0.2" />

      <circle cx="10" cy="70" r="2" fill={color} opacity="0.3" />
      <circle cx="30" cy="70" r="2" fill={color} opacity="0.2" />
      <circle cx="50" cy="70" r="2" fill={color} opacity="0.3" />
      <circle cx="70" cy="70" r="2" fill={color} opacity="0.2" />
      <circle cx="90" cy="70" r="2" fill={color} opacity="0.3" />

      <circle cx="10" cy="90" r="2" fill={color} opacity="0.2" />
      <circle cx="30" cy="90" r="2" fill={color} opacity="0.3" />
      <circle cx="50" cy="90" r="2" fill={color} opacity="0.2" />
      <circle cx="70" cy="90" r="2" fill={color} opacity="0.3" />
      <circle cx="90" cy="90" r="2" fill={color} opacity="0.2" />
    </svg>
  );
}

export default DotsPattern;
