import React, { Suspense, useEffect, useState } from 'react';
import Header from '@/components/header';
import ClinicCard from '@/components/ClinicCard';
import { clinics, getClinicsByType, type Clinic } from '@/data/clinics';
import about1 from '@/static/about1.jpg';
import CallIcon from '@/components/icons/call';
import './styles.css'; // CSS animations still needed for some effects
import { motion, useAnimation, AnimatePresence, useInView, Variant, Variants, useReducedMotion } from 'framer-motion'; // Import proper types
import { BORDER_RADIUS, SHADOWS, combineClasses } from '@/styles/medical-design-system';
import { AnimatedMedicalIcon } from '@/components/medical-animations';
import { getColorToken } from '@/styles/unified-color-system';

// Utility function for reduced motion support
const useAccessibleAnimation = () => {
  const shouldReduceMotion = useReducedMotion();

  const getAnimationProps = (normalProps: any, reducedProps?: any) => {
    if (shouldReduceMotion) {
      return (
        reducedProps || {
          ...normalProps,
          transition: { duration: 0.01 },
          animate: normalProps.initial || {},
        }
      );
    }
    return normalProps;
  };

  const getTransition = (duration: number, delay: number = 0) => {
    if (shouldReduceMotion) {
      return { duration: 0.01, delay: 0 };
    }
    return { duration, delay, ease: [0.25, 0.46, 0.45, 0.94] };
  };

  return { getAnimationProps, getTransition, shouldReduceMotion };
};

// Floating element component for subtle background animations
const FloatingElement: React.FC<{
  children?: React.ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
}> = ({ children, className = '', duration = 8, delay = 0 }) => {
  const { shouldReduceMotion } = useAccessibleAnimation();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      animate={{
        scale: [1, 1.05, 1],
        opacity: [0.3, 0.5, 0.3],
        y: [0, -10, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: 'reverse',
        delay,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
};

// Professional button component with micro-interactions
const ProfessionalButton: React.FC<{
  children: React.ReactNode;
  href: string;
  variant: 'primary' | 'secondary';
  className?: string;
  ariaLabel?: string;
}> = ({ children, href, variant, className = '', ariaLabel }) => {
  const { getAnimationProps } = useAccessibleAnimation();

  const baseClasses =
    'flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-semibold transition-all shadow-lg text-center min-h-[48px] sm:min-h-[56px] focus:outline-none focus:ring-4 focus:ring-opacity-50 touch-manipulation';

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-medical-blue to-medical-blue-dark text-white hover:from-medical-blue-dark hover:to-medical-blue focus:ring-medical-blue',
    secondary:
      'bg-medical-white border-2 border-healing-green text-healing-green hover:bg-healing-green/5 focus:ring-healing-green',
  };

  const hoverProps = getAnimationProps(
    {
      whileHover: {
        scale: 1.02,
        y: -2,
        boxShadow:
          variant === 'primary'
            ? '0 12px 28px -8px rgba(37, 99, 235, 0.3)'
            : '0 12px 28px -8px rgba(16, 185, 129, 0.3)',
      },
      whileTap: { scale: 0.98 },
      transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    {
      whileHover: {},
      whileTap: {},
      transition: { duration: 0.01 },
    }
  );

  return (
    <motion.a
      href={href}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...hoverProps}
      aria-label={ariaLabel}
      role="button"
      tabIndex={0}
    >
      {children}
    </motion.a>
  );
};

// Content variables moved to a dedicated object for better organization
const CONTENT = {
  about: {
    banner: 'Về chúng tôi',
    title: 'BỆNH VIỆN ĐA KHOA',
    brandName: 'HÒA BÌNH - HẢI PHÒNG',
    slogan: 'Trị bệnh bằng khối óc – Chăm sóc bằng trái tim',
    paragraphs: [
      'Bệnh viện Đa khoa Hòa Bình – Hải Phòng chính thức đi vào hoạt động từ ngày 23 tháng 5 năm 2008 theo Quyết định số 1805/QĐ-BYT và Giấy chứng nhận số 20/GCNĐĐKHN-Y của Bộ Y tế.',
      'Ngoài việc cung cấp dịch vụ khám chữa bệnh cho bệnh nhân, bệnh viện còn hợp tác với nhiều công ty lớn như Sumidenso Việt Nam, Uniden Việt Nam, Ford Việt Nam, Toyodenso Việt Nam, Namyang Delta và Kefico Việt Nam để cung cấp dịch vụ khám sức khỏe tuyển dụng và định kỳ. Bệnh viện cũng hợp tác với hệ thống các ngân hàng trên địa bàn tỉnh Hải Phòng, đảm bảo sức khỏe và an toàn cho đội ngũ nhân viên và cộng đồng.',
    ],
    buttonText: 'Tìm hiểu thêm',
    buttonLink: '/',
    imageSrc: 'https://benhvienhoabinh.vn/wp-content/uploads/2025/01/57.png',
    imageAlt: 'Bệnh viện Đa khoa Hòa Bình - Hải Phòng',
    phoneNumber: '0868.115666',
  },
  stats: [
    { value: '+10', label: 'Năm hình thành & phát triển' },
    { value: '+50', label: 'Tiến sĩ, bác sĩ hàng đầu' },
    { value: '+300', label: 'Đội ngũ cán bộ nhân viên' },
    { value: '+1000', label: 'Bệnh nhân khám & điều trị/ngày' },
  ],
  cta: {
    title: 'Cần Tư Vấn Y Tế?',
    description: 'Liên hệ ngay với chúng tôi để được tư vấn và đặt lịch khám',
    phoneNumber: '0976.091.115',
    phoneText: 'Gọi Ngay: 0976.091.115',
    contactText: 'Liên Hệ',
    contactLink: '/contact',
  },
  sections: {
    general: 'Bệnh viện đa khoa Hòa Bình – Hải Phòng',
  },
};

// Animation variants - reusable animation configurations
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
  },
};

