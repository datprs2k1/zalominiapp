import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedMedicalIcon } from '@/components/medical-animations';
import { getColorToken } from '@/styles/unified-color-system';
import CallIcon from '@/components/icons/call';
import { useAccessibleAnimation } from '../hooks/useAccessibleAnimation';
import { AnimatedElement, FloatingElement, ProfessionalButton } from './index';
import { CONTENT } from '../constants/content';
import { fadeInUp, fadeInSlide, staggerChildren } from '../constants/animations';
import {
  createButtonAriaLabel,
  createPhoneAriaLabel,
  useFocusManagement,
  MEDICAL_ARIA_ROLES,
} from '../utils/accessibility';
import { useLazyImage, useAnimationOptimization } from '../utils/performance';

// Enhanced Section components with improved medical design, accessibility, and performance
export const HeroSection: React.FC = () => {
  const { shouldReduceMotion } = useAccessibleAnimation();
  const { shouldAnimate } = useAnimationOptimization();
  const mainContentRef = useFocusManagement();

  // Lazy load hero image for better performance
  const heroImage = useLazyImage(
    CONTENT.about.imageSrc,
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+'
  );

  return (
    <section
      ref={mainContentRef}
      className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-br from-surface via-primary/3 to-surface"
      aria-labelledby="hero-title"
      role={MEDICAL_ARIA_ROLES.BANNER}
      aria-describedby="hero-description"
      tabIndex={-1}
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
                  ref={heroImage.ref}
                  src={heroImage.src}
                  alt={CONTENT.about.imageAlt}
                  className={`w-full h-full object-cover transition-all duration-700 ${
                    shouldAnimate ? 'hover:scale-105' : ''
                  } ${heroImage.isLoaded ? 'opacity-100' : 'opacity-0'}`}
                  loading="lazy"
                  decoding="async"
                  {...({ fetchpriority: 'high' } as any)}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  onLoad={(e) => {
                    // Remove will-change after animation completes for performance
                    const img = e.target as HTMLImageElement;
                    img.style.willChange = 'auto';
                  }}
                  style={{
                    willChange: shouldAnimate ? 'transform' : 'auto',
                    filter: heroImage.isLoaded ? 'none' : 'blur(5px)',
                  }}
                  role="img"
                  aria-describedby="hero-image-description"
                />

                {/* Loading state */}
                {!heroImage.isLoaded && (
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-gray-100"
                    aria-label="Đang tải hình ảnh bệnh viện"
                  >
                    <div className="animate-pulse text-gray-400">Đang tải...</div>
                  </div>
                )}

                {/* Error state */}
                {heroImage.isError && (
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-gray-100"
                    aria-label="Không thể tải hình ảnh"
                  >
                    <div className="text-gray-400">Không thể tải hình ảnh</div>
                  </div>
                )}

                {/* Image overlay with medical theme */}
                {shouldAnimate && (
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                )}

                {/* Hidden description for screen readers */}
                <div id="hero-image-description" className="sr-only">
                  Hình ảnh chính của bệnh viện {CONTENT.about.brandName}, thể hiện cơ sở vật chất hiện đại và đội ngũ y
                  bác sĩ chuyên nghiệp
                </div>
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
          </div>
        </div>
      </div>

      {/* Hidden description for screen readers */}
      <div id="hero-description" className="sr-only">
        Phần giới thiệu chính của trang web bệnh viện {CONTENT.about.brandName}. Bao gồm thông tin về phương châm hoạt
        động, dịch vụ y tế chuyên nghiệp, và các thông tin liên hệ quan trọng như hotline và số cấp cứu 24/7.
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
