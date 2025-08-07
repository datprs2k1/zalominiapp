import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useEnhancedMobile } from '@/hooks/use-enhanced-mobile';
import { MobileOptimizedHero } from './components/MobileOptimizedHero';
import { MobileServicesSection } from './components/MobileServicesSection';
import { MobileContactSection } from './components/MobileContactSection';
import { getColorToken } from '@/styles/unified-color-system';

interface MobileOptimizedAboutPageProps {
  className?: string;
}

export const MobileOptimizedAboutPage: React.FC<MobileOptimizedAboutPageProps> = ({ 
  className = '' 
}) => {
  const { deviceInfo, platformStyles, getPlatformClasses } = useEnhancedMobile();
  const shouldReduceMotion = useReducedMotion();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    // Set viewport height for mobile browsers
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
    
    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);

  const platformClasses = getPlatformClasses('mobile-about-page');
  const isIOS = deviceInfo.platform === 'ios';

  // Platform-specific page styling
  const pageStyles = {
    fontFamily: platformStyles.typography.fontFamily.primary,
    backgroundColor: getColorToken('background'),
    minHeight: 'calc(var(--vh, 1vh) * 100)',
    overflowX: 'hidden' as const,
  };

  // Page transition variants
  const pageVariants = {
    initial: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 20 
    },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.1 : 0.6,
        ease: 'easeOut',
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
      }
    },
    exit: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : -20,
      transition: {
        duration: shouldReduceMotion ? 0.1 : 0.4,
      }
    }
  };

  const sectionVariants = {
    initial: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 30 
    },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.1 : 0.6,
        ease: 'easeOut',
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.main
        className={`${platformClasses} ${className}`}
        style={pageStyles}
        variants={pageVariants}
        initial="initial"
        animate={isLoaded ? "animate" : "initial"}
        exit="exit"
        role="main"
        aria-label="Trang giới thiệu bệnh viện Hòa Bình - Hải Phòng"
      >
        {/* Skip Navigation for Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{
            backgroundColor: getColorToken('primary'),
            color: getColorToken('white'),
            borderRadius: platformStyles.borderRadius.medium,
            fontSize: isIOS ? '16px' : '14sp',
          }}
          tabIndex={0}
        >
          Bỏ qua điều hướng, đến nội dung chính
        </a>

        {/* Breadcrumb Navigation (Hidden but accessible) */}
        <nav aria-label="Breadcrumb" className="sr-only">
          <ol>
            <li>
              <a href="/">Trang chủ</a>
            </li>
            <li aria-current="page">Về chúng tôi</li>
          </ol>
        </nav>

        {/* Main Content */}
        <div id="main-content" tabIndex={-1}>
          {/* Hero Section */}
          <motion.div variants={sectionVariants}>
            <MobileOptimizedHero />
          </motion.div>

          {/* Services Section */}
          <motion.div variants={sectionVariants}>
            <MobileServicesSection />
          </motion.div>

          {/* Contact & Location Section */}
          <motion.div variants={sectionVariants}>
            <MobileContactSection />
          </motion.div>

          {/* Trust Indicators Section */}
          <motion.section
            className="py-8 px-4"
            style={{ backgroundColor: getColorToken('background-secondary') }}
            variants={sectionVariants}
            aria-labelledby="trust-title"
          >
            <div className="container mx-auto max-w-md text-center">
              <h2
                id="trust-title"
                className="font-bold mb-4"
                style={{
                  fontSize: isIOS ? '20px' : '24sp',
                  color: getColorToken('primary'),
                }}
              >
                Được Tin Tưởng Bởi
              </h2>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { icon: '🏆', title: 'Chứng nhận', desc: 'Bộ Y tế' },
                  { icon: '⭐', title: 'Đánh giá', desc: '4.8/5 sao' },
                  { icon: '👥', title: 'Bệnh nhân', desc: '50K+ tin tưởng' },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg"
                    style={{
                      backgroundColor: getColorToken('white'),
                      border: `1px solid ${getColorToken('border')}`,
                    }}
                  >
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <div
                      className="font-semibold text-sm"
                      style={{ color: getColorToken('text-primary') }}
                    >
                      {item.title}
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: getColorToken('text-secondary') }}
                    >
                      {item.desc}
                    </div>
                  </div>
                ))}
              </div>

              <p
                className="text-center"
                style={{
                  fontSize: isIOS ? '14px' : '12sp',
                  color: getColorToken('text-secondary'),
                  lineHeight: '1.4',
                }}
              >
                Bệnh viện Đa khoa Hòa Bình - Hải Phòng cam kết mang đến dịch vụ y tế chất lượng cao, 
                an toàn và hiệu quả cho mọi bệnh nhân.
              </p>
            </div>
          </motion.section>
        </div>

        {/* Enhanced Footer */}
        <motion.footer
          className="py-6 px-4 mt-auto"
          style={{
            backgroundColor: getColorToken('background'),
            borderTop: `1px solid ${getColorToken('border')}`,
          }}
          variants={sectionVariants}
          role="contentinfo"
        >
          <div className="container mx-auto max-w-md text-center">
            <p
              className="mb-2"
              style={{
                fontSize: isIOS ? '14px' : '12sp',
                color: getColorToken('text-secondary'),
              }}
            >
              © 2024 Bệnh viện Đa khoa Hòa Bình - Hải Phòng
            </p>
            
            <div className="flex justify-center space-x-4 text-xs">
              <a
                href="tel:0976091115"
                className="flex items-center space-x-1"
                style={{ color: getColorToken('primary') }}
              >
                <span>📞</span>
                <span>0976.091.115</span>
              </a>
              <a
                href="tel:0868115666"
                className="flex items-center space-x-1"
                style={{ color: getColorToken('error') }}
              >
                <span>🚨</span>
                <span>0868.115.666</span>
              </a>
            </div>

            {/* Accessibility Statement */}
            <p
              className="mt-2 sr-only"
              style={{
                fontSize: isIOS ? '12px' : '10sp',
                color: getColorToken('text-muted'),
              }}
            >
              Trang web tuân thủ tiêu chuẩn WCAG 2.1 AA về khả năng tiếp cận.
            </p>
          </div>
        </motion.footer>

        {/* Platform-specific Status Bar */}
        {isIOS && (
          <div
            className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
            style={{
              height: 'env(safe-area-inset-top)',
              backgroundColor: getColorToken('background'),
            }}
          />
        )}
      </motion.main>
    </AnimatePresence>
  );
};

export default MobileOptimizedAboutPage;