const fadeInSlide: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
  },
};

const staggerChildren: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Types for component props
interface AnimatedElementProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  animation?: 'fadeUp' | 'fadeScale' | 'fadeSlide';
}

interface StatItemProps {
  value: string;
  label: string;
  index: number;
}

// Reusable components with Framer Motion
const AnimatedElement: React.FC<AnimatedElementProps> = ({
  children,
  delay = 0,
  className = '',
  animation = 'fadeUp',
}) => {
  const { getAnimationProps, getTransition } = useAccessibleAnimation();

  const variants = {
    fadeUp: fadeInUp,
    fadeScale: fadeInScale,
    fadeSlide: fadeInSlide,
  };

  const animationProps = getAnimationProps({
    initial: 'hidden',
    whileInView: 'visible',
    viewport: { once: true, margin: '-50px' },
    variants: variants[animation],
    transition: getTransition(animation === 'fadeScale' ? 0.5 : 0.7, delay / 1000),
  });

  return (
    <motion.div {...animationProps} className={className}>
      {children}
    </motion.div>
  );
};

const StatItem: React.FC<StatItemProps> = ({ value, label, index }) => {
  const controls = useAnimation();
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const { shouldReduceMotion } = useAccessibleAnimation();

  useEffect(() => {
    if (inView) {
      if (shouldReduceMotion) {
        controls.start({
          opacity: 1,
          y: 0,
          transition: { duration: 0.01 },
        });
      } else {
        controls.start({
          opacity: 1,
          y: 0,
          transition: {
            delay: index * 0.1,
            duration: 0.7,
            ease: 'backOut',
          },
        });
      }
    }
  }, [controls, inView, index, shouldReduceMotion]);

  // Medical icons for different stats
  const getStatIcon = (index: number) => {
    const icons = ['cross', 'stethoscope', 'heartbeat', 'pill'] as const;
    return icons[index % icons.length];
  };

  const { getAnimationProps } = useAccessibleAnimation();

  const hoverProps = getAnimationProps(
    {
      whileHover: {
        scale: 1.03,
        boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 10px 10px -5px rgba(59, 130, 246, 0.04)',
        y: -2,
      },
      transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    {
      whileHover: {},
      transition: { duration: 0.01 },
    }
  );

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      {...hoverProps}
      className={combineClasses(
        'bg-white/15 backdrop-blur-sm',
        'p-3 sm:p-4',
        BORDER_RADIUS.cardLarge,
        'border border-white/20 transition-all duration-300',
        'relative overflow-hidden min-h-[100px] sm:min-h-[120px]'
      )}
    >
      {/* Medical Icon Background */}
      <div className="absolute top-2 right-2 opacity-20" aria-hidden="true">
        <AnimatedMedicalIcon type={getStatIcon(index)} size="lg" color="primary" animate={false} />
      </div>

      <motion.div
        className="text-2xl sm:text-3xl font-bold mb-1 text-healing-green-light relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
        aria-label={`Số liệu: ${value}`}
      >
        {value}
      </motion.div>
      <motion.div
        className="text-xs sm:text-sm font-medium text-medical-white relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
        role="text"
      >
        {label}
      </motion.div>
    </motion.div>
  );
};

