import React, { memo, useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { combineClasses } from '@/styles/medical-design-system';

// ===== TRANSITION TYPES =====

interface SmoothTransitionProps {
  isLoading: boolean;
  skeleton: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  transitionType?: 'fade' | 'slide' | 'scale' | 'medical' | 'crossfade';
  duration?: number;
  delay?: number;
  onTransitionStart?: () => void;
  onTransitionComplete?: () => void;
}

interface MedicalTransitionProps extends SmoothTransitionProps {
  variant?: 'primary' | 'secondary' | 'neutral';
  medicalContext?: 'appointment' | 'doctor' | 'service' | 'department';
}

interface ProgressiveTransitionProps {
  stages: Array<{
    component: React.ReactNode;
    duration: number;
    name: string;
  }>;
  finalContent: React.ReactNode;
  className?: string;
  onStageChange?: (stageName: string, stageIndex: number) => void;
}

// ===== TRANSITION UTILITIES =====

/**
 * Medical easing functions for healthcare-appropriate animations
 */
const MEDICAL_EASINGS = {
  gentle: [0.25, 0.46, 0.45, 0.94] as const, // Gentle, reassuring
  professional: [0.4, 0.0, 0.2, 1] as const, // Professional, confident
  healing: [0.25, 0.1, 0.25, 1] as const, // Smooth, healing-like
  emergency: [0.55, 0.085, 0.68, 0.53] as const, // Quick but controlled
} as const;

/**
 * Get optimal transition timing based on medical context
 */
const getMedicalTiming = (context?: string) => {
  switch (context) {
    case 'emergency': return { duration: 0.2, easing: MEDICAL_EASINGS.emergency };
    case 'appointment': return { duration: 0.4, easing: MEDICAL_EASINGS.professional };
    case 'doctor': return { duration: 0.5, easing: MEDICAL_EASINGS.gentle };
    case 'service': return { duration: 0.3, easing: MEDICAL_EASINGS.professional };
    default: return { duration: 0.4, easing: MEDICAL_EASINGS.gentle };
  }
};

// ===== TRANSITION VARIANTS =====

/**
 * Create animation variants based on transition type and medical context
 */
const createTransitionVariants = (
  type: SmoothTransitionProps['transitionType'],
  shouldReduceMotion: boolean,
  medicalContext?: string
) => {
  const timing = getMedicalTiming(medicalContext);

  if (shouldReduceMotion) {
    return {
      skeleton: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.2 },
      },
      content: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.2 },
      },
    };
  }

  switch (type) {
    case 'fade':
      return {
        skeleton: {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: timing.duration, ease: timing.easing },
        },
        content: {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: timing.duration, ease: timing.easing },
        },
      };

    case 'slide':
      return {
        skeleton: {
          initial: { opacity: 0, x: -20 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 20 },
          transition: { duration: timing.duration, ease: timing.easing },
        },
        content: {
          initial: { opacity: 0, x: 20 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -20 },
          transition: { duration: timing.duration, ease: timing.easing },
        },
      };

    case 'scale':
      return {
        skeleton: {
          initial: { opacity: 0, scale: 0.95 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 1.05 },
          transition: { duration: timing.duration, ease: timing.easing },
        },
        content: {
          initial: { opacity: 0, scale: 1.05 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.95 },
          transition: { duration: timing.duration, ease: timing.easing },
        },
      };

    case 'medical':
      return {
        skeleton: {
          initial: { opacity: 0, y: 10, scale: 0.98 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: -5, scale: 1.02 },
          transition: { duration: timing.duration, ease: timing.easing },
        },
        content: {
          initial: { opacity: 0, y: 5, scale: 1.02 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: -10, scale: 0.98 },
          transition: { duration: timing.duration, ease: timing.easing },
        },
      };

    case 'crossfade':
    default:
      return {
        skeleton: {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: timing.duration * 0.7, ease: timing.easing },
        },
        content: {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { 
            duration: timing.duration,
            delay: timing.duration * 0.3,
            ease: timing.easing 
          },
        },
      };
  }
};

// ===== MAIN TRANSITION COMPONENTS =====

/**
 * Smooth Skeleton Transition Component
 * Provides seamless transitions between skeleton and content states
 */
