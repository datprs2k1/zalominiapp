import { ReactNode } from 'react';
import ArrowRightIcon from './icons/arrow-right';
import { To } from 'react-router-dom';
import TransitionLink from './transition-link';

interface SectionProps {
  children: ReactNode;
  className?: string;
  title?: string;
  viewMore?: To;
  isCard?: boolean;
  noPadding?: boolean;
  noBackground?: boolean;
  accentColor?: string;
  icon?: ReactNode;
}

export default function Section({
  children,
  className = '',
  title,
  viewMore,
  isCard = false,
  noPadding = false,
  noBackground = false,
  accentColor = 'blue',
  icon,
}: SectionProps) {
  const header = (title || viewMore) && (
    <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
      {title && (
        <div className="flex items-center">
          {icon && <div className="mr-2">{icon}</div>}
          <div className={`font-bold text-lg md:text-xl text-${accentColor}-600 relative`}>
            {title}
            <span className={`absolute -bottom-1 left-0 h-[3px] w-1/3 bg-${accentColor}-500 rounded-full`}></span>
          </div>
        </div>
      )}
      {viewMore && (
        <TransitionLink
          to={viewMore}
          className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-${accentColor}-50 text-${accentColor}-600 hover:bg-${accentColor}-100 active:bg-${accentColor}-200 transition-all duration-200`}
        >
          <div className="text-xs md:text-sm font-medium">Xem tất cả</div>
          <ArrowRightIcon className={`h-3.5 w-3.5 md:h-4 md:w-4 text-${accentColor}-500`} />
        </TransitionLink>
      )}
    </div>
  );

  const containerPadding = noPadding ? '' : 'px-4 md:px-5';

  let sectionClasses = `${containerPadding} ${className} mb-6`;
  let contentClasses = '';

  if (isCard) {
    contentClasses = `${noBackground ? '' : 'bg-white'} rounded-2xl shadow-sm ${
      !noBackground && 'border border-gray-100'
    } p-4 md:p-5 hover:shadow-md transition-all duration-300`;
  }

  return (
    <div className={sectionClasses}>
      {isCard ? (
        <div className={`flex flex-col justify-center gap-3 ${contentClasses}`}>
          {header}
          {children}
        </div>
      ) : (
        <>
          {header}
          {children}
        </>
      )}
    </div>
  );
}