// Section components with Framer Motion
const HeroSection: React.FC = () => (
  <section
    className="relative pt-8 pb-16 overflow-hidden bg-gradient-to-br from-medical-white via-medical-blue/5 to-medical-white"
    aria-labelledby="hero-title"
    role="banner"
  >
    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-medical-blue via-healing-green to-trust-cyan"></div>

    {/* Medical Cross Pattern Background */}
    <div className="absolute inset-0 opacity-5">
      <div className="absolute top-10 left-10">
        <AnimatedMedicalIcon type="cross" size="lg" color="primary" animate={false} />
      </div>
      <div className="absolute top-20 right-20">
        <AnimatedMedicalIcon type="stethoscope" size="lg" color="primary" animate={false} />
      </div>
      <div className="absolute bottom-20 left-20">
        <AnimatedMedicalIcon type="heartbeat" size="lg" color="primary" animate={false} />
      </div>
      <div className="absolute bottom-10 right-10">
        <AnimatedMedicalIcon type="pill" size="lg" color="primary" animate={false} />
      </div>
    </div>
    <FloatingElement
      className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-medical-blue/20 blur-3xl"
      duration={8}
      delay={0}
    />
    <FloatingElement
      className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-healing-green/20 blur-3xl"
      duration={8}
      delay={1}
    />

    <div className="container mx-auto px-6 lg:px-8 relative z-10 max-w-6xl">
      <AnimatedElement delay={100} className="flex justify-center mb-8">
        <div
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-medical-blue to-medical-blue-dark text-white rounded-full text-sm font-medium shadow-lg border border-white/20"
          role="banner"
          aria-label="Trang giới thiệu bệnh viện"
        >
          <motion.div className="mr-2" aria-hidden="true">
            <AnimatedMedicalIcon type="cross" size="sm" color="secondary" animate={true} />
          </motion.div>
          <span className="font-semibold">{CONTENT.about.banner}</span>
        </div>
      </AnimatedElement>

      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 md:gap-12 lg:gap-16">
        <AnimatedElement
          delay={200}
          className="relative w-full lg:w-1/2 mb-6 md:mb-8 lg:mb-0 max-w-sm md:max-w-md lg:max-w-none"
          animation="fadeScale"
        >
          <motion.div
            className="absolute -z-10 w-full h-full bg-gradient-to-r from-medical-blue/10 to-healing-green/10 rounded-2xl"
            animate={{ rotate: [2, 4, 2] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          ></motion.div>
          <motion.div
            className="relative bg-medical-white rounded-xl p-2 shadow-lg border border-medical-blue/10"
            whileHover={{
              y: -5,
              boxShadow: '0 20px 25px -5px rgba(37, 99, 235, 0.15), 0 10px 10px -5px rgba(37, 99, 235, 0.08)',
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className="aspect-[4/3] rounded-lg overflow-hidden">
              <img
                src={CONTENT.about.imageSrc}
                alt={CONTENT.about.imageAlt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <motion.div
              className="absolute -bottom-3 right-4 bg-medical-white px-3 py-1.5 rounded-lg shadow-md border-l-3 border-medical-blue text-xs"
              animate={{
                boxShadow: [
                  '0 4px 6px -1px rgba(37, 99, 235, 0.1)',
                  '0 10px 15px -3px rgba(37, 99, 235, 0.15)',
                  '0 4px 6px -1px rgba(37, 99, 235, 0.1)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <p className="text-medical-blue font-bold">Đội ngũ chuyên nghiệp</p>
            </motion.div>
          </motion.div>
        </AnimatedElement>

        <div className="text-center lg:text-left space-y-6 w-full lg:w-1/2">
          <AnimatedElement delay={300}>
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
              <div aria-hidden="true">
                <AnimatedMedicalIcon type="cross" size="md" color="primary" animate={true} />
              </div>
              <h1 id="hero-title" className="text-2xl lg:text-3xl font-bold text-medical-blue tracking-wide">
                {CONTENT.about.title}
              </h1>
            </div>
            <motion.h2
              className="text-4xl lg:text-5xl font-black tracking-tight leading-tight"
              style={{
                backgroundImage: `linear-gradient(to right, ${getColorToken('primary')}, ${getColorToken('primary-hover')})`,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
              animate={{
                backgroundImage: [
                  `linear-gradient(to right, ${getColorToken('primary')}, ${getColorToken('primary-hover')})`,
                  `linear-gradient(to right, ${getColorToken('primary-hover')}, ${getColorToken('accent')})`,
                  `linear-gradient(to right, ${getColorToken('primary')}, ${getColorToken('primary-hover')})`,
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
              aria-label={`Tên bệnh viện: ${CONTENT.about.brandName}`}
            >
              {CONTENT.about.brandName}
            </motion.h2>
            <motion.div
              className="h-1.5 bg-gradient-to-r from-healing-green to-trust-cyan rounded-full mx-auto lg:mx-0 my-4"
              initial={{ width: 0 }}
              whileInView={{ width: 120 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
              aria-hidden="true"
            ></motion.div>
          </AnimatedElement>

          <AnimatedElement delay={400} className="block" animation="fadeSlide">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
              <div aria-hidden="true">
                <AnimatedMedicalIcon type="heartbeat" size="md" color="success" animate={true} />
              </div>
              <p
                className="text-healing-green font-bold text-lg lg:text-xl tracking-wide border-l-4 border-healing-green pl-4 py-2"
                role="text"
                aria-label={`Phương châm của bệnh viện: ${CONTENT.about.slogan}`}
              >
                {CONTENT.about.slogan}
              </p>
            </div>
          </AnimatedElement>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="space-y-4 text-gray-700 leading-relaxed text-base lg:text-lg"
          >
            {CONTENT.about.paragraphs.map((paragraph, index) => (
              <motion.p
                key={index}
                variants={fadeInSlide}
                className="relative pl-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1.5 before:bg-gradient-to-b before:from-medical-blue/60 before:to-medical-blue before:rounded-full text-left"
              >
                {paragraph}
              </motion.p>
            ))}
          </motion.div>

          <AnimatedElement delay={700} className="pt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <ProfessionalButton
              href={CONTENT.about.buttonLink}
              variant="primary"
              className="flex-1 w-full sm:w-auto"
              ariaLabel={`${CONTENT.about.buttonText} - Tìm hiểu thêm về bệnh viện`}
            >
              <span className="text-base sm:text-lg">{CONTENT.about.buttonText}</span>
              <motion.svg
                className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                initial={{ x: 0 }}
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </motion.svg>
            </ProfessionalButton>

            <ProfessionalButton
              href={`tel:${CONTENT.about.phoneNumber}`}
              variant="secondary"
              className="flex-1 w-full sm:w-auto"
              ariaLabel={`Gọi điện thoại đến bệnh viện số ${CONTENT.about.phoneNumber}`}
            >
              <motion.div className="mr-2 sm:mr-3" whileHover={{ rotate: 15 }} aria-hidden="true">
                <CallIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.div>
              <span className="text-base sm:text-lg">Gọi: {CONTENT.about.phoneNumber}</span>
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

const StatsSection: React.FC = () => {
  const controls = useAnimation();
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.section
      ref={ref}
      className="bg-gradient-to-r from-medical-blue-dark via-medical-blue to-trust-cyan text-white py-16 lg:py-20 relative overflow-hidden"
      initial="hidden"
      animate={controls}
      variants={{
        hidden: {},
        visible: {},
      }}
      aria-labelledby="stats-title"
      role="region"
    >
      <motion.div
        className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/10 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      ></motion.div>
      <motion.div
        className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/10 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: 'reverse',
          delay: 2,
        }}
      ></motion.div>
      <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDF2NWgtMXYtNXptNiAwaDF2NWgtMXYtNXptLTIgMGgxdjJoLTF2LTJ6bS00IDBoMXYyaC0xdi0yek0xMiAxMmg0djFoLTR2LTF6bTAtMmgxdjVoLTF2LTV6bTYgMGgxdjVoLTF2LTV6bS0yIDBoMXYyaC0xdi0yek0xMiAzNmg0djFoLTR2LTF6bTAtMmgxdjVoLTF2LTV6bTYgMGgxdjVoLTF2LTV6bS0yIDBoMXYyaC0xdi0yek0zNiAxMmg0djFoLTR2LTF6bTAtMmgxdjVoLTF2LTV6bTYgMGgxdjVoLTF2LTV6bS0yIDBoMXYyaC0xdi0yeiI+PC9wYXRoPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10 max-w-6xl">
        <motion.div className="text-center mb-12" variants={fadeInUp} transition={{ duration: 0.7, ease: 'easeOut' }}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div aria-hidden="true">
              <AnimatedMedicalIcon type="stethoscope" size="lg" color="secondary" animate={true} />
            </div>
            <h3 id="stats-title" className="text-2xl lg:text-3xl font-bold text-white drop-shadow">
              Thành tựu của chúng tôi
            </h3>
            <div aria-hidden="true">
              <AnimatedMedicalIcon type="heartbeat" size="lg" color="secondary" animate={true} />
            </div>
          </div>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Những con số ấn tượng thể hiện cam kết chất lượng dịch vụ y tế hàng đầu
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {CONTENT.stats.map((stat, index) => (
            <StatItem key={index} {...stat} index={index} />
          ))}
        </div>
      </div>
    </motion.section>
  );
};

const CTASection: React.FC = () => (
  <section className="py-12 lg:py-16 bg-gradient-to-br from-medical-white via-medical-blue/5 to-medical-white relative overflow-hidden">
    <motion.div
      className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-medical-blue/20 blur-2xl"
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        repeatType: 'reverse',
      }}
    ></motion.div>
    <motion.div
      className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-healing-green/20 blur-2xl"
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        repeatType: 'reverse',
        delay: 2,
      }}
    ></motion.div>

    <div className="container mx-auto px-6 lg:px-8 relative z-10 max-w-4xl">
      <AnimatedElement className="transform" animation="fadeScale">
        <motion.div
          className="bg-gradient-to-r from-medical-blue/10 to-trust-cyan/10 rounded-3xl p-8 lg:p-12 shadow-xl border border-medical-blue/20"
          whileHover={{
            boxShadow: '0 25px 50px -12px rgba(37, 99, 235, 0.15)',
            y: -5,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <div className="text-center space-y-6">
            <motion.div
              className="flex items-center justify-center gap-3 mb-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <AnimatedMedicalIcon type="stethoscope" size="lg" color="primary" animate={true} />
              <h3 className="text-2xl lg:text-3xl font-bold text-medical-blue">{CONTENT.cta.title}</h3>
            </motion.div>

            <motion.p
              className="text-lg text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {CONTENT.cta.description}
            </motion.p>

            <motion.a
              href={`tel:${CONTENT.cta.phoneNumber}`}
              className="inline-flex items-center justify-center bg-healing-green text-white px-8 py-4 rounded-xl font-semibold hover:bg-healing-green-dark transition-all shadow-lg text-lg w-full max-w-sm mx-auto min-h-[56px]"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.3,
                type: 'spring',
                stiffness: 400,
                damping: 15,
              }}
              viewport={{ once: true }}
            >
              <motion.div
                className="mr-2"
                animate={{ rotate: [0, 15, 0, -15, 0] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              >
                <CallIcon className="w-4 h-4" />
              </motion.div>
              <span>{CONTENT.cta.phoneText}</span>
            </motion.a>
          </div>
        </motion.div>
      </AnimatedElement>
    </div>
  </section>
);

const ClinicsSection: React.FC<{ clinics: Clinic[] }> = ({ clinics }) => (
  <div className="py-16 lg:py-20 bg-gradient-to-br from-medical-white via-healing-green/5 to-medical-white relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-healing-green/60 to-trust-cyan/60"></div>
    <motion.div
      className="absolute -top-16 right-16 w-48 h-48 rounded-full bg-healing-green/20 blur-3xl"
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.2, 0.4, 0.2],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        repeatType: 'reverse',
      }}
    ></motion.div>
    <motion.div
      className="absolute bottom-1/3 -left-16 w-40 h-40 rounded-full bg-medical-blue/20 blur-2xl"
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.2, 0.4, 0.2],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        repeatType: 'reverse',
        delay: 3,
      }}
    ></motion.div>
    <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-trust-cyan/60 to-healing-green/60"></div>

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
  </div>
);

export default function AboutPage() {
  const generalClinics = getClinicsByType('general');

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="flex-1 flex flex-col bg-gradient-to-br from-medical-white via-medical-blue/5 to-medical-white min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <HeroSection />
        <StatsSection />
        <CTASection />
        <ClinicsSection clinics={generalClinics} />
      </motion.div>
    </AnimatePresence>
  );
}
