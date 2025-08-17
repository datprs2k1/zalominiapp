/**
 * Medical Breadcrumbs Component
 * Navigation breadcrumbs for hospital application
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/utils/cn';

interface BreadcrumbItem {
  label: string;
  path?: string;
  active?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
  testId?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  separator,
  className,
  testId,
  ...props
}) => {
  const navigate = useNavigate();

  const defaultSeparator = (
    <svg className="w-4 h-4 text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
  );

  const handleItemClick = (item: BreadcrumbItem) => {
    if (item.path && !item.active) {
      navigate(item.path);
    }
  };

  return (
    <nav
      className={cn('flex items-center space-x-2', className)}
      aria-label="Breadcrumb"
      data-testid={testId}
      {...props}
    >
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isActive = item.active || isLast;

          return (
            <li key={index} className="flex items-center space-x-2">
              {index > 0 && (
                <span className="flex-shrink-0" aria-hidden="true">
                  {separator || defaultSeparator}
                </span>
              )}
              
              {item.path && !isActive ? (
                <button
                  onClick={() => handleItemClick(item)}
                  className="text-medical-600 hover:text-medical-700 font-medium text-sm transition-colors min-h-[44px] px-2 py-1 rounded-medical hover:bg-medical-50"
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </button>
              ) : (
                <span
                  className={cn(
                    'text-sm font-medium px-2 py-1',
                    isActive 
                      ? 'text-neutral-900' 
                      : 'text-neutral-600'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