export const SmoothSkeletonTransition = memo<SmoothTransitionProps>(({
  isLoading,
  skeleton,
  children,
  className = '',
  transitionType = 'medical',
  duration = 400,
  delay = 0,
  onTransitionStart,
  onTransitionComplete,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const variants = useMemo(
    () => createTransitionVariants(transitionType, shouldReduceMotion),
    [transitionType, shouldReduceMotion]
  );

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsTransitioning(true);
    onTransitionStart?.();

    timeoutRef.current = setTimeout(() => {
      setIsTransitioning(false);
      onTransitionComplete?.();
    }, shouldReduceMotion ? 200 : duration);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isLoading, duration, shouldReduceMotion, onTransitionStart, onTransitionComplete]);

  return (
    <div className={className} role="region" aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        {isLoading ? (
          <motion.div
            key="skeleton"
            variants={variants.skeleton}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ animationDelay: `${delay}ms` }}
          >
            {skeleton}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            variants={variants.content}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ animationDelay: `${delay}ms` }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

/**
 * Medical-specific transition with healthcare context
 */
export const MedicalSkeletonTransition = memo<MedicalTransitionProps>(({
  variant = 'primary',
  medicalContext = 'service',
  ...props
}) => {
  const contextualProps = {
    ...props,
    transitionType: 'medical' as const,
    duration: getMedicalTiming(medicalContext).duration * 1000,
  };

  return (
    <div className={combineClasses(
      'medical-transition-container',
      variant === 'primary' && 'border-blue-100',
      variant === 'secondary' && 'border-green-100',
      variant === 'neutral' && 'border-gray-100'
    )}>
      <SmoothSkeletonTransition {...contextualProps} />
    </div>
  );
});

/**
 * Progressive transition through multiple skeleton stages
 */
export const ProgressiveSkeletonTransition = memo<ProgressiveTransitionProps>(({
  stages,
  finalContent,
  className = '',
  onStageChange,
}) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (currentStage >= stages.length) {
      setIsComplete(true);
      return;
    }

    const stage = stages[currentStage];
    onStageChange?.(stage.name, currentStage);

    const timer = setTimeout(() => {
      setCurrentStage(prev => prev + 1);
    }, shouldReduceMotion ? 100 : stage.duration);

    return () => clearTimeout(timer);
  }, [currentStage, stages, shouldReduceMotion, onStageChange]);

  const variants = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: shouldReduceMotion ? 0 : -10 },
  };

  return (
    <div className={className} role="status" aria-live="polite">
      <AnimatePresence mode="wait">
        {!isComplete ? (
          <motion.div
            key={`stage-${currentStage}`}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
              duration: shouldReduceMotion ? 0.2 : 0.4,
              ease: MEDICAL_EASINGS.gentle,
            }}
          >
            {stages[currentStage]?.component}
          </motion.div>
        ) : (
          <motion.div
            key="final-content"
            variants={variants}
            initial="initial"
            animate="animate"
            transition={{
              duration: shouldReduceMotion ? 0.2 : 0.5,
              ease: MEDICAL_EASINGS.gentle,
            }}
          >
            {finalContent}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

/**
 * Staggered transition for multiple skeleton items
 */
export const StaggeredSkeletonTransition = memo<{
  items: Array<{
    skeleton: React.ReactNode;
    content: React.ReactNode;
    isLoading: boolean;
  }>;
  staggerDelay?: number;
  className?: string;
}>(({ items, staggerDelay = 100, className = '' }) => {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : staggerDelay / 1000,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.2 : 0.5,
        ease: MEDICAL_EASINGS.gentle,
      },
    },
  };

  return (
    <motion.div
      className={combineClasses('space-y-4', className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {items.map((item, index) => (
        <motion.div key={index} variants={itemVariants}>
          <SmoothSkeletonTransition
            isLoading={item.isLoading}
            skeleton={item.skeleton}
            transitionType="medical"
          >
            {item.content}
          </SmoothSkeletonTransition>
        </motion.div>
      ))}
    </motion.div>
  );
});

// Set display names for better debugging
SmoothSkeletonTransition.displayName = 'SmoothSkeletonTransition';
MedicalSkeletonTransition.displayName = 'MedicalSkeletonTransition';
ProgressiveSkeletonTransition.displayName = 'ProgressiveSkeletonTransition';
StaggeredSkeletonTransition.displayName = 'StaggeredSkeletonTransition';

export default SmoothSkeletonTransition;
