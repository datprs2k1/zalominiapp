import { Variants, Transition } from 'framer-motion';

// Performance-optimized easing curves
export const EASING = {
  smooth: [0.25, 0.46, 0.45, 0.94],
  spring: [0.4, 0.0, 0.2, 1],
  bounce: [0.175, 0.885, 0.32, 1.275],
} as const;

// Standard transition configurations
export const TRANSITIONS = {
  fast: { duration: 0.2, ease: EASING.smooth },
  normal: { duration: 0.4, ease: EASING.smooth },
  slow: { duration: 0.6, ease: EASING.smooth },
  spring: { type: 'spring', stiffness: 400, damping: 30 },
  bounce: { type: 'spring', stiffness: 200, damping: 15 },
} as const;

// Core animation variants - reusable and performance-optimized
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    transition: TRANSITIONS.fast,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: TRANSITIONS.normal,
  },
};

export const fadeInScale: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    transition: TRANSITIONS.fast,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: TRANSITIONS.spring,
  },
};

export const fadeInSlide: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
    transition: TRANSITIONS.fast,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: TRANSITIONS.normal,
  },
};

export const fadeInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 20,
    transition: TRANSITIONS.fast,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: TRANSITIONS.normal,
  },
};

export const staggerChildren: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
      ease: EASING.smooth,
    },
  },
};

export const scaleOnHover: Variants = {
  hover: {
    scale: 1.02,
    transition: TRANSITIONS.fast,
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};

// Medical-themed animations
export const medicalPulse: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.8, 1, 0.8],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: EASING.smooth,
    },
  },
};

export const floatingElement: Variants = {
  animate: {
    y: [-10, 10, -10],
    rotate: [-2, 2, -2],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: EASING.smooth,
    },
  },
};

// Container animations for sections
export const sectionContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

// Utility function to create custom transitions
export const createTransition = (
  duration: number = 0.4,
  delay: number = 0,
  ease: string | number[] = EASING.smooth
): Transition => ({
  duration,
  delay,
  ease,
});

// Utility function to create stagger animations
export const createStagger = (staggerDelay: number = 0.1, childrenDelay: number = 0.2): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: childrenDelay,
    },
  },
});
