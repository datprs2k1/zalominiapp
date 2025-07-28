import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from './theme-provider';
import { SPACING } from '@/styles/medical-design-system';

// Enhanced Grid System
interface GridProps {
  children: ReactNode;
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  responsive?: {
    sm?: 1 | 2 | 3 | 4 | 6 | 12;
    md?: 1 | 2 | 3 | 4 | 6 | 12;
    lg?: 1 | 2 | 3 | 4 | 6 | 12;
  };
  className?: string;
  animated?: boolean;
}

export function Grid({ 
  children, 
  cols = 1, 
  gap = 'md',
  responsive,
  className = '',
  animated = false
}: GridProps) {
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  };

  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    6: 'grid-cols-6',
    12: 'grid-cols-12'
  };

  const responsiveClasses = responsive ? [
    responsive.sm && `sm:grid-cols-${responsive.sm}`,
    responsive.md && `md:grid-cols-${responsive.md}`,
    responsive.lg && `lg:grid-cols-${responsive.lg}`
  ].filter(Boolean).join(' ') : '';

  const gridClasses = `grid ${colClasses[cols]} ${gapClasses[gap]} ${responsiveClasses} ${className}`;

  if (animated) {
    return (
      <motion.div
        className={gridClasses}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, staggerChildren: 0.1 }}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={gridClasses}>{children}</div>;
}

// Enhanced Container System
interface ContainerProps {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  centered?: boolean;
}

export function Container({ 
  children, 
  size = 'lg',
  padding = 'md',
  className = '',
  centered = true
}: ContainerProps) {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full'
  };

  const paddingClasses = {
    none: '',
    sm: 'px-4',
    md: 'px-6',
    lg: 'px-8',
    xl: 'px-12'
  };

  const containerClasses = `
    ${sizeClasses[size]}
    ${paddingClasses[padding]}
    ${centered ? 'mx-auto' : ''}
    ${className}
  `;

  return <div className={containerClasses}>{children}</div>;
}

// Enhanced Card Component
interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'medical';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  hoverable?: boolean;
  animated?: boolean;
  onClick?: () => void;
}

export function Card({ 
  children, 
  variant = 'default',
  padding = 'md',
  className = '',
  hoverable = false,
  animated = false,
  onClick
}: CardProps) {
  const { colors, shadows } = useTheme();

  const variantClasses = {
    default: 'bg-surface-primary border border-border-primary',
    elevated: 'bg-surface-elevated shadow-md',
    outlined: 'bg-surface-primary border-2 border-border-secondary',
    medical: 'bg-gradient-to-br from-blue-50 to-white border border-blue-200'
  };

  const paddingClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  };

  const cardClasses = `
    ${variantClasses[variant]}
    ${paddingClasses[padding]}
    rounded-xl
    transition-all duration-200
    ${hoverable ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer' : ''}
    ${className}
  `;

  if (animated) {
    return (
      <motion.div
        className={cardClasses}
        onClick={onClick}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={hoverable ? { y: -4, scale: 1.02 } : undefined}
        whileTap={onClick ? { scale: 0.98 } : undefined}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={cardClasses} onClick={onClick}>
      {children}
    </div>
  );
}

// Enhanced Stack Component
interface StackProps {
  children: ReactNode;
  direction?: 'row' | 'column';
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
  className?: string;
}

export function Stack({ 
  children, 
  direction = 'column',
  spacing = 'md',
  align = 'stretch',
  justify = 'start',
  wrap = false,
  className = ''
}: StackProps) {
  const directionClasses = {
    row: 'flex-row',
    column: 'flex-col'
  };

  const spacingClasses = {
    sm: direction === 'row' ? 'space-x-2' : 'space-y-2',
    md: direction === 'row' ? 'space-x-4' : 'space-y-4',
    lg: direction === 'row' ? 'space-x-6' : 'space-y-6',
    xl: direction === 'row' ? 'space-x-8' : 'space-y-8'
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  };

  const stackClasses = `
    flex
    ${directionClasses[direction]}
    ${spacingClasses[spacing]}
    ${alignClasses[align]}
    ${justifyClasses[justify]}
    ${wrap ? 'flex-wrap' : ''}
    ${className}
  `;

  return <div className={stackClasses}>{children}</div>;
}

// Enhanced Section Component
interface SectionProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  background?: 'default' | 'muted' | 'gradient';
  className?: string;
  titleClassName?: string;
  animated?: boolean;
}

export function Section({ 
  children, 
  title,
  subtitle,
  padding = 'lg',
  background = 'default',
  className = '',
  titleClassName = '',
  animated = false
}: SectionProps) {
  const paddingClasses = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
    xl: 'py-24'
  };

  const backgroundClasses = {
    default: 'bg-background-primary',
    muted: 'bg-background-secondary',
    gradient: 'bg-gradient-to-br from-blue-50 via-white to-green-50'
  };

  const sectionClasses = `
    ${backgroundClasses[background]}
    ${paddingClasses[padding]}
    ${className}
  `;

  const content = (
    <>
      {(title || subtitle) && (
        <div className="text-center mb-12">
          {title && (
            <h2 className={`text-3xl font-bold text-text-primary mb-4 ${titleClassName}`}>
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </>
  );

  if (animated) {
    return (
      <motion.section
        className={sectionClasses}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        <Container>
          {content}
        </Container>
      </motion.section>
    );
  }

  return (
    <section className={sectionClasses}>
      <Container>
        {content}
      </Container>
    </section>
  );
}

// Medical Layout Components
interface MedicalCardProps extends CardProps {
  status?: 'normal' | 'warning' | 'critical' | 'emergency';
  icon?: ReactNode;
  title?: string;
  subtitle?: string;
}

export function MedicalCard({ 
  children,
  status = 'normal',
  icon,
  title,
  subtitle,
  ...cardProps
}: MedicalCardProps) {
  const { colors } = useTheme();

  const statusColors = {
    normal: colors.medical.normal,
    warning: colors.medical.caution,
    critical: colors.medical.vital,
    emergency: colors.medical.emergency
  };

  const statusBorderColor = statusColors[status];

  return (
    <Card
      {...cardProps}
      className={`border-l-4 ${cardProps.className}`}
      style={{ borderLeftColor: statusBorderColor }}
    >
      <Stack direction="row" spacing="md" align="start">
        {icon && (
          <div className="flex-shrink-0 p-2 rounded-lg bg-background-secondary">
            {icon}
          </div>
        )}
        <div className="flex-1">
          {title && (
            <h3 className="font-semibold text-text-primary mb-1">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-text-secondary mb-3">{subtitle}</p>
          )}
          {children}
        </div>
      </Stack>
    </Card>
  );
}

// Responsive Layout Hook
export function useResponsive() {
  const [breakpoint, setBreakpoint] = React.useState<'sm' | 'md' | 'lg' | 'xl'>('md');

  React.useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 640) setBreakpoint('sm');
      else if (width < 768) setBreakpoint('md');
      else if (width < 1024) setBreakpoint('lg');
      else setBreakpoint('xl');
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return {
    breakpoint,
    isMobile: breakpoint === 'sm',
    isTablet: breakpoint === 'md',
    isDesktop: breakpoint === 'lg' || breakpoint === 'xl',
  };
}
