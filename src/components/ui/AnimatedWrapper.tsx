/**
 * Animated Wrapper Component
 * Provides micro-interactions and animations for medical UI
 */

import React, { useEffect, useState } from 'react';
import { cn } from '@/utils/cn';

interface AnimatedWrapperProps {
  children: React.ReactNode;
  animation?: 'fade-in' | 'slide-up' | 'slide-down' | 'scale-in' | 'heartbeat' | 'none';
  delay?: number;
  duration?: number;
  trigger?: 'mount' | 'hover' | 'click' | 'visible';
  className?: string;
  testId?: string;
}

const AnimatedWrapper: React.FC<AnimatedWrapperProps> = ({
  children,
  animation = 'fade-in',
  delay = 0,
  duration = 200,
  trigger = 'mount',
  className,
  testId,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(trigger === 'mount');
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    if (trigger === 'mount' && delay > 0) {
      const timer = setTimeout(() => setIsVisible(true), delay);
      return () => clearTimeout(timer);
    }
  }, [delay, trigger]);

  // Animation classes
  const animationClasses = {
    'fade-in': isVisible ? 'animate-fade-in' : 'opacity-0',
    'slide-up': isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-4',
    'slide-down': isVisible ? 'animate-slide-down' : 'opacity-0 -translate-y-4',
    'scale-in': isVisible ? 'animate-scale-in' : 'opacity-0 scale-95',
    'heartbeat': 'animate-heartbeat',
    'none': '',
  };

  // Trigger-specific classes
  const triggerClasses = {
    mount: animationClasses[animation],
    hover: isHovered ? animationClasses[animation] : '',
    click: isClicked ? animationClasses[animation] : '',
    visible: isVisible ? animationClasses[animation] : 'opacity-0',
  };

  // Event handlers
  const handleMouseEnter = () => {
    if (trigger === 'hover') setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') setIsHovered(false);
  };

  const handleClick = () => {
    if (trigger === 'click') {
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), duration);
    }
  };

  // Intersection Observer for 'visible' trigger
  useEffect(() => {
    if (trigger !== 'visible') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector(`[data-testid="${testId}"]`);
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [trigger, delay, testId]);

  const wrapperClasses = cn(
    'transition-all',
    triggerClasses[trigger],
    className
  );

  const wrapperProps = {
    className: wrapperClasses,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onClick: handleClick,
    'data-testid': testId,
    style: {
      transitionDuration: `${duration}ms`,
      transitionDelay: trigger === 'mount' ? `${delay}ms` : '0ms',
    },
    ...props,
  };

  return (
    <div {...wrapperProps}>
      {children}
    </div>
  );
};

// Predefined animation components
export const FadeIn: React.FC<Omit<AnimatedWrapperProps, 'animation'>> = (props) => (
  <AnimatedWrapper animation="fade-in" {...props} />
);

export const SlideUp: React.FC<Omit<AnimatedWrapperProps, 'animation'>> = (props) => (
  <AnimatedWrapper animation="slide-up" {...props} />
);

export const SlideDown: React.FC<Omit<AnimatedWrapperProps, 'animation'>> = (props) => (
  <AnimatedWrapper animation="slide-down" {...props} />
);

export const ScaleIn: React.FC<Omit<AnimatedWrapperProps, 'animation'>> = (props) => (
  <AnimatedWrapper animation="scale-in" {...props} />
);

export const Heartbeat: React.FC<Omit<AnimatedWrapperProps, 'animation'>> = (props) => (
  <AnimatedWrapper animation="heartbeat" trigger="mount" {...props} />
);

// Staggered animation for lists
interface StaggeredListProps {
  children: React.ReactNode[];
  staggerDelay?: number;
  animation?: 'fade-in' | 'slide-up' | 'scale-in';
  className?: string;
}

export const StaggeredList: React.FC<StaggeredListProps> = ({
  children,
  staggerDelay = 100,
  animation = 'slide-up',
  className,
}) => {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <AnimatedWrapper
          key={index}
          animation={animation}
          delay={index * staggerDelay}
          trigger="visible"
        >
          {child}
        </AnimatedWrapper>
      ))}
    </div>
  );
};

export default AnimatedWrapper;
