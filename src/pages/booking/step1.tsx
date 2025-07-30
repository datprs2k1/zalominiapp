import EnhancedDatePicker from '@/components/form/enhanced-date-picker';
import DoctorSelector from '@/components/form/doctor-selector';
import DepartmentPicker from '@/components/form/department-picker';
import ServicePicker from '@/components/form/service-picker';
import FabForm from '@/components/form/fab-form';
import { availableTimeSlotsState, bookingFormState } from '@/state';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Department, Service, TimeSlot } from '@/types';
import toast from 'react-hot-toast';
import { authorize } from 'zmp-sdk/apis';
import { getSetting } from 'zmp-sdk/apis';
import { MEDICAL_COLORS } from '@/styles/medical-design-system';
import { motion, useReducedMotion } from 'framer-motion';

export default function Step1() {
  const timeSlots = useAtomValue(availableTimeSlotsState);
  const [formData, setFormData] = useAtom(bookingFormState);
  const [selectedSlot, setSelectedSlot] = useState<Partial<TimeSlot>>(formData.slot ?? {});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [examType, setExamType] = useState(formData.examType || 'specialist');
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [isValidating, setIsValidating] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const auth = async () => {
      setLoading(true);
      try {
        const data = await authorize({
          scopes: ['scope.userInfo', 'scope.userPhonenumber'],
        });

        if (!data['scope.userInfo'] || !data['scope.userPhonenumber']) {
          toast.error('Vui lòng cấp quyền truy cập thông tin cá nhân và số điện thoại!');
          navigate('/');
        }
      } catch (error) {
        console.error('Authorization error:', error);
        toast.error('Không thể xác thực quyền truy cập');
      } finally {
        setLoading(false);
      }
    };

    const checkPermission = async () => {
      try {
        const data = await getSetting();
        if (!data.authSetting['scope.userInfo'] && !data.authSetting['scope.userPhonenumber']) {
          auth();
        }
      } catch (error) {
        console.error('Permission check error:', error);
      }
    };

    checkPermission();
  }, []);

  useEffect(() => {
    if (selectedSlot) {
      const { date } = selectedSlot;
      if (date) {
        setFormData((prev) => ({
          ...prev,
          slot: { date: new Date(date) },
        }));
      }
    }
  }, [selectedSlot]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      examType,
      // Reset department/service when switching exam type
      department: examType === 'specialist' ? prev.department : undefined,
      service: examType === 'service' ? prev.service : undefined,
    }));
  }, [examType, setFormData]);

  // Enhanced validation with real-time feedback
  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.slot) {
      errors.slot = 'Vui lòng chọn ngày và giờ khám';
    }

    if (examType === 'specialist' && !formData.department) {
      errors.department = 'Vui lòng chọn khoa khám';
    }

    if (examType === 'service' && !formData.service) {
      errors.service = 'Vui lòng chọn dịch vụ khám';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isFormValid =
    formData.slot &&
    ((examType === 'specialist' && formData.department) || (examType === 'service' && formData.service));

  // Real-time validation on form changes
  useEffect(() => {
    if (Object.keys(validationErrors).length > 0) {
      setIsValidating(true);
      const timer = setTimeout(() => {
        validateForm();
        setIsValidating(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [formData.slot, formData.department, formData.service, examType]);

  // Get department/service name safely
  const getSelectionName = () => {
    if (examType === 'specialist' && formData.department) {
      const department = formData.department as Department;
      return typeof department.title === 'string'
        ? department.title
        : (department.title as any)?.rendered || 'Khoa đã chọn';
    } else if (examType === 'service' && formData.service) {
      const service = formData.service as Service;
      return service.name || 'Dịch vụ đã chọn';
    }
    return examType === 'specialist' ? 'Khoa đã chọn' : 'Dịch vụ đã chọn';
  };

  return (
    <FabForm
      fab={{
        children: isFormValid ? (
          <div className="flex items-center gap-2">
            <span className="font-bold">Tiếp tục</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-semibold">Hoàn thành thông tin</span>
          </div>
        ),
        disabled: !isFormValid,
        variant: isFormValid ? 'primary' : 'outline',
        size: 'lg',
        className: isFormValid ? 'shadow-2xl hover:shadow-3xl transform-gpu' : 'border-2 hover:border-primary/50',
        style: isFormValid
          ? {
              background: `linear-gradient(135deg, ${MEDICAL_COLORS.primary.blue} 0%, ${MEDICAL_COLORS.secondary.green} 100%)`,
              boxShadow: `0 10px 30px ${MEDICAL_COLORS.primary.blue}40, 0 0 0 1px ${MEDICAL_COLORS.primary.blue}20`,
              transform: 'translateY(-2px)',
            }
          : {
              borderColor: MEDICAL_COLORS.primary.blue,
              color: MEDICAL_COLORS.primary.blue,
            },
        'aria-label': isFormValid
          ? 'Tiếp tục đến bước tiếp theo'
          : 'Vui lòng hoàn thành thông tin bắt buộc trước khi tiếp tục',
        onClick: () => {
          if (validateForm()) {
            navigate('/booking/2', {
              viewTransition: true,
            });
          }
        },
        onDisabledClick() {
          // Trigger validation to show specific errors
          validateForm();

          // Show specific error message
          const missingFields = [];
          if (!formData.slot) missingFields.push('ngày khám');
          if (examType === 'specialist' && !formData.department) missingFields.push('khoa khám');
          if (examType === 'service' && !formData.service) missingFields.push('dịch vụ khám');

          const errorMessage =
            missingFields.length > 0
              ? `Vui lòng chọn: ${missingFields.join(', ')}`
              : 'Vui lòng hoàn thành thông tin bắt buộc';

          toast.error(errorMessage, {
            duration: 4000,
            style: {
              background: MEDICAL_COLORS.emergency.red,
              color: 'white',
              fontWeight: '500',
            },
          });
        },
      }}
    >
      <div className="flex flex-col" role="form" aria-label="Biểu mẫu đặt lịch khám - Bước 1">
        {loading && (
          <motion.div
            className="flex flex-col justify-center items-center py-12"
            initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative">
              {/* Medical Loading Spinner */}
              <div
                className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent"
                style={{
                  borderColor: `${MEDICAL_COLORS.primary.blue}20`,
                  borderTopColor: MEDICAL_COLORS.primary.blue,
                }}
              ></div>

              {/* Medical Cross Icon in Center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-4 h-4 animate-pulse"
                  style={{ color: MEDICAL_COLORS.primary.blue }}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                </svg>
              </div>
            </div>

            <p className="mt-4 text-sm font-medium animate-pulse" style={{ color: MEDICAL_COLORS.primary.blue }}>
              Đang xác thực quyền truy cập...
            </p>

            <div className="flex gap-1 mt-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full animate-bounce"
                  style={{
                    backgroundColor: MEDICAL_COLORS.secondary.green,
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {!loading && (
          <div className="p-3 sm:p-4 lg:p-5">
            <motion.fieldset
              className="mb-5 sm:mb-6"
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <legend className="text-lg font-bold text-blue-600 mb-3">1. Chọn loại khám</legend>
              <p
                className="text-sm mb-3"
                style={{ color: `${MEDICAL_COLORS.primary.blue}70` }}
                id="exam-type-description"
              >
                Vui lòng chọn loại khám phù hợp với nhu cầu của bạn
              </p>

              <div className="space-y-3">
                <button
                  type="button"
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    examType === 'specialist'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setExamType('specialist')}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        examType === 'specialist' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                      }`}
                    >
                      {examType === 'specialist' && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">Khám chuyên khoa</div>
                      <div className="text-sm text-gray-500">Khám theo chuyên khoa cụ thể</div>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    examType === 'service'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setExamType('service')}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        examType === 'service' ? 'border-green-500 bg-green-500' : 'border-gray-300'
                      }`}
                    >
                      {examType === 'service' && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">Khám dịch vụ</div>
                      <div className="text-sm text-gray-500">Khám theo gói dịch vụ</div>
                    </div>
                  </div>
                </button>
              </div>
            </motion.fieldset>

            <motion.div
              className="mb-5 sm:mb-6 p-4 rounded-xl border"
              style={{
                backgroundColor: `${MEDICAL_COLORS.primary.blue}03`,
                borderColor: `${MEDICAL_COLORS.primary.blue}15`,
              }}
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <h2 className="text-lg font-bold text-blue-600 mb-3">
                2. {examType === 'specialist' ? 'Chọn khoa khám' : 'Chọn dịch vụ khám'}
              </h2>
              <p className="text-sm mb-4" style={{ color: `${MEDICAL_COLORS.primary.blue}70` }}>
                Vui lòng chọn {examType === 'specialist' ? 'khoa' : 'dịch vụ'} bạn muốn đăng ký
              </p>

              <div className="relative">
                {examType === 'specialist' ? (
                  <DepartmentPicker
                    placeholder="Chọn khoa khám"
                    value={formData?.department}
                    error={validationErrors.department}
                    onChange={(department) => {
                      setFormData((prev) => ({
                        ...prev,
                        department,
                      }));
                      // Clear validation error when user makes selection
                      if (validationErrors.department) {
                        setValidationErrors((prev) => {
                          const newErrors = { ...prev };
                          delete newErrors.department;
                          return newErrors;
                        });
                      }
                    }}
                  />
                ) : (
                  <ServicePicker
                    placeholder="Chọn dịch vụ khám"
                    value={formData?.service}
                    error={validationErrors.service}
                    onChange={(service) => {
                      setFormData((prev) => ({
                        ...prev,
                        service,
                      }));
                      // Clear validation error when user makes selection
                      if (validationErrors.service) {
                        setValidationErrors((prev) => {
                          const newErrors = { ...prev };
                          delete newErrors.service;
                          return newErrors;
                        });
                      }
                    }}
                  />
                )}

                {/* Validation Loading Indicator */}
                {isValidating && (
                  <motion.div
                    className="mt-2 flex items-center gap-2"
                    initial={prefersReducedMotion ? {} : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className="w-4 h-4 rounded-full animate-spin border-2 border-t-transparent"
                      style={{
                        borderColor: `${MEDICAL_COLORS.primary.blue}30`,
                        borderTopColor: MEDICAL_COLORS.primary.blue,
                      }}
                    />
                    <span className="text-sm" style={{ color: MEDICAL_COLORS.primary.blue }}>
                      Đang kiểm tra...
                    </span>
                  </motion.div>
                )}

                {/* Success Confirmation */}
                {((examType === 'specialist' && formData?.department) ||
                  (examType === 'service' && formData?.service)) && (
                  <motion.div
                    className="mt-4 p-5 rounded-2xl flex items-center border-2"
                    style={{
                      backgroundColor: `${MEDICAL_COLORS.secondary.green}08`,
                      borderColor: `${MEDICAL_COLORS.secondary.green}30`,
                    }}
                    initial={
                      prefersReducedMotion
                        ? {}
                        : {
                            opacity: 0,
                            scale: 0.95,
                            y: 20,
                          }
                    }
                    animate={{
                      opacity: 1,
                      scale: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.4,
                      type: 'spring',
                      stiffness: 150,
                      damping: 20,
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0"
                      style={{ backgroundColor: MEDICAL_COLORS.secondary.green }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold" style={{ color: MEDICAL_COLORS.secondary.green }}>
                        Đã chọn: <span className="font-bold">{getSelectionName()}</span>
                      </p>
                      <p className="text-sm mt-1" style={{ color: `${MEDICAL_COLORS.secondary.green}80` }}>
                        {examType === 'specialist'
                          ? 'Bạn sẽ được khám với bác sĩ chuyên khoa'
                          : 'Bạn sẽ được tư vấn và thực hiện dịch vụ'}
                      </p>
                    </div>

                    {/* Medical Badge */}
                    <motion.div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${MEDICAL_COLORS.secondary.green}20` }}
                      animate={
                        !prefersReducedMotion
                          ? {
                              rotate: [0, 90, 180, 270, 360],
                            }
                          : {}
                      }
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    >
                      <svg
                        className="w-4 h-4"
                        style={{ color: MEDICAL_COLORS.secondary.green }}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                      </svg>
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            <motion.div
              className="pb-4 p-4 rounded-xl border mb-32"
              style={{
                backgroundColor: `${MEDICAL_COLORS.accent.cyan}03`,
                borderColor: `${MEDICAL_COLORS.accent.cyan}15`,
              }}
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <h2
                className="text-xl sm:text-2xl font-bold mb-3 flex items-center gap-2"
                style={{ color: MEDICAL_COLORS.accent.cyan }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300"
                  style={{
                    backgroundColor: formData?.slot
                      ? MEDICAL_COLORS.secondary.green
                      : `${MEDICAL_COLORS.accent.cyan}15`,
                    borderColor: formData?.slot ? MEDICAL_COLORS.secondary.green : MEDICAL_COLORS.accent.cyan,
                    color: formData?.slot ? 'white' : MEDICAL_COLORS.accent.cyan,
                  }}
                >
                  {formData?.slot ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <span className="text-lg font-black">3</span>
                  )}
                </div>
                Chọn ngày khám
              </h2>
              <p className="text-sm mb-4" style={{ color: `${MEDICAL_COLORS.primary.blue}70` }}>
                Vui lòng chọn ngày và giờ phù hợp với lịch trình của bạn
              </p>

              <EnhancedDatePicker
                value={selectedSlot}
                onChange={(slot) => {
                  setSelectedSlot(slot);
                  // Clear validation error when user makes selection
                  if (validationErrors.slot) {
                    setValidationErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.slot;
                      return newErrors;
                    });
                  }
                }}
                slots={timeSlots}
                error={validationErrors.slot}
                placeholder="Chọn ngày và giờ khám"
              />

              {/* Date Selection Confirmation */}
              {formData?.slot && (
                <motion.div
                  className="mt-4 p-5 rounded-2xl flex items-center border-2"
                  style={{
                    backgroundColor: `${MEDICAL_COLORS.accent.cyan}08`,
                    borderColor: `${MEDICAL_COLORS.accent.cyan}30`,
                  }}
                  initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0"
                    style={{ backgroundColor: MEDICAL_COLORS.accent.cyan }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: MEDICAL_COLORS.accent.cyan }}>
                      Đã chọn ngày khám:
                    </p>
                    <p className="text-sm font-bold mt-1" style={{ color: MEDICAL_COLORS.accent.cyan }}>
                      {new Date(formData.slot.date).toLocaleString('vi-VN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>

                  {/* Calendar Badge */}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${MEDICAL_COLORS.accent.cyan}20` }}
                  >
                    <svg
                      className="w-4 h-4"
                      style={{ color: MEDICAL_COLORS.accent.cyan }}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
                    </svg>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}

        <motion.div
          className="mt-auto p-3 sm:p-4 border-t"
          style={{
            backgroundColor: `${MEDICAL_COLORS.primary.blue}05`,
            borderColor: `${MEDICAL_COLORS.primary.blue}15`,
          }}
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex-shrink-0 rounded-full p-2"
              style={{ backgroundColor: `${MEDICAL_COLORS.primary.blue}15` }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                style={{ color: MEDICAL_COLORS.primary.blue }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: MEDICAL_COLORS.primary.blue }}>
                Vui lòng chọn đúng {examType === 'specialist' ? 'khoa' : 'dịch vụ'} và ngày khám để có trải nghiệm tốt
                nhất
              </p>
            </div>

            {/* Compact Medical Badges */}
            <div className="flex gap-1">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${MEDICAL_COLORS.secondary.green}15` }}
              >
                <svg
                  className="w-3 h-3"
                  style={{ color: MEDICAL_COLORS.secondary.green }}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${MEDICAL_COLORS.accent.cyan}15` }}
              >
                <svg
                  className="w-3 h-3"
                  style={{ color: MEDICAL_COLORS.accent.cyan }}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </FabForm>
  );
}
