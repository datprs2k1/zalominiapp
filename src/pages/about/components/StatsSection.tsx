import React, { useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { AnimatedMedicalIcon } from '@/components/medical-animations';
import { getColorToken } from '@/styles/unified-color-system';
import { useAccessibleAnimation } from '../hooks/useAccessibleAnimation';
import { FloatingElement } from './index';
import { StatItem } from './StatItem';
import { CONTENT } from '../constants/content';
import { fadeInUp } from '../constants/animations';

// Enhanced Medical Indicator Section (Bottom Stats) with Premium Hospital Design
export const StatsSection: React.FC = () => {
  const controls = useAnimation();
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const { shouldReduceMotion } = useAccessibleAnimation();

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.section
      ref={ref}
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{
        background: `linear-gradient(135deg,
          ${getColorToken('primary')} 0%,
          ${getColorToken('primary-600')} 25%,
          ${getColorToken('secondary')} 50%,
          ${getColorToken('accent')} 75%,
          ${getColorToken('primary-700')} 100%
        )`,
      }}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.8 } },
      }}
      aria-labelledby="medical-stats-title"
      role="region"
      aria-describedby="medical-stats-description"
    >
      {/* Enhanced Medical Status Indicators */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-surface via-secondary to-accent shadow-lg"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-secondary to-surface shadow-lg"></div>

      {/* Premium Medical Background Elements */}
      <div className="absolute inset-0 opacity-[0.08]">
        {/* Medical Cross Pattern */}
        <div className="absolute top-16 left-16 transform rotate-12">
          <AnimatedMedicalIcon type="cross" size="lg" color="secondary" animate={!shouldReduceMotion} />
        </div>
        <div className="absolute top-32 right-24 transform -rotate-6">
          <AnimatedMedicalIcon type="stethoscope" size="lg" color="secondary" animate={!shouldReduceMotion} />
        </div>
        <div className="absolute bottom-32 left-24 transform rotate-6">
          <AnimatedMedicalIcon type="heartbeat" size="lg" color="secondary" animate={!shouldReduceMotion} />
        </div>
        <div className="absolute bottom-16 right-16 transform -rotate-12">
          <AnimatedMedicalIcon type="pill" size="lg" color="secondary" animate={!shouldReduceMotion} />
        </div>
        {/* Additional subtle medical grid */}
        <div className="absolute top-1/2 left-1/3 transform -translate-y-1/2 rotate-45 opacity-60">
          <AnimatedMedicalIcon type="cross" size="md" color="secondary" animate={false} />
        </div>
        <div className="absolute top-1/3 right-1/3 transform rotate-12 opacity-60">
          <AnimatedMedicalIcon type="heartbeat" size="md" color="secondary" animate={false} />
        </div>
      </div>

      {/* Enhanced floating medical elements */}
      {!shouldReduceMotion && (
        <>
          <FloatingElement
            className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20 bg-gradient-radial from-white/40 to-transparent blur-3xl"
            duration={12}
            delay={0}
          />
          <FloatingElement
            className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full opacity-15 bg-gradient-radial from-secondary/30 to-transparent blur-3xl"
            duration={15}
            delay={3}
          />
          <FloatingElement
            className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full opacity-10 bg-gradient-radial from-accent/25 to-transparent blur-2xl"
            duration={18}
            delay={6}
          />
        </>
      )}

      <div className="container mx-auto px-6 lg:px-8 relative z-10 max-w-7xl">
        {/* Premium Medical Header */}
        <motion.header
          className="text-center mb-20"
          variants={fadeInUp}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Medical Certification Badge */}
          <motion.div
            className="inline-flex items-center gap-3 px-6 py-3 mb-8 rounded-full border-2 border-white/30 backdrop-blur-sm bg-white/20"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          >
            <AnimatedMedicalIcon type="cross" size="sm" color="secondary" animate={!shouldReduceMotion} />
            <span className="text-white font-semibold text-sm tracking-wide">CHỨNG NHẬN BỘ Y TẾ</span>
            <motion.div
              className="w-2 h-2 rounded-full bg-secondary"
              animate={!shouldReduceMotion ? { scale: [1, 1.3, 1], opacity: [1, 0.7, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          {/* Enhanced Title with Medical Icons */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <motion.div
              aria-hidden="true"
              animate={!shouldReduceMotion ? { rotate: [0, 360] } : {}}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            >
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <AnimatedMedicalIcon type="stethoscope" size="md" color="secondary" animate={!shouldReduceMotion} />
              </div>
            </motion.div>

            <h2
              id="medical-stats-title"
              className="text-4xl lg:text-5xl font-black text-white drop-shadow-2xl tracking-tight"
            >
              Thành Tựu Y Khoa
            </h2>

            <motion.div
              aria-hidden="true"
              animate={!shouldReduceMotion ? { scale: [1, 1.15, 1] } : {}}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center backdrop-blur-sm">
                <AnimatedMedicalIcon type="heartbeat" size="md" color="secondary" animate={!shouldReduceMotion} />
              </div>
            </motion.div>
          </div>

          {/* Enhanced Description with Medical Context */}
          <motion.p
            id="medical-stats-description"
            className="text-white/95 text-xl lg:text-2xl max-w-4xl mx-auto leading-relaxed font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Những con số ấn tượng phản ánh cam kết chất lượng dịch vụ y tế hàng đầu và niềm tin tuyệt đối từ cộng đồng
          </motion.p>

          {/* Medical Divider */}
          <motion.div
            className="flex items-center justify-center gap-4 mt-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
            <div className="w-3 h-3 rounded-full bg-secondary"></div>
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
          </motion.div>
        </motion.header>

        {/* Enhanced Medical Statistics Grid */}
        <div
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10"
          role="list"
          aria-label="Thống kê thành tựu y khoa của bệnh viện"
        >
          {CONTENT.stats.map((stat, index) => (
            <div key={index} role="listitem">
              <StatItem {...stat} index={index} />
            </div>
          ))}
        </div>

        {/* Medical Trust Indicators */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <div className="flex flex-wrap justify-center items-center gap-8 text-white/80">
            <div className="flex items-center gap-2">
              <AnimatedMedicalIcon type="cross" size="sm" color="secondary" animate={false} />
              <span className="text-sm font-medium">Chứng nhận ISO 9001:2015</span>
            </div>
            <div className="flex items-center gap-2">
              <AnimatedMedicalIcon type="stethoscope" size="sm" color="secondary" animate={false} />
              <span className="text-sm font-medium">Đạt chuẩn JCI</span>
            </div>
            <div className="flex items-center gap-2">
              <AnimatedMedicalIcon type="heartbeat" size="sm" color="secondary" animate={false} />
              <span className="text-sm font-medium">Công nghệ 4.0</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};
