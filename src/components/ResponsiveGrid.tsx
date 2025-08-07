import React, { ReactNode, CSSProperties } from 'react';
import { useResponsiveLayout, BreakpointKey } from '@/hooks/useResponsiveLayout';
import { useEnhancedMobile } from '@/hooks/use-enhanced-mobile';

interface ResponsiveGridProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  
  // Grid configuration
  columns?: Partial<Record<BreakpointKey, number>>;
  gap?: Partial<Record<BreakpointKey, string>> | string;
  
  // Alignment
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
  justifyContent?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';
  
  // Responsive behavior
  autoColumns?: boolean;
  minColumnWidth?: string;
  maxColumns?: number;
  
  // Accessibility
  role?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

interface ResponsiveGridItemProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  
  // Span configuration
  span?: Partial<Record<BreakpointKey, number>> | number;
  offset?: Partial<Record<BreakpointKey, number>> | number;
  
  // Order
  order?: Partial<Record<BreakpointKey, number>> | number;
  
  // Alignment (overrides grid alignment)
  alignSelf?: 'start' | 'center' | 'end' | 'stretch';
  justifySelf?: 'start' | 'center' | 'end' | 'stretch';
  
  // Accessibility
  role?: string;
  'aria-label'?: string;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  className = '',
  style = {},
  columns = { xs: 1, sm: 1, md: 2, lg: 2 },
  gap = '16px',
  alignItems = 'stretch',
  justifyContent = 'start',
  autoColumns = false,
  minColumnWidth = '280px',
  maxColumns = 4,
  role,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}) => {
  const { 
    getResponsiveValue, 
    getResponsiveClasses, 
    getOptimalColumns,
    getResponsiveSpacing,
    responsiveState 
  } = useResponsiveLayout();
  const { deviceInfo, platformStyles } = useEnhancedMobile();

  // Calculate current columns
  const currentColumns = autoColumns 
    ? getOptimalColumns(maxColumns)
    : getResponsiveValue(columns) || 1;

  // Calculate current gap
  const currentGap = typeof gap === 'string' 
    ? gap 
    : getResponsiveValue(gap) || getResponsiveSpacing('md');

  // Generate responsive classes
  const responsiveClasses = getResponsiveClasses('responsive-grid');

  // Grid styles
  const gridStyles: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: autoColumns 
      ? `repeat(auto-fit, minmax(${minColumnWidth}, 1fr))`
      : `repeat(${currentColumns}, 1fr)`,
    gap: currentGap,
    alignItems,
    justifyContent,
    width: '100%',
    
    // Platform-specific optimizations
    contain: 'layout style',
    willChange: responsiveState.isMobile ? 'auto' : 'transform',
    
    ...style,
  };

  return (
    <div
      className={`${responsiveClasses} ${className}`}
      style={gridStyles}
      role={role}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
    >
      {children}
    </div>
  );
};

export const ResponsiveGridItem: React.FC<ResponsiveGridItemProps> = ({
  children,
  className = '',
  style = {},
  span = 1,
  offset = 0,
  order = 0,
  alignSelf,
  justifySelf,
  role,
  'aria-label': ariaLabel,
}) => {
  const { getResponsiveValue, getResponsiveClasses } = useResponsiveLayout();

  // Calculate current values
  const currentSpan = typeof span === 'number' 
    ? span 
    : getResponsiveValue(span) || 1;
  
  const currentOffset = typeof offset === 'number' 
    ? offset 
    : getResponsiveValue(offset) || 0;
    
  const currentOrder = typeof order === 'number' 
    ? order 
    : getResponsiveValue(order) || 0;

  // Generate responsive classes
  const responsiveClasses = getResponsiveClasses('responsive-grid-item');

  // Grid item styles
  const itemStyles: CSSProperties = {
    gridColumn: currentOffset > 0 
      ? `${currentOffset + 1} / span ${currentSpan}`
      : `span ${currentSpan}`,
    order: currentOrder,
    alignSelf,
    justifySelf,
    
    // Performance optimizations
    contain: 'layout style',
    
    ...style,
  };

  return (
    <div
      className={`${responsiveClasses} ${className}`}
      style={itemStyles}
      role={role}
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
};

// Specialized grid components for common layouts

interface ServiceGridProps {
  children: ReactNode;
  className?: string;
  compact?: boolean;
}

export const ServiceGrid: React.FC<ServiceGridProps> = ({
  children,
  className = '',
  compact = false,
}) => {
  const { isMobile, isTablet } = useResponsiveLayout();

  const columns = compact
    ? { xs: 2, sm: 2, md: 3, lg: 4 }
    : { xs: 1, sm: 1, md: 2, lg: 2 };

  const gap = compact
    ? { xs: '12px', sm: '16px', md: '20px', lg: '24px' }
    : { xs: '16px', sm: '20px', md: '24px', lg: '32px' };

  return (
    <ResponsiveGrid
      columns={columns}
      gap={gap}
      className={`service-grid ${className}`}
      role="list"
      aria-label="Danh sách dịch vụ y tế"
    >
      {children}
    </ResponsiveGrid>
  );
};

interface ContactGridProps {
  children: ReactNode;
  className?: string;
}

export const ContactGrid: React.FC<ContactGridProps> = ({
  children,
  className = '',
}) => {
  return (
    <ResponsiveGrid
      columns={{ xs: 1, sm: 1, md: 1, lg: 2 }}
      gap={{ xs: '16px', sm: '20px', md: '24px', lg: '32px' }}
      alignItems="start"
      className={`contact-grid ${className}`}
      role="list"
      aria-label="Thông tin liên hệ"
    >
      {children}
    </ResponsiveGrid>
  );
};

interface StatsGridProps {
  children: ReactNode;
  className?: string;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  children,
  className = '',
}) => {
  return (
    <ResponsiveGrid
      columns={{ xs: 2, sm: 3, md: 3, lg: 4 }}
      gap={{ xs: '12px', sm: '16px', md: '20px', lg: '24px' }}
      alignItems="center"
      justifyContent="center"
      className={`stats-grid ${className}`}
      role="list"
      aria-label="Thống kê bệnh viện"
    >
      {children}
    </ResponsiveGrid>
  );
};

// Responsive container component
interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  maxWidth?: Partial<Record<BreakpointKey, string>> | string;
  padding?: Partial<Record<BreakpointKey, string>> | string;
  center?: boolean;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className = '',
  style = {},
  maxWidth = { xs: '100%', sm: '100%', md: '480px', lg: '768px' },
  padding = { xs: '16px', sm: '20px', md: '24px', lg: '32px' },
  center = true,
}) => {
  const { getResponsiveValue, getResponsiveClasses } = useResponsiveLayout();

  const currentMaxWidth = typeof maxWidth === 'string' 
    ? maxWidth 
    : getResponsiveValue(maxWidth) || '100%';

  const currentPadding = typeof padding === 'string' 
    ? padding 
    : getResponsiveValue(padding) || '16px';

  const responsiveClasses = getResponsiveClasses('responsive-container');

  const containerStyles: CSSProperties = {
    width: '100%',
    maxWidth: currentMaxWidth,
    padding: currentPadding,
    margin: center ? '0 auto' : '0',
    
    // Performance optimizations
    contain: 'layout style',
    
    ...style,
  };

  return (
    <div
      className={`${responsiveClasses} ${className}`}
      style={containerStyles}
    >
      {children}
    </div>
  );
};

// Export all components
export default ResponsiveGrid;
