import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useEnhancedMobile } from '@/hooks/use-enhanced-mobile';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { ResponsiveGrid, ResponsiveContainer } from '@/components/ResponsiveGrid';
import { TouchButton } from '@/components/mobile-enhancements';
import { MEDICAL_COLORS, SPACING, TYPOGRAPHY } from '@/styles/medical-design-system';
import { getColorToken } from '@/styles/unified-color-system';

interface MobileOptimizedHeroProps {
  className?: string;
}

export const MobileOptimizedHero: React.FC<MobileOptimizedHeroProps> = ({ className = '' }) => {
  const { deviceInfo, platformStyles, getPlatformClasses } = useEnhancedMobile();
  const { getResponsiveClasses, getResponsiveSpacing, isMobile } = useResponsiveLayout();
  const shouldReduceMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const platformClasses = getPlatformClasses('mobile-hero-container');
  const isIOS = deviceInfo.platform === 'ios';
  const isAndroid = deviceInfo.platform === 'android';

  // Platform-specific styling
  const heroStyles = {
    ios: {
      paddingTop: `max(${platformStyles.spacing.large}, env(safe-area-inset-top))`,
      borderRadius: platformStyles.borderRadius.large,
      fontFamily: platformStyles.typography.fontFamily.primary,
    },
    android: {
      paddingTop: platformStyles.spacing.large,
      borderRadius: platformStyles.borderRadius.medium,
      fontFamily: platformStyles.typography.fontFamily.primary,
    },
  };

  const currentStyles = isIOS ? heroStyles.ios : heroStyles.android;

  const emergencyButtonVariant = isAndroid ? 'emergency' : 'medical';
  const primaryButtonVariant = isIOS ? 'medical' : 'primary';

  return (
    <motion.section
      className={`${platformClasses} ${className}`}
      style={{
        background: `linear-gradient(135deg, 
          ${getColorToken('primary-50')} 0%, 
          ${MEDICAL_COLORS.white.soft} 50%, 
          ${getColorToken('secondary-50')} 100%)`,
        ...currentStyles,
        minHeight: isIOS ? 'calc(100vh - env(safe-area-inset-bottom))' : '100vh',
      }}
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0.1 : 0.6, ease: 'easeOut' }}
      role="banner"
      aria-labelledby="hero-title"
    >
      {/* Status Bar for Medical Context */}
      <div
        className="absolute top-0 left-0 w-full h-1"
        style={{
          background: `linear-gradient(90deg, 
            ${getColorToken('primary')} 0%, 
            ${getColorToken('secondary')} 50%, 
            ${getColorToken('accent')} 100%)`,
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 py-8 flex flex-col justify-center min-h-full">
        {/* Hospital Branding */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
          animate={{ opacity: isVisible ? 1 : 0, scale: 1 }}
          transition={{ duration: shouldReduceMotion ? 0.1 : 0.8, delay: 0.2 }}
        >
          {/* Trust Indicators */}
          <div className="flex justify-center items-center mb-4 space-x-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: getColorToken('success') }}
              aria-label="Hoạt động 24/7"
            />
            <span
              className="text-sm font-medium"
              style={{
                color: getColorToken('text-secondary'),
                fontSize: isIOS ? '15px' : '14sp',
              }}
            >
              Hoạt động 24/7 • Chứng nhận Bộ Y tế
            </span>
          </div>

          {/* Hospital Name */}
          <h1
            id="hero-title"
            className="font-bold mb-2"
            style={{
              fontSize: isIOS ? '28px' : '32sp',
              lineHeight: isIOS ? '34px' : '40sp',
              color: getColorToken('primary'),
              fontFamily: currentStyles.fontFamily,
              letterSpacing: isIOS ? '-0.5px' : '-0.25px',
            }}
          >
            BỆNH VIỆN ĐA KHOA
            <br />
            <span style={{ color: getColorToken('secondary') }}>HÒA BÌNH - HẢI PHÒNG</span>
          </h1>

          {/* Tagline */}
          <p
            className="font-medium mb-6"
            style={{
              fontSize: isIOS ? '17px' : '16sp',
              lineHeight: isIOS ? '22px' : '24sp',
              color: getColorToken('text-secondary'),
              maxWidth: '280px',
              margin: '0 auto',
            }}
          >
            Trị bệnh bằng khối óc – Chăm sóc bằng trái tim
          </p>
        </motion.div>

        {/* Key Services Grid */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
          animate={{ opacity: isVisible ? 1 : 0, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.1 : 0.6, delay: 0.4 }}
        >
          <ResponsiveGrid
            columns={{ xs: 2, sm: 2, md: 2, lg: 4 }}
            gap={{ xs: '12px', sm: '16px', md: '20px' }}
            role="list"
            aria-label="Dịch vụ chính của bệnh viện"
          >
            {[
              { icon: '🏥', title: 'Khám Tổng Quát', desc: 'Khám sức khỏe định kỳ' },
              { icon: '🚑', title: 'Cấp Cứu 24/7', desc: 'Sẵn sàng mọi lúc' },
              { icon: '👨‍⚕️', title: 'Chuyên Khoa', desc: 'Đội ngũ chuyên gia' },
              { icon: '🔬', title: 'Xét Nghiệm', desc: 'Công nghệ hiện đại' },
            ].map((service, index) => (
              <motion.div
                key={index}
                className="p-4 text-center"
                style={{
                  backgroundColor: MEDICAL_COLORS.white.pure,
                  borderRadius: currentStyles.borderRadius,
                  border: `1px solid ${getColorToken('border')}`,
                  boxShadow: isIOS ? '0 2px 8px rgba(0, 0, 0, 0.08)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
                whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
                transition={{ duration: 0.1 }}
              >
                <div className="text-2xl mb-2" role="img" aria-label={service.title}>
                  {service.icon}
                </div>
                <h3
                  className="font-semibold mb-1"
                  style={{
                    fontSize: isIOS ? '15px' : '14sp',
                    color: getColorToken('text-primary'),
                  }}
                >
                  {service.title}
                </h3>
                <p
                  className="text-xs"
                  style={{
                    color: getColorToken('text-secondary'),
                    fontSize: isIOS ? '13px' : '12sp',
                  }}
                >
                  {service.desc}
                </p>
              </motion.div>
            ))}
          </ResponsiveGrid>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
          animate={{ opacity: isVisible ? 1 : 0, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.1 : 0.6, delay: 0.6 }}
        >
          {/* Emergency Contact - Primary CTA */}
          <TouchButton
            variant={emergencyButtonVariant}
            size="lg"
            className="w-full"
            onClick={() => (window.location.href = 'tel:0868115666')}
            hapticFeedback={true}
          >
            <span className="flex items-center justify-center space-x-2">
              <span>🚨</span>
              <span>Cấp Cứu: 0868.115.666</span>
            </span>
          </TouchButton>

          {/* Book Appointment - Secondary CTA */}
          <TouchButton
            variant={primaryButtonVariant}
            size="md"
            className="w-full"
            onClick={() => {
              /* Navigate to booking */
            }}
          >
            Đặt Lịch Khám
          </TouchButton>

          {/* General Hotline */}
          <TouchButton
            variant="secondary"
            size="md"
            className="w-full"
            onClick={() => (window.location.href = 'tel:0976091115')}
          >
            Hotline: 0976.091.115
          </TouchButton>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          className="mt-8 pt-6 border-t"
          style={{ borderColor: getColorToken('border') }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: shouldReduceMotion ? 0.1 : 0.8, delay: 0.8 }}
        >
          <div className="flex justify-around text-center">
            {[
              { number: '15+', label: 'Năm kinh nghiệm' },
              { number: '50K+', label: 'Bệnh nhân tin tưởng' },
              { number: '24/7', label: 'Phục vụ không ngừng' },
            ].map((stat, index) => (
              <div key={index}>
                <div
                  className="font-bold"
                  style={{
                    fontSize: isIOS ? '20px' : '18sp',
                    color: getColorToken('primary'),
                  }}
                >
                  {stat.number}
                </div>
                <div
                  className="text-xs"
                  style={{
                    color: getColorToken('text-secondary'),
                    fontSize: isIOS ? '12px' : '11sp',
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};
