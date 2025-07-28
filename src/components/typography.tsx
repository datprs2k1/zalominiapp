import React, { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { 
  TYPOGRAPHY_PRESETS, 
  MEDICAL_TYPOGRAPHY, 
  RESPONSIVE_TYPOGRAPHY,
  getTypographyClasses,
  TypographyProps,
  combineTypography
} from '@/styles/enhanced-typography';

interface BaseTypographyProps extends TypographyProps {
  children: ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'label';
  animated?: boolean;
  animationDelay?: number;
}

interface MotionTypographyProps extends BaseTypographyProps, Omit<HTMLMotionProps<'div'>, 'children'> {}

// Base Typography Component
export function Typography({
  children,
  variant,
  size,
  weight,
  color,
  className = '',
  as: Component = 'p',
  animated = false,
  animationDelay = 0,
  ...props
}: BaseTypographyProps) {
  const typographyClasses = getTypographyClasses({
    variant,
    size,
    weight,
    color,
    className,
  });

  if (animated) {
    return (
      <motion.div
        as={Component}
        className={typographyClasses}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: animationDelay }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  const Element = Component as any;
  return (
    <Element className={typographyClasses} {...props}>
      {children}
    </Element>
  );
}

// Animated Typography Component
export function AnimatedTypography({
  children,
  variant,
  size,
  weight,
  color,
  className = '',
  as: Component = 'p',
  animationDelay = 0,
  ...motionProps
}: MotionTypographyProps) {
  const typographyClasses = getTypographyClasses({
    variant,
    size,
    weight,
    color,
    className,
  });

  return (
    <motion.div
      as={Component}
      className={typographyClasses}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: animationDelay }}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}

// Specialized Typography Components

// Page Title Component
export function PageTitle({ 
  children, 
  className = '', 
  animated = false,
  ...props 
}: Omit<BaseTypographyProps, 'variant' | 'as'>) {
  return (
    <Typography
      variant="pageTitle"
      as="h1"
      className={className}
      animated={animated}
      {...props}
    >
      {children}
    </Typography>
  );
}

// Section Title Component
export function SectionTitle({ 
  children, 
  className = '', 
  animated = false,
  ...props 
}: Omit<BaseTypographyProps, 'variant' | 'as'>) {
  return (
    <Typography
      variant="sectionTitle"
      as="h2"
      className={className}
      animated={animated}
      {...props}
    >
      {children}
    </Typography>
  );
}

// Card Title Component
export function CardTitle({ 
  children, 
  className = '', 
  animated = false,
  ...props 
}: Omit<BaseTypographyProps, 'variant' | 'as'>) {
  return (
    <Typography
      variant="cardTitle"
      as="h3"
      className={className}
      animated={animated}
      {...props}
    >
      {children}
    </Typography>
  );
}

// Body Text Component
export function BodyText({ 
  children, 
  size = 'lg',
  className = '', 
  animated = false,
  ...props 
}: Omit<BaseTypographyProps, 'variant'>) {
  const variant = size === 'xl' ? 'bodyLarge' : size === 'lg' ? 'bodyNormal' : 'bodySmall';
  
  return (
    <Typography
      variant={variant as keyof typeof TYPOGRAPHY_PRESETS}
      className={className}
      animated={animated}
      {...props}
    >
      {children}
    </Typography>
  );
}

// Medical Typography Components

// Vital Sign Display
export function VitalSign({ 
  children, 
  className = '', 
  animated = false,
  ...props 
}: Omit<BaseTypographyProps, 'variant'>) {
  return (
    <Typography
      variant="vitalSign"
      className={className}
      animated={animated}
      {...props}
    >
      {children}
    </Typography>
  );
}

// Medical Label
export function MedicalLabel({ 
  children, 
  className = '', 
  animated = false,
  ...props 
}: Omit<BaseTypographyProps, 'variant'>) {
  return (
    <Typography
      variant="medicalLabel"
      as="label"
      className={className}
      animated={animated}
      {...props}
    >
      {children}
    </Typography>
  );
}

// Medical Note
export function MedicalNote({ 
  children, 
  className = '', 
  animated = false,
  ...props 
}: Omit<BaseTypographyProps, 'variant'>) {
  return (
    <Typography
      variant="medicalNote"
      className={className}
      animated={animated}
      {...props}
    >
      {children}
    </Typography>
  );
}

// Status Text Components
export function SuccessText({ 
  children, 
  className = '', 
  animated = false,
  ...props 
}: Omit<BaseTypographyProps, 'variant'>) {
  return (
    <Typography
      variant="success"
      className={className}
      animated={animated}
      {...props}
    >
      {children}
    </Typography>
  );
}

export function WarningText({ 
  children, 
  className = '', 
  animated = false,
  ...props 
}: Omit<BaseTypographyProps, 'variant'>) {
  return (
    <Typography
      variant="warning"
      className={className}
      animated={animated}
      {...props}
    >
      {children}
    </Typography>
  );
}

export function ErrorText({ 
  children, 
  className = '', 
  animated = false,
  ...props 
}: Omit<BaseTypographyProps, 'variant'>) {
  return (
    <Typography
      variant="error"
      className={className}
      animated={animated}
      {...props}
    >
      {children}
    </Typography>
  );
}

// Responsive Typography Components
export function ResponsiveTitle({ 
  children, 
  level = 'page',
  className = '', 
  animated = false,
  ...props 
}: Omit<BaseTypographyProps, 'variant'> & { level?: 'hero' | 'page' | 'section' }) {
  const responsiveClass = level === 'hero' 
    ? RESPONSIVE_TYPOGRAPHY.heroTitle
    : level === 'page' 
    ? RESPONSIVE_TYPOGRAPHY.pageTitle
    : RESPONSIVE_TYPOGRAPHY.sectionTitle;

  const Component = level === 'hero' ? 'h1' : level === 'page' ? 'h1' : 'h2';

  return (
    <Typography
      as={Component}
      className={combineTypography(responsiveClass, className)}
      animated={animated}
      {...props}
    >
      {children}
    </Typography>
  );
}

export function ResponsiveBody({ 
  children, 
  size = 'normal',
  className = '', 
  animated = false,
  ...props 
}: Omit<BaseTypographyProps, 'variant'> & { size?: 'large' | 'normal' | 'small' }) {
  const responsiveClass = size === 'large' 
    ? RESPONSIVE_TYPOGRAPHY.bodyLarge
    : size === 'normal' 
    ? RESPONSIVE_TYPOGRAPHY.bodyNormal
    : RESPONSIVE_TYPOGRAPHY.bodySmall;

  return (
    <Typography
      className={combineTypography(responsiveClass, className)}
      animated={animated}
      {...props}
    >
      {children}
    </Typography>
  );
}

// Gradient Text Component
export function GradientText({ 
  children, 
  gradient = 'from-primary to-secondary',
  className = '', 
  animated = false,
  ...props 
}: Omit<BaseTypographyProps, 'color'> & { gradient?: string }) {
  const gradientClass = `bg-gradient-to-r ${gradient} bg-clip-text text-transparent`;
  
  return (
    <Typography
      className={combineTypography(gradientClass, className)}
      animated={animated}
      {...props}
    >
      {children}
    </Typography>
  );
}

// Typewriter Effect Component
export function TypewriterText({ 
  children, 
  speed = 50,
  className = '', 
  ...props 
}: Omit<BaseTypographyProps, 'animated'> & { speed?: number }) {
  const text = children as string;
  const [displayText, setDisplayText] = React.useState('');

  React.useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <Typography className={className} {...props}>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="inline-block w-0.5 h-5 bg-current ml-1"
      />
    </Typography>
  );
}
