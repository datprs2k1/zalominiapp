import { SVGProps } from 'react';

function SquigglyLine({ color = '#10b981', ...props }: SVGProps<SVGSVGElement> & { color?: string }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 300 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M0,10 C30,-10 60,30 90,10 C120,-10 150,30 180,10 C210,-10 240,30 270,10 C300,-10 330,30 360,10"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export default SquigglyLine;
