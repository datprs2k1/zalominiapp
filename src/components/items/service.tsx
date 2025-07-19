import { To } from 'react-router-dom';
import TransitionLink from '../transition-link';

interface Link {
  to: To;
}

interface CTA {
  onClick: () => void;
}

interface ServiceItemProps {
  icon: string;
  label: string;
  className?: string;
}

export default function ServiceItem({ icon, label, className = '', ...props }: ServiceItemProps & (Link | CTA)) {
  const children = (
    <div className={`flex flex-col items-center space-y-2 ${className}`}>
      <div className="h-12 w-12 sm:h-10 sm:w-10 flex items-center justify-center">
        <img src={icon} alt={label} className="w-8 h-8 sm:w-7 sm:h-7" />
      </div>
      <div className="text-sm sm:text-xs text-center w-full truncate" dangerouslySetInnerHTML={{ __html: label }}></div>
    </div>
  );
  if ('to' in props) {
    return <TransitionLink to={props.to}>{children}</TransitionLink>;
  }

  return <button onClick={props.onClick}>{children}</button>;
}
