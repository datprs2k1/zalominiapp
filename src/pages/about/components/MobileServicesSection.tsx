import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useEnhancedMobile } from '@/hooks/use-enhanced-mobile';
import { TouchButton } from '@/components/mobile-enhancements';
import { MEDICAL_COLORS, SPACING } from '@/styles/medical-design-system';
import { getColorToken } from '@/styles/unified-color-system';

interface ServiceItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  features: string[];
  available24h?: boolean;
}

interface MobileServicesSectionProps {
  className?: string;
}

const services: ServiceItem[] = [
  {
    id: 'emergency',
    icon: '🚑',
    title: 'Cấp Cứu 24/7',
    description: 'Dịch vụ cấp cứu chuyên nghiệp, sẵn sàng 24/7 với đội ngũ y bác sĩ giàu kinh nghiệm.',
    features: ['Cấp cứu tim mạch', 'Cấp cứu ngoại khoa', 'Cấp cứu nhi khoa', 'Hồi sức tích cực'],
    available24h: true,
  },
  {
    id: 'general',
    icon: '🏥',
    title: 'Khám Tổng Quát',
    description: 'Khám sức khỏe định kỳ và tầm soát bệnh với gói khám toàn diện.',
    features: ['Khám nội tổng quát', 'Khám tim mạch', 'Khám tiêu hóa', 'Tư vấn dinh dưỡng'],
  },
  {
    id: 'specialist',
    icon: '👨‍⚕️',
    title: 'Chuyên Khoa',
    description: 'Đội ngũ chuyên gia đầu ngành với nhiều năm kinh nghiệm điều trị.',
    features: ['Tim mạch', 'Tiêu hóa', 'Thần kinh', 'Nội tiết'],
  },
  {
    id: 'diagnostic',
    icon: '🔬',
    title: 'Chẩn Đoán Hình Ảnh',
    description: 'Trang thiết bị hiện đại cho chẩn đoán chính xác và nhanh chóng.',
    features: ['Siêu âm 4D', 'CT Scanner', 'MRI', 'X-Quang số hóa'],
  },
];

export const MobileServicesSection: React.FC<MobileServicesSectionProps> = ({ className = '' }) => {
  const { deviceInfo, platformStyles, getPlatformClasses } = useEnhancedMobile();
  const shouldReduceMotion = useReducedMotion();
  const [expandedService, setExpandedService] = useState<string | null>(null);

  const platformClasses = getPlatformClasses('mobile-services-section');
  const isIOS = deviceInfo.platform === 'ios';

  const toggleService = (serviceId: string) => {
    setExpandedService(expandedService === serviceId ? null : serviceId);
  };

  const cardStyles = {
    backgroundColor: MEDICAL_COLORS.white.pure,
    borderRadius: isIOS ? platformStyles.borderRadius.large : platformStyles.borderRadius.medium,
    border: `1px solid ${getColorToken('border')}`,
    boxShadow: isIOS 
      ? '0 4px 12px rgba(0, 0, 0, 0.08)' 
      : '0 2px 8px rgba(0, 0, 0, 0.1)',
  };

  return (
    <section 
      className={`${platformClasses} ${className} py-8 px-4`}
      style={{ backgroundColor: getColorToken('background-secondary') }}
      aria-labelledby="services-title"
    >
      <div className="container mx-auto max-w-md">
        {/* Section Header */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: shouldReduceMotion ? 0.1 : 0.6 }}
        >
          <h2
            id="services-title"
            className="font-bold mb-2"
            style={{
              fontSize: isIOS ? '24px' : '28sp',
              lineHeight: isIOS ? '30px' : '36sp',
              color: getColorToken('primary'),
              fontFamily: platformStyles.typography.fontFamily.primary,
            }}
          >
            Dịch Vụ Y Tế Chuyên Nghiệp
          </h2>
          <p
            className="text-center"
            style={{
              fontSize: isIOS ? '16px' : '14sp',
              color: getColorToken('text-secondary'),
              maxWidth: '280px',
              margin: '0 auto',
            }}
          >
            Chăm sóc sức khỏe toàn diện với đội ngũ y bác sĩ chuyên nghiệp
          </p>
        </motion.div>

        {/* Services List */}
        <div className="space-y-3">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              style={cardStyles}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ 
                duration: shouldReduceMotion ? 0.1 : 0.5, 
                delay: shouldReduceMotion ? 0 : index * 0.1 
              }}
              className="overflow-hidden"
            >
              {/* Service Header */}
              <TouchButton
                variant="secondary"
                className="w-full p-4 text-left"
                onClick={() => toggleService(service.id)}
                hapticFeedback={true}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="text-2xl"
                      role="img" 
                      aria-label={service.title}
                    >
                      {service.icon}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3
                          className="font-semibold"
                          style={{
                            fontSize: isIOS ? '17px' : '16sp',
                            color: getColorToken('text-primary'),
                          }}
                        >
                          {service.title}
                        </h3>
                        {service.available24h && (
                          <span
                            className="px-2 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: getColorToken('success-light'),
                              color: getColorToken('success'),
                              fontSize: isIOS ? '11px' : '10sp',
                            }}
                          >
                            24/7
                          </span>
                        )}
                      </div>
                      <p
                        className="text-sm mt-1"
                        style={{
                          color: getColorToken('text-secondary'),
                          fontSize: isIOS ? '14px' : '13sp',
                        }}
                      >
                        {service.description}
                      </p>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedService === service.id ? 180 : 0 }}
                    transition={{ duration: shouldReduceMotion ? 0.1 : 0.2 }}
                    style={{ color: getColorToken('text-secondary') }}
                  >
                    ▼
                  </motion.div>
                </div>
              </TouchButton>

              {/* Expandable Content */}
              <AnimatePresence>
                {expandedService === service.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ 
                      duration: shouldReduceMotion ? 0.1 : 0.3,
                      ease: 'easeInOut'
                    }}
                    className="overflow-hidden"
                  >
                    <div 
                      className="px-4 pb-4 pt-2"
                      style={{ borderTop: `1px solid ${getColorToken('border')}` }}
                    >
                      <h4
                        className="font-medium mb-2"
                        style={{
                          fontSize: isIOS ? '15px' : '14sp',
                          color: getColorToken('text-primary'),
                        }}
                      >
                        Dịch vụ bao gồm:
                      </h4>
                      <ul className="space-y-1">
                        {service.features.map((feature, featureIndex) => (
                          <li
                            key={featureIndex}
                            className="flex items-center space-x-2"
                          >
                            <div
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: getColorToken('primary') }}
                            />
                            <span
                              style={{
                                fontSize: isIOS ? '14px' : '13sp',
                                color: getColorToken('text-secondary'),
                              }}
                            >
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                      
                      {/* Action Button */}
                      <TouchButton
                        variant="primary"
                        size="sm"
                        className="mt-3 w-full"
                        onClick={() => {/* Navigate to service detail */}}
                      >
                        Tìm hiểu thêm
                      </TouchButton>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: shouldReduceMotion ? 0.1 : 0.6, delay: 0.3 }}
        >
          <TouchButton
            variant="medical"
            size="lg"
            className="w-full"
            onClick={() => {/* Navigate to all services */}}
          >
            Xem Tất Cả Dịch Vụ
          </TouchButton>
        </motion.div>
      </div>
    </section>
  );
};
