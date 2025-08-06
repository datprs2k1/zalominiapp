import React, { useEffect } from 'react';
import ClinicCard from '@/components/ClinicCard';
import { clinics, getClinicsByType, type Clinic } from '@/data/clinics';
import './styles.css';
import { motion, AnimatePresence, useReducedMotion, useAnimation, useInView } from 'framer-motion';
import { AnimatedMedicalIcon } from '@/components/medical-animations';
import { getColorToken } from '@/styles/unified-color-system';
import CallIcon from '@/components/icons/call';

// Import extracted components and utilities
import { useAccessibleAnimation } from './hooks/useAccessibleAnimation';
import { AnimatedElement, FloatingElement, ProfessionalButton } from './components';
import { CONTENT } from './constants/content';
import { fadeInUp, fadeInSlide, staggerChildren } from './constants/animations';

// Enhanced StatItem with improved medical design and accessibility
interface EnhancedStatItemProps {
  value: string;
  label: string;
  icon: 'cross' | 'stethoscope' | 'heartbeat' | 'pill';
  color: 'primary' | 'secondary' | 'success' | 'warning';
  index: number;
}

const StatItem: React.FC<EnhancedStatItemProps> = ({ value, label, icon, color, index }) => {
  const controls = useAnimation();
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const { shouldReduceMotion, getAnimationProps } = useAccessibleAnimation();

  useEffect(() => {
    if (inView) {
      if (shouldReduceMotion) {
        controls.start({
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.01 },
        });
      } else {
        controls.start({
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            delay: index * 0.2,
            duration: 1,
            ease: [0.25, 0.46, 0.45, 0.94],
          },
        });
      }
    }
  }, [controls, inView, index, shouldReduceMotion]);

  // Enhanced medical color mapping with premium hospital aesthetics
  const colorClasses = {
    primary: 'from-white/25 via-white/15 to-white/10 border-white/40',
    secondary: 'from-white/30 via-white/20 to-white/10 border-white/50',
    success: 'from-white/25 via-white/15 to-white/10 border-white/40',
    warning: 'from-white/25 via-white/15 to-white/10 border-white/40',
  };

  const iconBackgroundClasses = {
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
      transition: { duration: 0.3, ease: 'easeOut' },
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
        shadow-2xl hover:shadow-3xl group cursor-pointer
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
      }}
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

