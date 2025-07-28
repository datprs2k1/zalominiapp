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
    <motion.div
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
    >
      {/* Modern Hospital Header with Progress Indicator */}
      <motion.div
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
      >
        <div className="container mx-auto px-4 pt-6 pb-4">
          {/* Medical Step Progress Indicator */}
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((idx) => (
              <motion.div
                key={idx}
                className="flex flex-col items-center flex-1 relative"
                initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={
                  prefersReducedMotion
                    ? {}
                    : {
                        duration: 0.3,
                        delay: idx * 0.1,
                        ease: [0.16, 1, 0.3, 1],
                      }
                }
              >
                <motion.div
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center
                             font-semibold text-sm md:text-base transition-all duration-300 shadow-lg`}
                  style={{
                    backgroundColor:
                      idx === currentStep
                        ? MEDICAL_COLORS.primary.blue
                        : idx < currentStep
                          ? MEDICAL_COLORS.secondary.green
                          : `${MEDICAL_COLORS.primary.blue}15`,
                    color: idx <= currentStep ? 'white' : MEDICAL_COLORS.primary.blue,
                    boxShadow:
                      idx === currentStep
                        ? `0 4px 12px ${MEDICAL_COLORS.primary.blue}30`
                        : idx < currentStep
                          ? `0 2px 8px ${MEDICAL_COLORS.secondary.green}20`
                          : 'none',
                  }}
                  whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                >
                  {idx < currentStep ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="font-semibold">{idx}</span>
                  )}
                </motion.div>

                <span
                  className={`text-xs mt-2 font-medium transition-colors duration-200`}
                  style={{
                    color:
                      idx === currentStep
                        ? MEDICAL_COLORS.primary.blue
                        : idx < currentStep
                          ? MEDICAL_COLORS.secondary.green
                          : `${MEDICAL_COLORS.primary.blue}60`,
                  }}
                >
                  {idx === 1 ? 'Service' : idx === 2 ? 'Details' : 'Confirm'}
                </span>

                {/* Modern Medical Connector Line */}
                {idx < 3 && (
                  <div className="absolute top-6 left-1/2 w-full h-[3px] -z-10">
                    <motion.div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        backgroundColor:
                          idx < currentStep ? MEDICAL_COLORS.secondary.green : `${MEDICAL_COLORS.primary.blue}20`,
                      }}
                      initial={prefersReducedMotion ? {} : { scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={
                        prefersReducedMotion
                          ? {}
                          : {
                              duration: 0.6,
                              delay: idx * 0.2,
                              ease: [0.16, 1, 0.3, 1],
                            }
                      }
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Modern Hospital Step Title with Trust Indicators */}
          <motion.div
            className="text-center mt-6"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              prefersReducedMotion
                ? {}
                : {
                    duration: 0.4,
                    delay: 0.3,
                    ease: [0.16, 1, 0.3, 1],
                  }
            }
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <h1 className="text-xl md:text-2xl font-bold" style={{ color: MEDICAL_COLORS.primary.blue }}>
                {getStepTitle()}
              </h1>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <p className="text-sm md:text-base mb-4" style={{ color: `${MEDICAL_COLORS.primary.blue}80` }}>
              {getStepDescription()}
            </p>

            {/* Trust Indicators Bar */}
            <motion.div
              className="flex items-center justify-center gap-4 py-3 px-4 bg-blue-50 rounded-xl border border-blue-100 max-w-2xl mx-auto"
              initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <div className="flex items-center gap-1 text-xs text-blue-700">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                </svg>
                <span className="font-medium">Bảo mật SSL</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-blue-700">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Miễn phí đặt lịch</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-blue-700">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span className="font-medium">Đội ngũ chuyên gia</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Modern Hospital Main Content */}
      <motion.div
        className="flex-grow container mx-auto px-4 py-6"
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
      >
        <div
          className="bg-white rounded-2xl shadow-lg overflow-hidden border"
          style={{
            borderColor: `${MEDICAL_COLORS.primary.blue}10`,
            boxShadow: `0 4px 16px ${MEDICAL_COLORS.primary.blue}08`,
          }}
        >
          {renderStepContent()}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default BookingPage;
