import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { BackIcon } from '@/components/icons/back';
import { MEDICAL_COLORS, TYPOGRAPHY, ANIMATIONS, ACCESSIBILITY, SPACING } from '@/styles/medical-design-system';
import { getColorToken } from '@/styles/unified-color-system';

function BookingPage() {
  const { step } = useParams();
  const currentStep = Number(step ?? '1');
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  // Validate step parameter
  useEffect(() => {
    if (currentStep < 1 || currentStep > 3 || isNaN(currentStep)) {
      navigate('/booking/1', { replace: true });
    }
  }, [currentStep, navigate]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1 />;
      case 2:
        return <Step2 />;
      case 3:
        return <Step3 />;
      default:
        return <Navigate to="/booking/1" replace />;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Select Medical Service & Schedule';
      case 2:
        return 'Patient Information';
      case 3:
        return 'Confirm Medical Appointment';
      default:
        return '';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return 'Choose your medical service and preferred appointment time';
      case 2:
        return 'Provide your personal and medical information';
      case 3:
        return 'Review and confirm your medical appointment';
      default:
        return '';
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      navigate(`/booking/${currentStep - 1}`, { viewTransition: true });
    } else {
      navigate('/', { viewTransition: true });
    }
  };

  return (
    <motion.main
      className="booking-page flex flex-col min-h-screen"
      style={{ backgroundColor: MEDICAL_COLORS.white.soft }}
      initial={prefersReducedMotion ? {} : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={
        prefersReducedMotion
          ? {}
          : {
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1],
            }
      }
      role="main"
      aria-label="Trang đặt lịch khám bệnh"
    >
      {/* Enhanced Medical Header with Progress Indicator */}
      <motion.header
        className="bg-white shadow-sm sticky top-0 z-10 border-b"
        style={{ borderColor: `${MEDICAL_COLORS.primary.blue}15` }}
        initial={prefersReducedMotion ? {} : { opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          prefersReducedMotion
            ? {}
            : {
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1],
              }
        }
        role="banner"
        aria-label="Tiêu đề trang đặt lịch khám"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-3">
          {/* Thanh tiến trình đơn giản */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((idx) => (
                <div key={idx} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      idx === currentStep
                        ? 'bg-blue-600 text-white shadow-lg'
                        : idx < currentStep
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {idx < currentStep ? '✓' : idx}
                  </div>
                  {idx < 3 && (
                    <div className={`w-8 h-0.5 mx-1 ${idx < currentStep ? 'bg-green-500' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tiêu đề đơn giản */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-blue-600 mb-2">{getStepTitle()}</h1>
            <p className="text-gray-600 text-sm">{getStepDescription()}</p>
          </div>
        </div>
      </motion.header>

      {/* Compact Medical Main Content Container */}
      <motion.section
        className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5"
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          prefersReducedMotion
            ? {}
            : {
                duration: 0.5,
                delay: 0.4,
                ease: [0.16, 1, 0.3, 1],
              }
        }
        role="region"
        aria-labelledby="main-heading"
        aria-live="polite"
      >
        <div
          className="bg-white rounded-3xl shadow-xl border-2 relative"
          style={{
            borderColor: `${MEDICAL_COLORS.primary.blue}15`,
            boxShadow: `0 8px 32px ${MEDICAL_COLORS.primary.blue}12, 0 2px 8px ${MEDICAL_COLORS.primary.blue}08`,
          }}
        >
          {/* Medical Content Header Accent */}
          <div
            className="h-1 w-full"
            style={{
              background: `linear-gradient(90deg, ${MEDICAL_COLORS.primary.blue}, ${MEDICAL_COLORS.secondary.green}, ${MEDICAL_COLORS.accent.cyan})`,
            }}
          />

          {/* Content Area */}
          <div className="relative">
            {/* Subtle Medical Pattern Background */}
            <div
              className="absolute inset-0 opacity-[0.02] pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${MEDICAL_COLORS.primary.blue.replace('#', '%23')}' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />

            {renderStepContent()}
          </div>
        </div>
      </motion.section>
    </motion.main>
  );
}

export default BookingPage;