// Enhanced Section components with improved medical design
const HeroSection: React.FC = () => {
  const { shouldReduceMotion } = useAccessibleAnimation();

  return (
    <section
      className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-br from-surface via-primary/3 to-surface"
      aria-labelledby="hero-title"
      role="banner"
    >
      {/* Enhanced Medical Status Bar */}
      <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-primary via-secondary to-accent shadow-sm"></div>

      {/* Professional Medical Pattern Background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-16 left-16 transform rotate-12">
          <AnimatedMedicalIcon type="cross" size="lg" color="primary" animate={false} />
        </div>
        <div className="absolute top-32 right-24 transform -rotate-6">
          <AnimatedMedicalIcon type="stethoscope" size="lg" color="secondary" animate={false} />
        </div>
        <div className="absolute bottom-32 left-24 transform rotate-6">
          <AnimatedMedicalIcon type="heartbeat" size="lg" color="success" animate={false} />
        </div>
        <div className="absolute bottom-16 right-16 transform -rotate-12">
          <AnimatedMedicalIcon type="pill" size="lg" color="success" animate={false} />
        </div>
        {/* Additional subtle medical elements */}
        <div className="absolute top-1/2 left-1/3 transform -translate-y-1/2 rotate-45 opacity-50">
          <AnimatedMedicalIcon type="cross" size="md" color="primary" animate={false} />
        </div>
        <div className="absolute top-1/3 right-1/3 transform rotate-12 opacity-50">
          <AnimatedMedicalIcon type="heartbeat" size="md" color="secondary" animate={false} />
        </div>
      </div>
      {/* Simplified floating elements with medical theme */}
      <FloatingElement
        className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-primary/4 blur-3xl"
        duration={20}
        delay={0}
      />
      <FloatingElement
        className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-secondary/4 blur-3xl"
        duration={25}
        delay={5}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl">
        <AnimatedElement delay={100} className="flex justify-center mb-10">
          <motion.div
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-primary-hover text-white rounded-full text-sm font-semibold shadow-lg border border-white/30 backdrop-blur-sm"
            role="banner"
            aria-label="Trang giới thiệu bệnh viện"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mr-3" aria-hidden="true">
              <AnimatedMedicalIcon type="cross" size="sm" color="secondary" animate={false} />
            </div>
            <span className="font-bold tracking-wide">{CONTENT.about.banner}</span>
            <div className="ml-3 w-2 h-2 bg-white/80 rounded-full" aria-hidden="true" />
          </motion.div>
        </AnimatedElement>

        <div className="flex flex-col xl:flex-row items-center xl:items-start gap-8 md:gap-12 lg:gap-16 xl:gap-20">
          <AnimatedElement
            delay={200}
            className="relative w-full lg:w-1/2 mb-8 md:mb-10 lg:mb-0 max-w-md md:max-w-lg lg:max-w-none"
            animation="fadeScale"
          >
            {/* Enhanced background with medical gradient */}
            <div className="absolute -z-10 w-full h-full bg-gradient-to-br from-primary/8 via-secondary/6 to-accent/8 rounded-3xl" />

            {/* Medical certification badge */}
            <motion.div
              className="absolute -top-4 -left-4 z-20 bg-gradient-to-r from-success to-success-hover text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg"
              initial={{ scale: 0, rotate: -12 }}
              animate={{ scale: 1, rotate: -12 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
            >
              <div className="flex items-center gap-2">
                <AnimatedMedicalIcon type="cross" size="sm" color="secondary" animate={false} />
                <span>Chứng nhận BYT</span>
              </div>
            </motion.div>

            <motion.div
              className="relative bg-surface rounded-2xl p-3 shadow-card-elevated border border-border"
              whileHover={{
                boxShadow: '0 15px 30px -8px rgba(37, 99, 235, 0.1)',
              }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <div className="aspect-[4/3] rounded-xl overflow-hidden relative">
                <img
                  src={CONTENT.about.imageSrc}
                  alt={CONTENT.about.imageAlt}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                  decoding="async"
                  {...({ fetchpriority: 'high' } as any)}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  onLoad={(e) => {
                    // Remove will-change after animation completes for performance
                    const img = e.target as HTMLImageElement;
                    img.style.willChange = 'auto';
                  }}
                  style={{ willChange: 'transform' }}
                />
                {/* Image overlay with medical theme */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Enhanced professional badge */}
              <div className="absolute -bottom-4 right-6 bg-surface px-4 py-2 rounded-xl shadow-lg border-l-4 border-primary text-sm backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <AnimatedMedicalIcon type="stethoscope" size="sm" color="primary" animate={false} />
                  <p className="text-primary font-bold">Đội ngũ chuyên nghiệp</p>
                </div>
              </div>
            </motion.div>
          </AnimatedElement>

          <div className="text-center lg:text-left space-y-8 w-full lg:w-1/2">
            <AnimatedElement delay={300}>
              {/* Enhanced title section with better medical iconography */}
              <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                <div aria-hidden="true">
                  <AnimatedMedicalIcon type="cross" size="md" color="primary" animate={false} />
                </div>
                <h1 id="hero-title" className="text-2xl lg:text-3xl font-bold text-primary tracking-wide">
                  {CONTENT.about.title}
                </h1>
              </div>

              {/* Enhanced brand name with improved gradient */}
              <h2
                className="text-4xl lg:text-6xl font-black tracking-tight leading-tight mb-4"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${getColorToken('primary')}, ${getColorToken('secondary')}, ${getColorToken('accent')})`,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
                aria-label={`Tên bệnh viện: ${CONTENT.about.brandName}`}
              >
                {CONTENT.about.brandName}
              </h2>

              {/* Enhanced subtitle */}
              <motion.p
                className="text-lg lg:text-xl text-text-secondary font-medium mb-6 leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                {CONTENT.about.subtitle}
              </motion.p>

              {/* Enhanced decorative line */}
              <motion.div
                className="h-2 bg-gradient-to-r from-secondary via-accent to-primary rounded-full mx-auto lg:mx-0 my-6"
                initial={{ width: 0, opacity: 0 }}
                whileInView={{ width: 160, opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                viewport={{ once: true }}
                aria-hidden="true"
              />
            </AnimatedElement>

            <AnimatedElement delay={400} className="block" animation="fadeSlide">
              {/* Enhanced slogan section with better visual design */}
              <motion.div
                className="bg-gradient-to-r from-secondary/10 via-accent/5 to-secondary/10 rounded-2xl p-6 mb-8 border border-secondary/20"
                whileHover={{ boxShadow: '0 6px 20px rgba(16, 185, 129, 0.1)' }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
                  <div aria-hidden="true">
                    <AnimatedMedicalIcon type="heartbeat" size="md" color="success" animate={false} />
                  </div>
                  <h3 className="text-secondary font-bold text-sm uppercase tracking-wider">Phương châm</h3>
                </div>
                <p
                  className="text-secondary font-bold text-xl lg:text-2xl tracking-wide text-center lg:text-left leading-relaxed"
                  role="text"
                  aria-label={`Phương châm của bệnh viện: ${CONTENT.about.slogan}`}
                >
                  "{CONTENT.about.slogan}"
                </p>
              </motion.div>
            </AnimatedElement>

            {/* Enhanced content paragraphs with better typography */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerChildren}
              className="space-y-6"
            >
              {CONTENT.about.paragraphs.map((paragraph, index) => (
                <motion.div key={index} variants={fadeInSlide} className="relative">
                  <motion.div
                    className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-primary via-secondary to-accent rounded-full"
                    initial={{ height: 0 }}
                    whileInView={{ height: '100%' }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    viewport={{ once: true }}
                  />
                  <p className="pl-8 text-text-primary leading-relaxed text-base lg:text-lg text-left">{paragraph}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Premium Medical Features Showcase */}
            <AnimatedElement delay={600} className="pt-12">
              {/* Features Section Header */}
              <motion.div
                className="text-center mb-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center">
                      <AnimatedMedicalIcon type="stethoscope" size="sm" color="secondary" animate={false} />
                    </div>
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold text-primary">Dịch Vụ Y Tế Chuyên Nghiệp</h3>
                  <div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center">
                      <AnimatedMedicalIcon type="heartbeat" size="sm" color="success" animate={false} />
                    </div>
                  </div>
                </div>
                <motion.div
                  className="h-1 w-24 bg-gradient-to-r from-secondary via-accent to-primary rounded-full mx-auto"
                  initial={{ width: 0, opacity: 0 }}
                  whileInView={{ width: 96, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  viewport={{ once: true }}
                />
              </motion.div>

              {/* Enhanced Features Grid */}
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={staggerChildren}
              >
                {CONTENT.about.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className="group relative"
                    whileHover={{
                      scale: 1.02,
                      boxShadow: '0 12px 25px -8px rgba(37, 99, 235, 0.1)',
                    }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
                    {/* Premium Medical Feature Card */}
                    <div className="bg-gradient-to-br from-surface via-surface/95 to-surface/90 backdrop-blur-lg rounded-2xl p-6 border-2 border-primary/10 hover:border-primary/25 transition-all duration-500 shadow-lg hover:shadow-2xl relative overflow-hidden min-h-[120px]">
                      {/* Medical Status Indicator */}
                      <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-secondary shadow-sm" />

                      {/* Enhanced Medical Icon Container */}
                      <div className="flex items-start gap-4">
                        <div className="relative flex-shrink-0">
                          <div className="w-14 h-14 bg-gradient-to-br from-primary/15 via-secondary/10 to-accent/15 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300 backdrop-blur-sm border border-primary/20">
                            <AnimatedMedicalIcon type={feature.icon} size="md" color="primary" animate={false} />
                          </div>

                          {/* Medical Certification Badge */}
                          <motion.div
                            className="absolute -top-1 -right-1 w-4 h-4 bg-secondary rounded-full flex items-center justify-center shadow-sm"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.2 + 0.5, type: 'spring', stiffness: 200 }}
                          >
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </motion.div>
                        </div>

                        {/* Enhanced Content */}
                        <div className="flex-1 min-w-0">
                          <motion.h4
                            className="font-bold text-primary text-base lg:text-lg mb-2 leading-tight"
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + 0.3, duration: 0.6 }}
                            viewport={{ once: true }}
                          >
                            {feature.title}
                          </motion.h4>

                          <motion.p
                            className="text-text-secondary text-sm lg:text-base leading-relaxed"
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + 0.5, duration: 0.6 }}
                            viewport={{ once: true }}
                          >
                            {feature.description}
                          </motion.p>

                          {/* Medical Quality Indicator */}
                          <motion.div
                            className="flex items-center gap-2 mt-3"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 + 0.7, duration: 0.5 }}
                            viewport={{ once: true }}
                          >
                            <div className="flex gap-1">
                              {[...Array(3)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  className="w-1.5 h-1.5 rounded-full bg-secondary"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: index * 0.1 + 0.8 + i * 0.1, type: 'spring', stiffness: 200 }}
                                />
                              ))}
                            </div>
                            <span className="text-xs font-medium text-secondary">Chất lượng cao</span>
                          </motion.div>
                        </div>
                      </div>

                      {/* Subtle Medical Pattern Overlay */}
                      <div
                        className="absolute inset-0 opacity-[0.02] rounded-2xl pointer-events-none"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23${getColorToken('primary').slice(1)}' fill-opacity='0.1'%3E%3Cpath d='M15 15h3v3h-3v-3zm-6-6h3v3h-3v-3zm6 0h3v3h-3v-3zm6 0h3v3h-3v-3zm-6 6h3v3h-3v-3zm6 0h3v3h-3v-3zm-6 6h3v3h-3v-3zm6 0h3v3h-3v-3z'/%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                      />

                      {/* Enhanced Hover Glow */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/3 to-accent/5 opacity-0 rounded-2xl"
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatedElement>

            <AnimatedElement delay={700} className="pt-6 flex flex-col sm:flex-row gap-4 sm:gap-6">
              <ProfessionalButton
                href={CONTENT.about.buttonLink}
                variant="primary"
                className="flex-1 w-full sm:w-auto group"
                ariaLabel={`${CONTENT.about.buttonText} - Tìm hiểu thêm về bệnh viện`}
              >
                <span className="text-base sm:text-lg">{CONTENT.about.buttonText}</span>
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </ProfessionalButton>

              <ProfessionalButton
                href={`tel:${CONTENT.about.phoneNumber}`}
                variant="secondary"
                className="flex-1 w-full sm:w-auto group"
                ariaLabel={`Gọi điện thoại đến bệnh viện số ${CONTENT.about.phoneNumber}`}
              >
                <div className="mr-2 sm:mr-3 group-hover:scale-110 transition-transform" aria-hidden="true">
                  <CallIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-base sm:text-lg">Gọi: {CONTENT.about.phoneNumber}</span>
              </ProfessionalButton>

              {/* Emergency contact button */}
              <ProfessionalButton
                href={`tel:${CONTENT.about.emergencyNumber}`}
                variant="primary"
                className="flex-1 w-full sm:w-auto bg-gradient-to-r from-error to-error-hover hover:from-error-hover hover:to-error group"
                ariaLabel={`Cấp cứu 24/7 - Gọi ngay ${CONTENT.about.emergencyNumber}`}
              >
                <div className="mr-2 sm:mr-3" aria-hidden="true">
                  <AnimatedMedicalIcon type="cross" size="sm" color="secondary" animate={false} />
                </div>
                <span className="text-base sm:text-lg font-bold">Cấp cứu 24/7</span>
              </ProfessionalButton>
            </AnimatedElement>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" className="w-full h-auto">
          <path
            fill={getColorToken('secondary-hover')}
            d="M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,42.7C840,32,960,32,1080,37.3C1200,43,1320,53,1380,58.7L1440,64L1440,80L1380,80C1320,80,1200,80,1080,80C960,80,840,80,720,80C600,80,480,80,360,80C240,80,120,80,60,80L0,80Z"
          ></path>
        </svg>
      </div>
    </section>
  );
};

// Enhanced Medical Indicator Section (Bottom Stats) with Premium Hospital Design
const StatsSection: React.FC = () => {
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

// Enhanced CTA Section with improved medical design and better UX
const CTASection: React.FC = () => (
  <section className="py-16 lg:py-24 bg-gradient-to-br from-surface via-primary/3 to-surface relative overflow-hidden">
    {/* Enhanced floating elements */}
    <motion.div
      className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-primary/15 blur-3xl"
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.4, 0.6, 0.4],
      }}
      transition={{
        duration: 12,
        repeat: Infinity,
        repeatType: 'reverse',
      }}
    />
    <motion.div
      className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-secondary/15 blur-3xl"
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.4, 0.6, 0.4],
      }}
      transition={{
        duration: 12,
        repeat: Infinity,
        repeatType: 'reverse',
        delay: 3,
      }}
    />

    <div className="container mx-auto px-6 lg:px-8 relative z-10 max-w-5xl">
      <AnimatedElement className="transform" animation="fadeScale">
        <motion.div
          className="bg-gradient-to-br from-primary/8 via-secondary/5 to-accent/8 rounded-3xl p-10 lg:p-16 shadow-2xl border border-primary/20 backdrop-blur-sm"
          whileHover={{
            boxShadow: '0 30px 60px -12px rgba(37, 99, 235, 0.2)',
            y: -8,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <div className="text-center space-y-8">
            {/* Enhanced header with medical iconography */}
            <motion.div
              className="flex items-center justify-center gap-4 mb-6"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                <AnimatedMedicalIcon type="stethoscope" size="lg" color="primary" animate={true} />
              </motion.div>
              <h3 className="text-3xl lg:text-4xl font-bold text-primary">{CONTENT.cta.title}</h3>
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }}>
                <AnimatedMedicalIcon type="heartbeat" size="lg" color="secondary" animate={true} />
              </motion.div>
            </motion.div>

            {/* Enhanced description */}
            <motion.p
              className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {CONTENT.cta.description}
            </motion.p>

            {/* Enhanced features list */}
            <motion.div
              className="flex flex-wrap justify-center gap-4 mb-8"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              {CONTENT.cta.features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-surface/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-primary border border-primary/20"
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(37, 99, 235, 0.1)' }}
                  transition={{ duration: 0.2 }}
                >
                  ✓ {feature}
                </motion.div>
              ))}
            </motion.div>

            {/* Enhanced CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
              <motion.a
                href={`tel:${CONTENT.cta.phoneNumber}`}
                className="inline-flex items-center justify-center bg-gradient-to-r from-secondary to-secondary-hover text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg transition-all text-lg flex-1 min-h-[56px] shadow-button"
                whileHover={{ scale: 1.03, y: -2, boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)' }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.4,
                  type: 'spring',
                  stiffness: 400,
                  damping: 15,
                }}
                viewport={{ once: true }}
              >
                <motion.div
                  className="mr-3"
                  animate={{ rotate: [0, 15, 0, -15, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                >
                  <CallIcon className="w-5 h-5" />
                </motion.div>
                <span>{CONTENT.cta.phoneText}</span>
              </motion.a>

              <motion.a
                href={CONTENT.cta.contactLink}
                className="inline-flex items-center justify-center bg-gradient-to-r from-primary to-primary-hover text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg transition-all text-lg flex-1 min-h-[56px] shadow-button"
                whileHover={{ scale: 1.03, y: -2, boxShadow: '0 8px 25px rgba(37, 99, 235, 0.3)' }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.5,
                  type: 'spring',
                  stiffness: 400,
                  damping: 15,
                }}
                viewport={{ once: true }}
              >
                <motion.div
                  className="mr-3"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <AnimatedMedicalIcon type="cross" size="sm" color="secondary" animate={false} />
                </motion.div>
                <span>{CONTENT.cta.contactText}</span>
              </motion.a>
            </div>

            {/* Emergency contact note */}
            <motion.p
              className="text-sm text-text-muted mt-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              🚨 {CONTENT.cta.emergencyText} - Luôn sẵn sàng phục vụ bạn
            </motion.p>
          </div>
        </motion.div>
      </AnimatedElement>
    </div>
  </section>
);

// Enhanced ClinicsSection with improved medical design and animations
const ClinicsSection: React.FC<{ clinics: Clinic[] }> = ({ clinics }) => (
  <section className="py-20 lg:py-28 bg-gradient-to-br from-surface via-secondary/3 to-surface relative overflow-hidden">
    {/* Enhanced medical status indicators */}
    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-secondary via-accent to-primary shadow-sm"></div>

    {/* Enhanced floating elements with medical theme */}
    <motion.div
      className="absolute -top-20 right-20 w-56 h-56 rounded-full bg-secondary/12 blur-3xl"
      animate={{
        scale: [1, 1.15, 1],
        opacity: [0.3, 0.5, 0.3],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: 15,
        repeat: Infinity,
        repeatType: 'reverse',
      }}
    />
    <motion.div
      className="absolute bottom-1/4 -left-20 w-48 h-48 rounded-full bg-primary/12 blur-3xl"
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3],
        rotate: [360, 180, 0],
      }}
      transition={{
        duration: 18,
        repeat: Infinity,
        repeatType: 'reverse',
        delay: 4,
      }}
    />
    <motion.div
      className="absolute top-1/3 right-1/4 w-32 h-32 rounded-full bg-accent/10 blur-2xl"
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.2, 0.4, 0.2],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        repeatType: 'reverse',
        delay: 2,
      }}
    />

    {/* Bottom medical indicator */}
    <div className="absolute bottom-0 right-0 w-full h-2 bg-gradient-to-r from-primary via-accent to-secondary shadow-sm"></div>

    <div className="container mx-auto px-6 lg:px-8 relative z-10 max-w-6xl">
      <div>
        <AnimatedElement className="flex flex-col items-center justify-center mb-12" animation="fadeScale">
          <motion.div
            className="w-16 h-16 bg-medical-blue/10 rounded-full flex items-center justify-center mb-4"
            whileHover={{ scale: 1.1 }}
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(37, 99, 235, 0.4)',
                '0 0 0 15px rgba(37, 99, 235, 0)',
                '0 0 0 0 rgba(37, 99, 235, 0)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
            }}
          >
            <div className="w-10 h-10 bg-medical-blue rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
          </motion.div>

          <motion.h2
            className="text-2xl lg:text-3xl font-bold text-gray-800 text-center"
            initial={{ opacity: 0, y: 5 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {CONTENT.sections.general}
          </motion.h2>

          <motion.div
            className="h-1.5 w-20 bg-healing-green rounded-full my-4"
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: 80, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          ></motion.div>

          <motion.p
            className="text-gray-600 text-lg max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Khám phá các dịch vụ y tế chuyên nghiệp và toàn diện của chúng tôi
          </motion.p>
        </AnimatedElement>

        <motion.div
          className="space-y-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerChildren}
        >
          {clinics.map((clinic, index) => (
            <motion.div
              key={clinic.id}
              variants={fadeInUp}
              custom={index}
              transition={{
                delay: index * 0.1,
                duration: 0.7,
                ease: 'easeOut',
              }}
              whileHover={{
                scale: 1.01,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              }}
            >
              <ClinicCard clinic={clinic} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  </section>
);

// Enhanced AboutPage with improved accessibility and semantic structure
export default function AboutPage() {
  const generalClinics = getClinicsByType('general');

  return (
    <AnimatePresence mode="wait">
      <motion.main
        className="flex-1 flex flex-col bg-gradient-to-br from-surface via-primary/3 to-surface min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        role="main"
        aria-label="Trang giới thiệu bệnh viện Hòa Bình - Hải Phòng"
      >
        {/* Skip navigation for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white px-4 py-2 rounded-lg z-50 focus:outline-none focus:ring-4 focus:ring-primary/50"
          tabIndex={0}
        >
          Bỏ qua điều hướng, đến nội dung chính
        </a>

        {/* Page header with breadcrumb navigation */}
        <nav aria-label="Breadcrumb" className="sr-only">
          <ol>
            <li>
              <a href="/">Trang chủ</a>
            </li>
            <li aria-current="page">Về chúng tôi</li>
          </ol>
        </nav>

        <div id="main-content" tabIndex={-1}>
          <HeroSection />
          <StatsSection />
          <CTASection />
          <ClinicsSection clinics={generalClinics} />
        </div>

        {/* Enhanced page footer with accessibility info */}
        <footer className="mt-auto py-8 bg-surface border-t border-border" role="contentinfo">
          <div className="container mx-auto px-6 lg:px-8 text-center">
            <p className="text-text-secondary text-sm">
              © 2024 Bệnh viện Đa khoa Hòa Bình - Hải Phòng.
              <span className="sr-only">Trang web tuân thủ tiêu chuẩn WCAG 2.1 AA về khả năng tiếp cận.</span>
            </p>
            <div className="mt-2 flex justify-center gap-4 text-xs text-text-muted">
              <span>
                Hotline:{' '}
                <a href="tel:0976091115" className="text-primary hover:underline">
                  0976.091.115
                </a>
              </span>
              <span>
                Cấp cứu 24/7:{' '}
                <a href="tel:0868115666" className="text-error hover:underline">
                  0868.115666
                </a>
              </span>
            </div>
          </div>
        </footer>
      </motion.main>
    </AnimatePresence>
  );
}
