import React, { useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { AnimatedMedicalIcon } from '@/components/medical-animations';
import { useAccessibleAnimation } from '../hooks/useAccessibleAnimation';
import { createTransition, TRANSITIONS, EASING } from '../constants/animations';
import { createStatAriaLabel, MEDICAL_ARIA_ROLES } from '../utils/accessibility';
import { useAnimationOptimization } from '../utils/performance';
import type { StatItemProps, ColorVariant } from '../types';

/**
 * StatItem component displays medical statistics with animations and accessibility features
 * @param props - StatItemProps containing value, label, icon, color, and index
 */
export const StatItem: React.FC<StatItemProps> = ({ value, label, icon, color, index }) => {
  const controls = useAnimation();
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const { shouldReduceMotion, getAnimationProps } = useAccessibleAnimation();
  const { shouldAnimate } = useAnimationOptimization();

  useEffect(() => {
    if (inView) {
      const transition = shouldReduceMotion ? { duration: 0.01 } : createTransition(0.8, index * 0.15, EASING.spring);

      controls.start({
        opacity: 1,
        y: 0,
        scale: 1,
        transition,
      });
    }
  }, [controls, inView, index, shouldReduceMotion]);

  // Enhanced medical color mapping with premium hospital aesthetics
  const colorClasses: Record<ColorVariant, string> = {
    primary: 'from-white/25 via-white/15 to-white/10 border-white/40',
    secondary: 'from-white/30 via-white/20 to-white/10 border-white/50',
    success: 'from-white/25 via-white/15 to-white/10 border-white/40',
    warning: 'from-white/25 via-white/15 to-white/10 border-white/40',
  };

  const iconBackgroundClasses: Record<ColorVariant, string> = {
    primary: 'bg-white/20',
    secondary: 'bg-white/25',
    success: 'bg-white/20',
    warning: 'bg-white/20',
  };

  const hoverProps = getAnimationProps(
    {
      whileHover: {
        scale: 1.02,
        boxShadow: '0 12px 25px -8px rgba(255, 255, 255, 0.15)',
      },
      transition: TRANSITIONS.fast,
    },
    {
      whileHover: {},
      transition: { duration: 0.01 },
    }
  );

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.85 }}
      animate={controls}
      {...hoverProps}
      className={`
        bg-gradient-to-br ${colorClasses[color]} backdrop-blur-md
        p-6 sm:p-8 rounded-3xl border-2 transition-all duration-500
        relative overflow-hidden min-h-[160px] sm:min-h-[180px]
        shadow-2xl ${shouldAnimate ? 'hover:shadow-3xl' : ''} group cursor-pointer
        transform-gpu perspective-1000
      `}
      style={{
        background: `linear-gradient(135deg,
          rgba(255, 255, 255, 0.25) 0%,
          rgba(255, 255, 255, 0.15) 50%,
          rgba(255, 255, 255, 0.1) 100%
        )`,
        backdropFilter: 'blur(20px)',
        borderColor: 'rgba(255, 255, 255, 0.4)',
        willChange: shouldAnimate ? 'transform, box-shadow' : 'auto',
      }}
      role={MEDICAL_ARIA_ROLES.ARTICLE}
      aria-label={createStatAriaLabel(value, label, index)}
      tabIndex={0}
    >
      {/* Premium Medical Icon Container */}
      <div
        className="absolute top-4 right-4 opacity-20 group-hover:opacity-30 transition-opacity duration-300"
        aria-hidden="true"
      >
        <div
          className={`w-16 h-16 rounded-2xl ${iconBackgroundClasses[color]} flex items-center justify-center backdrop-blur-sm`}
        >
          <AnimatedMedicalIcon type={icon} size="lg" color="secondary" animate={false} />
        </div>
      </div>

      {/* Medical Status Indicator */}
      <div className="absolute top-4 left-4 w-3 h-3 rounded-full bg-secondary shadow-lg" aria-hidden="true" />

      {/* Enhanced Medical Counter */}
      <motion.div
        className="text-5xl sm:text-6xl font-black mb-4 text-white relative z-10 drop-shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: index * 0.1 + 0.3,
          duration: 0.6,
        }}
        aria-label={`Thống kê y khoa: ${value}`}
      >
        {value}
      </motion.div>

      {/* Premium Medical Label */}
      <motion.div
        className="text-base sm:text-lg font-bold text-white/95 relative z-10 leading-tight tracking-wide"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.1 + 0.5, duration: 0.6 }}
        role="text"
      >
        {label}
      </motion.div>

      {/* Medical Achievement Badge */}
      <motion.div
        className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.1 + 0.7, duration: 0.5 }}
      >
        <div className="w-2 h-2 rounded-full bg-secondary"></div>
        <span className="text-xs font-semibold text-white/90">Chứng nhận</span>
      </motion.div>

      {/* Enhanced Hover Glow Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent opacity-0 rounded-3xl"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        aria-hidden="true"
      />

      {/* Medical Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-5 rounded-3xl"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20h4v4h-4v-4zm-8-8h4v4h-4v-4zm8 0h4v4h-4v-4zm8 0h4v4h-4v-4zm-8 8h4v4h-4v-4zm8 0h4v4h-4v-4zm-8 8h4v4h-4v-4zm8 0h4v4h-4v-4z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />
    </motion.div>
  );
};
