/**
 * Medical Grid Component
 * Responsive grid system for hospital application
 */

import React from 'react';
import { GridProps } from './types';
import { cn } from '@/utils/cn';

const Grid: React.FC<GridProps> = ({
  columns = 1,
  gap = 'md',
  responsive = true,
  children,
  className,
  testId,
  ...props
}) => {
  // Gap classes
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  // Column classes
  const getColumnClasses = () => {
    if (typeof columns === 'number') {
      const colClass = {
        1: 'grid-cols-1',
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4',
        5: 'grid-cols-5',
        6: 'grid-cols-6',
      }[columns] || 'grid-cols-1';
      
      return responsive ? [colClass, 'sm:grid-cols-2', 'lg:grid-cols-3'] : [colClass];
    }

    // Responsive columns object
    const responsiveClasses = [];
    if (columns.sm) responsiveClasses.push(`sm:grid-cols-${columns.sm}`);
    if (columns.md) responsiveClasses.push(`md:grid-cols-${columns.md}`);
    if (columns.lg) responsiveClasses.push(`lg:grid-cols-${columns.lg}`);
    
    return ['grid-cols-1', ...responsiveClasses];
  };

  // Combine all classes
  const gridClasses = cn(
    'grid',
    getColumnClasses(),
    gapClasses[gap],
    className
  );

  return (
    <div
      className={gridClasses}
      data-testid={testId}
      {...props}
    >
      {children}
    </div>
  );
};

export default Grid;
